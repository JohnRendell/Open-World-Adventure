/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Public/*.{html,js}",
    "./Game/*.{html,js}"
  ],
  theme: {
    extend: {
        fontFamily: {
          "PixelifySans": ["Pixelify Sans", "Sans"]
        }
    },
  },
  plugins: [],
}