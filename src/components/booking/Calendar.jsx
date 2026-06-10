import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

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
    <div className="card-dental">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-sky-500 rounded-full" />
        Select Appointment Date
      </h2>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            disabled={isPreviousMonthDisabled()}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isPreviousMonthDisabled()
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-800">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
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
                className={`aspect-square rounded-xl text-sm font-semibold transition-all duration-200 ${
                  disabled
                    ? 'text-slate-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-sky-600 text-white shadow-md scale-105'
                    : isToday
                    ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                    : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-sky-600 border border-slate-50'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="
        mt-6
        rounded-2xl
        bg-slate-50
        p-4
        border border-slate-100
        flex items-center gap-4
      ">
        <div className="p-2 bg-white rounded-lg shadow-sm text-sky-600">
          <CalendarIcon size={20} />
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Appointment Date
          </div>
          <div className="text-lg font-bold text-slate-800">
            {formatSelectedDate()}
          </div>
        </div>
      </div>
    </div>
  );
}
