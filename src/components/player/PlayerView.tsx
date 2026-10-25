import React, { useState } from 'react';
import { PLAYERS_DATA } from '../../data/mockData';
import { ShotMap } from '../pitch/ShotMap';
import { BarChart2, Crosshair, Calendar, Award } from 'lucide-react';
import { SwipeableTabs, TabItem } from '../common/SwipeableTabs';

interface PlayerViewProps {
  playerId?: string;
  onOpenTeam?: (teamId: string) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  playerId = 'lautaro-martinez',
  onOpenTeam,
}) => {
  const player = PLAYERS_DATA[playerId] || PLAYERS_DATA['lautaro-martinez'];
  const [activeTab, setActiveTab] = useState('panoramica');

  // Convert player shots to ShotEvent format for ShotMap
  const mappedShots = player.shots.map((s: any, idx: number) => ({
    id: `ps-${idx}`,
    player: player.name,
    team: 'home' as const,
    minute: s.minute,
    x: s.x,
    y: s.y,
    xG: s.xG,
    outcome: s.outcome,
    bodyPart: s.bodyPart,
    situation: 'Azione' as const,
  }));

  // 1. Panoramica Tab (Season Stats Grid + Per 90 stats)
  const renderPanoramica = () => (
    <div className="space-y-4 px-2">
      {/* Season Stats Grid */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
          Statistiche Stagione 2024/25
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">Gol</span>
            <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
              {player.statsSeason.gol}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">Assist</span>
            <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
              {player.statsSeason.assist}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">Voto Medio</span>
            <span className="text-xl font-mono font-black text-emerald-500">
              {player.statsSeason.votoMedio}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">Tiri Totali</span>
            <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
              {player.statsSeason.tiriTotali}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">In Porta</span>
            <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
              {player.statsSeason.tiriInPorta}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium block">Expected Goals</span>
            <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
              {player.statsSeason.xG}
            </span>
          </div>
        </div>
      </div>

      {/* Per-90 Stats */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
          Rendimento Normalizzato (per 90 minuti)
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {player.per90.map((stat: any, i: number) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {stat.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                  {stat.leagueRank}
                </span>
                <span className="font-mono font-black text-slate-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Ultime Partite Tab
  const renderPartite = () => (
    <div className="space-y-3 px-2">
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
          Ultime Presenze
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
          {player.lastMatches.map((m: any, i: number) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-sans font-bold text-slate-900 dark:text-white block">
                  vs {m.opponent} ({m.score})
                </span>
                <span className="text-[10px] text-slate-400">
                  {m.date} · {m.minutes}&apos; giocati
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-500 block">
                  {m.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {m.shots} tiri ({m.shotsOnTarget} in porta)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 3. Mappa Tiri Tab
  const renderMappaTiri = () => (
    <div className="px-2">
      <ShotMap shots={mappedShots} homeName={player.name} awayName="Avversari" />
    </div>
  );

  const tabs: TabItem[] = [
    { id: 'panoramica', label: 'Panoramica', icon: BarChart2, content: renderPanoramica() },
    { id: 'partite', label: 'Ultime gare', icon: Calendar, content: renderPartite() },
    { id: 'mappa', label: 'Mappa tiri', icon: Crosshair, content: renderMappaTiri() },
  ];

  return (
    <div className="pb-24">
      {/* Player Hero */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-4">
        <div className="w-18 h-18 rounded-3xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
          <img
            src={player.photo}
            alt={player.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-400">
              #{player.number}
            </span>
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
              {player.role}
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white truncate">
            {player.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <button
              onClick={() => onOpenTeam && onOpenTeam(player.teamId)}
              className="text-slate-700 dark:text-slate-300 font-semibold hover:underline"
            >
              {player.team}
            </button>
            <span>·</span>
            <span>{player.nationality}</span>
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
