import React, { useState } from 'react';
import { MIGLIORI_GIOCATORI_DATA } from '../../data/mockData';
import { Calendar, ChevronRight, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface MiglioriGiocatoriViewProps {
  onOpenPlayer?: (playerId: string) => void;
  onOpenMatch?: (matchId: string) => void;
}

export const MiglioriGiocatoriView: React.FC<MiglioriGiocatoriViewProps> = ({
  onOpenPlayer,
  onOpenMatch,
}) => {
  const [dateFilter, setDateFilter] = useState<'Oggi' | 'Domani' | 'Weekend'>('Oggi');
  const [overFilter, setOverFilter] = useState<'0.5' | '1.5' | '2.5'>('0.5');

  return (
    <div className="pb-24 px-3 space-y-3 pt-3">
      {/* Title & Description */}
      <div className="px-1">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          Migliori Giocatori
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Classifica quantitativa basata sul modello Poisson e valore atteso
        </p>
      </div>

      {/* Date selector */}
      <div className="flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
        {(['Oggi', 'Domani', 'Weekend'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDateFilter(d)}
            className={`flex-1 py-1.5 rounded-full text-center transition-all ${
              dateFilter === d
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Over 0,5 / 1,5 / 2,5 filter */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Filtro Linea Tiri
        </span>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full text-xs font-mono font-bold">
          {(['0.5', '1.5', '2.5'] as const).map((line) => (
            <button
              key={line}
              onClick={() => setOverFilter(line)}
              className={`px-3 py-1 rounded-full transition-all ${
                overFilter === line
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Over {line.replace('.', ',')}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Player Cards */}
      <div className="space-y-2.5">
        {MIGLIORI_GIOCATORI_DATA.map((player) => (
          <motion.div
            key={player.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenPlayer && onOpenPlayer('lautaro-martinez')}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Position Rank */}
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-black text-sm text-slate-700 dark:text-slate-300 shrink-0">
                  #{player.rank}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {player.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                    {player.match}
                  </span>
                </div>
              </div>

              {/* Odds */}
              <div className="shrink-0 text-right bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-1 rounded-xl">
                <span className="text-[10px] text-slate-500 font-mono block">Quota</span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  @{player.odds.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Metrics Row: Voto, Media attesa, 90' medi */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Voto</span>
                <span className="text-xs font-mono font-black text-emerald-500">
                  {player.rating}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Media attesa</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {player.expectedAvg}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">90&apos; medi</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {player.avg90}
                </span>
              </div>
            </div>

            {/* Line: Ultime 5: 7,6 - stagione 6,9 /90' */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
              <span>{player.line}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-sans flex items-center gap-0.5">
                <span>Dettaglio</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
