import { useEffect, useState } from "react";
import { fetchMyBookings } from "../services/api";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function MyBookings() {
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
      <div className="py-20 flex justify-center bg-brutal-black min-h-screen">
        <Loader2 className="animate-spin w-16 h-16 text-brutal-yellow" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="relative min-h-screen pt-36 bg-brutal-black">
        <div className="py-20 text-center text-white text-3xl font-black uppercase italic tracking-tighter">
          NO MISSIONS LOGGED.
        </div>
      </div>
    );
  }

  const toggleOpen = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="relative min-h-screen pt-48 bg-brutal-black font-[Montserrat] pb-20">

      {/* GRITTY BACKGROUND */}
      <div
        className="absolute inset-0 -z-20 grayscale opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-6xl font-black mb-12 text-white uppercase italic tracking-tighter border-l-8 border-brutal-red pl-6">
          MY DOSSIER
        </h1>

        <div className="space-y-6">
          {bookings.map((b) => {
            const open = openId === b.booking_id;

            return (
              <div
                key={b.booking_id}
                className="brutalist-card !bg-white"
              >

                {/* ---- TOP BAR ---- */}
                <button
                  onClick={() => toggleOpen(b.booking_id)}
                  className="
                    w-full flex justify-between items-center 
                    px-6 py-6 text-left transition-all
                    hover:bg-gray-100
                  "
                >
                  <div>
                    <div className="text-2xl font-black text-black uppercase tracking-tighter">
                      {b.service?.name.replace("Football", "Strength").replace("Cricket", "Cardio").replace("Badminton", "HIIT")}
                    </div>
                    <div className="text-sm font-black text-black/60 uppercase tracking-widest mt-1">
                      {b.date} • {to12Hour(b.time_slot.start_time)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* STATUS BADGE */}
                    <span
                      className={`
                        px-4 py-1 border-4 border-black text-xs font-black uppercase tracking-widest
                        ${
                          b.status === "paid"
                            ? "bg-brutal-yellow text-black"
                            : b.status === "partial"
                            ? "bg-white text-black"
                            : "bg-gray-200 text-black"
                        }
                      `}
                    >
                      {b.status.toUpperCase()}
                    </span>

                    {/* CHEVRON */}
                    {open ? (
                      <ChevronUp className="text-black" strokeWidth={4} />
                    ) : (
                      <ChevronDown className="text-black" strokeWidth={4} />
                    )}
                  </div>
                </button>

                {/* ---- EXPANDED DETAILS ---- */}
                {open && (
                  <div className="px-6 pb-6 text-black border-t-4 border-black pt-6 animate-fadeIn font-black uppercase text-sm tracking-widest space-y-2">
                    <p>
                      <span className="bg-black text-white px-2 py-1 mr-2">DATE:</span> {b.date}
                    </p>
                    <p>
                      <span className="bg-black text-white px-2 py-1 mr-2">WINDOW:</span>{" "}
                     {formatTimeRange(b.time_slot.start_time, b.duration_hours)}
                    </p>
                    <p>
                      <span className="bg-black text-white px-2 py-1 mr-2">DURATION:</span>{" "}
                      {b.duration_hours} hour(s)
                    </p>
                    <p>
                      <span className="bg-black text-white px-2 py-1 mr-2">TXID:</span>{" "}
                      {b.payment_id || "PENDING"}
                    </p>
                    <p>
                      <span className="bg-black text-white px-2 py-1 mr-2">ID:</span>{" "}
                      {b.booking_id}
                    </p>
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
          animation: fadeIn .2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
