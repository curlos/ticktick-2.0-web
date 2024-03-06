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
        'color-lighter-gray': '#919191',
        'color-light-gray': '#474747',
        'color-medium-gray': '#2f2f2f'
      },
    },
  },
  plugins: [],
}

