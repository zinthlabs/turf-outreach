import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ShieldCheck, Star, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useSports } from '../hooks/UseSports';
import { fetchSlots, createBooking, verifyPayment } from '../services/api';
import ServiceSelector from '../components/booking/ServiceSelector';
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
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay SDK failed to load.'));
    document.body.appendChild(script);
  });
};


export default function AppointmentBooking() {

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
  const { sports, loading, error } = useSports();
  const [login, setLogin] = useState(isLoggedIn());

  const turfs = [
    { id: 'dental-room-1', name: 'Premium Dental Suite 1' },
    { id: 'dental-room-2', name: 'Premium Dental Suite 2' },
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
     AUTO-SELECT DEFAULT SERVICE
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
      toast.error("Please select service, slot, and date before proceeding.");
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
      const { booking_id, razorpay_order_id, razorpay_key_id, amount } =
        bookingResponse.data || {};

      await loadRazorpayScript();

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key: razorpay_key_id,
        amount,
        currency: "INR",
        name: "Cuspids Dental Studio",
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
          toast.success("Appointment Confirmed!");
          setTimeout(() => navigate("/my-bookings"), 200);
        },
        modal: {
          ondismiss: () => {
            toast.error("Process cancelled. If payment failed, the slot will be released shortly.", {
              duration: 6000,
            });
            setIsProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        toast.error("Payment failed. Please try again.", {
          duration: 6000,
        });
        setIsProcessingPayment(false);
      });

      rzp.open();
    } catch (error) {
      toast.error("Failed to initiate booking. Please try again later.", {
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
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Premium Hero Banner */}
      <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1629909605125-58da16ffaf91?q=80&w=2000&auto=format&fit=crop"
          alt="Dental Clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-sky-900/40 backdrop-blur-[2px]" />

        <div className="relative z-10 text-center px-6 max-w-4xl pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-white text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} className="text-sky-300" />
            Certified Dental Excellence
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Schedule Your <span className="text-sky-300">New Smile</span>
          </h1>
          <p className="text-lg text-sky-50 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Experience premium dental care in a state-of-the-art environment. Your journey to perfect oral health begins here.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[32px] shadow-xl shadow-sky-900/5 border border-slate-100 overflow-hidden">
               <ServiceSelector
                sports={sports}
                selectedSport={selectedSport}
                onSelectSport={setSelectedSport}
              />
            </div>

            <div className="bg-white rounded-[32px] shadow-xl shadow-sky-900/5 border border-slate-100 overflow-hidden">
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
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-8">

            {/* SLOT SELECTOR */}
            <div className="card-dental bg-white shadow-xl shadow-sky-900/5">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-sky-500 rounded-full" />
                Select a Time
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {availableSlots.length === 0 ? (
                  <div className="col-span-2 py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-400 text-sm">No available slots for this date.</p>
                  </div>
                ) : (
                  availableSlots
                    .filter(slot => !isPastSlot(slot))
                    .map((slot) => {
                      const slotText = `${formatTime(slot.start_time)}`;
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
                            relative p-3.5 rounded-xl text-sm font-bold transition-all duration-300
                            border
                            ${slot.is_taken
                              ? 'bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed opacity-60'
                              : isSelected
                                ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-200 scale-105'
                                : 'bg-white text-slate-700 border-slate-100 hover:border-sky-200 hover:bg-sky-50'
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
            <div className="bg-white rounded-[32px] shadow-xl shadow-sky-900/5 border border-slate-100 overflow-hidden">
              <DurationSelector
                duration={duration}
                setDuration={setDuration}
                getMaxDuration={getMaxDuration}
                selectedSlot={selectedSlot}
              />
            </div>

            {/* CLINIC SELECTOR */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-sky-900/5 border border-slate-100 overflow-hidden">
              <TurfSelector
                turfs={turfs}
                selectedTurf={selectedTurf}
                setSelectedTurf={setSelectedTurf}
              />
            </div>

            {/* BOOKING SUMMARY */}
            <div className="bg-white rounded-[32px] shadow-xl shadow-sky-900/5 border border-slate-100 overflow-hidden">
              <BookingSummary
                selectedSportObj={sports.find(s => s.name.toLowerCase() === selectedSport)}
                convenienceFee={convenienceFee}
                total={total}
                selectedSlot={availableSlots.find(s => s.id === selectedSlot)}
                duration={duration}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4 pt-4">
              {login ? (
                <>
                  <button
                    onClick={() => handleBooking(false)}
                    disabled={isProcessingPayment}
                    className="
                      w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-sky-200
                      transition-all duration-300 active:scale-95 flex items-center justify-center gap-3
                    "
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        CONFIRM APPOINTMENT
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleBooking(true)}
                    disabled={isProcessingPayment}
                    className="
                      w-full bg-white hover:bg-sky-50 text-sky-600 font-bold py-5 rounded-2xl border border-sky-100
                      transition-all duration-300 active:scale-95
                    "
                  >
                    {isProcessingPayment ? 'Processing...' : 'PARTIAL PRE-PAYMENT'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setOverlay(true)}
                  disabled={isProcessingPayment}
                  className="
                    w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-sky-200
                    transition-all duration-300
                  "
                >
                  Login to Continue
                </button>
              )}

              <div className="flex items-center justify-center gap-6 py-4 opacity-50 grayscale">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold">4.9 Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-sky-600" />
                  <span className="text-xs font-bold">Safe & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP MODAL */}
      {overlay && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-md"
        >
          <div className="animate-scaleIn">
             <PhoneOTPComponent
              onSuccess={() => {
                setLogin(true);
                setOverlay(false);
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
