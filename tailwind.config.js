module.exports = {
  theme: {
    extend: {
      colors: {
        magenta: '#d27ea7',
        cyan: '#b5dcdd',
        cream: '#f8efd4',
        blue: '#61aac5',
        turmeric: '#e2d36b'

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
    './components/**/*.vue',
    './pages/**/*.vue',
  ]
};
