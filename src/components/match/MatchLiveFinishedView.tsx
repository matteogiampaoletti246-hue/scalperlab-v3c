import React, { useState } from 'react';
import { MatchItem, LEAGUES_DATA } from '../../data/mockData';
import { TwoSidedBar } from '../common/TwoSidedBar';
import { MomentumGraph } from './MomentumGraph';
import { ShotMap } from '../pitch/ShotMap';
import { FormationsPitch } from '../pitch/FormationsPitch';
import { SwipeableTabs, TabItem } from '../common/SwipeableTabs';
import { Activity, BarChart2, Users, Crosshair, Table, Flame, AlertCircle } from 'lucide-react';

interface MatchLiveFinishedViewProps {
  match: MatchItem;
  onOpenTeam: (teamId: string) => void;
  onOpenLeague: (leagueId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  onOpenReferee?: (refereeId: string) => void;
}

export const MatchLiveFinishedView: React.FC<MatchLiveFinishedViewProps> = ({
  match,
  onOpenTeam,
  onOpenLeague,
  onOpenPlayer,
  onOpenReferee,
}) => {
  const [activeTab, setActiveTab] = useState('riepilogo');

  const isLive = match.status === 'live';
  const league = LEAGUES_DATA.find((l) => l.id === match.leagueId) || LEAGUES_DATA[0];

  // 1. Riepilogo Tab (Momentum, Timeline with VAR, Subs, Dividers)
  const renderRiepilogo = () => (
    <div className="space-y-4 px-2">
      {/* Momentum Graph */}
      {match.momentum && (
        <MomentumGraph
          momentum={match.momentum}
          homeName={match.homeTeam.name}
          awayName={match.awayTeam.name}
          currentMinute={parseInt(match.timeOrMinute.replace("'", ''), 10) || 67}
        />
      )}

      {/* Match Timeline */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
          Cronologia Eventi
        </h3>

        <div className="space-y-2 relative before:absolute before:inset-y-0 before:left-6 before:w-[1px] before:bg-slate-200 dark:before:bg-slate-800">
          {match.timeline?.map((ev, i) => {
            const isHome = ev.team === 'home';

            // Divider items: "Intervallo" or "Fine partita"
            if (ev.player === 'Intervallo' || ev.player === 'Fine partita') {
              return (
                <div
                  key={i}
                  className="relative z-10 my-3 flex items-center justify-center"
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {ev.player} ({ev.detail})
                  </span>
                </div>
              );
            }

            return (
              <div
                key={i}
                className="relative z-10 flex items-start gap-3 text-xs py-1.5"
              >
                {/* Minute badge */}
                <span className="w-8 shrink-0 text-center font-mono font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 py-0.5 rounded-md">
                  {ev.minute}&apos;
                </span>

                {/* Event icon & description */}
                <div className="flex-1 flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Icon */}
                    {ev.type === 'goal' && (
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        ⚽
                      </span>
                    )}
                    {ev.type === 'yellow_card' && (
                      <span className="w-4 h-5 rounded-xs bg-amber-400 border border-amber-600 shrink-0" />
                    )}
                    {ev.type === 'red_card' && (
                      <span className="w-4 h-5 rounded-xs bg-red-600 border border-red-800 shrink-0" />
                    )}
                    {ev.type === 'var' && (
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 font-bold text-[9px] flex items-center justify-center shrink-0 font-mono border border-blue-500/20">
                        VAR
                      </span>
                    )}
                    {ev.type === 'sub' && (
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">
                        ⇄
                      </span>
                    )}

                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {ev.player}
                      </div>
                      {ev.assistOrSubWith && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {ev.type === 'goal'
                            ? `Assist: ${ev.assistOrSubWith}`
                            : `Esce: ${ev.assistOrSubWith}`}
                        </div>
                      )}
                      {ev.detail && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {ev.detail}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold shrink-0 ml-2">
                    {isHome ? match.homeTeam.shortName : match.awayTeam.shortName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 2. Statistiche Tab (10 comparison bars)
  const renderStatistiche = () => (
    <div className="px-2">
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Statistiche in Diretta
          </h3>
          <span className="text-[10px] font-mono font-bold text-emerald-500">
            {isLive ? 'Aggiornate in tempo reale' : 'Dati finali'}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {match.statsComparison.map((st, i) => (
            <TwoSidedBar
              key={i}
              label={st.label}
              homeValue={st.homeValue}
              awayValue={st.awayValue}
              isPercentage={st.label.includes('Possesso')}
              unit={st.label.includes('Possesso') ? '%' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // 3. Formazioni Tab (with live ratings)
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

  // 4. Mappa Tiri Tab
  const renderMappaTiri = () => (
    <div className="px-2">
      <ShotMap
        shots={match.shots || []}
        homeName={match.homeTeam.name}
        awayName={match.awayTeam.name}
      />
    </div>
  );

  // 5. Classifica Tab
  const renderClassifica = () => (
    <div className="px-2">
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Classifica Live
          </h3>
          <span className="text-[10px] font-mono text-emerald-500">
            Punti virtuali in corso
          </span>
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
                const isHome = row.teamId === match.homeTeam.id;
                const isAway = row.teamId === match.awayTeam.id;
                const isHighlighted = isHome || isAway;

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
                              : row.zone === 'relegation'
                              ? 'bg-red-600'
                              : 'bg-transparent'
                          }`}
                        />
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-2 font-sans font-semibold">
                      {row.teamName}
                    </td>
                    <td className="py-2 text-center text-slate-500">{row.played}</td>
                    <td className="py-2 text-center text-slate-500">
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

  const tabs: TabItem[] = [
    { id: 'riepilogo', label: 'Riepilogo', icon: Activity, content: renderRiepilogo() },
    { id: 'statistiche', label: 'Statistiche', icon: BarChart2, content: renderStatistiche() },
    { id: 'formazioni', label: 'Formazioni', icon: Users, content: renderFormazioni() },
    { id: 'mappa_tiri', label: 'Mappa tiri', icon: Crosshair, content: renderMappaTiri() },
    { id: 'classifica', label: 'Classifica', icon: Table, content: renderClassifica() },
  ];

  return (
    <div className="pb-24">
      {/* Live Hero Header */}
      <div className="px-4 pt-3 pb-2 text-center">
        {/* Pulsing Live badge or FT badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold mb-2">
          {isLive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono font-bold text-red-500">{match.timeOrMinute} LIVE</span>
            </>
          ) : (
            <span className="font-mono font-bold text-slate-500">FINALE</span>
          )}
          <span>·</span>
          <span className="text-slate-600 dark:text-slate-300">{match.leagueName}</span>
        </div>

        {/* Live Score Display */}
        <div className="grid grid-cols-3 items-center justify-center my-3">
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
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-emerald-500">
              {match.homeTeam.name}
            </span>
          </button>

          {/* Large Live Score */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-mono font-black ${
                  isLive ? 'text-red-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {match.homeTeam.score ?? 0}
              </span>
              <span className="text-2xl font-mono text-slate-400 font-light">-</span>
              <span
                className={`text-4xl font-mono font-black ${
                  isLive ? 'text-red-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {match.awayTeam.score ?? 0}
              </span>
            </div>
            {isLive && (
              <span className="text-[10px] font-mono text-red-500 font-bold mt-1">
                2° Tempo
              </span>
            )}
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
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-emerald-500">
              {match.awayTeam.name}
            </span>
          </button>
        </div>
      </div>

      {/* Swipeable Tabs */}
      <SwipeableTabs
        tabs={tabs}
        activeTabId={activeTab}
        onChangeTab={setActiveTab}
      />
    </div>
  );
};
