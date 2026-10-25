import React from 'react';
import {
  X,
  Calendar,
  Calculator,
  Target,
  Users,
  Zap,
  BookOpen,
  Sun,
  Moon,
  Smartphone,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from '../../tokens';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string) => void;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  themeMode,
  onChangeTheme,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Partite & Risultati', icon: Calendar, tag: 'Live' },
    { id: 'calc', label: 'Calcolatore di Affidabilità', icon: Calculator, tag: 'Poisson λ' },
    { id: 'tiri_squadre', label: 'Tiri Squadre', icon: Target },
    { id: 'players', label: 'Migliori Giocatori', icon: Users, tag: 'Ranking' },
    { id: 'matchups', label: 'Migliori Matchup', icon: Zap, tag: 'Divario' },
    { id: 'linee_guida', label: 'Linee Guida', icon: BookOpen },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="w-full max-w-xs bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between p-4 shadow-2xl"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-emerald-500/20 text-emerald-500 font-black text-xs flex items-center justify-center border border-slate-200 dark:border-emerald-500/30">
                  SL
                </div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  Scalper<span className="text-emerald-500">Lab</span>
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="mt-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.tag && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.tag}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selector: Chiaro / Scuro / Auto */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block text-center">
              Tema Grafico
            </span>

            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800">
              <button
                onClick={() => onChangeTheme('light')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  themeMode === 'light'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Chiaro</span>
              </button>

              <button
                onClick={() => onChangeTheme('dark')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  themeMode === 'dark'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Scuro</span>
              </button>

              <button
                onClick={() => onChangeTheme('auto')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  themeMode === 'auto'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Auto</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-400 text-center font-mono">
              ScalperLab v1.4.2 · Mobile First
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
