import React, { useState } from 'react';
import { MIGLIORI_MATCHUP_DATA } from '../../data/mockData';
import { Zap, ChevronRight, CornerDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface MiglioriMatchupViewProps {
  onOpenMatch?: (matchId: string) => void;
}

export const MiglioriMatchupView: React.FC<MiglioriMatchupViewProps> = ({
  onOpenMatch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'Angoli' | 'Cartellini' | 'Tiri' | 'Falli' | 'Fuorigiochi'
  >('Angoli');
  const [dateFilter, setDateFilter] = useState<'Oggi' | 'Domani' | 'Weekend'>('Oggi');

  const categories = ['Angoli', 'Cartellini', 'Tiri', 'Falli', 'Fuorigiochi'] as const;
  const currentList = MIGLIORI_MATCHUP_DATA[selectedCategory] || [];

  return (
    <div className="pb-24 px-3 space-y-3 pt-3">
      {/* Title */}
      <div className="px-1">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          Migliori Matchup
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Confronti con massimo divario statistico e valore di quota
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

      {/* Category Tabs: Angoli, Cartellini, Tiri, Falli, Fuorigiochi */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Matchup Cards */}
      <div className="space-y-2.5">
        {currentList.map((item) => (
          <motion.div
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenMatch && onOpenMatch('match-inter-juve')}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.match}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.league}
                </span>
              </div>

              {/* Divario indicator */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">Divario</span>
                <span className="text-sm font-mono font-black text-emerald-500">
                  +{item.gap}
                </span>
              </div>
            </div>

            {/* Metrics Row: Divario, attesi, partite usate */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Stima attesa</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {item.metricExpected}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Campione</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {item.matchesUsed}
                </span>
              </div>
            </div>

            {/* Advice and Action */}
            <div className="mt-2.5 flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Consiglio: {item.advice}
              </span>
              <span className="text-slate-400 flex items-center gap-0.5 text-[11px]">
                <span>Analisi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
