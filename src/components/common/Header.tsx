import React from 'react';
import { Search, Menu, ChevronLeft, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  title?: string;
  isSubPage?: boolean;
  onBack?: () => void;
  onOpenSearch?: () => void;
  onOpenMenu?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  isSubPage = false,
  onBack,
  onOpenSearch,
  onOpenMenu,
  rightAction,
  subtitle,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/70 dark:border-slate-800/80 transition-colors duration-200">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        {/* Left Slot */}
        <div className="flex items-center gap-2">
          {isSubPage ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onBack}
              aria-label="Torna indietro"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 dark:from-emerald-500/20 dark:to-emerald-400/10 flex items-center justify-center border border-slate-200 dark:border-emerald-500/30">
                <span className="text-emerald-500 font-black text-sm tracking-tighter">SL</span>
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Scalper<span className="text-emerald-500 font-black">Lab</span>
              </span>
            </div>
          )}
        </div>

        {/* Center Slot (Subpage title or empty) */}
        {isSubPage && title && (
          <div className="flex flex-col items-center justify-center px-2 flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
              {title}
            </h1>
            {subtitle && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[180px]">
                {subtitle}
              </span>
            )}
          </div>
        )}

        {/* Right Slot */}
        <div className="flex items-center gap-1.5 shrink-0">
          {rightAction ? (
            rightAction
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onOpenSearch}
                aria-label="Cerca squadre, partite o giocatori"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onOpenMenu}
                aria-label="Apri menu"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <Menu className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
