import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LiveNowBarProps {
  matchCount: number;
  matchSnippet: string; // e.g. "Milan 1 - 1 Napoli (67')"
  onTap: () => void;
}

export const LiveNowBar: React.FC<LiveNowBarProps> = ({ matchCount, matchSnippet, onTap }) => {
  if (matchCount <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className="mx-3 my-2 cursor-pointer"
    >
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-red-500/10 dark:bg-red-950/40 border border-red-500/20 text-red-600 dark:text-red-400">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="absolute w-3.5 h-3.5 rounded-full bg-red-500/40 animate-ping" />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white px-1.5 py-0.5 rounded-md font-mono">
              LIVE
            </span>
            <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
              {matchSnippet}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-red-500">
          <span className="text-[11px] font-medium hidden sm:inline">Guarda</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};
