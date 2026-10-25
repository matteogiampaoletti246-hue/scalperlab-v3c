import React, { useRef, useState } from 'react';
import { motion, PanInfo } from 'motion/react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface SwipeableTabsProps {
  tabs: TabItem[];
  activeTabId?: string;
  onChangeTab?: (id: string) => void;
  className?: string;
}

export const SwipeableTabs: React.FC<SwipeableTabsProps> = ({
  tabs,
  activeTabId,
  onChangeTab,
  className = '',
}) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);

  const activeIndex = activeTabId
    ? Math.max(0, tabs.findIndex((t) => t.id === activeTabId))
    : internalActiveIndex;

  const setActive = (index: number) => {
    setInternalActiveIndex(index);
    if (onChangeTab && tabs[index]) {
      onChangeTab(tabs[index].id);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && activeIndex < tabs.length - 1) {
      setActive(activeIndex + 1);
    } else if (info.offset.x > swipeThreshold && activeIndex > 0) {
      setActive(activeIndex - 1);
    }
  };

  return (
    <div className={`w-full overflow-hidden flex flex-col ${className}`}>
      {/* Tab Bar Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-3">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeIndex;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActive(idx)}
                className={`relative flex items-center justify-center gap-1.5 py-2.5 px-3 transition-colors ${
                  isActive
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                )}
                <span className="text-xs whitespace-nowrap tracking-tight">
                  {tab.label}
                </span>

                {/* Animated hairline indicator under active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-emerald-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipeable Content Views with neighbouring page preview and gap */}
      <div className="relative w-full overflow-hidden min-h-[380px] touch-pan-y">
        <motion.div
          className="flex w-full cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: `-${activeIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="w-full shrink-0 px-1 py-2 box-border"
              style={{ minWidth: '100%' }}
            >
              {tab.content}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
