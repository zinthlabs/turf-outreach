import { Clock } from 'lucide-react';

export default function BookingSummary({
  selectedSportObj,
  convenienceFee = 20,
  selectedSlot,
  duration = 1,
}) {
  // Convert HH:mm -> minutes
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Convert back to HH:mm string
  const minutesToTime = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // backend logic replicated
  const calculateBookingFee = () => {
    if (!selectedSportObj || !selectedSlot) return 0;

    const EVENING_START = toMinutes(selectedSportObj.evening_start || "17:00");

    const morningPrice = Number(selectedSportObj.price_per_hour);
    const eveningPrice = Number(selectedSportObj.evening_pricing);

    let startTime = toMinutes(selectedSlot.start_time);
    let total = 0;

    for (let i = 0; i < duration; i++) {
      const currentSlotStart = startTime + i * 60;

      if (currentSlotStart >= EVENING_START) {
        total += eveningPrice;
      } else {
        total += morningPrice;
      }
    }

    return total;
  };

  const bookingFee = calculateBookingFee();
  const total = bookingFee + convenienceFee;

  const formatTime = (timeStr) => {
    if (!timeStr) return "NA";
    const [hours, minutes] = timeStr.split(":");
    let hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    hourNum = hourNum % 12 || 12;
    return `${hourNum}:${minutes} ${ampm}`;
  };

  // Calculate end time (start + duration hours)
  const endTime = selectedSlot
    ? minutesToTime(toMinutes(selectedSlot.start_time) + duration * 60)
    : null;

  return (
    <div className="brutalist-card p-7 !bg-white">
      <h3 className="font-black text-2xl mb-6 text-black uppercase italic tracking-tighter">
        Mission Briefing
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-black font-black uppercase">Booking Fee</span>
          <span className="font-black text-3xl text-black">
            ₹{bookingFee === 0 ? 0 : bookingFee - 20}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-black font-black uppercase">Tax & Fees</span>
          <span className="font-black text-3xl text-black">
            ₹{bookingFee === 0 ? 0 :convenienceFee }
          </span>
        </div>

        <div className="border-t-4 border-black pt-4">
          <div className="flex justify-between items-center">
            <span className="font-black text-xl text-black uppercase">
              Total Damage
            </span>
            <span className="text-4xl font-black text-brutal-red italic">
              ₹{bookingFee === 0 ? 0 :total - 20}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Time */}
      <div className="border-4 border-black bg-black p-4">
        <div className="flex items-center gap-3 text-white">
          <Clock className="w-6 h-6 text-brutal-yellow" />

          <div>
            <div className="text-xs text-brutal-yellow font-black uppercase tracking-widest">
              Execution Window
            </div>

            <div className="font-black text-lg uppercase">
              {selectedSlot
                ? `${formatTime(selectedSlot.start_time)} → ${formatTime(endTime)}`
                : "Awaiting Input"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
