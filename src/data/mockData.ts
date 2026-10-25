/**
 * ScalperLab Comprehensive Mock Data
 * Italian football datasets, realistic Serie A stats, shot coordinates, lineups and referees.
 */

export interface FormDot {
  result: 'V' | 'P' | 'S';
  opponent: string;
  score: string;
  isHome: boolean;
}

export interface PlayerLineup {
  id: string;
  name: string;
  initials: string;
  number: number;
  role: 'P' | 'D' | 'C' | 'A';
  isCaptain?: boolean;
  rating?: number;
  yellowCards?: number;
  redCard?: boolean;
  subInMinute?: number;
  subOutMinute?: number;
  gridPos: { x: number; y: number }; // Percentage 0-100 on half pitch
}

export interface ShotEvent {
  id: string;
  player: string;
  team: 'home' | 'away';
  minute: number;
  x: number; // 0-100 on pitch
  y: number; // 0-100 on pitch
  xG: number;
  outcome: 'Gol' | 'Parato' | 'Fuori' | 'Murato';
  bodyPart: 'Destro' | 'Sinistro' | 'Testa';
  situation: 'Azione' | 'Palla inattiva' | 'Rigore' | 'Contropiede';
}

export interface MatchTimelineEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'sub' | 'var';
  team: 'home' | 'away';
  player: string;
  assistOrSubWith?: string;
  detail?: string;
}

export interface MatchItem {
  id: string;
  leagueId: string;
  leagueName: string;
  leagueLogo: string;
  leagueLogoDark: string;
  status: 'pre' | 'live' | 'finished';
  dateLabel: string; // 'Oggi', 'Domani', 'Ieri', 'Sab 25 Ott', etc.
  timeOrMinute: string; // '20:45' or '67\'' or 'FT'
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    crest: string;
    form: FormDot[];
    score?: number;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    crest: string;
    form: FormDot[];
    score?: number;
  };
  venue: {
    stadium: string;
    city: string;
    capacity: string;
    weather: {
      condition: string;
      icon: 'sun' | 'rain' | 'cloud' | 'wind';
      temp: string;
      wind: string;
    };
    referee: {
      name: string;
      id: string;
      avgYellows: number;
      avgFouls: number;
    };
  };
  reliability: {
    score: number; // e.g. 8.4
    stakeRecommendation: string; // '2.5%'
    valueOdds: number; // e.g. 1.82 vs 1.58
    market: string; // 'Lautaro Martinez Over 0.5 Tiri in Porta'
    riskLevel: 'Basso' | 'Medio' | 'Alto';
  };
  statsComparison: {
    category: string;
    label: string;
    homeValue: number;
    awayValue: number;
    homeExpected?: number;
    awayExpected?: number;
    isExpected?: boolean;
  }[];
  highlightNumbers: {
    label: string;
    value: string;
    rankBadge: string;
    teamName: string;
  }[];
  topPlayersComparison: {
    home: { name: string; initials: string; rating: number; goals: number; shotsPer90: number };
    away: { name: string; initials: string; rating: number; goals: number; shotsPer90: number };
  }[];
  lineups: {
    home: {
      formation: string;
      coach: string;
      startingXI: PlayerLineup[];
      bench: { id: string; name: string; number: number; role: string; rating?: number }[];
    };
    away: {
      formation: string;
      coach: string;
      startingXI: PlayerLineup[];
      bench: { id: string; name: string; number: number; role: string; rating?: number }[];
    };
  };
  shots?: ShotEvent[];
  timeline?: MatchTimelineEvent[];
  momentum?: { minute: number; value: number }[]; // -100 (away dominant) to +100 (home dominant)
}

export interface StandingRow {
  rank: number;
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ('V' | 'P' | 'S')[];
  zone: 'champions' | 'europa' | 'conference' | 'neutral' | 'relegation';
}

export const LEAGUES_DATA = [
  {
    id: 'serie-a',
    name: 'Serie A',
    country: 'Italia',
    season: '2024/25',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    logoDark: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    standings: [
      { rank: 1, teamId: 'inter', teamName: 'Inter', played: 9, won: 7, drawn: 1, lost: 1, goalsFor: 22, goalsAgainst: 7, goalDiff: 15, points: 22, form: ['V', 'V', 'V', 'P', 'V'], zone: 'champions' },
      { rank: 2, teamId: 'napoli', teamName: 'Napoli', played: 9, won: 7, drawn: 1, lost: 1, goalsFor: 18, goalsAgainst: 5, goalDiff: 13, points: 22, form: ['V', 'V', 'V', 'V', 'P'], zone: 'champions' },
      { rank: 3, teamId: 'juventus', teamName: 'Juventus', played: 9, won: 5, drawn: 4, lost: 0, goalsFor: 15, goalsAgainst: 2, goalDiff: 13, points: 19, form: ['V', 'P', 'V', 'P', 'V'], zone: 'champions' },
      { rank: 4, teamId: 'atalanta', teamName: 'Atalanta', played: 9, won: 6, drawn: 1, lost: 2, goalsFor: 26, goalsAgainst: 12, goalDiff: 14, points: 19, form: ['V', 'V', 'V', 'V', 'S'], zone: 'champions' },
      { rank: 5, teamId: 'milan', teamName: 'Milan', played: 9, won: 5, drawn: 2, lost: 2, goalsFor: 17, goalsAgainst: 10, goalDiff: 7, points: 17, form: ['P', 'V', 'S', 'V', 'V'], zone: 'europa' },
      { rank: 6, teamId: 'lazio', teamName: 'Lazio', played: 9, won: 5, drawn: 1, lost: 3, goalsFor: 17, goalsAgainst: 12, goalDiff: 5, points: 16, form: ['V', 'V', 'S', 'V', 'V'], zone: 'conference' },
      { rank: 7, teamId: 'fiorentina', teamName: 'Fiorentina', played: 9, won: 4, drawn: 4, lost: 1, goalsFor: 15, goalsAgainst: 9, goalDiff: 6, points: 16, form: ['V', 'V', 'V', 'P', 'V'], zone: 'neutral' },
      { rank: 8, teamId: 'bologna', teamName: 'Bologna', played: 9, won: 3, drawn: 5, lost: 1, goalsFor: 12, goalsAgainst: 11, goalDiff: 1, points: 14, form: ['P', 'P', 'V', 'P', 'P'], zone: 'neutral' },
      { rank: 9, teamId: 'roma', teamName: 'Roma', played: 9, won: 3, drawn: 3, lost: 3, goalsFor: 10, goalsAgainst: 11, goalDiff: -1, points: 12, form: ['S', 'V', 'P', 'S', 'P'], zone: 'neutral' },
      { rank: 10, teamId: 'torino', teamName: 'Torino', played: 9, won: 3, drawn: 2, lost: 4, goalsFor: 14, goalsAgainst: 15, goalDiff: -1, points: 11, form: ['S', 'S', 'S', 'V', 'S'], zone: 'neutral' },
      { rank: 18, teamId: 'monza', teamName: 'Monza', played: 9, won: 1, drawn: 4, lost: 4, goalsFor: 8, goalsAgainst: 12, goalDiff: -4, points: 7, form: ['P', 'V', 'P', 'S', 'S'], zone: 'relegation' },
      { rank: 19, teamId: 'venezia', teamName: 'Venezia', played: 9, won: 1, drawn: 2, lost: 6, goalsFor: 7, goalsAgainst: 16, goalDiff: -9, points: 5, form: ['S', 'S', 'P', 'S', 'V'], zone: 'relegation' },
      { rank: 20, teamId: 'lecce', teamName: 'Lecce', played: 9, won: 1, drawn: 2, lost: 6, goalsFor: 4, goalsAgainst: 19, goalDiff: -15, points: 5, form: ['S', 'S', 'S', 'S', 'S'], zone: 'relegation' },
    ] as StandingRow[],
  },
  {
    id: 'premier-league',
    name: 'Premier League',
    country: 'Inghilterra',
    season: '2024/25',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=120&auto=format&fit=crop&q=80',
    logoDark: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=120&auto=format&fit=crop&q=80',
    standings: [
      { rank: 1, teamId: 'man-city', teamName: 'Manchester City', played: 9, won: 7, drawn: 2, lost: 0, goalsFor: 20, goalsAgainst: 9, goalDiff: 11, points: 23, form: ['V', 'V', 'P', 'V', 'V'], zone: 'champions' },
      { rank: 2, teamId: 'liverpool', teamName: 'Liverpool', played: 9, won: 7, drawn: 1, lost: 1, goalsFor: 17, goalsAgainst: 5, goalDiff: 12, points: 22, form: ['P', 'V', 'V', 'V', 'V'], zone: 'champions' },
      { rank: 3, teamId: 'arsenal', teamName: 'Arsenal', played: 9, won: 5, drawn: 3, lost: 1, goalsFor: 17, goalsAgainst: 10, goalDiff: 7, points: 18, form: ['P', 'S', 'V', 'V', 'P'], zone: 'champions' },
      { rank: 4, teamId: 'aston-villa', teamName: 'Aston Villa', played: 9, won: 5, drawn: 3, lost: 1, goalsFor: 16, goalsAgainst: 11, goalDiff: 5, points: 18, form: ['P', 'V', 'P', 'P', 'V'], zone: 'champions' },
    ] as StandingRow[],
  },
];

