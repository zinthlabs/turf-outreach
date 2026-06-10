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
    <div className="card-dental">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-sky-500 rounded-full" />
        Select Room/Clinic
      </h2>

      <div className="space-y-3">
        {turfs.map((turf) => {
          const isSelected = selectedTurf === turf.id;

          return (
            <button
              key={turf.id}
              onClick={() => setSelectedTurf(turf.id)}
              className={`
                w-full p-4 rounded-xl font-bold
                flex items-center gap-3 transition-all duration-300
                border
                ${
                  isSelected
                    ? "bg-sky-600 border-sky-600 text-white shadow-md scale-105"
                    : "bg-white border-slate-100 text-slate-700 hover:border-sky-200 hover:bg-slate-50"
                }
              `}
            >
              <MapPin className={`w-5 h-5 ${isSelected ? 'text-sky-200' : 'text-sky-500'}`} />
              {turf.name.replace('Turf', 'Clinic')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
