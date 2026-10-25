/**
 * ScalperLab Design Tokens
 * Style 1: "Icon-first minimal"
 * Ultra-clean, lots of air, near-monochrome palette with refined emerald accent.
 */

export const TOKENS = {
  colors: {
    light: {
      canvas: '#F8FAFC', // Slate 50
      surface: '#FFFFFF',
      surfaceSubtle: '#F1F5F9', // Slate 100
      surfaceHover: '#E2E8F0', // Slate 200
      border: '#E2E8F0',
      borderSubtle: '#F1F5F9',
      borderStrong: '#CBD5E1',
      textPrimary: '#0F172A', // Slate 900
      textSecondary: '#475569', // Slate 600
      textMuted: '#64748B', // Slate 500
      textSubtle: '#94A3B8', // Slate 400
      glassBg: 'rgba(255, 255, 255, 0.75)',
      glassBorder: 'rgba(226, 232, 240, 0.8)',
    },
    dark: {
      canvas: '#0B0F17', // Deep midnight obsidian
      surface: '#121A26', // Elevated midnight
      surfaceSubtle: '#182232', // Secondary dark surface
      surfaceHover: '#1F2C3F', // Interactive dark surface
      border: '#1E293B', // Slate 800
      borderSubtle: '#151D2A',
      borderStrong: '#334155', // Slate 700
      textPrimary: '#F8FAFC', // Slate 50
      textSecondary: '#CBD5E1', // Slate 300
      textMuted: '#94A3B8', // Slate 400
      textSubtle: '#64748B', // Slate 500
      glassBg: 'rgba(18, 26, 38, 0.78)',
      glassBorder: 'rgba(255, 255, 255, 0.08)',
    },
    accent: {
      primary: '#10B981', // Emerald precision
      hover: '#059669',
      subtle: 'rgba(16, 185, 129, 0.12)',
      glow: 'rgba(16, 185, 129, 0.25)',
      contrastText: '#FFFFFF',
    },
    status: {
      live: '#EF4444', // Pulsing red for live minute & score
      liveSubtle: 'rgba(239, 68, 68, 0.12)',
      win: '#10B981', // Green dot V
      draw: '#94A3B8', // Grey dot P
      loss: '#EF4444', // Red dot S
      shotGoal: '#10B981', // Green
      shotSaved: '#3B82F6', // Blue
      shotOff: '#94A3B8', // Grey
      shotBlocked: '#F97316', // Orange
      yellowCard: '#FBBF24',
      redCard: '#EF4444',
      champions: '#2563EB',
      europa: '#EA580C',
      conference: '#16A34A',
      relegation: '#DC2626',
    },
  },
  typography: {
    fontFamily: {
      sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    scale: {
      hero: 'text-2xl font-bold tracking-tight', // 24-28px
      title1: 'text-lg font-bold tracking-tight', // 18px
      title2: 'text-base font-semibold tracking-tight', // 16px
      body: 'text-sm font-normal leading-relaxed', // 14px
      caption: 'text-xs font-medium', // 12px
      micro: 'text-[10px] font-semibold tracking-wider uppercase', // 10px
      metric: 'font-mono tabular-nums font-bold tracking-tight',
    },
  },
  radii: {
    full: '9999px',
    xl3: '24px', // Cards & sheets
    xl2: '18px', // Modals & outer panels
    xl: '14px', // Inner elements, inputs
    md: '10px', // Chips & small indicators
  },
  shadows: {
    subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
    dock: '0 10px 30px -4px rgba(0, 0, 0, 0.15)',
    glowEmerald: '0 0 20px -3px rgba(16, 185, 129, 0.35)',
  },
  motion: {
    springFast: { type: 'spring', stiffness: 450, damping: 32 },
    springNormal: { type: 'spring', stiffness: 350, damping: 30 },
    springBouncy: { type: 'spring', stiffness: 300, damping: 20 },
    durationFast: 0.18,
    durationNormal: 0.28,
    easeOut: [0.16, 1, 0.3, 1],
  },
} as const;

export type ThemeMode = 'light' | 'dark' | 'auto';
