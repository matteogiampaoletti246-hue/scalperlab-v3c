import React from 'react';
import { MapPin, Sun, CloudRain, Cloud, Wind, Shield } from 'lucide-react';

interface InfoBandProps {
  stadium: string;
  weather: {
    condition: string;
    icon: 'sun' | 'rain' | 'cloud' | 'wind';
    temp: string;
    wind: string;
  };
  referee: {
    name: string;
    id?: string;
    avgYellows?: number;
  };
  onRefereeClick?: () => void;
}

export const InfoBand: React.FC<InfoBandProps> = ({
  stadium,
  weather,
  referee,
  onRefereeClick,
}) => {
  const renderWeatherIcon = () => {
    switch (weather.icon) {
      case 'rain':
        return <CloudRain className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'cloud':
        return <Cloud className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'wind':
        return <Wind className="w-3.5 h-3.5 text-teal-500 shrink-0" />;
      case 'sun':
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    }
  };

  return (
    <div className="mx-3 my-2.5 px-3 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 backdrop-blur-md">
      <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 items-center text-center">
        {/* Stadio */}
        <div className="px-2 flex flex-col items-center justify-center min-w-0">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>Stadio</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full mt-0.5" title={stadium}>
            {stadium.replace('Stadio ', '')}
          </span>
        </div>

        {/* Meteo */}
        <div className="px-2 flex flex-col items-center justify-center min-w-0">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            {renderWeatherIcon()}
            <span>Meteo</span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate w-full mt-0.5">
            {weather.temp} · {weather.wind}
          </span>
        </div>

        {/* Arbitro */}
        <button
          onClick={onRefereeClick}
          className="px-2 flex flex-col items-center justify-center min-w-0 hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            <Shield className="w-3 h-3 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>Arbitro</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full mt-0.5 text-emerald-600 dark:text-emerald-400">
            {referee.name}
          </span>
        </button>
      </div>
    </div>
  );
};
