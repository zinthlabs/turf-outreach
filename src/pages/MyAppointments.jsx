import { useEffect, useState } from "react";
import { fetchMyBookings } from "../services/api";
import { Loader2, ChevronDown, Calendar, Clock, CreditCard, Stethoscope, ShieldCheck, MapPin, Download, CheckCircle2 } from "lucide-react";

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
        <div className="relative">
          <div className="w-20 h-20 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Stethoscope className="text-sky-600 w-8 h-8" />
          </div>
        </div>
        <p className="text-slate-500 font-bold mt-8 tracking-wide">PREPARING YOUR RECORDS...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 px-6">
        <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-[48px] shadow-2xl shadow-sky-900/5 border border-slate-100 px-10">
          <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-8">
            <Calendar size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">No Appointments Yet</h2>
          <p className="text-slate-500 mb-10 leading-relaxed text-lg">Your medical journey at Cuspids starts here. Book your first consultation and let's work on your perfect smile together.</p>
          <button
            onClick={() => window.location.href = '/booking'}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Stethoscope size={20} />
            Book Your First Visit
          </button>
        </div>
      </div>
    );
  }

  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-24">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} />
              Verified Patient Records
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
              My Appointments
            </h1>
            <p className="text-slate-500 text-lg">Track and manage your upcoming dental visits.</p>
          </div>
          <button
            onClick={() => window.location.href = '/booking'}
            className="btn-secondary h-fit flex items-center gap-2 bg-white"
          >
            New Appointment
          </button>
        </div>

        <div className="space-y-6">
          {bookings.map((b) => {
            const open = openId === b.booking_id;

            return (
              <div
                key={b.booking_id}
                className={`
                  group rounded-[32px] transition-all duration-500 border overflow-hidden
                  ${open ? 'bg-white shadow-2xl border-sky-200 ring-4 ring-sky-50' : 'bg-white border-slate-100 hover:shadow-xl hover:border-sky-100'}
                `}
              >

                {/* ---- TOP BAR ---- */}
                <button
                  onClick={() => toggleOpen(b.booking_id)}
                  className="
                    w-full flex flex-col sm:flex-row justify-between items-start sm:items-center
                    px-8 py-8 text-left transition-colors
                  "
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${open ? 'bg-sky-600 text-white rotate-6 scale-110 shadow-lg shadow-sky-200' : 'bg-sky-50 text-sky-600 group-hover:rotate-3'}`}>
                      <Stethoscope size={32} />
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-slate-900 mb-1">
                        {b.service?.name}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-400">
                         <span className="flex items-center gap-1.5"><Calendar size={16} className="text-sky-500" /> {b.date}</span>
                         <span className="flex items-center gap-1.5"><Clock size={16} className="text-sky-500" /> {to12Hour(b.time_slot.start_time)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    {/* STATUS BADGE */}
                    <div
                      className={`
                        px-5 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2
                        ${
                          b.status === "paid"
                            ? "bg-green-50 text-green-600"
                            : b.status === "partial"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-50 text-slate-400"
                        }
                      `}
                    >
                      {b.status === "paid" && <CheckCircle2 size={14} />}
                      {b.status}
                    </div>

                    {/* CHEVRON */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 transition-all duration-300 ${open ? 'rotate-180 bg-sky-50 text-sky-600' : 'group-hover:bg-slate-100'}`}>
                      <ChevronDown size={24} />
                    </div>
                  </div>
                </button>

                {/* ---- EXPANDED DETAILS ---- */}
                {open && (
                  <div className="px-8 pb-10 pt-2 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[24px] bg-slate-50 border border-slate-100 relative overflow-hidden">
                      {/* Decorative Background Icon */}
                      <Stethoscope className="absolute -right-10 -bottom-10 w-48 h-48 text-sky-900/5 rotate-12" />

                      <div className="space-y-6 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm text-sky-600">
                             <Calendar size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Scheduled Appointment</p>
                            <p className="text-xl font-extrabold text-slate-800">{b.date}</p>
                            <p className="text-sm font-semibold text-slate-500">{formatTimeRange(b.time_slot.start_time, b.duration_hours)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm text-sky-600">
                             <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Clinic Location</p>
                            <p className="text-xl font-extrabold text-slate-800">Premium Suite 1</p>
                            <p className="text-sm font-semibold text-slate-500">Cuspids Dental Studio, Floor 4</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-white rounded-xl shadow-sm text-sky-600">
                             <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Payment & Billing</p>
                            <p className="text-xl font-extrabold text-slate-800">{b.payment_id || "Awaiting Payment"}</p>
                            <p className="text-sm font-bold text-sky-600 uppercase">STATUS: {b.status}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <div className="p-3 bg-white rounded-xl shadow-sm text-sky-600">
                             <div className="w-5 h-5 flex items-center justify-center font-black text-xs">ID</div>
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Appointment Reference</p>
                            <p className="font-mono text-lg font-bold text-slate-600">{b.booking_id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-slate-400 italic text-sm">
                        <ShieldCheck size={16} />
                        Please arrive 15 minutes before your scheduled time.
                      </div>
                      <div className="flex gap-4">
                         <button className="flex items-center gap-2 text-sky-600 font-bold hover:text-sky-700 transition-colors bg-sky-50 px-6 py-2.5 rounded-full">
                           <Download size={18} />
                           Download Receipt
                         </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
