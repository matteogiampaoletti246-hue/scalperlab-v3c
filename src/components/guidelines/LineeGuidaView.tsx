import React, { useState } from 'react';
import { LINEE_GUIDA_DATA } from '../../data/mockData';
import { ChevronDown, BookOpen, Sigma, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LineeGuidaView: React.FC = () => {
  const [openPlayerCalc, setOpenPlayerCalc] = useState(true);
  const [openTeamCalc, setOpenTeamCalc] = useState(true);

  return (
    <div className="pb-24 px-3 space-y-4 pt-3">
      {/* Title */}
      <div className="px-1">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          Linee Guida Metodologiche
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Architettura quantitativa, formule matematiche e gestione del rischio di ScalperLab
        </p>
      </div>

      {/* Accordion 1: Calcolo Giocatori */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <button
          onClick={() => setOpenPlayerCalc(!openPlayerCalc)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sigma className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {LINEE_GUIDA_DATA.calcoloGiocatori.title}
              </h3>
              <span className="text-[11px] text-slate-500 block">
                Ponderazione Poisson e Fair Odds
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              openPlayerCalc ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openPlayerCalc && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3"
            >
              <p className="text-xs text-slate-500 italic">
                {LINEE_GUIDA_DATA.calcoloGiocatori.description}
              </p>

              {LINEE_GUIDA_DATA.calcoloGiocatori.sections.map((sec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {sec.heading}
                  </h4>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                    {sec.content}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accordion 2: Calcolo Tiri Squadre */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <button
          onClick={() => setOpenTeamCalc(!openTeamCalc)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {LINEE_GUIDA_DATA.calcoloTiriSquadre.title}
              </h3>
              <span className="text-[11px] text-slate-500 block">
                Matrice Casa/Trasferta e PPDA
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              openTeamCalc ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openTeamCalc && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3"
            >
              <p className="text-xs text-slate-500 italic">
                {LINEE_GUIDA_DATA.calcoloTiriSquadre.description}
              </p>

              {LINEE_GUIDA_DATA.calcoloTiriSquadre.sections.map((sec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {sec.heading}
                  </h4>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                    {sec.content}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