export const MATCHES_DATA: MatchItem[] = [
  // 1. PRE-MATCH FEATURED (Inter vs Juventus)
  {
    id: 'match-inter-juve',
    leagueId: 'serie-a',
    leagueName: 'Serie A',
    leagueLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    leagueLogoDark: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    status: 'pre',
    dateLabel: 'Oggi',
    timeOrMinute: '20:45',
    homeTeam: {
      id: 'inter',
      name: 'Inter',
      shortName: 'INT',
      crest: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=80&auto=format&fit=crop&q=80',
      form: [
        { result: 'V', opponent: 'Roma', score: '1-0', isHome: false },
        { result: 'V', opponent: 'Young Boys', score: '1-0', isHome: false },
        { result: 'V', opponent: 'Torino', score: '3-2', isHome: true },
        { result: 'V', opponent: 'Stella Rossa', score: '4-0', isHome: true },
        { result: 'V', opponent: 'Udinese', score: '3-2', isHome: false },
      ],
    },
    awayTeam: {
      id: 'juventus',
      name: 'Juventus',
      shortName: 'JUV',
      crest: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
      form: [
        { result: 'S', opponent: 'Stoccarda', score: '0-1', isHome: true },
        { result: 'V', opponent: 'Lazio', score: '1-0', isHome: true },
        { result: 'P', opponent: 'Cagliari', score: '1-1', isHome: true },
        { result: 'V', opponent: 'Lipsia', score: '3-2', isHome: false },
        { result: 'V', opponent: 'Genoa', score: '3-0', isHome: false },
      ],
    },
    venue: {
      stadium: 'Stadio Giuseppe Meazza (San Siro)',
      city: 'Milano',
      capacity: '75.923',
      weather: {
        condition: 'Sereno',
        icon: 'sun',
        temp: '17°C',
        wind: '8 km/h NW',
      },
      referee: {
        name: 'Davide Massa',
        id: 'ref-massa',
        avgYellows: 4.8,
        avgFouls: 25.4,
      },
    },
    reliability: {
      score: 8.6,
      stakeRecommendation: '2.5% (25€)',
      valueOdds: 1.85,
      market: 'Lautaro Martínez Over 0.5 Tiri in Porta',
      riskLevel: 'Basso',
    },
    statsComparison: [
      { category: 'Attesi', label: 'Tiri totali', homeValue: 16.2, awayValue: 11.4, isExpected: true },
      { category: 'Attesi', label: 'Tiri in porta', homeValue: 5.8, awayValue: 3.6, isExpected: true },
      { category: 'Attesi', label: 'Corner', homeValue: 6.4, awayValue: 4.2, isExpected: true },
      { category: 'Attesi', label: 'Falli', homeValue: 11.5, awayValue: 13.8, isExpected: true },
      { category: 'Attesi', label: 'Fuorigioco', homeValue: 1.8, awayValue: 1.4, isExpected: true },
      { category: 'Stagione', label: 'Tiri totali', homeValue: 17.1, awayValue: 12.3, isExpected: false },
      { category: 'Stagione', label: 'Tiri in porta', homeValue: 6.1, awayValue: 4.1, isExpected: false },
      { category: 'Stagione', label: 'Corner', homeValue: 6.8, awayValue: 4.9, isExpected: false },
      { category: 'Stagione', label: 'Falli', homeValue: 10.9, awayValue: 12.4, isExpected: false },
      { category: 'Stagione', label: 'Fuorigioco', homeValue: 2.1, awayValue: 1.6, isExpected: false },
    ],
    highlightNumbers: [
      { label: 'Tiri in porta concessi (casa)', value: '2.4', rankBadge: '1ª su 20', teamName: 'Inter' },
      { label: 'Possesso palla medio', value: '59.6%', rankBadge: '2ª su 20', teamName: 'Inter' },
      { label: 'Gol subiti su azione', value: '1', rankBadge: '1ª su 20', teamName: 'Juventus' },
      { label: 'Clean sheet stagionali', value: '7', rankBadge: '1ª su 20', teamName: 'Juventus' },
    ],
    topPlayersComparison: [
      {
        home: { name: 'L. Martínez', initials: 'LM', rating: 7.84, goals: 6, shotsPer90: 3.8 },
        away: { name: 'D. Vlahović', initials: 'DV', rating: 7.42, goals: 5, shotsPer90: 3.4 },
      },
      {
        home: { name: 'M. Thuram', initials: 'MT', rating: 7.71, goals: 7, shotsPer90: 3.1 },
        away: { name: 'K. Yildiz', initials: 'KY', rating: 7.18, goals: 2, shotsPer90: 2.2 },
      },
      {
        home: { name: 'N. Barella', initials: 'NB', rating: 7.55, goals: 1, shotsPer90: 1.6 },
        away: { name: 'T. Koopmeiners', initials: 'TK', rating: 7.35, goals: 2, shotsPer90: 2.5 },
      },
    ],
    lineups: {
      home: {
        formation: '3-5-2',
        coach: 'Simone Inzaghi',
        startingXI: [
          { id: 'p1', name: 'Y. Sommer', initials: 'YS', number: 1, role: 'P', rating: 7.1, gridPos: { x: 50, y: 92 } },
          { id: 'p2', name: 'B. Pavard', initials: 'BP', number: 28, role: 'D', rating: 7.3, gridPos: { x: 24, y: 76 } },
          { id: 'p3', name: 'S. de Vrij', initials: 'SD', number: 6, role: 'D', rating: 7.2, gridPos: { x: 50, y: 78 } },
          { id: 'p4', name: 'A. Bastoni', initials: 'AB', number: 95, role: 'D', rating: 7.6, gridPos: { x: 76, y: 76 } },
          { id: 'p5', name: 'M. Darmian', initials: 'MD', number: 36, role: 'C', rating: 7.0, gridPos: { x: 12, y: 54 } },
          { id: 'p6', name: 'N. Barella', initials: 'NB', number: 23, role: 'C', rating: 7.6, isCaptain: true, gridPos: { x: 32, y: 55 } },
          { id: 'p7', name: 'H. Çalhanoğlu', initials: 'HC', number: 20, role: 'C', rating: 7.5, gridPos: { x: 50, y: 62 } },
          { id: 'p8', name: 'H. Mkhitaryan', initials: 'HM', number: 22, role: 'C', rating: 7.2, gridPos: { x: 68, y: 55 } },
          { id: 'p9', name: 'F. Dimarco', initials: 'FD', number: 32, role: 'C', rating: 7.8, gridPos: { x: 88, y: 54 } },
          { id: 'p10', name: 'M. Thuram', initials: 'MT', number: 9, role: 'A', rating: 7.7, gridPos: { x: 36, y: 28 } },
          { id: 'p11', name: 'L. Martínez', initials: 'LM', number: 10, role: 'A', rating: 7.9, gridPos: { x: 64, y: 26 } },
        ],
        bench: [
          { id: 'b1', name: 'J. Martínez', number: 13, role: 'Portiere' },
          { id: 'b2', name: 'Y. Bisseck', number: 31, role: 'Difensore', rating: 6.8 },
          { id: 'b3', name: 'D. Dumfries', number: 2, role: 'Centrocampista', rating: 7.1 },
          { id: 'b4', name: 'P. Zieliński', number: 7, role: 'Centrocampista', rating: 6.9 },
          { id: 'b5', name: 'D. Frattesi', number: 16, role: 'Centrocampista', rating: 7.2 },
          { id: 'b6', name: 'M. Taremi', number: 99, role: 'Attaccante', rating: 6.7 },
        ],
      },
      away: {
        formation: '4-2-3-1',
        coach: 'Thiago Motta',
        startingXI: [
          { id: 'a1', name: 'M. Di Gregorio', initials: 'MD', number: 29, role: 'P', rating: 7.4, gridPos: { x: 50, y: 92 } },
          { id: 'a2', name: 'N. Savona', initials: 'NS', number: 37, role: 'D', rating: 6.9, gridPos: { x: 18, y: 76 } },
          { id: 'a3', name: 'P. Kalulu', initials: 'PK', number: 15, role: 'D', rating: 7.2, gridPos: { x: 38, y: 78 } },
          { id: 'a4', name: 'Danilo', initials: 'DA', number: 6, role: 'D', rating: 6.8, isCaptain: true, gridPos: { x: 62, y: 78 } },
          { id: 'a5', name: 'J. Cabal', initials: 'JC', number: 32, role: 'D', rating: 7.0, gridPos: { x: 82, y: 76 } },
          { id: 'a6', name: 'M. Locatelli', initials: 'ML', number: 5, role: 'C', rating: 7.1, gridPos: { x: 38, y: 60 } },
          { id: 'a7', name: 'K. Thuram', initials: 'KT', number: 19, role: 'C', rating: 7.2, gridPos: { x: 62, y: 60 } },
          { id: 'a8', name: 'F. Conceição', initials: 'FC', number: 7, role: 'A', rating: 7.3, gridPos: { x: 20, y: 42 } },
          { id: 'a9', name: 'W. McKennie', initials: 'WM', number: 16, role: 'C', rating: 7.0, gridPos: { x: 50, y: 44 } },
          { id: 'a10', name: 'T. Weah', initials: 'TW', number: 22, role: 'A', rating: 7.1, gridPos: { x: 80, y: 42 } },
          { id: 'a11', name: 'D. Vlahović', initials: 'DV', number: 9, role: 'A', rating: 7.5, gridPos: { x: 50, y: 24 } },
        ],
        bench: [
          { id: 'ab1', name: 'M. Perin', number: 1, role: 'Portiere' },
          { id: 'ab2', name: 'F. Gatti', number: 4, role: 'Difensore', rating: 7.0 },
          { id: 'ab3', name: 'N. Fagioli', number: 21, role: 'Centrocampista', rating: 6.8 },
          { id: 'ab4', name: 'K. Yildiz', number: 10, role: 'Attaccante', rating: 7.2 },
          { id: 'ab5', name: 'S. Mbangula', number: 51, role: 'Attaccante', rating: 6.6 },
          { id: 'ab6', name: 'Douglas Luiz', number: 26, role: 'Centrocampista', rating: 6.7 },
        ],
      },
    },
  },

  // 2. LIVE MATCH FEATURED (Milan vs Napoli 1-1 at 67')
  {
    id: 'match-milan-napoli',
    leagueId: 'serie-a',
    leagueName: 'Serie A',
    leagueLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    leagueLogoDark: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    status: 'live',
    dateLabel: 'Oggi',
    timeOrMinute: "67'",
    homeTeam: {
      id: 'milan',
      name: 'Milan',
      shortName: 'MIL',
      crest: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
      score: 1,
      form: [
        { result: 'V', opponent: 'Club Brugge', score: '3-1', isHome: true },
        { result: 'V', opponent: 'Udinese', score: '1-0', isHome: true },
        { result: 'S', opponent: 'Fiorentina', score: '1-2', isHome: false },
        { result: 'S', opponent: 'Leverkusen', score: '0-1', isHome: false },
        { result: 'V', opponent: 'Lecce', score: '3-0', isHome: true },
      ],
    },
    awayTeam: {
      id: 'napoli',
      name: 'Napoli',
      shortName: 'NAP',
      crest: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=80&auto=format&fit=crop&q=80',
      score: 1,
      form: [
        { result: 'V', opponent: 'Lecce', score: '1-0', isHome: true },
        { result: 'V', opponent: 'Empoli', score: '1-0', isHome: false },
        { result: 'V', opponent: 'Como', score: '3-1', isHome: true },
        { result: 'V', opponent: 'Monza', score: '2-0', isHome: true },
        { result: 'P', opponent: 'Juventus', score: '0-0', isHome: false },
      ],
    },
    venue: {
      stadium: 'Stadio Giuseppe Meazza',
      city: 'Milano',
      capacity: '75.923',
      weather: {
        condition: 'Coperto',
        icon: 'cloud',
        temp: '15°C',
        wind: '12 km/h E',
      },
      referee: {
        name: 'Daniele Doveri',
        id: 'ref-doveri',
        avgYellows: 4.2,
        avgFouls: 23.8,
      },
    },
    reliability: {
      score: 8.8,
      stakeRecommendation: '3.0% (30€)',
      valueOdds: 2.10,
      market: 'Khvicha Kvaratskhelia Over 1.5 Tiri',
      riskLevel: 'Medio',
    },
    statsComparison: [
      { category: 'Live', label: 'Possesso palla', homeValue: 53, awayValue: 47 },
      { category: 'Live', label: 'Expected Goals (xG)', homeValue: 1.24, awayValue: 0.98 },
      { category: 'Live', label: 'Tiri totali', homeValue: 11, awayValue: 8 },
      { category: 'Live', label: 'Tiri in porta', homeValue: 4, awayValue: 3 },
      { category: 'Live', label: 'Occasioni nitide', homeValue: 2, awayValue: 1 },
      { category: 'Live', label: 'Corner', homeValue: 5, awayValue: 3 },
      { category: 'Live', label: 'Falli commessi', homeValue: 9, awayValue: 11 },
      { category: 'Live', label: 'Cartellini gialli', homeValue: 1, awayValue: 2 },
      { category: 'Live', label: 'Passaggi completati', homeValue: 382, awayValue: 341 },
      { category: 'Live', label: 'Fuorigioco', homeValue: 2, awayValue: 1 },
    ],
    highlightNumbers: [
      { label: 'Attacchi pericolosi', value: '38 - 31', rankBadge: 'Live', teamName: 'Milan' },
      { label: 'Tiri dentro l’area', value: '7', rankBadge: 'Milan', teamName: 'Milan' },
      { label: 'Contropiedi riusciti', value: '4', rankBadge: 'Napoli', teamName: 'Napoli' },
    ],
    topPlayersComparison: [
      {
        home: { name: 'C. Pulisic', initials: 'CP', rating: 7.91, goals: 1, shotsPer90: 2.4 },
        away: { name: 'R. Lukaku', initials: 'RL', rating: 7.45, goals: 1, shotsPer90: 2.1 },
      },
    ],
    lineups: {
      home: {
        formation: '4-2-3-1',
        coach: 'Paulo Fonseca',
        startingXI: [
          { id: 'm1', name: 'M. Maignan', initials: 'MM', number: 16, role: 'P', rating: 7.0, isCaptain: true, gridPos: { x: 50, y: 92 } },
          { id: 'm2', name: 'Emerson Royal', initials: 'ER', number: 22, role: 'D', rating: 6.6, yellowCards: 1, gridPos: { x: 18, y: 76 } },
          { id: 'm3', name: 'M. Thiaw', initials: 'MT', number: 28, role: 'D', rating: 6.9, gridPos: { x: 38, y: 78 } },
          { id: 'm4', name: 'S. Pavlović', initials: 'SP', number: 31, role: 'D', rating: 7.1, gridPos: { x: 62, y: 78 } },
          { id: 'm5', name: 'F. Terracciano', initials: 'FT', number: 42, role: 'D', rating: 6.7, gridPos: { x: 82, y: 76 } },
          { id: 'm6', name: 'Y. Fofana', initials: 'YF', number: 29, role: 'C', rating: 7.4, gridPos: { x: 36, y: 60 } },
          { id: 'm7', name: 'R. Loftus-Cheek', initials: 'RL', number: 8, role: 'C', rating: 6.8, gridPos: { x: 64, y: 60 } },
          { id: 'm8', name: 'S. Chukwueze', initials: 'SC', number: 21, role: 'A', rating: 7.3, subOutMinute: 62, gridPos: { x: 20, y: 42 } },
          { id: 'm9', name: 'C. Pulisic', initials: 'CP', number: 11, role: 'A', rating: 8.1, gridPos: { x: 50, y: 42 } },
          { id: 'm10', name: 'N. Okafor', initials: 'NO', number: 17, role: 'A', rating: 6.9, gridPos: { x: 80, y: 42 } },
          { id: 'm11', name: 'Á. Morata', initials: 'AM', number: 7, role: 'A', rating: 7.2, gridPos: { x: 50, y: 22 } },
        ],
        bench: [
          { id: 'mb1', name: 'R. Leão', number: 10, role: 'Attaccante', rating: 7.0 },
          { id: 'mb2', name: 'T. Abraham', number: 90, role: 'Attaccante' },
          { id: 'mb3', name: 'Y. Musah', number: 80, role: 'Centrocampista', rating: 6.7 },
        ],
      },
      away: {
        formation: '4-3-3',
        coach: 'Antonio Conte',
        startingXI: [
          { id: 'n1', name: 'A. Meret', initials: 'AM', number: 1, role: 'P', rating: 7.2, gridPos: { x: 50, y: 92 } },
          { id: 'n2', name: 'G. Di Lorenzo', initials: 'GD', number: 22, role: 'D', rating: 7.3, isCaptain: true, gridPos: { x: 18, y: 76 } },
          { id: 'n3', name: 'A. Rrahmani', initials: 'AR', number: 13, role: 'D', rating: 7.1, gridPos: { x: 38, y: 78 } },
          { id: 'n4', name: 'A. Buongiorno', initials: 'AB', number: 4, role: 'D', rating: 7.5, gridPos: { x: 62, y: 78 } },
          { id: 'n5', name: 'M. Olivera', initials: 'MO', number: 17, role: 'D', rating: 6.8, yellowCards: 1, gridPos: { x: 82, y: 76 } },
          { id: 'n6', name: 'A. Zambo Anguissa', initials: 'ZA', number: 99, role: 'C', rating: 7.2, gridPos: { x: 26, y: 58 } },
          { id: 'n7', name: 'B. Gilmour', initials: 'BG', number: 6, role: 'C', rating: 7.0, gridPos: { x: 50, y: 62 } },
          { id: 'n8', name: 'S. McTominay', initials: 'SM', number: 8, role: 'C', rating: 7.4, gridPos: { x: 74, y: 58 } },
          { id: 'n9', name: 'M. Politano', initials: 'MP', number: 21, role: 'A', rating: 6.9, gridPos: { x: 20, y: 35 } },
          { id: 'n10', name: 'R. Lukaku', initials: 'RL', number: 11, role: 'A', rating: 7.6, gridPos: { x: 50, y: 24 } },
          { id: 'n11', name: 'K. Kvaratskhelia', initials: 'KK', number: 77, role: 'A', rating: 7.7, yellowCards: 1, gridPos: { x: 80, y: 35 } },
        ],
        bench: [
          { id: 'nb1', name: 'G. Raspadori', number: 81, role: 'Attaccante' },
          { id: 'nb2', name: 'G. Simeone', number: 18, role: 'Attaccante' },
          { id: 'nb3', name: 'D. Neres', number: 7, role: 'Attaccante' },
        ],
      },
    },
    shots: [
      { id: 's1', player: 'Romelu Lukaku', team: 'away', minute: 5, x: 88, y: 48, xG: 0.42, outcome: 'Gol', bodyPart: 'Sinistro', situation: 'Azione' },
      { id: 's2', player: 'Álvaro Morata', team: 'home', minute: 18, x: 85, y: 54, xG: 0.18, outcome: 'Parato', bodyPart: 'Testa', situation: 'Palla inattiva' },
      { id: 's3', player: 'Christian Pulisic', team: 'home', minute: 43, x: 84, y: 44, xG: 0.36, outcome: 'Gol', bodyPart: 'Destro', situation: 'Azione' },
      { id: 's4', player: 'Khvicha Kvaratskhelia', team: 'away', minute: 31, x: 74, y: 32, xG: 0.08, outcome: 'Fuori', bodyPart: 'Destro', situation: 'Azione' },
      { id: 's5', player: 'Samuel Chukwueze', team: 'home', minute: 51, x: 82, y: 62, xG: 0.12, outcome: 'Murato', bodyPart: 'Sinistro', situation: 'Azione' },
      { id: 's6', player: 'Scott McTominay', team: 'away', minute: 58, x: 79, y: 48, xG: 0.22, outcome: 'Parato', bodyPart: 'Testa', situation: 'Palla inattiva' },
      { id: 's7', player: 'Youssouf Fofana', team: 'home', minute: 64, x: 72, y: 50, xG: 0.05, outcome: 'Fuori', bodyPart: 'Destro', situation: 'Azione' },
    ],
    timeline: [
      { minute: 5, type: 'goal', team: 'away', player: 'Romelu Lukaku', assistOrSubWith: 'Zambo Anguissa', detail: 'Tiro preciso nell’angolino basso' },
      { minute: 28, type: 'yellow_card', team: 'away', player: 'Mathías Olivera', detail: 'Trattenuta tattica' },
      { minute: 43, type: 'goal', team: 'home', player: 'Christian Pulisic', assistOrSubWith: 'Youssouf Fofana', detail: 'Inserimento centrale e rasoterra' },
      { minute: 45, type: 'var', team: 'home', player: 'Controllo VAR', detail: 'Confermato gol regolare per posizione in linea' },
      { minute: 45, type: 'sub', team: 'home', player: 'Intervallo', detail: '1 - 1' },
      { minute: 54, type: 'yellow_card', team: 'home', player: 'Emerson Royal', detail: 'Fallo su Kvaratskhelia' },
      { minute: 62, type: 'sub', team: 'home', player: 'Rafael Leão', assistOrSubWith: 'Samuel Chukwueze', detail: 'Sostituzione tattica' },
      { minute: 65, type: 'yellow_card', team: 'away', player: 'Khvicha Kvaratskhelia', detail: 'Proteste' },
    ],
    momentum: [
      { minute: 0, value: 0 },
      { minute: 5, value: -60 },
      { minute: 15, value: 15 },
      { minute: 25, value: 45 },
      { minute: 35, value: -20 },
      { minute: 43, value: 75 },
      { minute: 45, value: 30 },
      { minute: 55, value: -35 },
      { minute: 60, value: 20 },
      { minute: 67, value: 55 },
    ],
  },

  // 3. FINISHED MATCH (Roma vs Lazio 2-0)
  {
    id: 'match-roma-lazio',
    leagueId: 'serie-a',
    leagueName: 'Serie A',
    leagueLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    leagueLogoDark: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    status: 'finished',
    dateLabel: 'Ieri',
    timeOrMinute: 'FT',
    homeTeam: {
      id: 'roma',
      name: 'Roma',
      shortName: 'ROM',
      crest: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
      score: 2,
      form: [
        { result: 'V', opponent: 'Lazio', score: '2-0', isHome: true },
        { result: 'V', opponent: 'Dinamo Kiev', score: '1-0', isHome: true },
        { result: 'S', opponent: 'Inter', score: '0-1', isHome: true },
        { result: 'P', opponent: 'Monza', score: '1-1', isHome: false },
        { result: 'S', opponent: 'Elfsborg', score: '0-1', isHome: false },
      ],
    },
    awayTeam: {
      id: 'lazio',
      name: 'Lazio',
      shortName: 'LAZ',
      crest: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=80&auto=format&fit=crop&q=80',
      score: 0,
      form: [
        { result: 'S', opponent: 'Roma', score: '0-2', isHome: false },
        { result: 'V', opponent: 'Twente', score: '2-0', isHome: false },
        { result: 'S', opponent: 'Juventus', score: '0-1', isHome: false },
        { result: 'V', opponent: 'Empoli', score: '2-1', isHome: true },
        { result: 'V', opponent: 'Nizza', score: '4-1', isHome: true },
      ],
    },
    venue: {
      stadium: 'Stadio Olimpico',
      city: 'Roma',
      capacity: '70.634',
      weather: {
        condition: 'Sereno',
        icon: 'sun',
        temp: '19°C',
        wind: '6 km/h S',
      },
      referee: {
        name: 'Simone Sozza',
        id: 'ref-sozza',
        avgYellows: 5.2,
        avgFouls: 27.1,
      },
    },
    reliability: {
      score: 8.2,
      stakeRecommendation: '2.0% (20€)',
      valueOdds: 1.95,
      market: 'Paulo Dybala Over 0.5 Tiri in Porta (Vinta)',
      riskLevel: 'Basso',
    },
    statsComparison: [
      { category: 'Finale', label: 'Possesso palla', homeValue: 49, awayValue: 51 },
      { category: 'Finale', label: 'Expected Goals (xG)', homeValue: 1.88, awayValue: 0.64 },
      { category: 'Finale', label: 'Tiri totali', homeValue: 14, awayValue: 9 },
      { category: 'Finale', label: 'Tiri in porta', homeValue: 6, awayValue: 2 },
      { category: 'Finale', label: 'Occasioni nitide', homeValue: 3, awayValue: 0 },
      { category: 'Finale', label: 'Corner', homeValue: 6, awayValue: 4 },
      { category: 'Finale', label: 'Falli commessi', homeValue: 16, awayValue: 14 },
      { category: 'Finale', label: 'Cartellini gialli', homeValue: 3, awayValue: 4 },
    ],
    highlightNumbers: [
      { label: 'xG Roma', value: '1.88', rankBadge: 'Partita', teamName: 'Roma' },
      { label: 'Tiri in porta concessi', value: '2', rankBadge: 'Difesa', teamName: 'Roma' },
    ],
    topPlayersComparison: [
      {
        home: { name: 'P. Dybala', initials: 'PD', rating: 8.35, goals: 1, shotsPer90: 3.5 },
        away: { name: 'M. Zaccagni', initials: 'MZ', rating: 6.80, goals: 0, shotsPer90: 1.8 },
      },
    ],
    lineups: {
      home: {
        formation: '3-4-2-1',
        coach: 'Ivan Jurić',
        startingXI: [
          { id: 'r1', name: 'M. Svilar', initials: 'MS', number: 99, role: 'P', rating: 7.8, gridPos: { x: 50, y: 92 } },
          { id: 'r2', name: 'G. Mancini', initials: 'GM', number: 23, role: 'D', rating: 7.5, gridPos: { x: 26, y: 76 } },
          { id: 'r3', name: 'E. Ndicka', initials: 'EN', number: 5, role: 'D', rating: 7.4, gridPos: { x: 50, y: 78 } },
          { id: 'r4', name: 'Angeliño', initials: 'AN', number: 3, role: 'D', rating: 7.7, gridPos: { x: 74, y: 76 } },
          { id: 'r5', name: 'Z. Çelik', initials: 'ZC', number: 19, role: 'C', rating: 7.1, gridPos: { x: 14, y: 56 } },
          { id: 'r6', name: 'M. Koné', initials: 'MK', number: 17, role: 'C', rating: 7.6, gridPos: { x: 38, y: 58 } },
          { id: 'r7', name: 'B. Cristante', initials: 'BC', number: 4, role: 'C', rating: 7.2, gridPos: { x: 62, y: 58 } },
          { id: 'r8', name: 'N. Zalewski', initials: 'NZ', number: 59, role: 'C', rating: 6.9, gridPos: { x: 86, y: 56 } },
          { id: 'r9', name: 'P. Dybala', initials: 'PD', number: 21, role: 'A', rating: 8.4, gridPos: { x: 35, y: 38 } },
          { id: 'r10', name: 'L. Pellegrini', initials: 'LP', number: 7, role: 'A', rating: 7.4, isCaptain: true, gridPos: { x: 65, y: 38 } },
          { id: 'r11', name: 'A. Dovbyk', initials: 'AD', number: 11, role: 'A', rating: 7.6, gridPos: { x: 50, y: 22 } },
        ],
        bench: [
          { id: 'rb1', name: 'T. Baldanzi', number: 35, role: 'Attaccante', rating: 6.8 },
          { id: 'rb2', name: 'M. Soulé', number: 18, role: 'Attaccante' },
        ],
      },
      away: {
        formation: '4-2-3-1',
        coach: 'Marco Baroni',
        startingXI: [
          { id: 'l1', name: 'I. Provedel', initials: 'IP', number: 94, role: 'P', rating: 6.7, gridPos: { x: 50, y: 92 } },
          { id: 'l2', name: 'M. Lazzari', initials: 'ML', number: 29, role: 'D', rating: 6.4, gridPos: { x: 18, y: 76 } },
          { id: 'l3', name: 'M. Gila', initials: 'MG', number: 34, role: 'D', rating: 6.5, gridPos: { x: 38, y: 78 } },
          { id: 'l4', name: 'A. Romagnoli', initials: 'AR', number: 13, role: 'D', rating: 6.6, gridPos: { x: 62, y: 78 } },
          { id: 'l5', name: 'N. Tavares', initials: 'NT', number: 30, role: 'D', rating: 6.8, gridPos: { x: 82, y: 76 } },
          { id: 'l6', name: 'M. Guendouzi', initials: 'MG', number: 8, role: 'C', rating: 6.9, gridPos: { x: 38, y: 60 } },
          { id: 'l7', name: 'N. Rovella', initials: 'NR', number: 6, role: 'C', rating: 6.8, gridPos: { x: 62, y: 60 } },
          { id: 'l8', name: 'G. Isaksen', initials: 'GI', number: 18, role: 'A', rating: 6.3, gridPos: { x: 20, y: 42 } },
          { id: 'l9', name: 'B. Dia', initials: 'BD', number: 19, role: 'A', rating: 6.5, gridPos: { x: 50, y: 44 } },
          { id: 'l10', name: 'M. Zaccagni', initials: 'MZ', number: 10, role: 'A', rating: 6.8, isCaptain: true, gridPos: { x: 80, y: 42 } },
          { id: 'l11', name: 'T. Castellanos', initials: 'TC', number: 11, role: 'A', rating: 6.7, gridPos: { x: 50, y: 24 } },
        ],
        bench: [
          { id: 'lb1', name: 'Pedro', number: 9, role: 'Attaccante' },
          { id: 'lb2', name: 'F. Dele-Bashiru', number: 7, role: 'Centrocampista' },
        ],
      },
    },
    timeline: [
      { minute: 38, type: 'goal', team: 'home', player: 'Paulo Dybala', assistOrSubWith: 'Angeliño', detail: 'Tiro a giro dal limite dell’area' },
      { minute: 45, type: 'sub', team: 'home', player: 'Intervallo', detail: '1 - 0' },
      { minute: 71, type: 'goal', team: 'home', player: 'Artem Dovbyk', assistOrSubWith: 'Lorenzo Pellegrini', detail: 'Colpo di testa vincente su cross' },
      { minute: 88, type: 'yellow_card', team: 'away', player: 'Mattéo Guendouzi', detail: 'Fallo di frustrazione' },
      { minute: 90, type: 'sub', team: 'home', player: 'Fine partita', detail: '2 - 0 per la Roma' },
    ],
  },

  // 4. PREMIER LEAGUE MATCH (Arsenal vs Liverpool)
  {
    id: 'match-arsenal-liv',
    leagueId: 'premier-league',
    leagueName: 'Premier League',
    leagueLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=120&auto=format&fit=crop&q=80',
    leagueLogoDark: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=120&auto=format&fit=crop&q=80',
    status: 'pre',
    dateLabel: 'Domani',
    timeOrMinute: '17:30',
    homeTeam: {
      id: 'arsenal',
      name: 'Arsenal',
      shortName: 'ARS',
      crest: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=80&auto=format&fit=crop&q=80',
      form: [
        { result: 'V', opponent: 'Shakhtar', score: '1-0', isHome: true },
        { result: 'S', opponent: 'Bournemouth', score: '0-2', isHome: false },
        { result: 'V', opponent: 'Southampton', score: '3-1', isHome: true },
        { result: 'V', opponent: 'PSG', score: '2-0', isHome: true },
        { result: 'V', opponent: 'Leicester', score: '4-2', isHome: true },
      ],
    },
    awayTeam: {
      id: 'liverpool',
      name: 'Liverpool',
      shortName: 'LIV',
      crest: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
      form: [
        { result: 'V', opponent: 'Lipsia', score: '1-0', isHome: false },
        { result: 'V', opponent: 'Chelsea', score: '2-1', isHome: true },
        { result: 'V', opponent: 'Crystal Palace', score: '1-0', isHome: false },
        { result: 'V', opponent: 'Bologna', score: '2-0', isHome: true },
        { result: 'V', opponent: 'Wolves', score: '2-1', isHome: false },
      ],
    },
    venue: {
      stadium: 'Emirates Stadium',
      city: 'Londra',
      capacity: '60.704',
      weather: {
        condition: 'Pioggia leggera',
        icon: 'rain',
        temp: '13°C',
        wind: '18 km/h SW',
      },
      referee: {
        name: 'Anthony Taylor',
        id: 'ref-taylor',
        avgYellows: 4.1,
        avgFouls: 22.9,
      },
    },
    reliability: {
      score: 8.7,
      stakeRecommendation: '2.5% (25€)',
      valueOdds: 1.88,
      market: 'Bukayo Saka Over 0.5 Tiri in Porta',
      riskLevel: 'Basso',
    },
    statsComparison: [
      { category: 'Attesi', label: 'Tiri totali', homeValue: 14.8, awayValue: 15.2, isExpected: true },
      { category: 'Attesi', label: 'Tiri in porta', homeValue: 5.2, awayValue: 5.5, isExpected: true },
      { category: 'Attesi', label: 'Corner', homeValue: 6.1, awayValue: 5.9, isExpected: true },
      { category: 'Attesi', label: 'Falli', homeValue: 10.4, awayValue: 11.2, isExpected: true },
      { category: 'Attesi', label: 'Fuorigioco', homeValue: 1.5, awayValue: 1.9, isExpected: true },
    ],
    highlightNumbers: [
      { label: 'Clean sheets Arsenal', value: '5', rankBadge: '2ª su 20', teamName: 'Arsenal' },
      { label: 'Gol subiti Liverpool', value: '5', rankBadge: '1ª su 20', teamName: 'Liverpool' },
    ],
    topPlayersComparison: [
      {
        home: { name: 'B. Saka', initials: 'BS', rating: 7.95, goals: 3, shotsPer90: 3.2 },
        away: { name: 'M. Salah', initials: 'MS', rating: 8.12, goals: 6, shotsPer90: 3.6 },
      },
    ],
    lineups: {
      home: {
        formation: '4-3-3',
        coach: 'Mikel Arteta',
        startingXI: [
          { id: 'ar1', name: 'D. Raya', initials: 'DR', number: 22, role: 'P', rating: 7.3, gridPos: { x: 50, y: 92 } },
          { id: 'ar2', name: 'B. White', initials: 'BW', number: 4, role: 'D', rating: 7.1, gridPos: { x: 18, y: 76 } },
          { id: 'ar3', name: 'W. Saliba', initials: 'WS', number: 2, role: 'D', rating: 7.6, gridPos: { x: 38, y: 78 } },
          { id: 'ar4', name: 'Gabriel', initials: 'GM', number: 6, role: 'D', rating: 7.7, gridPos: { x: 62, y: 78 } },
          { id: 'ar5', name: 'J. Timber', initials: 'JT', number: 12, role: 'D', rating: 7.2, gridPos: { x: 82, y: 76 } },
          { id: 'ar6', name: 'T. Partey', initials: 'TP', number: 5, role: 'C', rating: 7.2, gridPos: { x: 36, y: 60 } },
          { id: 'ar7', name: 'D. Rice', initials: 'DR', number: 41, role: 'C', rating: 7.7, gridPos: { x: 64, y: 60 } },
          { id: 'ar8', name: 'M. Merino', initials: 'MM', number: 23, role: 'C', rating: 7.0, gridPos: { x: 50, y: 46 } },
          { id: 'ar9', name: 'B. Saka', initials: 'BS', number: 7, role: 'A', rating: 8.0, isCaptain: true, gridPos: { x: 20, y: 28 } },
          { id: 'ar10', name: 'K. Havertz', initials: 'KH', number: 29, role: 'A', rating: 7.5, gridPos: { x: 50, y: 22 } },
          { id: 'ar11', name: 'G. Martinelli', initials: 'GM', number: 11, role: 'A', rating: 7.4, gridPos: { x: 80, y: 28 } },
        ],
        bench: [],
      },
      away: {
        formation: '4-2-3-1',
        coach: 'Arne Slot',
        startingXI: [
          { id: 'lv1', name: 'C. Kelleher', initials: 'CK', number: 62, role: 'P', rating: 7.2, gridPos: { x: 50, y: 92 } },
          { id: 'lv2', name: 'T. Alexander-Arnold', initials: 'TA', number: 66, role: 'D', rating: 7.8, gridPos: { x: 18, y: 76 } },
          { id: 'lv3', name: 'I. Konaté', initials: 'IK', number: 5, role: 'D', rating: 7.4, gridPos: { x: 38, y: 78 } },
          { id: 'lv4', name: 'V. van Dijk', initials: 'VV', number: 4, role: 'D', rating: 7.9, isCaptain: true, gridPos: { x: 62, y: 78 } },
          { id: 'lv5', name: 'A. Robertson', initials: 'AR', number: 26, role: 'D', rating: 7.2, gridPos: { x: 82, y: 76 } },
          { id: 'lv6', name: 'R. Gravenberch', initials: 'RG', number: 38, role: 'C', rating: 7.6, gridPos: { x: 38, y: 60 } },
          { id: 'lv7', name: 'A. Mac Allister', initials: 'AM', number: 10, role: 'C', rating: 7.4, gridPos: { x: 62, y: 60 } },
          { id: 'lv8', name: 'M. Salah', initials: 'MS', number: 11, role: 'A', rating: 8.2, gridPos: { x: 20, y: 40 } },
          { id: 'lv9', name: 'D. Szoboszlai', initials: 'DS', number: 8, role: 'C', rating: 7.3, gridPos: { x: 50, y: 44 } },
          { id: 'lv10', name: 'L. Díaz', initials: 'LD', number: 7, role: 'A', rating: 7.7, gridPos: { x: 80, y: 40 } },
          { id: 'lv11', name: 'D. Núñez', initials: 'DN', number: 9, role: 'A', rating: 7.3, gridPos: { x: 50, y: 24 } },
        ],
        bench: [],
      },
    },
  },
];

