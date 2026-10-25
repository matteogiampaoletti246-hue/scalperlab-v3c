/**
 * ScalperLab Pure Calculation Brain
 * Includes Poisson modeling, weighted expectations, EV and Kelly stake sizing.
 */

export interface PlayerCalcInputs {
  giocatore: string;
  squadra: string;
  avversario: string;
  mercato: 'Tiri in porta' | 'Tiri totali';
  linea: 0.5 | 1.5 | 2.5 | 3.5;
  quotaBookmaker: number;
  mediaUltime5: number;
  mediaStagione: number;
  mediaSubitiAvversario: number;
  minutiMedi: number;
  partiteCampione: number;
  titolare: boolean;
  bankroll: number;
}

export interface PlayerCalcResult {
  giocatore: string;
  mercato: string;
  linea: number;
  quotaBookmaker: number;
  probabilitaStimata: number; // e.g. 68.4
  quotaReale: number; // e.g. 1.46
  valoreAtteso: number; // EV % e.g. +14.2
  affidabilita: number; // 1.0 to 10.0
  stakePercentuale: number; // Kelly % e.g. 2.5
  stakeEuro: number; // e.g. 25.00
  livelloRischio: 'Basso' | 'Medio' | 'Alto' | 'Molto Alto';
  consiglio: string;
  lambda: number;
  timestamp: string;
  id: string;
}

export interface TeamShotsInputs {
  squadraCasa: string;
  squadraOspite: string;
  tiriFattiCasa: number;
  tiriSubitiCasa: number;
  tiriFattiOspite: number;
  tiriSubitiOspite: number;
  lineaOverUnder: number; // e.g. 25.5
  quotaOver: number;
  bankroll: number;
}

export interface TeamShotsResult {
  squadraCasa: string;
  squadraOspite: string;
  tiriAttesiCasa: number;
  tiriAttesiOspite: number;
  totaleTiriAttesi: number;
  lineaOverUnder: number;
  quotaOver: number;
  probabilitaOver: number;
  quotaRealeOver: number;
  valoreAtteso: number;
  affidabilita: number;
  consiglio: string;
}

