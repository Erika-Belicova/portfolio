/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // scan all .html and .ts files
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        slateNight: {
          100: '#2D3748', // about
          200: '#2E3F57', // skills
          300: '#29364C', // projects
          400: '#232837', // contact
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
