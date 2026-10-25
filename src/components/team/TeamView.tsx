import React, { useState } from 'react';
import { TEAMS_DATA, MATCHES_DATA, LEAGUES_DATA } from '../../data/mockData';
import { SwipeableTabs, TabItem } from '../common/SwipeableTabs';
import { MatchCard } from '../match/MatchCard';
import { Calendar, Table, Users, Award, BarChart2 } from 'lucide-react';

interface TeamViewProps {
  teamId: string;
  onOpenMatch: (matchId: string) => void;
  onOpenLeague: (leagueId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  teamId,
  onOpenMatch,
  onOpenLeague,
  onOpenPlayer,
}) => {
  const team = TEAMS_DATA[teamId] || TEAMS_DATA['inter'];
  const [activeTab, setActiveTab] = useState('partite');

  // Filter team matches
  const teamMatches = MATCHES_DATA.filter(
    (m) => m.homeTeam.id === team.id || m.awayTeam.id === team.id
  );
  const league = LEAGUES_DATA.find((l) => l.name === team.league) || LEAGUES_DATA[0];

  // 1. Partite Tab (upcoming incl live in red, then results)
  const renderPartite = () => (
    <div className="space-y-3 px-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Calendario & Risultati
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          Stagione 2024/25
        </span>
      </div>
      {teamMatches.map((m) => (
        <MatchCard key={m.id} match={m} onClick={() => onOpenMatch(m.id)} />
      ))}
    </div>
  );

  // 2. Classifica Tab
  const renderClassifica = () => (
    <div className="px-2">
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {team.league} · Posizione #{team.position}
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-500">
            {team.points} Punti
          </span>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono text-left">
              <th className="py-1.5 pl-2">#</th>
              <th className="py-1.5">Squadra</th>
              <th className="py-1.5 text-center">G</th>
              <th className="py-1.5 text-center">DR</th>
              <th className="py-1.5 pr-2 text-right">Pt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {league.standings.map((row) => {
              const isThisTeam = row.teamId === team.id;
              return (
                <tr
                  key={row.teamId}
                  className={
                    isThisTeam
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 font-bold text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                >
                  <td className="py-2 pl-2">{row.rank}</td>
                  <td className="py-2 font-sans font-semibold">{row.teamName}</td>
                  <td className="py-2 text-center text-slate-500">{row.played}</td>
                  <td className="py-2 text-center text-slate-500">{row.goalDiff}</td>
                  <td className="py-2 pr-2 text-right font-black">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 3. Squadra Tab (Portieri / Difensori / Centrocampisti / Attaccanti + Coach)
  const renderSquadra = () => (
    <div className="space-y-4 px-2">
      {/* Coach banner */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Allenatore</span>
        <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
          {team.coach}
        </span>
      </div>

      {/* Roster grouped by role */}
      {Object.entries(team.squad).map(([roleKey, players]: [string, any]) => (
        <div
          key={roleKey}
          className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        >
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            {roleKey}
          </span>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {players.map((p: any) => (
              <div
                key={p.id}
                onClick={() => onOpenPlayer && onOpenPlayer('lautaro-martinez')}
                className="py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl px-1.5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 font-mono text-[10px] text-slate-400 text-center font-bold">
                    {p.number}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {p.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                  <span>{p.appearances} presenze</span>
                  {p.goals !== undefined && (
                    <span className="font-bold text-emerald-500">{p.goals} Gol</span>
                  )}
                  {p.cleanSheets !== undefined && (
                    <span className="font-bold text-blue-500">{p.cleanSheets} Clean Sheet</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // 4. Giocatori Tab (Leaderboards: Gol / Assist / Tiri / Voto)
  const renderGiocatori = () => (
    <div className="space-y-3 px-2">
      {Object.entries(team.leaderboards).map(([cat, list]: [string, any]) => (
        <div
          key={cat}
          className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Classifica {cat}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((item: any) => (
              <div
                key={item.rank}
                onClick={() => onOpenPlayer && onOpenPlayer('lautaro-martinez')}
                className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-center font-mono font-bold text-slate-400">
                    #{item.rank}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // 5. Statistiche Tab (tiles with rank badge like "3ª su 20")
  const renderStatistiche = () => (
    <div className="space-y-3 px-2">
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
          Rendimento & Ranking Serie A
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {team.statsTiles.map((tile: any, i: number) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  Metrica
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded-md">
                  {tile.rankBadge}
                </span>
              </div>
              <div className="text-xl font-mono font-black text-slate-900 dark:text-white my-0.5">
                {tile.value}
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight">
                {tile.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs: TabItem[] = [
    { id: 'partite', label: 'Partite', icon: Calendar, content: renderPartite() },
    { id: 'classifica', label: 'Classifica', icon: Table, content: renderClassifica() },
    { id: 'squadra', label: 'Squadra', icon: Users, content: renderSquadra() },
    { id: 'giocatori', label: 'Giocatori', icon: Award, content: renderGiocatori() },
    { id: 'statistiche', label: 'Statistiche', icon: BarChart2, content: renderStatistiche() },
  ];

  return (
    <div className="pb-24">
      {/* Team Hero with Gradient & Crest */}
      <div className="relative px-4 pt-5 pb-4 text-center overflow-hidden">
        {/* Ambient team background tint */}
        <div
          className="absolute inset-0 opacity-15 dark:opacity-25 blur-3xl pointer-events-none"
          style={{ backgroundColor: team.primaryColor || '#0066B2' }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full p-1.5 bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
            <img
              src={team.crest}
              alt={team.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 object-contain"
            />
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {team.name}
          </h2>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
            <button
              onClick={() => onOpenLeague('serie-a')}
              className="text-emerald-500 hover:underline"
            >
              {team.league}
            </button>
            <span>·</span>
            <span>#{team.position} in classifica ({team.points} Pt)</span>
          </div>

          {/* Form dots */}
          <div className="flex items-center gap-1.5 mt-2.5">
            {team.form.map((res: string, i: number) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  res === 'V'
                    ? 'bg-emerald-500'
                    : res === 'P'
                    ? 'bg-slate-400'
                    : 'bg-red-500'
                }`}
              />
            ))}
          </div>
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