// Factorial helper for Poisson
function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Poisson probability P(X = k)
export function poissonPMF(lambda: number, k: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

// Poisson cumulative probability P(X >= target)
export function poissonCDFGreaterOrEqual(lambda: number, target: number): number {
  const kTarget = Math.floor(target) + 1;
  let sumLower = 0;
  for (let k = 0; k < kTarget; k++) {
    sumLower += poissonPMF(lambda, k);
  }
  return Math.max(0, Math.min(1, 1 - sumLower));
}

/**
 * Calcola l'affidabilita del giocatore
 */
export function calculatePlayerReliability(inputs: PlayerCalcInputs): PlayerCalcResult {
  const {
    giocatore,
    mercato,
    linea,
    quotaBookmaker,
    mediaUltime5,
    mediaStagione,
    mediaSubitiAvversario,
    minutiMedi,
    partiteCampione,
    titolare,
    bankroll,
  } = inputs;

  // Weight player stats: 60% recent form (last 5), 30% season avg, 10% baseline
  const playerBaseRate = mediaUltime5 * 0.6 + mediaStagione * 0.4;

  // Opponent defensive factor (baseline: 3.8 shots on target conceded per match or 12.0 total shots)
  const baselineDefense = mercato === 'Tiri in porta' ? 3.8 : 12.0;
  const oppFactor = Math.pow(Math.max(0.5, mediaSubitiAvversario / baselineDefense), 0.45);

  // Minutes played factor (scaled to 90 mins)
  const minFactor = Math.min(1.05, Math.max(0.4, (minutiMedi || 80) / 90));
  const starterFactor = titolare ? 1.0 : 0.65;

  // Poisson expected lambda
  const lambda = Math.max(0.08, playerBaseRate * oppFactor * minFactor * starterFactor);

  // Probability of reaching over line
  const prob = poissonCDFGreaterOrEqual(lambda, linea);
  const probPercent = Math.round(prob * 1000) / 10;

  // Fair odds
  const quotaReale = prob > 0.02 ? Math.round((1 / prob) * 100) / 100 : 99.0;

  // Expected Value (EV%) = (Quota Bookmaker * Prob - 1) * 100
  const ev = (quotaBookmaker * prob - 1) * 100;
  const valoreAtteso = Math.round(ev * 10) / 10;

  // Sample size confidence factor (20+ games is full confidence)
  const sampleConfidence = Math.min(1.0, Math.max(0.65, partiteCampione / 20));

  // Score from 1.0 to 10.0
  let rawScore = 5.0;
  if (ev > 0) {
    rawScore = 6.0 + Math.min(3.5, ev / 5) * 0.9 + (prob - 0.5) * 2;
  } else {
    rawScore = 5.0 + Math.max(-4.0, ev / 7);
  }
  rawScore *= sampleConfidence;
  const affidabilita = Math.max(1.0, Math.min(10.0, Math.round(rawScore * 10) / 10));

  // Fractional Kelly criterion (1/4 Kelly for safety)
  let kelly = 0;
  const b = quotaBookmaker - 1;
  const q = 1 - prob;
  if (b > 0 && ev > 0) {
    const fullKelly = (b * prob - q) / b;
    kelly = Math.max(0, Math.min(0.05, (fullKelly * 0.25))); // cap at 5%
  }
  const stakePercentuale = Math.round(kelly * 1000) / 10;
  const stakeEuro = Math.round(((bankroll * stakePercentuale) / 100) * 100) / 100;

  // Risk categorization
  let livelloRischio: 'Basso' | 'Medio' | 'Alto' | 'Molto Alto' = 'Medio';
  if (prob >= 0.65 && ev >= 6) livelloRischio = 'Basso';
  else if (prob >= 0.50 && ev >= 3) livelloRischio = 'Medio';
  else if (ev > 0) livelloRischio = 'Alto';
  else livelloRischio = 'Molto Alto';

  // Recommendation text
  let consiglio = 'Nessun Valore / Evitare';
  if (affidabilita >= 8.5 && ev >= 10) consiglio = 'Valore Top (Forte)';
  else if (affidabilita >= 7.5 && ev >= 5) consiglio = 'Valore Consistente (Medio)';
  else if (affidabilita >= 6.5 && ev > 0) consiglio = 'Valore Marginale (Prudente)';

  return {
    id: 'calc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    giocatore: giocatore || 'Giocatore',
    mercato,
    linea,
    quotaBookmaker,
    probabilitaStimata: probPercent,
    quotaReale,
    valoreAtteso,
    affidabilita,
    stakePercentuale,
    stakeEuro,
    livelloRischio,
    consiglio,
    lambda: Math.round(lambda * 100) / 100,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calcola media tiri squadre e linea Over/Under
 */
export function calculateTeamShots(inputs: TeamShotsInputs): TeamShotsResult {
  const {
    squadraCasa,
    squadraOspite,
    tiriFattiCasa,
    tiriSubitiCasa,
    tiriFattiOspite,
    tiriSubitiOspite,
    lineaOverUnder,
    quotaOver,
  } = inputs;

  // Expected shots for Home: combination of Home attack at home & Away defense away
  const tiriAttesiCasa = Math.round(((tiriFattiCasa * 0.55 + tiriSubitiOspite * 0.45)) * 10) / 10;
  const tiriAttesiOspite = Math.round(((tiriFattiOspite * 0.52 + tiriSubitiCasa * 0.48)) * 10) / 10;
  const totaleTiriAttesi = Math.round((tiriAttesiCasa + tiriAttesiOspite) * 10) / 10;

  // Poisson estimation of total shots exceeding line
  const prob = poissonCDFGreaterOrEqual(totaleTiriAttesi, lineaOverUnder);
  const probabilitaOver = Math.round(prob * 1000) / 10;
  const quotaRealeOver = prob > 0.05 ? Math.round((1 / prob) * 100) / 100 : 99.0;

  const ev = (quotaOver * prob - 1) * 100;
  const valoreAtteso = Math.round(ev * 10) / 10;

  let rawScore = 5.0;
  if (ev > 0) rawScore = 6.0 + Math.min(3.5, ev / 6) + (prob - 0.5) * 2;
  else rawScore = 4.8 + Math.max(-3.5, ev / 8);
  const affidabilita = Math.max(1.0, Math.min(10.0, Math.round(rawScore * 10) / 10));

  let consiglio = 'Nessun vantaggio statistico';
  if (valoreAtteso >= 8 && affidabilita >= 8) consiglio = 'Forte vantaggio Over';
  else if (valoreAtteso > 2) consiglio = 'Moderato valore Over';
  else if (valoreAtteso < -5) consiglio = 'Possibile valore Under';

  return {
    squadraCasa: squadraCasa || 'Casa',
    squadraOspite: squadraOspite || 'Ospite',
    tiriAttesiCasa,
    tiriAttesiOspite,
    totaleTiriAttesi,
    lineaOverUnder,
    quotaOver,
    probabilitaOver,
    quotaRealeOver,
    valoreAtteso,
    affidabilita,
    consiglio,
  };
}

/**
 * Storage helpers for History & Backup
 */
const STORAGE_KEY = 'scalperlab_calc_history_v1';

export function getStoredHistory(): PlayerCalcResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveToHistory(item: PlayerCalcResult): PlayerCalcResult[] {
  const current = getStoredHistory();
  const updated = [item, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save history', e);
  }
  return updated;
}

export function deleteHistoryItem(id: string): PlayerCalcResult[] {
  const current = getStoredHistory();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete item', e);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

export function exportHistoryJSON(): string {
  const history = getStoredHistory();
  return JSON.stringify({ version: '1.0', app: 'ScalperLab', exportDate: new Date().toISOString(), data: history }, null, 2);
}

export function importHistoryJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
      return { success: true, count: parsed.data.length };
    }
    return { success: false, count: 0, error: 'Formato file JSON non valido' };
  } catch {
    return { success: false, count: 0, error: 'Errore durante la lettura del file' };
  }
}
