module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'margenta': '#d27ea7',
        'cyan': '#b5dcdd',
        'cream': '#f8efd4',
        'blue': '#61aac5',
        'turmeric': '#e2d36b',

      },
      fontFamily: {
        'krub': ['Krub', 'sans-serif'],
        'mitr': ['mitr', 'sans-serif'],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
};
