/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'Gilroy-Bold': ['Gilroy-Bold'],
        'Gilroy-Extra-Bold': ['Gilroy-Extra-Bold'],
        'Gilroy-Light': ['Gilroy-Light'],
        'Gilroy-Medium': ['Gilroy-Medium'],
        'Gilroy-Regular': ['Gilroy-Regular'],
        'Gilroy-Semi-Bold': ['Gilroy-Semi-Bold'],
        'Honk-Sans-Regular': ['Honk-Sans-Regular'],
        'Sharp-Grotesk-Medium-25': ['Sharp-Grotesk-Medium-25'],
        'Sharp-Grotesk-Semi-Bold-25': ['Sharp-Grotesk-Semi-Bold-25']
      },
      colors: {
        'accented': '#f06b5e',
        'primary': '#125367',
        'secondary': '#043038',
        'primary-light': '#94d2e7'
      }
    },
  },
  plugins: [],
}

