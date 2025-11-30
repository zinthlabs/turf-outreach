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
    <div className="
      rounded-3xl
      backdrop-blur-3xl
      bg-gray-950/10
      border border-white/15
      shadow-[0_24px_80px_rgba(0,0,0,0.55)]
      p-7
    ">
      <h3 className="font-semibold text-xl mb-6 text-emerald-50">
        Booking Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-emerald-100/80 font-medium">Booking Fee</span>
          <span className="font-bold text-2xl text-emerald-50">
            ₹{bookingFee === 0 ? 0 : bookingFee - 20}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-emerald-100/80 font-medium">Convenience Fee</span>
          <span className="font-bold text-2xl text-emerald-50">
            ₹{bookingFee === 0 ? 0 :convenienceFee }
          </span>
        </div>

        <div className="border-t border-white/20 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-emerald-50">
              Total Amount
            </span>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
              ₹{bookingFee === 0 ? 0 :total - 20} 
            </span>
          </div>
        </div>
      </div>

      {/* Selected Time */}
      <div className="
        rounded-2xl
        border border-white/20
        bg-white/10
        backdrop-blur-xl
        p-4
      ">
        <div className="flex items-center gap-3 text-emerald-50">
          <Clock className="w-5 h-5 text-emerald-300" />

          <div>
            <div className="text-xs text-emerald-100/60 font-medium">
              Selected Time
            </div>

            <div className="font-bold">
              {selectedSlot
                ? `${formatTime(selectedSlot.start_time)} → ${formatTime(endTime)}`
                : "No slot selected"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
