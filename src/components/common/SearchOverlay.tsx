import React, { useState } from 'react';
import { Search, X, Users, Shield, Award, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TEAMS_DATA, LEAGUES_DATA, PLAYERS_DATA } from '../../data/mockData';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (teamId: string) => void;
  onSelectLeague: (leagueId: string) => void;
  onSelectPlayer: (playerId: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  onSelectLeague,
  onSelectPlayer,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Filter items
  const matchedTeams = Object.values(TEAMS_DATA).filter((t: any) =>
    t.name.toLowerCase().includes(normalizedQuery)
  );

  const matchedLeagues = LEAGUES_DATA.filter((l) =>
    l.name.toLowerCase().includes(normalizedQuery)
  );

  const matchedPlayers = Object.values(PLAYERS_DATA).filter((p: any) =>
    p.name.toLowerCase().includes(normalizedQuery)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-start bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl rounded-b-3xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Search Header Input */}
          <div className="p-3.5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Cerca squadre, leghe, calciatori..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-none"
            />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results Container */}
          <div className="overflow-y-auto no-scrollbar p-3 space-y-4">
            {/* Quick Suggestions if empty */}
            {normalizedQuery.length === 0 && (
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                  Suggerimenti Rapidi
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Inter', 'Juventus', 'Milan', 'Napoli', 'Lautaro Martínez', 'Serie A'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Teams */}
            {matchedTeams.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                  Squadre ({matchedTeams.length})
                </span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {matchedTeams.map((team: any) => (
                    <div
                      key={team.id}
                      onClick={() => {
                        onSelectTeam(team.id);
                        onClose();
                      }}
                      className="py-2 px-1 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <img
                            src={team.crest}
                            alt={team.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {team.name}
                        </span>
                        <span className="text-[10px] text-slate-400">({team.league})</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            {matchedPlayers.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                  Calciatori ({matchedPlayers.length})
                </span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {matchedPlayers.map((player: any) => (
                    <div
                      key={player.id}
                      onClick={() => {
                        onSelectPlayer(player.id);
                        onClose();
                      }}
                      className="py-2 px-1 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <img
                            src={player.photo}
                            alt={player.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {player.name}
                        </span>
                        <span className="text-[10px] text-slate-400">({player.team})</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leagues */}
            {matchedLeagues.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                  Campionati ({matchedLeagues.length})
                </span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {matchedLeagues.map((lg) => (
                    <div
                      key={lg.id}
                      onClick={() => {
                        onSelectLeague(lg.id);
                        onClose();
                      }}
                      className="py-2 px-1 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                          {lg.name.slice(0, 2)}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {lg.name}
                        </span>
                        <span className="text-[10px] text-slate-400">({lg.country})</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {normalizedQuery.length > 0 &&
              matchedTeams.length === 0 &&
              matchedPlayers.length === 0 &&
              matchedLeagues.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400">
                  Nessun risultato trovato per &quot;{query}&quot;
                </div>
              )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