export const TEAMS_DATA: Record<string, any> = {
  inter: {
    id: 'inter',
    name: 'Inter',
    shortName: 'INT',
    crest: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80',
    primaryColor: '#0066B2',
    league: 'Serie A',
    position: 1,
    points: 22,
    form: ['V', 'V', 'V', 'P', 'V'],
    stadium: 'San Siro (Milano)',
    coach: 'Simone Inzaghi',
    statsTiles: [
      { label: 'Possesso palla', value: '59.6%', rankBadge: '2ª su 20' },
      { label: 'Expected Goals (xG) /p', value: '2.14', rankBadge: '1ª su 20' },
      { label: 'Tiri totali /p', value: '17.1', rankBadge: '1ª su 20' },
      { label: 'Tiri in porta /p', value: '6.1', rankBadge: '1ª su 20' },
      { label: 'Tiri concessi /p', value: '8.4', rankBadge: '2ª su 20' },
      { label: 'Corner battuti /p', value: '6.8', rankBadge: '1ª su 20' },
      { label: 'Precisione passaggi', value: '87.8%', rankBadge: '2ª su 20' },
      { label: 'Gol da palla inattiva', value: '7', rankBadge: '1ª su 20' },
    ],
    squad: {
      portieri: [
        { id: 'p1', name: 'Yann Sommer', number: 1, appearances: 9, cleanSheets: 4 },
        { id: 'p2', name: 'Josep Martínez', number: 13, appearances: 1, cleanSheets: 1 },
      ],
      difensori: [
        { id: 'd1', name: 'Alessandro Bastoni', number: 95, appearances: 9, goals: 1 },
        { id: 'd2', name: 'Benjamin Pavard', number: 28, appearances: 8, goals: 0 },
        { id: 'd3', name: 'Stefan de Vrij', number: 6, appearances: 7, goals: 0 },
        { id: 'd4', name: 'Francesco Acerbi', number: 15, appearances: 6, goals: 0 },
        { id: 'd5', name: 'Yann Bisseck', number: 31, appearances: 5, goals: 1 },
        { id: 'd6', name: 'Federico Dimarco', number: 32, appearances: 9, goals: 2 },
      ],
      centrocampisti: [
        { id: 'c1', name: 'Nicolò Barella', number: 23, appearances: 8, goals: 1 },
        { id: 'c2', name: 'Hakan Çalhanoğlu', number: 20, appearances: 7, goals: 2 },
        { id: 'c3', name: 'Henrikh Mkhitaryan', number: 22, appearances: 9, goals: 1 },
        { id: 'c4', name: 'Davide Frattesi', number: 16, appearances: 9, goals: 3 },
        { id: 'c5', name: 'Piotr Zieliński', number: 7, appearances: 6, goals: 1 },
        { id: 'c6', name: 'Denzel Dumfries', number: 2, appearances: 8, goals: 2 },
      ],
      attaccanti: [
        { id: 'a1', name: 'Lautaro Martínez', number: 10, appearances: 9, goals: 6 },
        { id: 'a2', name: 'Marcus Thuram', number: 9, appearances: 9, goals: 7 },
        { id: 'a3', name: 'Mehdi Taremi', number: 99, appearances: 7, goals: 1 },
        { id: 'a4', name: 'Marko Arnautović', number: 8, appearances: 4, goals: 1 },
      ],
    },
    leaderboards: {
      gol: [
        { rank: 1, name: 'Marcus Thuram', value: 7 },
        { rank: 2, name: 'Lautaro Martínez', value: 6 },
        { rank: 3, name: 'Davide Frattesi', value: 3 },
      ],
      assist: [
        { rank: 1, name: 'Federico Dimarco', value: 4 },
        { rank: 2, name: 'Nicolò Barella', value: 3 },
        { rank: 3, name: 'Marcus Thuram', value: 2 },
      ],
      tiri: [
        { rank: 1, name: 'Lautaro Martínez', value: '3.8 /90\'' },
        { rank: 2, name: 'Marcus Thuram', value: '3.1 /90\'' },
        { rank: 3, name: 'Federico Dimarco', value: '2.4 /90\'' },
      ],
      voto: [
        { rank: 1, name: 'Lautaro Martínez', value: '7.84' },
        { rank: 2, name: 'Federico Dimarco', value: '7.80' },
        { rank: 3, name: 'Marcus Thuram', value: '7.71' },
      ],
    },
  },
  juventus: {
    id: 'juventus',
    name: 'Juventus',
    shortName: 'JUV',
    crest: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    primaryColor: '#1A1A1A',
    league: 'Serie A',
    position: 3,
    points: 19,
    form: ['V', 'P', 'V', 'P', 'V'],
    stadium: 'Allianz Stadium (Torino)',
    coach: 'Thiago Motta',
    statsTiles: [
      { label: 'Possesso palla', value: '61.2%', rankBadge: '1ª su 20' },
      { label: 'Gol subiti', value: '2', rankBadge: '1ª su 20' },
      { label: 'Clean sheets', value: '7', rankBadge: '1ª su 20' },
      { label: 'xG concessi /p', value: '0.54', rankBadge: '1ª su 20' },
      { label: 'Tiri subiti /p', value: '6.8', rankBadge: '1ª su 20' },
      { label: 'Precisione passaggi', value: '89.1%', rankBadge: '1ª su 20' },
    ],
    squad: {
      portieri: [{ id: 'jp1', name: 'Michele Di Gregorio', number: 29, appearances: 8, cleanSheets: 6 }],
      difensori: [{ id: 'jd1', name: 'Pierre Kalulu', number: 15, appearances: 9, goals: 0 }],
      centrocampisti: [{ id: 'jc1', name: 'Teun Koopmeiners', number: 8, appearances: 7, goals: 2 }],
      attaccanti: [{ id: 'ja1', name: 'Dušan Vlahović', number: 9, appearances: 9, goals: 5 }],
    },
    leaderboards: {
      gol: [{ rank: 1, name: 'Dušan Vlahović', value: 5 }],
      assist: [{ rank: 1, name: 'Kenan Yildiz', value: 2 }],
      tiri: [{ rank: 1, name: 'Dušan Vlahović', value: '3.4 /90\'' }],
      voto: [{ rank: 1, name: 'Dušan Vlahović', value: '7.42' }],
    },
  },
};

