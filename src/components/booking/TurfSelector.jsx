import { useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function TurfSelector({ turfs, selectedTurf, setSelectedTurf }) {

  // ✅ Auto-select the first turf by default
  useEffect(() => {
    if (!selectedTurf && turfs.length > 0) {
      setSelectedTurf(turfs[0].id);
    }
  }, [selectedTurf, turfs, setSelectedTurf]);

  return (
    <div className="brutalist-card p-7">
      <h2 className="text-2xl font-black text-black mb-6 uppercase italic flex items-center gap-3">
        <div className="w-2 h-8 bg-brutal-black" />
        Select Training Zone
      </h2>

      <div className="space-y-3">
        {turfs.map((turf) => {
          const isSelected = selectedTurf === turf.id;

          return (
            <button
              key={turf.id}
              onClick={() => setSelectedTurf(turf.id)}
              className={`
                w-full p-4 font-black uppercase tracking-tighter
                flex items-center gap-3 transition-all duration-200 border-4
                ${
                  isSelected
                    ? "bg-brutal-yellow text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1"
                    : "bg-white text-black border-black hover:bg-gray-100"
                }
              `}
            >
              <MapPin className="w-5 h-5" />
              {turf.name.replace("Turf", "Rack")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
