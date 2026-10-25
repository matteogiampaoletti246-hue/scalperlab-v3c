import React, { useState, useEffect } from 'react';
import {
  calculatePlayerReliability,
  calculateTeamShots,
  getStoredHistory,
  saveToHistory,
  deleteHistoryItem,
  clearAllHistory,
  exportHistoryJSON,
  importHistoryJSON,
  PlayerCalcInputs,
  PlayerCalcResult,
  TeamShotsInputs,
  TeamShotsResult,
} from '../../utils/calculations';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CalculatorView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'giocatore' | 'squadra' | 'storico'>('giocatore');

  // Player Calculation Form State
  const [playerForm, setPlayerForm] = useState<PlayerCalcInputs>({
    giocatore: 'Lautaro Martínez',
    squadra: 'Inter',
    avversario: 'Juventus',
    mercato: 'Tiri in porta',
    linea: 0.5,
    quotaBookmaker: 1.85,
    mediaUltime5: 1.8,
    mediaStagione: 1.4,
    mediaSubitiAvversario: 4.2,
    minutiMedi: 84,
    partiteCampione: 24,
    titolare: true,
    bankroll: 1000,
  });

  const [playerResult, setPlayerResult] = useState<PlayerCalcResult | null>(null);

  // Team Shots Form State
  const [teamForm, setTeamForm] = useState<TeamShotsInputs>({
    squadraCasa: 'Inter',
    squadraOspite: 'Juventus',
    tiriFattiCasa: 17.1,
    tiriSubitiCasa: 8.4,
    tiriFattiOspite: 12.3,
    tiriSubitiOspite: 11.2,
    lineaOverUnder: 25.5,
    quotaOver: 1.88,
    bankroll: 1000,
  });

  const [teamResult, setTeamResult] = useState<TeamShotsResult | null>(null);

  // History State
  const [historyList, setHistoryList] = useState<PlayerCalcResult[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Compute on mount and changes
  useEffect(() => {
    setPlayerResult(calculatePlayerReliability(playerForm));
  }, [playerForm]);

  useEffect(() => {
    setTeamResult(calculateTeamShots(teamForm));
  }, [teamForm]);

  useEffect(() => {
    setHistoryList(getStoredHistory());
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // "Gioca!" Button Action
  const handleGioca = () => {
    if (!playerResult) return;
    const updated = saveToHistory(playerResult);
    setHistoryList(updated);
    showToast('Scommessa salvata nello storico con successo!');
  };

  // Export JSON
  const handleExport = () => {
    const json = exportHistoryJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scalperlab_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON esportato con successo!');
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importHistoryJSON(content);
      if (res.success) {
        setHistoryList(getStoredHistory());
        showToast(`Ripristinati ${res.count} record con successo!`);
      } else {
        showToast(res.error || 'Errore nel ripristino del file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="pb-28 px-3 space-y-4 pt-3">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 z-50 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="px-1">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          Calcolatore di Affidabilità
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Modellazione Poisson, stima della quota reale e calibrazione dello stake
        </p>
      </div>

      {/* 3 Section Switcher */}
      <div className="flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold justify-between">
        <button
          onClick={() => setActiveSection('giocatore')}
          className={`flex-1 py-1.5 rounded-full text-center transition-all ${
            activeSection === 'giocatore'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Affidabilità Giocatore
        </button>
        <button
          onClick={() => setActiveSection('squadra')}
          className={`flex-1 py-1.5 rounded-full text-center transition-all ${
            activeSection === 'squadra'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Media Tiri Squadra
        </button>
        <button
          onClick={() => setActiveSection('storico')}
          className={`flex-1 py-1.5 rounded-full text-center transition-all ${
            activeSection === 'storico'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Storico ({historyList.length})
        </button>
      </div>

      {/* SECTION 1: AFFIDABILITA GIOCATORE */}
      {activeSection === 'giocatore' && (
        <div className="space-y-4">
          {/* Inputs Card */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Parametri di Calcolo
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Input Quantitativi</span>
            </div>

            {/* Giocatore */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nome Giocatore
              </label>
              <input
                type="text"
                value={playerForm.giocatore}
                onChange={(e) => setPlayerForm({ ...playerForm, giocatore: e.target.value })}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* Squadra & Avversario */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Squadra
                </label>
                <input
                  type="text"
                  value={playerForm.squadra}
                  onChange={(e) => setPlayerForm({ ...playerForm, squadra: e.target.value })}
                  className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Avversario
                </label>
                <input
                  type="text"
                  value={playerForm.avversario}
                  onChange={(e) => setPlayerForm({ ...playerForm, avversario: e.target.value })}
                  className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Mercato & Linea */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mercato
                </label>
                <select
                  value={playerForm.mercato}
                  onChange={(e) =>
                    setPlayerForm({
                      ...playerForm,
                      mercato: e.target.value as 'Tiri in porta' | 'Tiri totali',
                    })
                  }
                  className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  <option value="Tiri in porta">Tiri in porta</option>
                  <option value="Tiri totali">Tiri totali</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Linea Over
                </label>
                <select
                  value={playerForm.linea}
                  onChange={(e) =>
                    setPlayerForm({
                      ...playerForm,
                      linea: parseFloat(e.target.value) as 0.5 | 1.5 | 2.5 | 3.5,
                    })
                  }
                  className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-mono"
                >
                  <option value={0.5}>Over 0.5</option>
                  <option value={1.5}>Over 1.5</option>
                  <option value={2.5}>Over 2.5</option>
                  <option value={3.5}>Over 3.5</option>
                </select>
              </div>
            </div>

            {/* Quota Bookmaker */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quota Bookmaker
                </label>
                <span className="text-[10px] text-slate-400">Quota decimale</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="1.01"
                value={playerForm.quotaBookmaker}
                onChange={(e) =>
                  setPlayerForm({ ...playerForm, quotaBookmaker: parseFloat(e.target.value) || 1.01 })
                }
                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* 3 Medie Numeriche: Ultime 5 / Stagione / Subiti avversario */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Media Ultime 5
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={playerForm.mediaUltime5}
                  onChange={(e) =>
                    setPlayerForm({ ...playerForm, mediaUltime5: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Media Stagione
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={playerForm.mediaStagione}
                  onChange={(e) =>
                    setPlayerForm({ ...playerForm, mediaStagione: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Subiti Avversario
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={playerForm.mediaSubitiAvversario}
                  onChange={(e) =>
                    setPlayerForm({
                      ...playerForm,
                      mediaSubitiAvversario: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full text-xs font-mono py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>
            </div>

            {/* Minuti Medi & Partite Campione & Titolare */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Minuti Medi
                </label>
                <input
                  type="number"
                  value={playerForm.minutiMedi}
                  onChange={(e) =>
                    setPlayerForm({ ...playerForm, minutiMedi: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Partite Campione
                </label>
                <input
                  type="number"
                  value={playerForm.partiteCampione}
                  onChange={(e) =>
                    setPlayerForm({
                      ...playerForm,
                      partiteCampione: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>
            </div>

            {/* Titolare Switch & Bankroll */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={playerForm.titolare}
                  onChange={(e) => setPlayerForm({ ...playerForm, titolare: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 border-slate-300"
                />
                <span>Previsto Titolare</span>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Bankroll €</span>
                <input
                  type="number"
                  value={playerForm.bankroll}
                  onChange={(e) =>
                    setPlayerForm({ ...playerForm, bankroll: parseFloat(e.target.value) || 100 })
                  }
                  className="w-20 text-xs font-mono font-bold py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right"
                />
              </div>
            </div>

            {/* Hints Box */}
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Il modello combina le ultime 5 gare al 60% e la stagione al 40%, applicando il Poisson λ ponderato sui minuti attesi.
              </span>
            </div>
          </div>

          {/* Result Card */}
          {playerResult && (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Risultati di Affidabilità
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  λ atteso: {playerResult.lambda}
                </span>
              </div>

              {/* Big Score & Recommendation */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Indice Affidabilità
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                      {playerResult.affidabilita.toFixed(1)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">/10</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Consiglio</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {playerResult.consiglio}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Rischio: <strong>{playerResult.livelloRischio}</strong>
                  </span>
                </div>
              </div>

              {/* Result Details Rows */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Probabilità Stimata:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {playerResult.probabilitaStimata}%
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Quota Reale Neutrale:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    @{playerResult.quotaReale.toFixed(2)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Valore Atteso (+EV):</span>
                  <span
                    className={`font-mono font-bold ${
                      playerResult.valoreAtteso >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {playerResult.valoreAtteso > 0 ? `+${playerResult.valoreAtteso}%` : `${playerResult.valoreAtteso}%`}
                  </span>
                </div>
              </div>

              {/* Stake Card Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                    Stake Consigliato (Kelly 1/4)
                  </span>
                  <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-200">
                    {playerResult.stakePercentuale}% bankroll
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">
                    Importo
                  </span>
                  <span className="text-lg font-mono font-black text-emerald-700 dark:text-emerald-300">
                    €{playerResult.stakeEuro.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Gioca! Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleGioca}
                className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Gioca! Salva nello Storico</span>
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: MEDIA TIRI SQUADRA */}
      {activeSection === 'squadra' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Matrice Tiri Casa / Fuori
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Convoluzione Poisson</span>
            </div>

            {/* Squadre */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Squadra Casa
                </label>
                <input
                  type="text"
                  value={teamForm.squadraCasa}
                  onChange={(e) => setTeamForm({ ...teamForm, squadraCasa: e.target.value })}
                  className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Squadra Ospite
                </label>
                <input
                  type="text"
                  value={teamForm.squadraOspite}
                  onChange={(e) => setTeamForm({ ...teamForm, squadraOspite: e.target.value })}
                  className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Casa Fatti / Subiti */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Tiri Fatti Casa
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teamForm.tiriFattiCasa}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, tiriFattiCasa: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Tiri Subiti Casa
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teamForm.tiriSubitiCasa}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, tiriSubitiCasa: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>
            </div>

            {/* Ospite Fatti / Subiti */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Tiri Fatti Ospite
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teamForm.tiriFattiOspite}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, tiriFattiOspite: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Tiri Subiti Ospite
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={teamForm.tiriSubitiOspite}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, tiriSubitiOspite: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center"
                />
              </div>
            </div>

            {/* Linea Over / Under & Quota */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Linea Over / Under
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={teamForm.lineaOverUnder}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, lineaOverUnder: parseFloat(e.target.value) || 20.5 })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Quota Over Bookmaker
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={teamForm.quotaOver}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, quotaOver: parseFloat(e.target.value) || 1.01 })
                  }
                  className="w-full text-xs font-mono py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* Team Result Card */}
          {teamResult && (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Stima Produzione Tiri
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Over {teamResult.lineaOverUnder}
                </span>
              </div>

              {/* Total Expected Shots Header */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Totale Tiri Attesi
                  </span>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {teamResult.totaleTiriAttesi}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {teamResult.squadraCasa} ({teamResult.tiriAttesiCasa}) - {teamResult.squadraOspite} ({teamResult.tiriAttesiOspite})
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Affidabilità</span>
                  <div className="text-2xl font-black font-mono text-emerald-500">
                    {teamResult.affidabilita.toFixed(1)}/10
                  </div>
                </div>
              </div>

              {/* Result Details Rows */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Probabilità Over {teamResult.lineaOverUnder}:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {teamResult.probabilitaOver}%
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Quota Reale Over:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    @{teamResult.quotaRealeOver.toFixed(2)}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Valore Atteso (+EV):</span>
                  <span
                    className={`font-mono font-bold ${
                      teamResult.valoreAtteso >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {teamResult.valoreAtteso > 0 ? `+${teamResult.valoreAtteso}%` : `${teamResult.valoreAtteso}%`}
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Consiglio ScalperLab:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {teamResult.consiglio}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: STORICO */}
      {activeSection === 'storico' && (
        <div className="space-y-4">
          {/* Backup / Restore Controls */}
          <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExport}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Esporta Backup</span>
              </button>

              <label className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Ripristina</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            {historyList.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Vuoi svuotare tutto lo storico?')) {
                    clearAllHistory();
                    setHistoryList([]);
                    showToast('Storico svuotato');
                  }
                }}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Svuota storico"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* History List */}
          {historyList.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-400 space-y-2">
              <Calculator className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-medium">Nessuna scommessa salvata nello storico.</p>
              <p className="text-[11px] text-slate-500">
                Usa il pulsante &quot;Gioca!&quot; nella sezione giocatore per salvare i tuoi calcoli.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.giocatore}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded-md">
                        {item.mercato} Over {item.linea}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      Quota @{item.quotaBookmaker} · Stake: {item.stakePercentuale}% (€{item.stakeEuro})
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Affidabilità: {item.affidabilita}/10 · EV: +{item.valoreAtteso}%
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = deleteHistoryItem(item.id);
                      setHistoryList(updated);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