export const PLAYERS_DATA: Record<string, any> = {
  'lautaro-martinez': {
    id: 'lautaro-martinez',
    name: 'Lautaro Martínez',
    team: 'Inter',
    teamId: 'inter',
    teamCrest: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=60&auto=format&fit=crop&q=80',
    role: 'Attaccante',
    number: 10,
    nationality: 'Argentina',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    statsSeason: {
      partite: 9,
      titolare: 8,
      minuti: 712,
      gol: 6,
      assist: 2,
      xG: 5.42,
      votoMedio: 7.84,
      tiriTotali: 31,
      tiriInPorta: 16,
      precisioneTiri: '51.6%',
    },
    per90: [
      { label: 'Tiri totali /90', value: '3.82', leagueRank: '1º in Serie A' },
      { label: 'Tiri in porta /90', value: '1.98', leagueRank: '1º in Serie A' },
      { label: 'xG /90', value: '0.68', leagueRank: '2º in Serie A' },
      { label: 'Tocchi area avversaria /90', value: '7.4', leagueRank: '1º in Serie A' },
      { label: 'Falli subiti /90', value: '2.1', leagueRank: '14º in Serie A' },
    ],
    lastMatches: [
      { opponent: 'Roma', date: '20 Ott', score: '1-0', rating: 7.8, minutes: 72, shots: 4, shotsOnTarget: 2, goals: 1 },
      { opponent: 'Young Boys', date: '23 Ott', score: '1-0', rating: 7.2, minutes: 29, shots: 2, shotsOnTarget: 1, goals: 0 },
      { opponent: 'Torino', date: '05 Ott', score: '3-2', rating: 8.5, minutes: 90, shots: 6, shotsOnTarget: 3, goals: 2 },
      { opponent: 'Udinese', date: '28 Set', score: '3-2', rating: 8.3, minutes: 86, shots: 5, shotsOnTarget: 3, goals: 2 },
    ],
    shots: [
      { x: 88, y: 52, xG: 0.38, outcome: 'Gol', minute: 60, bodyPart: 'Destro' },
      { x: 84, y: 46, xG: 0.15, outcome: 'Parato', minute: 22, bodyPart: 'Testa' },
      { x: 78, y: 38, xG: 0.08, outcome: 'Fuori', minute: 41, bodyPart: 'Sinistro' },
      { x: 82, y: 64, xG: 0.12, outcome: 'Murato', minute: 74, bodyPart: 'Destro' },
      { x: 92, y: 49, xG: 0.45, outcome: 'Gol', minute: 88, bodyPart: 'Destro' },
    ],
  },
};

