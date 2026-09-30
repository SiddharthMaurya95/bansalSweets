/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            900: 'var(--brand-blue-900, #0B2A6B)',
            700: 'var(--brand-blue-700, #1E4BA8)',
          },
          red: {
            600: 'var(--brand-red-600, #C8102E)',
          },
          gold: {
            500: 'var(--brand-gold-500, #D9A521)',
            300: 'var(--brand-gold-300, #F2D27A)',
          },
        },
        surface: {
          DEFAULT: 'var(--surface, #FFFFFF)',
          warm: 'var(--surface-warm, #FFF9EE)',
        },
        ink: {
          900: 'var(--ink-900, #1B1F2A)',
          600: 'var(--ink-600, #4A5163)',
        },
        state: {
          success: 'var(--success, #15803D)',
          warning: 'var(--warning, #B45309)',
          danger: 'var(--danger, #B91C1C)',
        },
      },
      borderRadius: {
        card: '14px',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
};
