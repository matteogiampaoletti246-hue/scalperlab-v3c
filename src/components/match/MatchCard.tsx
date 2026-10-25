import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MatchItem } from '../../data/mockData';
import { motion } from 'motion/react';

interface MatchCardProps {
  match: MatchItem;
  onClick: () => void;
  onOpenHomeTeam?: (e: React.MouseEvent) => void;
  onOpenAwayTeam?: (e: React.MouseEvent) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onClick,
  onOpenHomeTeam,
  onOpenAwayTeam,
}) => {
  const [homeImgError, setHomeImgError] = useState(false);
  const [awayImgError, setAwayImgError] = useState(false);

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-3 my-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2">
        {/* Left: Time or Live Minute */}
        <div className="w-12 shrink-0 flex flex-col items-center justify-center">
          {isLive ? (
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono font-black text-red-500 animate-pulse">
                {match.timeOrMinute}
              </span>
              <span className="text-[8px] font-bold tracking-wider text-red-500 uppercase font-mono">
                LIVE
              </span>
            </div>
          ) : isFinished ? (
            <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
              FT
            </span>
          ) : (
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {match.timeOrMinute}
            </span>
          )}
        </div>

        {/* Center: Teams & Crests */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-1">
          {/* Home Team Row */}
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={(e) => {
                if (onOpenHomeTeam) {
                  e.stopPropagation();
                  onOpenHomeTeam(e);
                }
              }}
              className="flex items-center gap-2 truncate group"
            >
              {/* Crest button */}
              <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
                {!homeImgError ? (
                  <img
                    src={match.homeTeam.crest}
                    alt={match.homeTeam.name}
                    referrerPolicy="no-referrer"
                    onError={() => setHomeImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">
                    {match.homeTeam.shortName.slice(0, 2)}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-500 transition-colors">
                {match.homeTeam.name}
              </span>
            </div>

            {/* Home Score (if live or finished) */}
            {(isLive || isFinished) && match.homeTeam.score !== undefined && (
              <span
                className={`text-xs font-mono font-black tabular-nums ${
                  isLive ? 'text-red-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {match.homeTeam.score}
              </span>
            )}
          </div>

          {/* Away Team Row */}
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={(e) => {
                if (onOpenAwayTeam) {
                  e.stopPropagation();
                  onOpenAwayTeam(e);
                }
              }}
              className="flex items-center gap-2 truncate group"
            >
              {/* Crest button */}
              <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
                {!awayImgError ? (
                  <img
                    src={match.awayTeam.crest}
                    alt={match.awayTeam.name}
                    referrerPolicy="no-referrer"
                    onError={() => setAwayImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">
                    {match.awayTeam.shortName.slice(0, 2)}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-500 transition-colors">
                {match.awayTeam.name}
              </span>
            </div>

            {/* Away Score */}
            {(isLive || isFinished) && match.awayTeam.score !== undefined && (
              <span
                className={`text-xs font-mono font-black tabular-nums ${
                  isLive ? 'text-red-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {match.awayTeam.score}
              </span>
            )}
          </div>
        </div>

        {/* Right: ScalperLab score badge + Chevron */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          {match.reliability && (
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                match.reliability.score >= 8.5
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {match.reliability.score}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};
