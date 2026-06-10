import { Clock, Info } from 'lucide-react';

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
    <div className="card-dental">
      <h3 className="font-bold text-xl mb-6 text-slate-800">
        Appointment Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Service Fee</span>
          <span className="font-bold text-lg text-slate-900">
            ₹{bookingFee === 0 ? 0 : bookingFee - 20}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Registration Fee</span>
          <span className="font-bold text-lg text-slate-900">
            ₹{bookingFee === 0 ? 0 : convenienceFee}
          </span>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-slate-900">
              Total Payable
            </span>
            <span className="text-2xl font-extrabold text-sky-600">
              ₹{bookingFee === 0 ? 0 : total - 20}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Time */}
      <div className="
        rounded-xl
        bg-sky-50
        p-4
        border border-sky-100
      ">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-sky-600" />

          <div>
            <div className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">
              Selected Schedule
            </div>

            <div className="font-bold text-slate-800">
              {selectedSlot
                ? `${formatTime(selectedSlot.start_time)} → ${formatTime(endTime)}`
                : "No slot selected"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 items-start text-[11px] text-slate-400">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p>A confirmation email and SMS will be sent once the appointment is confirmed.</p>
      </div>
    </div>
  );
}
