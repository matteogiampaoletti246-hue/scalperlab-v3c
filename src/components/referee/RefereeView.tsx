import React from 'react';
import { REFEREES_DATA } from '../../data/mockData';
import { Shield, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface RefereeViewProps {
  refereeId?: string;
  onOpenMatch?: (matchId: string) => void;
}

export const RefereeView: React.FC<RefereeViewProps> = ({
  refereeId = 'ref-massa',
  onOpenMatch,
}) => {
  const referee = REFEREES_DATA[refereeId] || REFEREES_DATA['ref-massa'];

  return (
    <div className="pb-24 px-3 space-y-4 pt-3">
      {/* Referee Hero */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {referee.name}
          </h2>
          <div className="text-xs text-slate-500">
            <span>{referee.country}</span> · <span className="font-mono">{referee.experience}</span>
          </div>
          <span className="inline-block text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full mt-1">
            {referee.matchesThisSeason} partite dirette in stagione
          </span>
        </div>
      </div>

      {/* Disciplinary Averages Grid */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
          Medie Disciplinari per Partita
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cartellini Gialli /p
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-4.5 bg-amber-400 rounded-xs border border-amber-600 inline-block" />
              <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                {referee.avgYellows}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Media di lega: 4.2</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Falli Fischiati /p
            </span>
            <span className="text-2xl font-mono font-black text-slate-900 dark:text-white block">
              {referee.avgFouls}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Media di lega: 24.5</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cartellini Rossi /p
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-4.5 bg-red-600 rounded-xs border border-red-800 inline-block" />
              <span className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                {referee.avgReds}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Rigori Assegnati
            </span>
            <span className="text-2xl font-mono font-black text-emerald-500 block">
              {referee.penaltiesAwarded}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">0.50 per gara</span>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
          Ultime Gare Dirette
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {referee.recentMatches.map((m: any, i: number) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-sans font-semibold text-slate-900 dark:text-white block">
                  {m.match}
                </span>
                <span className="text-[10px] text-slate-400">
                  {m.fouls} falli · {m.penalties} rigori concessi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                  {m.yellows} Gialli
                </span>
                {m.reds > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 font-bold text-[11px]">
                    {m.reds} Rossi
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