export const REFEREES_DATA: Record<string, any> = {
  'ref-massa': {
    id: 'ref-massa',
    name: 'Davide Massa',
    country: 'Italia (Imperia)',
    experience: '13 stagioni Serie A',
    matchesThisSeason: 6,
    avgYellows: 4.83,
    avgReds: 0.33,
    avgFouls: 25.4,
    penaltiesAwarded: 3,
    recentMatches: [
      { match: 'Napoli - Como 3-1', yellows: 3, reds: 0, fouls: 22, penalties: 1 },
      { match: 'Inter - Milan 1-2', yellows: 5, reds: 0, fouls: 28, penalties: 0 },
      { match: 'Juventus - Roma 0-0', yellows: 4, reds: 0, fouls: 24, penalties: 0 },
    ],
  },
  'ref-doveri': {
    id: 'ref-doveri',
    name: 'Daniele Doveri',
    country: 'Italia (Roma 1)',
    experience: '15 stagioni Serie A',
    matchesThisSeason: 7,
    avgYellows: 4.14,
    avgReds: 0.14,
    avgFouls: 23.8,
    penaltiesAwarded: 2,
    recentMatches: [
      { match: 'Fiorentina - Milan 2-1', yellows: 6, reds: 1, fouls: 27, penalties: 2 },
      { match: 'Juventus - Napoli 0-0', yellows: 3, reds: 0, fouls: 21, penalties: 0 },
    ],
  },
};

