import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface GaugeAffidabilitaProps {
  score: number; // 0 to 10
  stakeRecommendation?: string;
  market?: string;
  valueOdds?: number;
  riskLevel?: 'Basso' | 'Medio' | 'Alto' | 'Molto Alto';
  advice?: string;
  evPercent?: number;
}

export const GaugeAffidabilita: React.FC<GaugeAffidabilitaProps> = ({
  score,
  stakeRecommendation = '2.5% (25€)',
  market = 'Over 0.5 Tiri in Porta',
  valueOdds = 1.85,
  riskLevel = 'Basso',
  advice = 'Valore Top (Forte)',
  evPercent = 14.2,
}) => {
  // Semi-circle SVG calculation
  const radius = 64;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // 180 degrees
  const clampedScore = Math.max(0, Math.min(10, score));
  const strokeDashoffset = circumference - (clampedScore / 10) * circumference;

  const getScoreColor = () => {
    if (clampedScore >= 8.0) return '#10B981'; // Emerald
    if (clampedScore >= 6.5) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col items-center justify-center pt-2">
        {/* Semi-circular gauge */}
        <div className="relative w-44 h-28 flex items-end justify-center overflow-hidden">
          <svg className="w-44 h-44 -rotate-180 transform" viewBox="0 0 160 160">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={0}
              className="text-slate-200 dark:text-slate-800"
              strokeLinecap="round"
            />
            {/* Value stroke */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={getScoreColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
            />
          </svg>

          {/* Central Score Display */}
          <div className="absolute bottom-2 flex flex-col items-center">
            <div className="flex items-baseline gap-0.5">
              <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {score.toFixed(1)}
              </span>
              <span className="text-xs font-mono font-medium text-slate-400">/10</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 font-mono">
              Affidabilità
            </span>
          </div>
        </div>

        {/* Advice subtitle */}
        <div className="flex items-center gap-1.5 mt-2 mb-3">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getScoreColor() }}
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {advice}
          </span>
        </div>
      </div>

      {/* Stake Card Box */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Mercato consigliato</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[190px]">
            {market}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Valore atteso (+EV)</span>
          </div>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            +{evPercent.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Stake Kelly consigliato</span>
          </div>
          <span className="font-mono font-bold text-slate-900 dark:text-white bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-lg">
            {stakeRecommendation}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 dark:text-slate-500">
          <span>Livello rischio: <strong className="text-slate-700 dark:text-slate-300">{riskLevel}</strong></span>
          <span>Quota stimata: <strong className="font-mono text-slate-700 dark:text-slate-300">@{valueOdds.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
};
