export const BRAND_TOKENS = {
  colors: {
    brandBlue900: '#0B2A6B',
    brandBlue700: '#1E4BA8',
    brandRed600: '#C8102E',
    brandGold500: '#D9A521',
    brandGold300: '#F2D27A',
    surface: '#FFFFFF',
    surfaceWarm: '#FFF9EE',
    ink900: '#1B1F2A',
    ink600: '#4A5163',
    success: '#15803D',
    warning: '#B45309',
    danger: '#B91C1C',
  },
  radii: {
    card: '14px',
    button: '8px',
    chip: '20px',
  },
} as const;

export type BrandTokens = typeof BRAND_TOKENS;
