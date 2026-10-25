import React, { useState } from 'react';
import { ShotEvent } from '../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, Info } from 'lucide-react';

interface ShotMapProps {
  shots: ShotEvent[];
  homeName?: string;
  awayName?: string;
}

export const ShotMap: React.FC<ShotMapProps> = ({
  shots,
  homeName = 'Casa',
  awayName = 'Ospite',
}) => {
  const [filterTeam, setFilterTeam] = useState<'all' | 'home' | 'away'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [activeShot, setActiveShot] = useState<ShotEvent | null>(null);

  // Extract unique players
  const playersList = Array.from(new Set(shots.map((s) => s.player)));

  // Filter shots
  const filteredShots = shots.filter((s) => {
    if (filterTeam !== 'all' && s.team !== filterTeam) return false;
    if (selectedPlayer !== 'all' && s.player !== selectedPlayer) return false;
    return true;
  });

  const getOutcomeColor = (outcome: ShotEvent['outcome']) => {
    switch (outcome) {
      case 'Gol':
        return '#10B981'; // Green
      case 'Parato':
        return '#3B82F6'; // Blue
      case 'Fuori':
        return '#94A3B8'; // Grey
      case 'Murato':
        return '#F97316'; // Orange
    }
  };

  // Shot circle radius based on xG (from 5px to 14px)
  const getRadius = (xG: number) => {
    return Math.max(5, Math.min(15, 5 + xG * 18));
  };

  return (
    <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
      {/* Filter Bar: Tutti / Casa / Ospite */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setFilterTeam('all');
              setSelectedPlayer('all');
            }}
            className={`px-3 py-1 rounded-full transition-all ${
              filterTeam === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tutti
          </button>
          <button
            onClick={() => setFilterTeam('home')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterTeam === 'home'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {homeName}
          </button>
          <button
            onClick={() => setFilterTeam('away')}
            className={`px-3 py-1 rounded-full transition-all ${
              filterTeam === 'away'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {awayName}
          </button>
        </div>

        {/* Player filter select */}
        <div className="relative">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="text-xs font-semibold py-1 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="all">Tutti i calciatori</option>
            {playersList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Football Pitch SVG Canvas */}
      <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#14231E] dark:bg-[#0E1A16] border border-emerald-900/30 overflow-hidden shadow-inner">
        {/* Pitch Lines (Attacking Half) */}
        <svg
          viewBox="0 0 100 80"
          className="w-full h-full stroke-emerald-500/20 stroke-[0.8] fill-none"
        >
          {/* Halfway line */}
          <line x1="0" y1="5" x2="100" y2="5" />
          <circle cx="50" cy="5" r="14" />

          {/* Penalty Box */}
          <rect x="20" y="52" width="60" height="28" />

          {/* 6-Yard Goal Box */}
          <rect x="34" y="68" width="32" height="12" />

          {/* Penalty Arc */}
          <path d="M 38 52 A 12 12 0 0 1 62 52" />

          {/* Goal Line */}
          <line x1="0" y1="80" x2="100" y2="80" strokeWidth="1.5" />
          {/* Goal posts */}
          <rect x="42" y="79" width="16" height="2" fill="#FFFFFF" fillOpacity="0.4" stroke="none" />

          {/* Interactive Shot Circles */}
          {filteredShots.map((shot) => {
            const isSelected = activeShot?.id === shot.id;
            const r = getRadius(shot.xG);

            return (
              <g
                key={shot.id}
                onClick={() => setActiveShot(shot)}
                className="cursor-pointer group"
              >
                {/* Glow ring on hover/select */}
                {isSelected && (
                  <circle
                    cx={shot.y} // map coords appropriately to attacking goal
                    cy={shot.x * 0.8}
                    r={r + 4}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="animate-spin origin-center"
                  />
                )}

                <circle
                  cx={shot.y}
                  cy={shot.x * 0.8}
                  r={r}
                  fill={getOutcomeColor(shot.outcome)}
                  fillOpacity="0.88"
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? '2' : '1'}
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Outcome indicator symbol in center for Gol */}
                {shot.outcome === 'Gol' && (
                  <text
                    x={shot.y}
                    y={shot.x * 0.8 + 2.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="5"
                    fontWeight="bold"
                  >
                    G
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Shot Tooltip */}
        <AnimatePresence>
          {activeShot && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-slate-950/92 backdrop-blur-md border border-white/15 text-white text-xs shadow-xl flex items-center justify-between"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getOutcomeColor(activeShot.outcome) }}
                  />
                  <span className="truncate">{activeShot.player}</span>
                  <span className="font-mono text-slate-400 font-normal">
                    ({activeShot.minute}&apos;)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-0.5">
                  <span>Esito: <strong className="text-white">{activeShot.outcome}</strong></span>
                  <span>·</span>
                  <span>Piede/Testa: <strong className="text-white">{activeShot.bodyPart}</strong></span>
                </div>
              </div>

              <div className="shrink-0 text-right bg-white/10 px-2 py-1 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-mono">xG</span>
                <span className="text-xs font-mono font-black text-emerald-400">
                  {activeShot.xG.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Gol</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Parato</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Fuori</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>Murato</span>
        </div>
      </div>
      <div className="text-center text-[10px] text-slate-400 font-mono">
        Dimensione del cerchio proporzionale all&apos;Expected Goals (xG)
      </div>
    </div>
  );
};
