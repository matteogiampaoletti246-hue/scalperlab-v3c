import React, { useState } from 'react';
import { motion } from 'motion/react';

interface MomentumPoint {
  minute: number;
  value: number; // -100 to 100
}

interface MomentumGraphProps {
  momentum: MomentumPoint[];
  homeName?: string;
  awayName?: string;
  currentMinute?: number;
}

export const MomentumGraph: React.FC<MomentumGraphProps> = ({
  momentum,
  homeName = 'Casa',
  awayName = 'Ospite',
  currentMinute = 67,
}) => {
  const [hoveredMinute, setHoveredMinute] = useState<number | null>(null);

  // SVG dimensions
  const width = 340;
  const height = 90;
  const centerY = height / 2;

  // Build path points
  const points = momentum.map((pt) => {
    const x = (pt.minute / 90) * width;
    // value positive = home dominant (upwards, smaller Y), negative = away (downwards, larger Y)
    const y = centerY - (pt.value / 100) * (centerY - 8);
    return { x, y, ...pt };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Fill area under / above zero line
  const fillHomeD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M 0 ${centerY} L ${pt.x} ${Math.min(pt.y, centerY)}` : `${acc} L ${pt.x} ${Math.min(pt.y, centerY)}`;
  }, '') + ` L ${width} ${centerY} Z`;

  const fillAwayD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M 0 ${centerY} L ${pt.x} ${Math.max(pt.y, centerY)}` : `${acc} L ${pt.x} ${Math.max(pt.y, centerY)}`;
  }, '') + ` L ${width} ${centerY} Z`;

  return (
    <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Pressione Offensiva (Momentum)
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-emerald-400" />
            {homeName}
          </span>
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
            {awayName}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[90px] select-none touch-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="awayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748B" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Center zero line */}
          <line
            x1="0"
            y1={centerY}
            x2={width}
            y2={centerY}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 3"
            className="text-slate-300 dark:text-slate-700"
          />

          {/* Half time divider at 45' */}
          <line
            x1={width / 2}
            y1="4"
            x2={width / 2}
            y2={height - 4}
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-300 dark:text-slate-800"
          />

          {/* Shaded momentum areas */}
          <path d={fillHomeD} fill="url(#homeGrad)" />
          <path d={fillAwayD} fill="url(#awayGrad)" />

          {/* Momentum stroke line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Current minute indicator */}
          <line
            x1={(currentMinute / 90) * width}
            y1="0"
            x2={(currentMinute / 90) * width}
            y2={height}
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Minute time labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>0&apos;</span>
          <span>15&apos;</span>
          <span>30&apos;</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">45&apos; INT</span>
          <span>60&apos;</span>
          <span>75&apos;</span>
          <span>90&apos;</span>
        </div>
      </div>
    </div>
  );
};