export const MIGLIORI_GIOCATORI_DATA = [
  {
    id: 'mg-1',
    rank: 1,
    name: 'Lautaro Martínez',
    team: 'Inter',
    match: 'Inter vs Juventus (Stasera 20:45)',
    rating: '9.96',
    expectedAvg: '7.66',
    avg90: '3.82',
    line: 'Ultime 5: 7,6 - stagione 6,9 /90\'',
    overCategory: 'Over 0.5 Tiri in Porta',
    odds: 1.54,
    confidence: '98%',
  },
  {
    id: 'mg-2',
    rank: 2,
    name: 'Dušan Vlahović',
    team: 'Juventus',
    match: 'Inter vs Juventus (Stasera 20:45)',
    rating: '9.72',
    expectedAvg: '7.12',
    avg90: '3.41',
    line: 'Ultime 5: 6,8 - stagione 6,2 /90\'',
    overCategory: 'Over 0.5 Tiri in Porta',
    odds: 1.62,
    confidence: '94%',
  },
  {
    id: 'mg-3',
    rank: 3,
    name: 'Khvicha Kvaratskhelia',
    team: 'Napoli',
    match: 'Milan vs Napoli (In corso 67\')',
    rating: '9.58',
    expectedAvg: '6.84',
    avg90: '3.15',
    line: 'Ultime 5: 6,5 - stagione 6,0 /90\'',
    overCategory: 'Over 1.5 Tiri Totali',
    odds: 1.48,
    confidence: '92%',
  },
  {
    id: 'mg-4',
    rank: 4,
    name: 'Christian Pulisic',
    team: 'Milan',
    match: 'Milan vs Napoli (In corso 67\')',
    rating: '9.41',
    expectedAvg: '6.45',
    avg90: '2.84',
    line: 'Ultime 5: 6,1 - stagione 5,8 /90\'',
    overCategory: 'Over 0.5 Tiri in Porta',
    odds: 1.72,
    confidence: '89%',
  },
  {
    id: 'mg-5',
    rank: 5,
    name: 'Artem Dovbyk',
    team: 'Roma',
    match: 'Roma vs Lazio (Terminata 2-0)',
    rating: '9.28',
    expectedAvg: '6.10',
    avg90: '2.76',
    line: 'Ultime 5: 5,9 - stagione 5,4 /90\'',
    overCategory: 'Over 0.5 Tiri in Porta',
    odds: 1.65,
    confidence: '88%',
  },
  {
    id: 'mg-6',
    rank: 6,
    name: 'Mateo Retegui',
    team: 'Atalanta',
    match: 'Atalanta vs Verona (Domani 20:45)',
    rating: '9.15',
    expectedAvg: '5.92',
    avg90: '3.62',
    line: 'Ultime 5: 7,1 - stagione 6,4 /90\'',
    overCategory: 'Over 1.5 Tiri in Porta',
    odds: 2.10,
    confidence: '86%',
  },
];

