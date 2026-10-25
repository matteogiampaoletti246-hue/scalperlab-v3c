import React, { useState } from 'react';
import { MatchItem, LEAGUES_DATA } from '../../data/mockData';
import { InfoBand } from '../common/InfoBand';
import { TwoSidedBar } from '../common/TwoSidedBar';
import { FormationsPitch } from '../pitch/FormationsPitch';
import { GaugeAffidabilita } from '../common/GaugeAffidabilita';
import { SwipeableTabs, TabItem } from '../common/SwipeableTabs';
import { Eye, BarChart2, Users, Table, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface MatchPreMatchViewProps {
  match: MatchItem;
  onOpenTeam: (teamId: string) => void;
  onOpenLeague: (leagueId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  onOpenReferee?: (refereeId: string) => void;
}

export const MatchPreMatchView: React.FC<MatchPreMatchViewProps> = ({
  match,
  onOpenTeam,
  onOpenLeague,
  onOpenPlayer,
  onOpenReferee,
}) => {
  const [activeTab, setActiveTab] = useState('panoramica');

  // League standings
  const league = LEAGUES_DATA.find((l) => l.id === match.leagueId) || LEAGUES_DATA[0];

  // 1. Panoramica Tab Content
  const renderPanoramica = () => (
    <div className="space-y-4 px-2">
      {/* "Numeri da tenere d'occhio" */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          Numeri da tenere d&apos;occhio
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {match.highlightNumbers.map((num, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {num.teamName}
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded-md">
                  {num.rankBadge}
                </span>
              </div>
              <div className="text-xl font-mono font-black text-slate-900 dark:text-white my-0.5">
                {num.value}
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight">
                {num.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* "Giocatori migliori" comparison */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Giocatori Migliori (Confronto)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Rating Stagionale</span>
        </div>

        <div className="space-y-3">
          {match.topPlayersComparison.map((row, i) => (
            <div
              key={i}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                {/* Home player */}
                <button
                  onClick={() => onOpenPlayer && onOpenPlayer('lautaro-martinez')}
                  className="flex items-center gap-2 group text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold group-hover:scale-105 transition-transform">
                    {row.home.initials}
                  </div>
                  <div>
                    <span className="block text-slate-900 dark:text-white group-hover:text-emerald-500">
                      {row.home.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {row.home.goals} Gol · {row.home.shotsPer90} tiri/90
                    </span>
                  </div>
                </button>

                {/* Away player */}
                <button
                  onClick={() => onOpenPlayer && onOpenPlayer('lautaro-martinez')}
                  className="flex items-center gap-2 group text-right flex-row-reverse"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white flex items-center justify-center text-[10px] font-bold group-hover:scale-105 transition-transform">
                    {row.away.initials}
                  </div>
                  <div>
                    <span className="block text-slate-900 dark:text-white group-hover:text-emerald-500">
                      {row.away.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {row.away.goals} Gol · {row.away.shotsPer90} tiri/90
                    </span>
                  </div>
                </button>
              </div>

              {/* Two-sided bar comparison on Rating */}
              <TwoSidedBar
                label="Voto Medio"
                homeValue={row.home.rating}
                awayValue={row.away.rating}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Statistiche Tab Content
  const renderStatistiche = () => {
    const attesiStats = match.statsComparison.filter((s) => s.isExpected);
    const stagioneStats = match.statsComparison.filter((s) => !s.isExpected);

    return (
      <div className="space-y-4 px-2">
        {/* Attesi in partita */}
        <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Attesi in Partita (Modello ScalperLab)
            </h3>
            <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Poisson λ
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {attesiStats.map((st, i) => (
              <TwoSidedBar
                key={i}
                label={st.label}
                homeValue={st.homeValue}
                awayValue={st.awayValue}
              />
            ))}
          </div>
        </div>

        {/* Medie di stagione */}
        <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
            Medie di Stagione
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stagioneStats.map((st, i) => (
              <TwoSidedBar
                key={i}
                label={st.label}
                homeValue={st.homeValue}
                awayValue={st.awayValue}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 3. Formazioni Tab Content
  const renderFormazioni = () => (
    <div className="px-2">
      <FormationsPitch
        homeFormation={match.lineups.home.formation}
        awayFormation={match.lineups.away.formation}
        homeCoach={match.lineups.home.coach}
        awayCoach={match.lineups.away.coach}
        homeStartingXI={match.lineups.home.startingXI}
        awayStartingXI={match.lineups.away.startingXI}
        homeBench={match.lineups.home.bench}
        awayBench={match.lineups.away.bench}
        homeName={match.homeTeam.name}
        awayName={match.awayTeam.name}
        onPlayerClick={() => onOpenPlayer && onOpenPlayer('lautaro-martinez')}
      />
    </div>
  );

  // 4. Classifica Tab Content
  const renderClassifica = () => (
    <div className="px-2">
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Classifica {league.name}
          </h3>
          <button
            onClick={() => onOpenLeague(match.leagueId)}
            className="text-[11px] font-semibold text-emerald-500 hover:underline flex items-center gap-0.5"
          >
            <span>Completa</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                <th className="py-1.5 pl-2">#</th>
                <th className="py-1.5">Squadra</th>
                <th className="py-1.5 text-center">G</th>
                <th className="py-1.5 text-center">DR</th>
                <th className="py-1.5 pr-2 text-right">Pt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {league.standings.map((row) => {
                const isHomeTeam = row.teamId === match.homeTeam.id;
                const isAwayTeam = row.teamId === match.awayTeam.id;
                const isHighlighted = isHomeTeam || isAwayTeam;

                return (
                  <tr
                    key={row.teamId}
                    onClick={() => onOpenTeam(row.teamId)}
                    className={`cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 font-bold text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="py-2 pl-2">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-1 h-3 rounded-full ${
                            row.zone === 'champions'
                              ? 'bg-blue-600'
                              : row.zone === 'europa'
                              ? 'bg-orange-500'
                              : row.zone === 'conference'
                              ? 'bg-green-600'
                              : row.zone === 'relegation'
                              ? 'bg-red-600'
                              : 'bg-transparent'
                          }`}
                        />
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-2 font-sans font-semibold">
                      <div className="flex items-center gap-2">
                        <span>{row.teamName}</span>
                        {isHomeTeam && (
                          <span className="text-[9px] font-mono px-1 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            CASA
                          </span>
                        )}
                        {isAwayTeam && (
                          <span className="text-[9px] font-mono px-1 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            OSP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 text-center text-slate-500 dark:text-slate-400">
                      {row.played}
                    </td>
                    <td className="py-2 text-center text-slate-500 dark:text-slate-400">
                      {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                    </td>
                    <td className="py-2 pr-2 text-right font-black text-slate-900 dark:text-white">
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 5. Affidabilità Tab Content
  const renderAffidabilita = () => (
    <div className="px-2">
      <GaugeAffidabilita
        score={match.reliability.score}
        stakeRecommendation={match.reliability.stakeRecommendation}
        market={match.reliability.market}
        valueOdds={match.reliability.valueOdds}
        riskLevel={match.reliability.riskLevel}
      />
    </div>
  );

  const tabs: TabItem[] = [
    { id: 'panoramica', label: 'Panoramica', icon: Eye, content: renderPanoramica() },
    { id: 'statistiche', label: 'Statistiche', icon: BarChart2, content: renderStatistiche() },
    { id: 'formazioni', label: 'Formazioni', icon: Users, content: renderFormazioni() },
    { id: 'classifica', label: 'Classifica', icon: Table, content: renderClassifica() },
    { id: 'affidabilita', label: 'Affidabilità', icon: ShieldCheck, content: renderAffidabilita() },
  ];

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="px-4 pt-3 pb-2 text-center">
        {/* League pill & Kickoff */}
        <button
          onClick={() => onOpenLeague(match.leagueId)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors mb-3"
        >
          <span>{match.leagueName}</span>
          <span>·</span>
          <span className="font-mono">{match.dateLabel} {match.timeOrMinute}</span>
        </button>

        {/* Crests and Matchup */}
        <div className="grid grid-cols-3 items-center justify-center my-2">
          {/* Home team */}
          <button
            onClick={() => onOpenTeam(match.homeTeam.id)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full p-1 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-emerald-500 transition-colors">
              {match.homeTeam.name}
            </span>
            {/* Form dots */}
            <div className="flex items-center gap-1 mt-1">
              {match.homeTeam.form.map((f, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    f.result === 'V'
                      ? 'bg-emerald-500'
                      : f.result === 'P'
                      ? 'bg-slate-400'
                      : 'bg-red-500'
                  }`}
                  title={`${f.result} vs ${f.opponent} (${f.score})`}
                />
              ))}
            </div>
          </button>

          {/* Versus center info */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              VS
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-1">
              Kickoff {match.timeOrMinute}
            </span>
          </div>

          {/* Away team */}
          <button
            onClick={() => onOpenTeam(match.awayTeam.id)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full p-1 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-emerald-500 transition-colors">
              {match.awayTeam.name}
            </span>
            {/* Form dots */}
            <div className="flex items-center gap-1 mt-1">
              {match.awayTeam.form.map((f, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    f.result === 'V'
                      ? 'bg-emerald-500'
                      : f.result === 'P'
                      ? 'bg-slate-400'
                      : 'bg-red-500'
                  }`}
                  title={`${f.result} vs ${f.opponent} (${f.score})`}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Info Band: Stadio, Meteo, Arbitro */}
      <InfoBand
        stadium={match.venue.stadium}
        weather={match.venue.weather}
        referee={match.venue.referee}
        onRefereeClick={() => onOpenReferee && onOpenReferee(match.venue.referee.id)}
      />

      {/* Swipeable Tabs */}
      <SwipeableTabs
        tabs={tabs}
        activeTabId={activeTab}
        onChangeTab={setActiveTab}
      />
    </div>
  );
};
