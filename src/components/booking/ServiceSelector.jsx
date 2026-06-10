import { Stethoscope, Sparkles, Activity, ShieldCheck } from "lucide-react";

export default function ServiceSelector({ sports, selectedSport, onSelectSport }) {

  // Map each service to an icon
  const getIcon = (name) => {
    const service = name.toLowerCase();
    if (service.includes("checkup") || service.includes("consultation")) return <Stethoscope />;
    if (service.includes("whitening") || service.includes("aesthetic")) return <Sparkles />;
    if (service.includes("root canal") || service.includes("surgery")) return <Activity />;
    return <ShieldCheck />; // fallback
  };

  return (
    <div
      className="card-dental"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-sky-500 rounded-full" />
        Select Service
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sports.map((sport) => {
          const isSelected = selectedSport === sport.name.toLowerCase();

          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.name.toLowerCase())}
              className={`
                relative
                p-4 rounded-xl
                transition-all duration-300
                flex items-center gap-4
                text-left
                border
                ${
                  isSelected
                    ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-300 shadow-sm'
                    : 'bg-white border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  p-3 rounded-lg transition-all duration-300
                  ${isSelected ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600'}
                `}
              >
                {getIcon(sport.name)}
              </div>

              {/* Service Name */}
              <div className="flex flex-col">
                <span
                  className={`
                    font-bold transition-all duration-300
                    ${isSelected ? 'text-sky-900' : 'text-slate-700'}
                  `}
                >
                  {sport.name}
                </span>
                <span className="text-xs text-slate-400">Professional Care</span>
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
}
