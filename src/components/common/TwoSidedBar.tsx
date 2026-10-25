import React from 'react';

interface TwoSidedBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  unit?: string;
  isPercentage?: boolean;
  highlightHigher?: boolean;
}

export const TwoSidedBar: React.FC<TwoSidedBarProps> = ({
  label,
  homeValue,
  awayValue,
  unit = '',
  isPercentage = false,
  highlightHigher = true,
}) => {
  const total = homeValue + awayValue;
  const homeRatio = total > 0 ? (homeValue / total) * 100 : 50;
  const awayRatio = total > 0 ? (awayValue / total) * 100 : 50;

  const isHomeGreater = homeValue > awayValue;
  const isAwayGreater = awayValue > homeValue;

  return (
    <div className="py-2 px-1">
      <div className="flex items-center justify-between text-xs mb-1">
        {/* Home value */}
        <span
          className={`font-mono font-bold tabular-nums text-left min-w-[42px] ${
            isHomeGreater && highlightHigher
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {homeValue}
          {unit}
        </span>

        {/* Central metric label */}
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center truncate px-2">
          {label}
        </span>

        {/* Away value */}
        <span
          className={`font-mono font-bold tabular-nums text-right min-w-[42px] ${
            isAwayGreater && highlightHigher
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {awayValue}
          {unit}
        </span>
      </div>

      {/* Two-sided split track */}
      <div className="flex items-center gap-1.5 h-1.5 w-full">
        {/* Home bar (anchored to center, fills left) */}
        <div className="flex-1 flex justify-end h-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isHomeGreater
                ? 'bg-slate-900 dark:bg-emerald-500'
                : 'bg-slate-400/80 dark:bg-slate-600'
            }`}
            style={{ width: `${isPercentage ? homeValue : homeRatio}%` }}
          />
        </div>

        {/* Center hairline pip */}
        <div className="w-1 h-2 bg-slate-300 dark:bg-slate-700 rounded-full shrink-0" />

        {/* Away bar (anchored to center, fills right) */}
        <div className="flex-1 flex justify-start h-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAwayGreater
                ? 'bg-slate-900 dark:bg-emerald-500'
                : 'bg-slate-400/80 dark:bg-slate-600'
            }`}
            style={{ width: `${isPercentage ? awayValue : awayRatio}%` }}
          />
        </div>
      </div>
    </div>
  );
};
