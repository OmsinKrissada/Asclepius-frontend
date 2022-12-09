const colors = require('tailwindcss/colors');
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        magenta: '#d27ea7',
        cyan: '#b5dcdd',
        cream: '#f8efd4',
        fah: '#61aac5',
        // turmeric: '#e2d36b'
        turmeric: colors.yellow[400],

      },
      fontFamily: {
        krub: ['Krub', 'sans-serif'],
        mitr: ['mitr', 'sans-serif'],
        fahkwang: ['Fahkwang', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }

    },
  },
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
};
