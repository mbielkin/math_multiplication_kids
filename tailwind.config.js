/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}",
    "!./node_modules/**/*.*"
  ],
  theme: {
    extend: {
      animation: {
        'spin-one-time': 'spin 1s linear 1'
      }
    },
  },
  plugins: [],
}

