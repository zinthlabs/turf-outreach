import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useSports } from '../hooks/UseSports';
import { fetchSlots, createBooking, verifyPayment } from '../services/api';
import SportSelector from '../components/booking/SportSelector';
import Calendar from '../components/booking/Calendar';
import DurationSelector from '../components/booking/DurationSelector';
import TurfSelector from '../components/booking/TurfSelector';
import BookingSummary from '../components/booking/BookingSummary';
import { isLoggedIn } from '../services/is_logged_in';
import PhoneOTPComponent from "../components/Register";
import toast from "react-hot-toast";


/* -----------------------------
   FIXED SCRIPT LOADER (NO HOOKS)
--------------------------------*/
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      resolve(true);
      return;
    } // <-- FIXED missing closing brace

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay SDK failed to load.'));
    document.body.appendChild(script);
  });
};


export default function SportsBooking() {

  /* --------------------------
      FIXED: useNavigate HERE
  ---------------------------*/
  const navigate = useNavigate();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [duration, setDuration] = useState(1);
  const [selectedTurf, setSelectedTurf] = useState();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const { sports } = useSports();
  const [login, setLogin] = useState(isLoggedIn());

  const turfs = [
    { id: '7-a-side-turf-c', name: 'Power Rack 1' },
  ];

  const bookingFee = 2000;
  const convenienceFee = 20;
  const total = bookingFee + convenienceFee;


  /* -------------------------
     CALENDAR FUNCTIONS
  --------------------------*/
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateOnly < todayOnly;
  };

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const formatSelectedDate = () => {
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${selectedDate.getDate()} ${m[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
  };

  const goToPreviousMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isPreviousMonthDisabled = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth < new Date(today.getFullYear(), today.getMonth(), 1);
  };


  const days = getDaysInMonth();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsLong = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  /* -------------------------
     LOGIN STATE LISTENER
  --------------------------*/
  useEffect(() => {
    const handler = () => setLogin(isLoggedIn());
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  /* -------------------------
     AUTO-SELECT DEFAULT SPORT
  --------------------------*/
  useEffect(() => {
    if (!selectedSport && sports.length > 0) {
      setSelectedSport(sports[0].name.toLowerCase());
    }
  }, [sports, selectedSport]);

  /* -------------------------
     FETCH AVAILABLE SLOTS
  --------------------------*/
  useEffect(() => {
    if (!selectedSport || !selectedDate || sports.length === 0) return;

    const service = sports.find(s => s.name.toLowerCase() === selectedSport);
    if (!service) return;

    const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
    const dateStr = utcDate.toISOString().split('T')[0];

    fetchSlots(dateStr, service.id)
      .then(res => {
        let slots = res.data.slots;
        setAvailableSlots(slots);
        setSelectedSlot(null);
      })
      .catch(err => {
        console.error('Failed to fetch slots:', err);
        setAvailableSlots([]);
        setSelectedSlot(null);
      });
  }, [selectedSport, selectedDate, sports]);


  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    let hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${m} ${ampm}`;
  };


  /* -------------------------
     FIND MAX CONTINUOUS DURATION
  --------------------------*/
  const getMaxDuration = (slotId = selectedSlot) => {
    if (!slotId) return 1;
    const index = availableSlots.findIndex(s => s.id === slotId);
    if (index === -1) return 1;

    let max = 1;
    for (let i = index + 1; i < availableSlots.length; i++) {
      const prev = availableSlots[i - 1];
      const next = availableSlots[i];
      if (next.is_taken) break;
      if (prev.end_time !== next.start_time) break;
      max++;
    }
    return max;
  };


  /* -------------------------
     HANDLE PAYMENT & BOOKING
  --------------------------*/
  const handleBooking = async (partial = false) => {
    if (!selectedSport || !selectedSlot || !selectedDate) {
      toast.error("Please select sport, slot, and date before proceeding.");
      return;
    }

    const serviceObj = sports.find(s => s.name.toLowerCase() === selectedSport);

    const utcDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );
    const dateStr = utcDate.toISOString().split("T")[0];

    const bookingData = {
      service: serviceObj.id,
      time_slot: selectedSlot,
      date: dateStr,
      duration_hours: duration,
      is_partial_payment: partial,
    };

    setIsProcessingPayment(true);

    try {
      const bookingResponse = await createBooking(bookingData);
      const { razorpay_order_id, razorpay_key_id, amount } =
        bookingResponse.data || {};

      await loadRazorpayScript();

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key: razorpay_key_id,
        amount,
        currency: "INR",
        name: "IRON HAVEN",
        order_id: razorpay_order_id,
        prefill: {
          name: storedUser?.name,
          contact: storedUser?.phone_number,
        },
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            is_partial_payment: partial,
          });
          toast.success("Payment verified!");
          setTimeout(() => navigate("/my-bookings"), 200);
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled. If the transaction failed, the selected slot will be released in approximately 12 minutes.", {
              duration: 6000,
            });
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function () {
        toast.error("Payment failed. If the transaction failed, the selected slot will be released in approximately 12 minutes.", {
          duration: 6000,
        });
        setIsProcessingPayment(false);
      });

      rzp.open();
    } catch {
      toast.error("Failed to initiate booking. If the slot is temporarily locked because of payment failure, please try again later.", {
        duration: 6000,
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };


  /* -------------------------
     DISABLE PAST SLOTS
  --------------------------*/
  const isPastSlot = (slot) => {
    const now = new Date();
    const slotDate = new Date(selectedDate);

    if (
      slotDate.getDate() !== now.getDate() ||
      slotDate.getMonth() !== now.getMonth() ||
      slotDate.getFullYear() !== now.getFullYear()
    ) {
      return false;
    }

    const [h, m] = slot.start_time.split(":").map(Number);
    const slotStart = new Date();
    slotStart.setHours(h, m, 0, 0);

    return slotStart < now;
  };


  /* -------------------------
     UI STARTS HERE
  --------------------------*/
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-[Montserrat] pt-32">

      {/* GRITTY BACKGROUND */}
      <div
        className="absolute inset-0 -z-20 grayscale opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="absolute inset-0 bg-brutal-black -z-30" />

      <div className="max-w-7xl mx-auto p-6 lg:flex lg:gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:flex-1 space-y-6">
          <SportSelector
            sports={sports}
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
          />

          <Calendar
            currentMonth={currentMonth}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
            isPreviousMonthDisabled={isPreviousMonthDisabled}
            days={days}
            weekDays={weekDays}
            months={monthsLong}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isDateDisabled={isDateDisabled}
            isSameDay={isSameDay}
            today={today}
            formatSelectedDate={formatSelectedDate}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:flex-1 space-y-6">

          {/* SLOT SELECTOR */}
          <div className="brutalist-card p-7 !bg-white">
            <h2 className="text-3xl font-black text-black mb-6 uppercase italic flex items-center gap-3">
              <div className="w-2 h-8 bg-brutal-red" />
              Select Training Window
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {availableSlots.length === 0 ? (
                <p className="text-black font-bold">No slots available.</p>
              ) : (
                availableSlots
                  .filter(slot => !isPastSlot(slot))
                  .map((slot) => {
                    const slotText = `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`;
                    const isSelected = selectedSlot === slot.id;

                    return (
                      <button
                        key={slot.id}
                        disabled={slot.is_taken}
                        onClick={() => {
                          const max = getMaxDuration(slot.id);
                          setSelectedSlot(slot.id);
                          if (duration > max) setDuration(1);
                        }}
                        className={`
                          relative p-4 text-sm font-black transition-all duration-200 border-4
                          ${slot.is_taken
                            ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                            : isSelected
                              ? 'bg-brutal-yellow text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1'
                              : 'bg-white text-black border-black hover:bg-gray-100'
                          }
                        `}
                      >
                        {slotText}
                      </button>
                    );
                  })
              )}
            </div>
          </div>

          {/* DURATION SELECTOR */}
          <DurationSelector
            duration={duration}
            setDuration={setDuration}
            getMaxDuration={getMaxDuration}
            selectedSlot={selectedSlot}
          />

          {/* TURF SELECTOR */}
          <TurfSelector
            turfs={turfs}
            selectedTurf={selectedTurf}
            setSelectedTurf={setSelectedTurf}
          />

          {/* BOOKING SUMMARY */}
          <BookingSummary
            selectedSportObj={sports.find(s => s.name.toLowerCase() === selectedSport)}
            convenienceFee={convenienceFee}
            total={total}
            selectedSlot={availableSlots.find(s => s.id === selectedSlot)}
            duration={duration}
          />

          {/* ACTION BUTTONS */}
          <div className="brutalist-card p-7 space-y-4 !bg-black">
            {login ? (
              <>
                <button
                  onClick={() => handleBooking(false)}
                  disabled={isProcessingPayment}
                  className="brutalist-button w-full text-xl py-5 bg-brutal-yellow"
                >
                  {isProcessingPayment ? 'Processing...' : 'CONFIRM BOOKING'}
                </button>

                <button
                  onClick={() => handleBooking(true)}
                  disabled={isProcessingPayment}
                  className="brutalist-button w-full text-xl py-5 bg-white"
                >
                  {isProcessingPayment ? 'Processing...' : 'PAY PARTIAL'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setOverlay(true)}
                disabled={isProcessingPayment}
                className="brutalist-button w-full text-xl py-5 bg-brutal-red text-white"
              >
                Login to Continue
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {overlay && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          style={{ backdropFilter: 'blur(2px)' }}
        >
          <PhoneOTPComponent
            onSuccess={() => {
              setLogin(true);
              setOverlay(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
