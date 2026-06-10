import { Stethoscope, Sparkles, Activity, ShieldCheck, HeartPulse } from "lucide-react";

export default function ServiceSelector({ sports, selectedSport, onSelectSport }) {

  // Map each service to an icon
  const getIcon = (name) => {
    const service = name.toLowerCase();
    if (service.includes("checkup") || service.includes("consultation")) return <Stethoscope size={24} />;
    if (service.includes("whitening") || service.includes("aesthetic")) return <Sparkles size={24} />;
    if (service.includes("root canal") || service.includes("surgery")) return <Activity size={24} />;
    if (service.includes("cleaning") || service.includes("hygiene")) return <HeartPulse size={24} />;
    return <ShieldCheck size={24} />; // fallback
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <div className="w-2 h-8 bg-sky-600 rounded-full shadow-lg shadow-sky-200" />
        Choose Your Treatment
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sports.map((sport) => {
          const isSelected = selectedSport === sport.name.toLowerCase();

          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.name.toLowerCase())}
              className={`
                group relative
                p-6 rounded-2xl
                transition-all duration-500
                flex items-start gap-5
                text-left
                border-2
                ${
                  isSelected
                    ? 'bg-sky-600 border-sky-600 shadow-xl shadow-sky-200 -translate-y-1'
                    : 'bg-white border-slate-100 hover:border-sky-200 hover:shadow-lg hover:-translate-y-1'
                }
              `}
            >
              {/* Icon Container */}
              <div
                className={`
                  p-4 rounded-xl transition-all duration-500
                  ${isSelected ? 'bg-white/20 text-white scale-110' : 'bg-sky-50 text-sky-600 group-hover:scale-110'}
                `}
              >
                {getIcon(sport.name)}
              </div>

              {/* Text Container */}
              <div className="flex flex-col pt-1">
                <span
                  className={`
                    text-lg font-black transition-all duration-500 leading-tight
                    ${isSelected ? 'text-white' : 'text-slate-800'}
                  `}
                >
                  {sport.name}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest mt-1.5 transition-all duration-500 ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                   Premium Dental Care
                </span>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
