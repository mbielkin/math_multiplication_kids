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

