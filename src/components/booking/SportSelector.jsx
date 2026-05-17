import { Dumbbell, Activity, Timer } from "lucide-react";

export default function SportSelector({ sports, selectedSport, onSelectSport }) {

  // Map each sport to an icon
  const getIcon = (name) => {
    const sport = name.toLowerCase();
    if (sport.includes("football") || sport.includes("soccer")) return <Dumbbell />;
    if (sport.includes("cricket")) return <Activity />;
    if (sport.includes("badminton")) return <Timer />;
    return <Dumbbell />; // fallback
  };

  return (
    <div className="brutalist-card p-7">
      <h2 className="text-2xl font-black text-black mb-6 uppercase italic flex items-center gap-3">
        <div className="w-2 h-8 bg-brutal-black" />
        Select Training Type
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {sports.map((sport) => {
          const isSelected = selectedSport === sport.name.toLowerCase();

          return (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.name.toLowerCase())}
              className={`
                relative
                p-5
                transition-all duration-200
                flex flex-col items-center gap-3
                group border-4
                ${
                  isSelected
                    ? 'bg-brutal-yellow text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1'
                    : 'bg-white text-black border-black hover:bg-gray-100'
                }
              `}
            >

              {/* Icon */}
              <span
                className={`
                  text-4xl transition-all duration-300
                  ${isSelected ? 'scale-110' : ''}
                `}
              >
                {getIcon(sport.name)}
              </span>

              {/* Sport Name */}
              <span className="font-black uppercase tracking-tighter">
                {sport.name.replace("Football", "Strength").replace("Cricket", "Cardio").replace("Badminton", "HIIT")}
              </span>

            </button>
          );
        })}
      </div>
    </div>
  );
}
