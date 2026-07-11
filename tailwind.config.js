/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}",
    "!./node_modules/**/*.*"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Shift every named size +2px over Tailwind's defaults, so text
      // across the app renders slightly larger without touching the
      // (unrelated) rem-based spacing/sizing scale.
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1rem' }],
        sm: ['1rem', { lineHeight: '1.25rem' }],
        base: ['1.125rem', { lineHeight: '1.5rem' }],
        lg: ['1.25rem', { lineHeight: '1.75rem' }],
        xl: ['1.375rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.625rem', { lineHeight: '2rem' }],
        '3xl': ['2rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.375rem', { lineHeight: '2.5rem' }],
        '5xl': ['3.125rem', { lineHeight: '1' }],
        '6xl': ['3.875rem', { lineHeight: '1' }],
        '7xl': ['4.625rem', { lineHeight: '1' }],
        '8xl': ['6.125rem', { lineHeight: '1' }],
        '9xl': ['8.125rem', { lineHeight: '1' }],
      },
      animation: {
        'spin-one-time': 'spin 1s linear 1',
        'pop': 'pop 0.3s ease-in-out 1',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      transitionProperty: {
        'opacity': 'opacity'
      }
    },
  },
  plugins: [],
}

