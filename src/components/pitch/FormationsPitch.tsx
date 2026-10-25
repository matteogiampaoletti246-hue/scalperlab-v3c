import React, { useState } from 'react';
import { PlayerLineup } from '../../data/mockData';
import { ArrowDownRight, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface FormationsPitchProps {
  homeFormation: string;
  awayFormation: string;
  homeCoach: string;
  awayCoach: string;
  homeStartingXI: PlayerLineup[];
  awayStartingXI: PlayerLineup[];
  homeBench: { id: string; name: string; number: number; role: string; rating?: number }[];
  awayBench: { id: string; name: string; number: number; role: string; rating?: number }[];
  homeName?: string;
  awayName?: string;
  onPlayerClick?: (player: PlayerLineup) => void;
}

export const FormationsPitch: React.FC<FormationsPitchProps> = ({
  homeFormation,
  awayFormation,
  homeCoach,
  awayCoach,
  homeStartingXI,
  awayStartingXI,
  homeBench,
  awayBench,
  homeName = 'Casa',
  awayName = 'Ospite',
  onPlayerClick,
}) => {
  const [selectedTeamTab, setSelectedTeamTab] = useState<'both' | 'home' | 'away'>('both');

  const renderPlayerNode = (player: PlayerLineup, isHome: boolean) => {
    return (
      <div
        key={player.id}
        onClick={() => onPlayerClick && onPlayerClick(player)}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
        style={{
          left: `${player.gridPos.x}%`,
          top: isHome
            ? `${50 + (player.gridPos.y - 50) * 0.9}%` // bottom half
            : `${50 - (player.gridPos.y - 50) * 0.9}%`, // top half
        }}
      >
        {/* Player Avatar Circle */}
        <div className="relative">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 transition-transform group-hover:scale-110 ${
              isHome
                ? 'bg-slate-900 border-white text-white'
                : 'bg-white border-slate-900 text-slate-900'
            }`}
          >
            <span>{player.initials}</span>
          </div>

          {/* Captain Badge 'C' */}
          {player.isCaptain && (
            <span className="absolute -top-1 -left-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center shadow-xs border border-white">
              C
            </span>
          )}

          {/* Rating Badge */}
          {player.rating && (
            <span
              className={`absolute -bottom-1 -right-1.5 px-1 py-0.2 rounded-md font-mono font-bold text-[9px] shadow-xs text-white ${
                player.rating >= 7.5
                  ? 'bg-emerald-600'
                  : player.rating >= 7.0
                  ? 'bg-teal-600'
                  : 'bg-slate-600'
              }`}
            >
              {player.rating.toFixed(1)}
            </span>
          )}

          {/* Yellow / Red Card indicator */}
          {player.yellowCards && player.yellowCards > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-3.5 bg-amber-400 rounded-xs shadow-xs border border-amber-600" />
          )}
          {player.redCard && (
            <span className="absolute -top-1 -right-1 w-2.5 h-3.5 bg-red-600 rounded-xs shadow-xs border border-red-800" />
          )}

          {/* Sub In / Out minute indicator */}
          {player.subOutMinute && (
            <span className="absolute -left-2 top-2 flex items-center text-[8px] font-mono font-bold text-red-400 bg-black/80 px-1 rounded-sm">
              <ArrowDownRight className="w-2.5 h-2.5" />
              {player.subOutMinute}&apos;
            </span>
          )}
          {player.subInMinute && (
            <span className="absolute -left-2 top-2 flex items-center text-[8px] font-mono font-bold text-emerald-400 bg-black/80 px-1 rounded-sm">
              <ArrowUpRight className="w-2.5 h-2.5" />
              {player.subInMinute}&apos;
            </span>
          )}
        </div>

        {/* Player Name & Number */}
        <span className="mt-1 text-[9px] font-medium text-white px-1.5 py-0.2 rounded-full bg-black/70 backdrop-blur-xs whitespace-nowrap shadow-xs max-w-[70px] truncate">
          {player.number}. {player.name}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tactical Pitch Visual */}
      <div className="relative w-full aspect-[3/4] rounded-3xl bg-[#173024] dark:bg-[#0D1F17] border border-emerald-900/40 overflow-hidden shadow-md">
        {/* Pitch Graphic Lines */}
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full stroke-emerald-500/25 stroke-[0.8] fill-none"
        >
          {/* Outer Boundary */}
          <rect x="5" y="5" width="90" height="120" rx="3" />

          {/* Halfway line & center circle */}
          <line x1="5" y1="65" x2="95" y2="65" />
          <circle cx="50" cy="65" r="14" />
          <circle cx="50" cy="65" r="1.5" fill="currentColor" />

          {/* Top Penalty Box (Away) */}
          <rect x="22" y="5" width="56" height="24" />
          <rect x="34" y="5" width="32" height="10" />
          <path d="M 37 29 A 12 12 0 0 0 63 29" />

          {/* Bottom Penalty Box (Home) */}
          <rect x="22" y="101" width="56" height="24" />
          <rect x="34" y="115" width="32" height="10" />
          <path d="M 37 101 A 12 12 0 0 1 63 101" />

          {/* Goals */}
          <rect x="40" y="2" width="20" height="3" strokeWidth="1" />
          <rect x="40" y="125" width="20" height="3" strokeWidth="1" />
        </svg>

        {/* Away Lineup (Top Half) */}
        <div className="absolute inset-x-0 top-2 px-3 flex items-center justify-between text-[11px] font-semibold text-emerald-200">
          <span>{awayName} ({awayFormation})</span>
          <span className="text-[10px] text-emerald-300/80">All. {awayCoach}</span>
        </div>
        {awayStartingXI.map((p) => renderPlayerNode(p, false))}

        {/* Home Lineup (Bottom Half) */}
        <div className="absolute inset-x-0 bottom-2 px-3 flex items-center justify-between text-[11px] font-semibold text-emerald-200">
          <span>{homeName} ({homeFormation})</span>
          <span className="text-[10px] text-emerald-300/80">All. {homeCoach}</span>
        </div>
        {homeStartingXI.map((p) => renderPlayerNode(p, true))}
      </div>

      {/* Bench (Panchina) - 2 Column Grid */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            A Disposizione (Panchina)
          </span>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>{homeName} vs {awayName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 divide-x divide-slate-100 dark:divide-slate-800">
          {/* Home Bench */}
          <div className="space-y-1.5 pr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {homeName}
            </span>
            {homeBench.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-none"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-5 text-center font-mono text-[10px] text-slate-400">
                    {p.number}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {p.name}
                  </span>
                </div>
                {p.rating && (
                  <span className="font-mono text-[10px] font-bold text-emerald-500">
                    {p.rating.toFixed(1)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Away Bench */}
          <div className="space-y-1.5 pl-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {awayName}
            </span>
            {awayBench.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-none"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-5 text-center font-mono text-[10px] text-slate-400">
                    {p.number}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {p.name}
                  </span>
                </div>
                {p.rating && (
                  <span className="font-mono text-[10px] font-bold text-emerald-500">
                    {p.rating.toFixed(1)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coaches row */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Allenatore: <strong className="text-slate-800 dark:text-slate-200">{homeCoach}</strong></span>
          <span>Allenatore: <strong className="text-slate-800 dark:text-slate-200">{awayCoach}</strong></span>
        </div>
      </div>
    </div>
  );
};