export const MIGLIORI_MATCHUP_DATA: Record<string, any[]> = {
  Angoli: [
    {
      id: 'm-ang-1',
      match: 'Inter vs Juventus',
      league: 'Serie A · Stasera',
      gap: '3,2',
      metricExpected: 'Angoli attesi 6,9 - 3,7',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Over 9.5 Corner totali',
      confidence: '89%',
    },
    {
      id: 'm-ang-2',
      match: 'Arsenal vs Liverpool',
      league: 'Premier League · Domani',
      gap: '2,8',
      metricExpected: 'Angoli attesi 6,4 - 5,8',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Over 10.5 Corner totali',
      confidence: '87%',
    },
    {
      id: 'm-ang-3',
      match: 'Atalanta vs Verona',
      league: 'Serie A · Domani',
      gap: '4,1',
      metricExpected: 'Angoli attesi 7,2 - 3,1',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Atalanta Over 5.5 Corner',
      confidence: '92%',
    },
  ],
  Cartellini: [
    {
      id: 'm-car-1',
      match: 'Inter vs Juventus',
      league: 'Serie A · Arbitro: D. Massa',
      gap: '2,4',
      metricExpected: 'Cartellini attesi 5,4 totali',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Over 4.5 Cartellini',
      confidence: '91%',
    },
    {
      id: 'm-car-2',
      match: 'Fiorentina vs Roma',
      league: 'Serie A · Arbitro: S. Sozza',
      gap: '1,9',
      metricExpected: 'Cartellini attesi 5,8 totali',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Over 5.5 Cartellini',
      confidence: '88%',
    },
  ],
  Tiri: [
    {
      id: 'm-tir-1',
      match: 'Inter vs Juventus',
      league: 'Serie A · Stasera',
      gap: '4,8',
      metricExpected: 'Tiri attesi 16,2 - 11,4',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Inter Over 14.5 Tiri',
      confidence: '93%',
    },
    {
      id: 'm-tir-2',
      match: 'Atalanta vs Verona',
      league: 'Serie A · Domani',
      gap: '8,2',
      metricExpected: 'Tiri attesi 18,5 - 9,2',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Atalanta Over 16.5 Tiri',
      confidence: '95%',
    },
  ],
  Falli: [
    {
      id: 'm-fal-1',
      match: 'Inter vs Juventus',
      league: 'Serie A · Derby d’Italia',
      gap: '3,1',
      metricExpected: 'Falli attesi 13,8 - 11,5',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Over 24.5 Falli totali',
      confidence: '90%',
    },
  ],
  Fuorigiochi: [
    {
      id: 'm-fuo-1',
      match: 'Milan vs Napoli',
      league: 'Serie A · In corso',
      gap: '1,5',
      metricExpected: 'Fuorigioco attesi 2,4 - 1,8',
      matchesUsed: 'Partite usate: 5 / 5',
      advice: 'Over 3.5 Fuorigioco',
      confidence: '84%',
    },
  ],
};

