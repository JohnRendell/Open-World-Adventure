/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Public/*.{html,js}",
    "./Game/*.{html,js}",
    "./Game/Base/*.{html,js}",
    "./404pages/*.{html,js}"
  ],
  theme: {
    extend: {
        fontFamily: {
          "PixelifySans": ["Pixelify Sans", "Sans"]
        },
        screens: {
          "xsm": { "max" : "568px" }
        }
    },
  },
  plugins: [],
}