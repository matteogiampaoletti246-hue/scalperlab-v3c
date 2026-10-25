import React, { useState } from 'react';
import { LEAGUES_DATA, MATCHES_DATA, REFEREES_DATA } from '../../data/mockData';
import { SwipeableTabs, TabItem } from '../common/SwipeableTabs';
import { MatchCard } from '../match/MatchCard';
import { Calendar, Table, Shield, Award, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeagueViewProps {
  leagueId: string;
  onOpenMatch: (matchId: string) => void;
  onOpenTeam: (teamId: string) => void;
  onOpenPlayer?: (playerId: string) => void;
  onOpenReferee?: (refereeId: string) => void;
}

export const LeagueView: React.FC<LeagueViewProps> = ({
  leagueId,
  onOpenMatch,
  onOpenTeam,
  onOpenPlayer,
  onOpenReferee,
}) => {
  const league = LEAGUES_DATA.find((l) => l.id === leagueId) || LEAGUES_DATA[0];
  const [activeTab, setActiveTab] = useState('classifica');

  // Classifica sub-filter: Totale / Casa / Trasferta / Forma
  const [standingsFilter, setStandingsFilter] = useState<'Totale' | 'Casa' | 'Trasferta' | 'Forma'>('Totale');

  // Squadre Category Cards State
  const [attaccoMetric, setAttaccoMetric] = useState('Gol');
  const [difesaMetric, setDifesaMetric] = useState('Gol subiti');
  const [disciplinaMetric, setDisciplinaMetric] = useState('Gialli');
  const [giocoMetric, setGiocoMetric] = useState('Possesso %');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Arbitri filter
  const [refereeSort, setRefereeSort] = useState<'Gialli' | 'Rossi' | 'Falli' | 'Rigori' | 'Partite'>('Gialli');

  // League matches
  const leagueMatches = MATCHES_DATA.filter((m) => m.leagueId === league.id);

  // 1. Partite Tab
  const renderPartite = () => (
    <div className="space-y-3 px-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Giornata 10 di 38
        </span>
        <span className="text-[10px] font-mono text-emerald-500 font-semibold">
          Calendario Ufficiale
        </span>
      </div>
      {leagueMatches.map((m) => (
        <MatchCard
          key={m.id}
          match={m}
          onClick={() => onOpenMatch(m.id)}
          onOpenHomeTeam={() => onOpenTeam(m.homeTeam.id)}
          onOpenAwayTeam={() => onOpenTeam(m.awayTeam.id)}
        />
      ))}
    </div>
  );

  // 2. Classifica Tab (Totale / Casa / Trasferta / Forma + colored left bars + legend)
  const renderClassifica = () => (
    <div className="space-y-3 px-2">
      {/* Sub-filter segmented buttons */}
      <div className="flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold justify-between">
        {(['Totale', 'Casa', 'Trasferta', 'Forma'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStandingsFilter(filter)}
            className={`flex-1 py-1 rounded-full text-center transition-all ${
              standingsFilter === filter
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Standings Table Card */}
      <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                <th className="py-2 pl-2">#</th>
                <th className="py-2">Squadra</th>
                <th className="py-2 text-center">G</th>
                <th className="py-2 text-center">DR</th>
                <th className="py-2 pr-2 text-right">Pt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {league.standings.map((row) => (
                <tr
                  key={row.teamId}
                  onClick={() => onOpenTeam(row.teamId)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-2 pl-2 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1 h-3.5 rounded-full ${
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
                  <td className="py-2 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <span>{row.teamName}</span>
                    </div>
                  </td>
                  <td className="py-2 text-center text-slate-500">{row.played}</td>
                  <td className="py-2 text-center text-slate-500">
                    {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                  </td>
                  <td className="py-2 pr-2 text-right font-black text-slate-900 dark:text-white">
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>UEFA Champions League</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>UEFA Europa League</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            <span>UEFA Conference League</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Retrocessione (Serie B)</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. Squadre Tab (Attacco, Difesa, Disciplina, Gioco with metric switch, top-3 mini ranking, expand, jump menu)
  const renderSquadre = () => {
    const categories = [
      {
        id: 'attacco',
        title: 'Attacco',
        metrics: [
          'Gol',
          'xG',
          'xG senza rigori',
          'xGOT',
          'xG da azione',
          'xG da palla inattiva',
          'Tiri fuori',
          'Tiri da fuori area',
        ],
        activeMetric: attaccoMetric,
        setMetric: setAttaccoMetric,
        top3: [
          { rank: 1, teamId: 'atalanta', name: 'Atalanta', value: '26 (2.89/p)' },
          { rank: 2, teamId: 'inter', name: 'Inter', value: '22 (2.44/p)' },
          { rank: 3, teamId: 'napoli', name: 'Napoli', value: '18 (2.00/p)' },
        ],
      },
      {
        id: 'difesa',
        title: 'Difesa',
        metrics: ['Gol subiti', 'xG concessi', 'Clean sheets', 'Tiri subiti in porta'],
        activeMetric: difesaMetric,
        setMetric: setDifesaMetric,
        top3: [
          { rank: 1, teamId: 'juventus', name: 'Juventus', value: '2 gol subiti' },
          { rank: 2, teamId: 'napoli', name: 'Napoli', value: '5 gol subiti' },
          { rank: 3, teamId: 'inter', name: 'Inter', value: '7 gol subiti' },
        ],
      },
      {
        id: 'disciplina',
        title: 'Disciplina',
        metrics: ['Gialli', 'Rossi', 'Falli commessi', 'Rigori contro'],
        activeMetric: disciplinaMetric,
        setMetric: setDisciplinaMetric,
        top3: [
          { rank: 1, teamId: 'torino', name: 'Torino', value: '24 gialli' },
          { rank: 2, teamId: 'lazio', name: 'Lazio', value: '22 gialli' },
          { rank: 3, teamId: 'roma', name: 'Roma', value: '20 gialli' },
        ],
      },
      {
        id: 'gioco',
        title: 'Gioco & Manovra',
        metrics: ['Possesso %', 'Precisione passaggi', 'PPDA (Pressing)', 'Corner a favore'],
        activeMetric: giocoMetric,
        setMetric: setGiocoMetric,
        top3: [
          { rank: 1, teamId: 'juventus', name: 'Juventus', value: '61.2%' },
          { rank: 2, teamId: 'inter', name: 'Inter', value: '59.6%' },
          { rank: 3, teamId: 'milan', name: 'Milan', value: '57.1%' },
        ],
      },
    ];

    return (
      <div className="space-y-4 px-2">
        {/* Quick Jump "Vai a" Menu */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono shrink-0">
            Vai a:
          </span>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#cat-${c.id}`}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 shrink-0 font-medium"
            >
              {c.title}
            </a>
          ))}
        </div>

        {/* Category Cards */}
        {categories.map((cat) => {
          const isExpanded = expandedCard === cat.id;

          return (
            <div
              key={cat.id}
              id={`cat-${cat.id}`}
              className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {cat.title}
                </h3>
                <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {cat.activeMetric}
                </span>
              </div>

              {/* Metric Switch (scrollable chips) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {cat.metrics.map((m) => (
                  <button
                    key={m}
                    onClick={() => cat.setMetric(m)}
                    className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                      cat.activeMetric === m
                        ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Top 3 Mini-Ranking */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cat.top3.map((item) => (
                  <div
                    key={item.rank}
                    onClick={() => onOpenTeam(item.teamId)}
                    className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 font-mono font-bold text-slate-400">
                        #{item.rank}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* "Mostra tutte" Expand toggle */}
              <button
                onClick={() => setExpandedCard(isExpanded ? null : cat.id)}
                className="w-full py-1.5 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
              >
                <span>{isExpanded ? 'Comprimi' : 'Mostra tutte le 20 squadre'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Expanded extra ranks preview */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600"
                  >
                    <div className="py-1.5 flex justify-between">
                      <span>#4 Milan</span>
                      <span className="font-mono">17</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span>#5 Lazio</span>
                      <span className="font-mono">17</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span>#6 Fiorentina</span>
                      <span className="font-mono">15</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span>#7 Juventus</span>
                      <span className="font-mono">15</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span>#8 Torino</span>
                      <span className="font-mono">14</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  // 4. Giocatori Tab (Capocannonieri, Assist, Tiri totali /90, Tiri in porta /90, Più in forma, Falli commessi /90, Falli subiti /90)
  const renderGiocatori = () => {
    const playerLeaderboards = [
      {
        id: 'gol',
        title: 'Capocannonieri',
        top3: [
          { rank: 1, name: 'Marcus Thuram (Inter)', value: '7 Gol' },
          { rank: 2, name: 'Lautaro Martínez (Inter)', value: '6 Gol' },
          { rank: 3, name: 'Dušan Vlahović (Juventus)', value: '5 Gol' },
        ],
      },
      {
        id: 'assist',
        title: 'Assist',
        top3: [
          { rank: 1, name: 'Federico Dimarco (Inter)', value: '4 Assist' },
          { rank: 2, name: 'Nicolò Barella (Inter)', value: '3 Assist' },
          { rank: 3, name: 'Christian Pulisic (Milan)', value: '3 Assist' },
        ],
      },
      {
        id: 'tiri_90',
        title: 'Tiri Totali ogni 90\'',
        top3: [
          { rank: 1, name: 'Lautaro Martínez (Inter)', value: '3.82 /90\'' },
          { rank: 2, name: 'Mateo Retegui (Atalanta)', value: '3.62 /90\'' },
          { rank: 3, name: 'Dušan Vlahović (Juventus)', value: '3.41 /90\'' },
        ],
      },
      {
        id: 'tiri_porta_90',
        title: 'Tiri in Porta ogni 90\'',
        top3: [
          { rank: 1, name: 'Lautaro Martínez (Inter)', value: '1.98 /90\'' },
          { rank: 2, name: 'Marcus Thuram (Inter)', value: '1.74 /90\'' },
          { rank: 3, name: 'Dušan Vlahović (Juventus)', value: '1.65 /90\'' },
        ],
      },
      {
        id: 'forma',
        title: 'Più in Forma (Tiri Ultime 5)',
        top3: [
          { rank: 1, name: 'Lautaro Martínez (Inter)', value: '7.6 tiri attesi' },
          { rank: 2, name: 'Mateo Retegui (Atalanta)', value: '7.1 tiri attesi' },
          { rank: 3, name: 'Dušan Vlahović (Juventus)', value: '6.8 tiri attesi' },
        ],
      },
      {
        id: 'falli_commessi',
        title: 'Falli Commessi ogni 90\'',
        top3: [
          { rank: 1, name: 'Youssouf Fofana (Milan)', value: '2.84 /90\'' },
          { rank: 2, name: 'Bryan Cristante (Roma)', value: '2.61 /90\'' },
          { rank: 3, name: 'Marten de Roon (Atalanta)', value: '2.45 /90\'' },
        ],
      },
      {
        id: 'falli_subiti',
        title: 'Falli Subiti ogni 90\'',
        top3: [
          { rank: 1, name: 'Khvicha Kvaratskhelia (Napoli)', value: '3.40 /90\'' },
          { rank: 2, name: 'Mattia Zaccagni (Lazio)', value: '3.12 /90\'' },
          { rank: 3, name: 'Paulo Dybala (Roma)', value: '2.88 /90\'' },
        ],
      },
    ];

    return (
      <div className="space-y-3 px-2">
        {playerLeaderboards.map((board) => (
          <div
            key={board.id}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {board.title}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {board.top3.map((p) => (
                <div
                  key={p.rank}
                  onClick={() => onOpenPlayer && onOpenPlayer('lautaro-martinez')}
                  className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono font-bold text-slate-400">
                      #{p.rank}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {p.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {p.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 5. Arbitri Tab (filters Gialli / Rossi / Falli / Rigori / Partite with active column highlighted)
  const renderArbitri = () => {
    const refsList = [
      { id: 'ref-massa', name: 'Davide Massa', partite: 6, gialli: 4.83, rossi: 0.33, falli: 25.4, rigori: 0.50 },
      { id: 'ref-doveri', name: 'Daniele Doveri', partite: 7, gialli: 4.14, rossi: 0.14, falli: 23.8, rigori: 0.28 },
      { id: 'ref-sozza', name: 'Simone Sozza', partite: 5, gialli: 5.20, rossi: 0.40, falli: 27.1, rigori: 0.60 },
      { id: 'ref-mariani', name: 'Maurizio Mariani', partite: 6, gialli: 4.50, rossi: 0.17, falli: 24.2, rigori: 0.33 },
      { id: 'ref-fabbri', name: 'Michael Fabbri', partite: 5, gialli: 4.60, rossi: 0.20, falli: 26.0, rigori: 0.40 },
    ];

    return (
      <div className="space-y-3 px-2">
        {/* Metric filter buttons */}
        <div className="flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
          {(['Gialli', 'Rossi', 'Falli', 'Rigori', 'Partite'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setRefereeSort(filter)}
              className={`flex-1 py-1 px-2.5 rounded-full text-center transition-all whitespace-nowrap ${
                refereeSort === filter
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Referee Table with active column highlighted */}
        <div className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                <th className="py-2 pl-2">Arbitro</th>
                <th
                  className={`py-2 text-center ${
                    refereeSort === 'Partite' ? 'text-emerald-500 font-bold' : ''
                  }`}
                >
                  P
                </th>
                <th
                  className={`py-2 text-center ${
                    refereeSort === 'Gialli' ? 'text-emerald-500 font-bold' : ''
                  }`}
                >
                  G/p
                </th>
                <th
                  className={`py-2 text-center ${
                    refereeSort === 'Rossi' ? 'text-emerald-500 font-bold' : ''
                  }`}
                >
                  R/p
                </th>
                <th
                  className={`py-2 text-center ${
                    refereeSort === 'Falli' ? 'text-emerald-500 font-bold' : ''
                  }`}
                >
                  F/p
                </th>
                <th
                  className={`py-2 pr-2 text-right ${
                    refereeSort === 'Rigori' ? 'text-emerald-500 font-bold' : ''
                  }`}
                >
                  Rig
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {refsList.map((rf) => (
                <tr
                  key={rf.id}
                  onClick={() => onOpenReferee && onOpenReferee(rf.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <td className="py-2.5 pl-2 font-sans font-semibold text-slate-900 dark:text-white">
                    {rf.name}
                  </td>
                  <td
                    className={`py-2.5 text-center ${
                      refereeSort === 'Partite'
                        ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {rf.partite}
                  </td>
                  <td
                    className={`py-2.5 text-center ${
                      refereeSort === 'Gialli'
                        ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {rf.gialli.toFixed(1)}
                  </td>
                  <td
                    className={`py-2.5 text-center ${
                      refereeSort === 'Rossi'
                        ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {rf.rossi.toFixed(2)}
                  </td>
                  <td
                    className={`py-2.5 text-center ${
                      refereeSort === 'Falli'
                        ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {rf.falli.toFixed(1)}
                  </td>
                  <td
                    className={`py-2.5 pr-2 text-right ${
                      refereeSort === 'Rigori'
                        ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {rf.rigori.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabs: TabItem[] = [
    { id: 'classifica', label: 'Classifica', icon: Table, content: renderClassifica() },
    { id: 'partite', label: 'Partite', icon: Calendar, content: renderPartite() },
    { id: 'squadre', label: 'Squadre', icon: Shield, content: renderSquadre() },
    { id: 'giocatori', label: 'Giocatori', icon: Award, content: renderGiocatori() },
    { id: 'arbitri', label: 'Arbitri', icon: Users, content: renderArbitri() },
  ];

  return (
    <div className="pb-24">
      {/* League Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xs flex items-center justify-center">
            <span className="text-xl font-black text-slate-900 dark:text-emerald-400">
              {league.name.slice(0, 2)}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {league.name}
            </h2>
            <div className="text-xs text-slate-500">
              <span>{league.country}</span> · <span className="font-mono">{league.season}</span>
            </div>
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
