/**
 * Tokens de diseño de UrbanFix.
 * Copiados 1:1 de `src/index.css` (@theme) del frontend web para mantener
 * el mismo look: fondo carbón, superficies grises y acento lima.
 */
export const colors = {
  bg: '#1A1A1A',
  surface: '#2B2B2B',
  surface2: '#363636',
  line: '#4A4A4A',

  text: '#F2F2F0',
  textSecondary: '#C9C9C4',
  textMuted: '#A8A8A4',

  accent: '#D4F58C',
  accentHover: '#E3FFA6',
  accentActive: '#C6F56B',
  accentGlow: '#EAFFB0',
  onAccent: '#1A1A1A',

  panelLight: '#D9D9D9',
  onPanel: '#1A1A1A',
  onPanelMuted: '#4A4A46',

  success: '#D4F58C',
  warning: '#F2C14E',
  error: '#FF6B5E',
  info: '#5B8FF9',
} as const;

/** Mezcla un color hex con transparencia (equivalente a `bg-accent/15`). */
export const alpha = (hex: string, opacity: number) => {
  const a = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};

export const radius = 4; // --radius-md del web

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  gutter: 16, // --gutter-mobile
} as const;

export const fonts = {
  heading: 'Anton_400Regular',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
} as const;

export type Tone = 'accent' | 'warning' | 'info' | 'success' | 'error';

export const toneColor: Record<Tone, string> = {
  accent: colors.accent,
  warning: colors.warning,
  info: colors.info,
  success: colors.success,
  error: colors.error,
};
