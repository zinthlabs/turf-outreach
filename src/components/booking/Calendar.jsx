import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({
  currentMonth,
  goToPreviousMonth,
  goToNextMonth,
  isPreviousMonthDisabled,
  days,
  weekDays,
  months,
  selectedDate,
  setSelectedDate,
  isDateDisabled,
  isSameDay,
  today,
  formatSelectedDate,
}) {
  return (
    <div className="brutalist-card p-7">
      <h2 className="text-2xl font-black text-black mb-6 uppercase italic flex items-center gap-3">
        <div className="w-2 h-8 bg-brutal-black" />
        Select Training Date
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            disabled={isPreviousMonthDisabled()}
            className={`p-2.5 transition-all duration-200 border-4 border-black ${
              isPreviousMonthDisabled()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-white text-black hover:bg-brutal-yellow'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-xl text-black uppercase tracking-tighter">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2.5 border-4 border-black bg-white text-black hover:bg-brutal-yellow transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-black text-black uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const disabled = isDateDisabled(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);

            return (
              <button
                key={idx}
                onClick={() => !disabled && setSelectedDate(day)}
                disabled={disabled}
                className={`aspect-square text-sm font-black transition-all duration-200 border-4 ${
                  disabled
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50 border-gray-100'
                    : isSelected
                    ? 'bg-brutal-yellow text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1'
                    : isToday
                    ? 'bg-black text-white border-black hover:bg-brutal-red'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="
        mt-4
        border-4 border-black
        bg-brutal-black
        p-4
        text-center
      ">
        <div className="text-sm text-white font-black uppercase mb-1">
          Target Date
        </div>
        <div className="text-3xl font-black text-brutal-yellow uppercase italic tracking-tighter">
          {formatSelectedDate()}
        </div>
      </div>
    </div>
  );
}
