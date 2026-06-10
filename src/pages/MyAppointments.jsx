import { useEffect, useState } from "react";
import { fetchMyBookings } from "../services/api";
import { Loader2, ChevronDown, ChevronUp, Calendar, Clock, CreditCard } from "lucide-react";

export default function MyAppointments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
// Convert "HH:MM" → minutes
const toMinutes = (str) => {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
};

// Convert minutes → "HH:MM" 24-hour
const fromMinutes = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Convert "HH:MM" → "h:MM AM/PM"
const to12Hour = (timeStr) => {
  if (!timeStr) return "NA";
  let [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
};

//  Format Range
 const formatTimeRange = (startTime24, durationHours) => {
  const startMins = toMinutes(startTime24);
  const endMins = startMins + durationHours * 60;

  const endTime24 = fromMinutes(endMins);

  return `${to12Hour(startTime24)} – ${to12Hour(endTime24)}`;
};


  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await fetchMyBookings();
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center bg-slate-50 min-h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-sky-600 mb-4" />
        <p className="text-slate-500 font-medium">Retrieving your appointments...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 px-6">
        <div className="max-w-md mx-auto text-center py-20 bg-white rounded-[40px] shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-6">
            <Calendar size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Appointments</h2>
          <p className="text-slate-500 mb-8 px-8">You haven't booked any appointments yet. Your smile is waiting!</p>
          <button
            onClick={() => window.location.href = '/booking'}
            className="btn-primary"
          >
            Book Your First Visit
          </button>
        </div>
      </div>
    );
  }

  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            My Appointments
          </h1>
          <p className="text-slate-500">Keep track of your scheduled dental visits.</p>
        </div>

        <div className="space-y-4">
          {bookings.map((b) => {
            const open = openId === b.booking_id;

            return (
              <div
                key={b.booking_id}
                className={`
                  rounded-3xl transition-all duration-300 border
                  ${open ? 'bg-white shadow-xl border-sky-100' : 'bg-white border-slate-100 hover:shadow-md'}
                `}
              >

                {/* ---- TOP BAR ---- */}
                <button
                  onClick={() => toggleOpen(b.booking_id)}
                  className="
                    w-full flex justify-between items-center
                    px-8 py-6 text-left
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${open ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600'}`}>
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-800">
                        {b.service?.name}
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-2">
                        <Calendar size={14} /> {b.date} • <Clock size={14} /> {to12Hour(b.time_slot.start_time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* STATUS BADGE */}
                    <span
                      className={`
                        hidden sm:inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                        ${
                          b.status === "paid"
                            ? "bg-green-50 text-green-600"
                            : b.status === "partial"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-50 text-slate-400"
                        }
                      `}
                    >
                      {b.status}
                    </span>

                    {/* CHEVRON */}
                    <div className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                      <ChevronDown className="text-slate-300" />
                    </div>
                  </div>
                </button>

                {/* ---- EXPANDED DETAILS ---- */}
                {open && (
                  <div className="px-8 pb-8 pt-2 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar size={18} className="text-sky-500 mt-1" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled Date</p>
                            <p className="font-bold text-slate-800">{b.date}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock size={18} className="text-sky-500 mt-1" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Slot</p>
                            <p className="font-bold text-slate-800">{formatTimeRange(b.time_slot.start_time, b.duration_hours)}</p>
                            <p className="text-xs text-slate-500">{b.duration_hours} hour session</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CreditCard size={18} className="text-sky-500 mt-1" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Info</p>
                            <p className="font-bold text-slate-800">{b.payment_id || "Payment Pending"}</p>
                            <p className="text-xs text-slate-500 uppercase">Status: {b.status}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-[18px] h-[18px] border-2 border-sky-500 rounded-full flex items-center justify-center text-sky-500 text-[10px] font-bold mt-1">ID</div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment Ref</p>
                            <p className="font-mono text-slate-600">{b.booking_id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button className="text-sky-600 font-bold text-sm hover:underline">Download Receipt</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn .25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
