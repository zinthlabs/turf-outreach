export default function DurationSelector({ duration, setDuration, getMaxDuration, selectedSlot }) {
  const maxDuration = getMaxDuration(selectedSlot);

  return (
    <div className="card-dental">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-sky-500 rounded-full" />
        Consultation Duration
      </h2>

      <div className="flex items-center justify-center gap-8">

        {/* MINUS BUTTON */}
        <button
          onClick={() => duration > 1 && setDuration(duration - 1)}
          disabled={duration <= 1}
          className={`
            w-12 h-12 rounded-xl font-bold text-xl flex items-center justify-center transition-all duration-200
            ${
              duration <= 1
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'bg-sky-50 text-sky-600 hover:bg-sky-100 active:scale-95'
            }
          `}
        >
          −
        </button>

        {/* DISPLAY */}
        <div className="text-center">
          <div className="text-4xl font-extrabold text-sky-600">
            {duration}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">hour(s)</div>
        </div>

        {/* PLUS BUTTON */}
        <button
          onClick={() => setDuration(duration + 1)}
          disabled={duration >= maxDuration || duration === 4}
          className={`
            w-12 h-12 rounded-xl font-bold text-xl flex items-center justify-center transition-all duration-200
            ${
              duration >= maxDuration || duration === 4
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'bg-sky-50 text-sky-600 hover:bg-sky-100 active:scale-95'
            }
          `}
        >
          +
        </button>

      </div>
      <p className="text-[10px] text-slate-400 text-center mt-6">
        Extended sessions are subject to availability.
      </p>
    </div>
  );
}
