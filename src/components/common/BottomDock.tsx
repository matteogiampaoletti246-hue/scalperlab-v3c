import React from 'react';
import { Home, Users, Zap, Calculator, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export type NavTabId = 'home' | 'players' | 'matchups' | 'calc' | 'menu';

interface BottomDockProps {
  activeTab: NavTabId;
  onChangeTab: (tab: NavTabId) => void;
}

interface NavItem {
  id: NavTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Partite', icon: Home },
  { id: 'players', label: 'Giocatori', icon: Users },
  { id: 'matchups', label: 'Matchup', icon: Zap },
  { id: 'calc', label: 'Calcolatore', icon: Calculator },
  { id: 'menu', label: 'Esplora', icon: Compass },
];

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Navigazione principale"
        className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-2xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-white/10 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.18)]"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              whileTap={{ scale: 0.92 }}
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className={`relative flex items-center justify-center h-11 rounded-full transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 px-4 font-semibold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 w-11'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />

              {isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: 'auto', marginLeft: 6 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xs font-semibold whitespace-nowrap overflow-hidden tracking-tight"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
