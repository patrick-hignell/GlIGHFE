/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './client/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['sans-serif'], // Overrides default sans font
        body: ['Roboto', 'sans-serif'], // Creates a new 'font-body' utility
      },
    },
  },
  plugins: [],
}