export const LINEE_GUIDA_DATA = {
  calcoloGiocatori: {
    title: 'Calcolo Giocatori (Modello Poisson Ponderato)',
    description: 'Come ScalperLab elabora le probabilità e l’indice di affidabilità per le linee individuali dei calciatori.',
    sections: [
      {
        heading: '1. Ponderazione dei Dati Storici',
        content: 'I tiri e i tiri in porta vengono calcolati assegnando un peso del 60% alle ultime 5 presenze da titolare e del 40% alla media complessiva stagionale normalizzata sui 90 minuti effettivi. Questo permette di catturare istantaneamente i picchi di forma e i cambi tattici.',
      },
      {
        heading: '2. Fattore Correttivo Avversario (Difesa)',
        content: 'La media del giocatore viene calibrata in base al tasso di concessione della squadra avversaria. Se l’avversario concede 5.2 tiri in porta contro la media di lega (3.8), l’aspettativa λ (lambda) viene aumentata con funzione log-esponenziale protetta contro gli outlier.',
      },
      {
        heading: '3. Distribuzione di Poisson e Fair Odds',
        content: 'Con il valore atteso λ, viene calcolata la funzione cumulativa di probabilità P(X ≥ Linea). La Quota Reale è pari a 1 / P. Se la quota del bookmaker è significativamente più alta della quota reale, si genera Valore Atteso Positivo (+EV).',
      },
      {
        heading: '4. Indice di Affidabilità /10 e Criterio di Kelly',
        content: 'Il punteggio finale integra probabilità assoluta, edge matematico (+EV) e dimensione del campione (minimo 15 partite per massima confidenza). Lo stake suggerito adotta un Criterio di Kelly Frazionale a 1/4 per preservare la bankroll dalla varianza.',
      },
    ],
  },
  calcoloTiriSquadre: {
    title: 'Calcolo Tiri Squadre (Matrice Incrociata Casa/Trasferta)',
    description: 'Metodologia statistica per la stima del volume totale dei tiri e delle linee Over/Under di squadra.',
    sections: [
      {
        heading: '1. Scomposizione Casa e Fuori Casa',
        content: 'Il rendimento offensivo di una squadra tra le mura amiche differisce sistematicamente da quello in trasferta. La produzione stimata della squadra di casa è determinata al 55% dai propri tiri interni e al 45% dai tiri concessi dalla squadra ospite fuori casa.',
      },
      {
        heading: '2. Ritmo di Gioco e Possesso Conteso',
        content: 'Due squadre con possesso palla elevato riducono il numero di transizioni totali. Il modello applica un indice di attrito basato sul PPDA (Passes Allowed Per Defensive Action) per stimare il numero di possessi totali nei 90 minuti.',
      },
      {
        heading: '3. Stima Linea Over/Under',
        content: 'Sommando i parametri λ_casa e λ_trasferta otteniamo il lambda combinato della partita. Attraverso la convoluzione di Poisson viene stimata la probabilità di superare la linea (es. Over 24.5 o 26.5 tiri).',
      },
    ],
  },
};
