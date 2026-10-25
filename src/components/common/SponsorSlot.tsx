import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface SponsorSlotProps {
  label?: string;
  tagline?: string;
  oddsHighlight?: string;
}

export const SponsorSlot: React.FC<SponsorSlotProps> = ({
  label = 'Partner Ufficiale Quote',
  tagline = 'Confronta le quote con il modello quantitativo ScalperLab',
  oddsHighlight = 'Over 0.5 Tiri in Porta @ 1.85',
}) => {
  return (
    <div className="mx-3 my-3">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 border border-slate-800 p-3 text-white shadow-xs">
        {/* Subtle decorative mesh */}
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                SPONSOR / ODDS
              </span>
              <span className="text-[11px] font-semibold text-slate-300 truncate">
                {label}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium truncate">
              {tagline}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <div className="bg-white/10 dark:bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-right">
              <span className="text-[10px] block text-slate-400 font-mono">Quota Top</span>
              <span className="text-xs font-mono font-bold text-emerald-400 whitespace-nowrap">
                {oddsHighlight}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
