/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Public/*.{html,js}",
    "./Game/*.{html,js}",
    "./Game/Base/*.{html,js}"
  ],
  theme: {
    extend: {
        fontFamily: {
          "PixelifySans": ["Pixelify Sans", "Sans"]
        },
        screens: {
          "xsm": { "max" : "320px" }
        }
    },
  },
  plugins: [],
}