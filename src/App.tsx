/**
 * ScalperLab - Mobile-First Quantitative Football Statistics App
 * Complete Visual Layer (UI only with mock data) in Italian
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeMode } from './tokens';
import { MATCHES_DATA, LEAGUES_DATA, MatchItem } from './data/mockData';

// Common Components
import { LaunchScreen } from './components/common/LaunchScreen';
import { Header } from './components/common/Header';
import { BottomDock, NavTabId } from './components/common/BottomDock';
import { DateStrip } from './components/common/DateStrip';
import { LiveNowBar } from './components/common/LiveNowBar';
import { SponsorSlot } from './components/common/SponsorSlot';
import { SearchOverlay } from './components/common/SearchOverlay';
import { MenuDrawer } from './components/common/MenuDrawer';

// Match Components
import { MatchCard } from './components/match/MatchCard';
import { MatchPreMatchView } from './components/match/MatchPreMatchView';
import { MatchLiveFinishedView } from './components/match/MatchLiveFinishedView';

// Dedicated Views
import { TeamView } from './components/team/TeamView';
import { LeagueView } from './components/league/LeagueView';
import { PlayerView } from './components/player/PlayerView';
import { RefereeView } from './components/referee/RefereeView';
import { CalculatorView } from './components/calculator/CalculatorView';
import { MiglioriGiocatoriView } from './components/leaderboards/MiglioriGiocatoriView';
import { MiglioriMatchupView } from './components/leaderboards/MiglioriMatchupView';
import { LineeGuidaView } from './components/guidelines/LineeGuidaView';

import { ChevronRight, RefreshCw, Share2 } from 'lucide-react';

type ActiveView =
  | { type: 'home' }
  | { type: 'match'; matchId: string }
  | { type: 'team'; teamId: string }
  | { type: 'league'; leagueId: string }
  | { type: 'player'; playerId: string }
  | { type: 'referee'; refereeId: string }
  | { type: 'players_leaderboard' }
  | { type: 'matchups_leaderboard' }
  | { type: 'calculator' }
  | { type: 'guidelines' };

export default function App() {
  // Navigation stack state
  const [historyStack, setHistoryStack] = useState<ActiveView[]>([{ type: 'home' }]);
  const [currentView, setCurrentView] = useState<ActiveView>({ type: 'home' });

  // Navigation dock tab
  const [activeDockTab, setActiveDockTab] = useState<NavTabId>('home');

  // Home page date & filter states
  const [selectedDate, setSelectedDate] = useState('Oggi');
  const [homeFilter, setHomeFilter] = useState<'all' | 'live'>('all');
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  // Overlays
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Theme state: Chiaro / Scuro / Auto
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  // Handle dark mode class on document
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto: system preference
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [themeMode]);

  // Navigate to new view with push history
  const navigateTo = (view: ActiveView) => {
    setHistoryStack((prev) => [...prev, view]);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync dock active tab if applicable
    if (view.type === 'home') setActiveDockTab('home');
    else if (view.type === 'players_leaderboard') setActiveDockTab('players');
    else if (view.type === 'matchups_leaderboard') setActiveDockTab('matchups');
    else if (view.type === 'calculator') setActiveDockTab('calc');
    else if (view.type === 'guidelines') setActiveDockTab('menu');
  };

  // Back button handler
  const handleBack = () => {
    if (historyStack.length > 1) {
      const nextStack = historyStack.slice(0, -1);
      const prevView = nextStack[nextStack.length - 1];
      setHistoryStack(nextStack);
      setCurrentView(prevView);
    } else {
      navigateTo({ type: 'home' });
    }
  };

  // Dock tab change handler
  const handleDockTabChange = (tabId: NavTabId) => {
    setActiveDockTab(tabId);
    switch (tabId) {
      case 'home':
        navigateTo({ type: 'home' });
        break;
      case 'players':
        navigateTo({ type: 'players_leaderboard' });
        break;
      case 'matchups':
        navigateTo({ type: 'matchups_leaderboard' });
        break;
      case 'calc':
        navigateTo({ type: 'calculator' });
        break;
      case 'menu':
        setIsMenuOpen(true);
        break;
    }
  };

  // Pull to refresh simulation
  const triggerRefresh = () => {
    setIsPullRefreshing(true);
    setTimeout(() => {
      setIsPullRefreshing(false);
    }, 700);
  };

  // Find live matches
  const liveMatches = MATCHES_DATA.filter((m) => m.status === 'live');
  const liveMatchSnippet =
    liveMatches.length > 0
      ? `${liveMatches[0].homeTeam.name} ${liveMatches[0].homeTeam.score} - ${liveMatches[0].awayTeam.score} ${liveMatches[0].awayTeam.name} (${liveMatches[0].timeOrMinute})`
      : 'Nessun match live al momento';

  // Filter home matches
  const filteredHomeMatches = MATCHES_DATA.filter((m) => {
    if (homeFilter === 'live') return m.status === 'live';
    if (selectedDate === 'Ieri') return m.dateLabel === 'Ieri' || m.status === 'finished';
    if (selectedDate === 'Domani') return m.dateLabel === 'Domani';
    return m.dateLabel === 'Oggi' || m.status === 'live' || m.status === 'pre';
  });

  // Group matches by league
  const groupedMatches = LEAGUES_DATA.map((league) => ({
    league,
    matches: filteredHomeMatches.filter((m) => m.leagueId === league.id),
  })).filter((group) => group.matches.length > 0);

  // Render Current Main Body Content
  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'match': {
        const match =
          MATCHES_DATA.find((m) => m.id === currentView.matchId) || MATCHES_DATA[0];

        if (match.status === 'pre') {
          return (
            <MatchPreMatchView
              match={match}
              onOpenTeam={(teamId) => navigateTo({ type: 'team', teamId })}
              onOpenLeague={(leagueId) => navigateTo({ type: 'league', leagueId })}
              onOpenPlayer={(playerId) => navigateTo({ type: 'player', playerId })}
              onOpenReferee={(refereeId) => navigateTo({ type: 'referee', refereeId })}
            />
          );
        } else {
          return (
            <MatchLiveFinishedView
              match={match}
              onOpenTeam={(teamId) => navigateTo({ type: 'team', teamId })}
              onOpenLeague={(leagueId) => navigateTo({ type: 'league', leagueId })}
              onOpenPlayer={(playerId) => navigateTo({ type: 'player', playerId })}
              onOpenReferee={(refereeId) => navigateTo({ type: 'referee', refereeId })}
            />
          );
        }
      }

      case 'team':
        return (
          <TeamView
            teamId={currentView.teamId}
            onOpenMatch={(matchId) => navigateTo({ type: 'match', matchId })}
            onOpenLeague={(leagueId) => navigateTo({ type: 'league', leagueId })}
            onOpenPlayer={(playerId) => navigateTo({ type: 'player', playerId })}
          />
        );

      case 'league':
        return (
          <LeagueView
            leagueId={currentView.leagueId}
            onOpenMatch={(matchId) => navigateTo({ type: 'match', matchId })}
            onOpenTeam={(teamId) => navigateTo({ type: 'team', teamId })}
            onOpenPlayer={(playerId) => navigateTo({ type: 'player', playerId })}
            onOpenReferee={(refereeId) => navigateTo({ type: 'referee', refereeId })}
          />
        );

      case 'player':
        return (
          <PlayerView
            playerId={currentView.playerId}
            onOpenTeam={(teamId) => navigateTo({ type: 'team', teamId })}
          />
        );

      case 'referee':
        return (
          <RefereeView
            refereeId={currentView.refereeId}
            onOpenMatch={(matchId) => navigateTo({ type: 'match', matchId })}
          />
        );

      case 'players_leaderboard':
        return (
          <MiglioriGiocatoriView
            onOpenPlayer={(playerId) => navigateTo({ type: 'player', playerId })}
            onOpenMatch={(matchId) => navigateTo({ type: 'match', matchId })}
          />
        );

      case 'matchups_leaderboard':
        return (
          <MiglioriMatchupView
            onOpenMatch={(matchId) => navigateTo({ type: 'match', matchId })}
          />
        );

      case 'calculator':
        return <CalculatorView />;

      case 'guidelines':
        return <LineeGuidaView />;

      case 'home':
      default:
        return (
          <div className="pb-28">
            {/* Date Strip & Filter */}
            <DateStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              filterMode={homeFilter}
              onChangeFilter={setHomeFilter}
              liveCount={liveMatches.length}
            />

            {/* Pull down indicator simulation */}
            {isPullRefreshing && (
              <div className="py-2 flex items-center justify-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Aggiornamento quote e statistiche...</span>
              </div>
            )}

            {/* Slim Live Now Bar if matches are in play */}
            {liveMatches.length > 0 && homeFilter === 'all' && (
              <LiveNowBar
                matchCount={liveMatches.length}
                matchSnippet={liveMatchSnippet}
                onTap={() => navigateTo({ type: 'match', matchId: liveMatches[0].id })}
              />
            )}

            {/* Matches Grouped by League */}
            <div className="px-3 pt-2 space-y-4">
              {groupedMatches.map(({ league, matches }, groupIdx) => (
                <div key={league.id} className="space-y-1.5">
                  {/* League Header with Logo and Name - Tap opens league */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigateTo({ type: 'league', leagueId: league.id })}
                    className="w-full flex items-center justify-between py-2 px-1 text-left group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* League Logo button with dark theme support */}
                      <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 p-0.5 shrink-0 flex items-center justify-center border border-slate-300/40 dark:border-slate-700">
                        <span className="text-[10px] font-black text-slate-800 dark:text-emerald-400">
                          {league.name.slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">
                          {league.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          · {league.country}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <span className="font-mono text-[10px]">Classifica</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.button>

                  {/* League Matches */}
                  <div className="space-y-1">
                    {matches.map((m) => (
                      <MatchCard
                        key={m.id}
                        match={m}
                        onClick={() => navigateTo({ type: 'match', matchId: m.id })}
                        onOpenHomeTeam={() =>
                          navigateTo({ type: 'team', teamId: m.homeTeam.id })
                        }
                        onOpenAwayTeam={() =>
                          navigateTo({ type: 'team', teamId: m.awayTeam.id })
                        }
                      />
                    ))}
                  </div>

                  {/* Sponsor / Odds banner slot between sections */}
                  {groupIdx === 0 && (
                    <SponsorSlot
                      label="ScalperLab Odds Engine"
                      tagline="Inter vs Juve: Valore su Lautaro Martinez Over 0.5 Tiri in Porta"
                      oddsHighlight="@1.85 (Fair @1.54)"
                    />
                  )}
                </div>
              ))}

              {groupedMatches.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 my-4">
                  Nessuna partita programmata per i filtri selezionati.
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  // Determine subpage header title & right action
  const isSubPage = currentView.type !== 'home';
  let subpageTitle = '';
  let subpageSubtitle = '';

  if (currentView.type === 'match') {
    const m = MATCHES_DATA.find((match) => match.id === currentView.matchId);
    if (m) {
      subpageTitle = `${m.homeTeam.shortName} vs ${m.awayTeam.shortName}`;
      subpageSubtitle = `${m.leagueName} · ${m.timeOrMinute}`;
    }
  } else if (currentView.type === 'team') {
    subpageTitle = 'Scheda Squadra';
  } else if (currentView.type === 'league') {
    subpageTitle = 'Campionato';
  } else if (currentView.type === 'player') {
    subpageTitle = 'Scheda Calciatore';
  } else if (currentView.type === 'referee') {
    subpageTitle = 'Scheda Arbitro';
  } else if (currentView.type === 'players_leaderboard') {
    subpageTitle = 'Migliori Giocatori';
  } else if (currentView.type === 'matchups_leaderboard') {
    subpageTitle = 'Migliori Matchup';
  } else if (currentView.type === 'calculator') {
    subpageTitle = 'Calcolatore';
  } else if (currentView.type === 'guidelines') {
    subpageTitle = 'Linee Guida';
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex justify-center">
      {/* Animated Launch Logo Screen */}
      <LaunchScreen />

      {/* Mobile-First iPhone 390px Viewport Frame */}
      <div className="w-full max-w-[430px] min-h-screen bg-white dark:bg-[#0B0F17] shadow-2xl relative flex flex-col border-x border-slate-200/80 dark:border-slate-800/80">
        {/* Sticky Header */}
        <Header
          isSubPage={isSubPage}
          title={subpageTitle}
          subtitle={subpageSubtitle}
          onBack={handleBack}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMenu={() => setIsMenuOpen(true)}
          rightAction={
            isSubPage ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            ) : undefined
          }
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 w-full">{renderCurrentView()}</main>

        {/* Floating Bottom Dock with icon-only active label */}
        <BottomDock
          activeTab={activeDockTab}
          onChangeTab={handleDockTabChange}
        />

        {/* Search Overlay */}
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectTeam={(teamId) => navigateTo({ type: 'team', teamId })}
          onSelectLeague={(leagueId) => navigateTo({ type: 'league', leagueId })}
          onSelectPlayer={(playerId) => navigateTo({ type: 'player', playerId })}
        />

        {/* Menu Drawer */}
        <MenuDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={(viewId) => {
            if (viewId === 'home') navigateTo({ type: 'home' });
            else if (viewId === 'calc') navigateTo({ type: 'calculator' });
            else if (viewId === 'tiri_squadre')
              navigateTo({ type: 'league', leagueId: 'serie-a' });
            else if (viewId === 'players')
              navigateTo({ type: 'players_leaderboard' });
            else if (viewId === 'matchups')
              navigateTo({ type: 'matchups_leaderboard' });
            else if (viewId === 'linee_guida')
              navigateTo({ type: 'guidelines' });
          }}
          themeMode={themeMode}
          onChangeTheme={setThemeMode}
        />
      </div>
    </div>
  );
}
