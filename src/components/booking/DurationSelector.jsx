export default function DurationSelector({ duration, setDuration, getMaxDuration, selectedSlot }) {
  const maxDuration = getMaxDuration(selectedSlot);

  return (
    <div className="brutalist-card p-7">
      <h2 className="text-2xl font-black text-black mb-6 uppercase italic flex items-center gap-3">
        <div className="w-2 h-8 bg-brutal-black" />
        Select Duration
      </h2>

      <div className="flex items-center justify-center gap-6">

        {/* MINUS BUTTON */}
        <button
          onClick={() => duration > 1 && setDuration(duration - 1)}
          disabled={duration <= 1}
          className={`
            w-16 h-16 border-4 border-black font-black text-3xl flex items-center justify-center transition-all duration-200
            ${
              duration <= 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300 opacity-50'
                : 'bg-white text-black hover:bg-brutal-red hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }
          `}
        >
          −
        </button>

        {/* DISPLAY */}
        <div className="text-center min-w-[140px] border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-5xl font-black text-black">
            {duration}
          </div>
          <div className="text-sm text-black font-black uppercase mt-1 tracking-widest">hour(s)</div>
        </div>

        {/* PLUS BUTTON */}
        <button
          onClick={() => setDuration(duration + 1)}
          disabled={duration >= maxDuration || duration === 4}
          className={`
            w-16 h-16 border-4 border-black font-black text-3xl flex items-center justify-center transition-all duration-200
            ${
              duration >= maxDuration || duration === 4
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300 opacity-50'
                : 'bg-white text-black hover:bg-brutal-yellow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            }
          `}
        >
          +
        </button>

      </div>
    </div>
  );
}
