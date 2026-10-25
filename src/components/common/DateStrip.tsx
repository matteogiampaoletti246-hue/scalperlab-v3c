import React, { useRef, useEffect } from 'react';
import { Calendar, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export interface DateItem {
  id: string;
  label: string; // 'Ieri', 'Oggi', 'Domani', 'Lun 27', etc.
  dateStr: string;
  dayNum: string;
  weekday: string;
}

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (id: string) => void;
  filterMode: 'all' | 'live';
  onChangeFilter: (mode: 'all' | 'live') => void;
  liveCount?: number;
}

const DATE_OPTIONS: DateItem[] = [
  { id: 'Ieri', label: 'Ieri', dateStr: '23 Ott', dayNum: '23', weekday: 'Gio' },
  { id: 'Oggi', label: 'Oggi', dateStr: '24 Ott', dayNum: '24', weekday: 'Ven' },
  { id: 'Domani', label: 'Domani', dateStr: '25 Ott', dayNum: '25', weekday: 'Sab' },
  { id: 'Dom 26', label: 'Dom 26', dateStr: '26 Ott', dayNum: '26', weekday: 'Dom' },
  { id: 'Lun 27', label: 'Lun 27', dateStr: '27 Ott', dayNum: '27', weekday: 'Lun' },
  { id: 'Mar 28', label: 'Mar 28', dateStr: '28 Ott', dayNum: '28', weekday: 'Mar' },
  { id: 'Mer 29', label: 'Mer 29', dateStr: '29 Ott', dayNum: '29', weekday: 'Mer' },
];

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onSelectDate,
  filterMode,
  onChangeFilter,
  liveCount = 1,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected date into view
  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDate]);

  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 px-3">
      {/* Top row: Filter segmented control (Tutte / Live) + Calendar icon button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center p-0.5 rounded-full bg-slate-200/70 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800">
          <button
            onClick={() => onChangeFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tutte
          </button>
          <button
            onClick={() => onChangeFilter('live')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterMode === 'live'
                ? 'bg-white dark:bg-slate-800 text-red-500 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>Live</span>
            {liveCount > 0 && (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                {liveCount}
              </span>
            )}
          </button>
        </div>

        {/* Round glass calendar button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          aria-label="Apri calendario"
          onClick={() => onSelectDate('Oggi')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 shadow-xs"
        >
          <Calendar className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Date list carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
      >
        {DATE_OPTIONS.map((item) => {
          const isSelected = selectedDate === item.id;
          return (
            <motion.button
              key={item.id}
              data-active={isSelected}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectDate(item.id)}
              className={`shrink-0 flex flex-col items-center justify-center px-3.5 py-1.5 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <span className={`text-[10px] font-medium tracking-tight uppercase ${isSelected ? 'opacity-80' : 'text-slate-400 dark:text-slate-500'}`}>
                {item.weekday}
              </span>
              <span className="text-xs font-bold font-mono tracking-tight">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
