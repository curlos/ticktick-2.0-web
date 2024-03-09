/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': 'rgb(49, 54, 67)',
        'color-gray': '#191919',
        'color-gray-100': '#919191',
        'color-gray-150': '#4A4A4A',
        'color-gray-200': '#474747',
        'color-gray-300': '#353535',
        'color-gray-600': '#2f2f2f',
        'color-gray-700': '#1E1E1E',
      },
    },
  },
  plugins: [],
}

