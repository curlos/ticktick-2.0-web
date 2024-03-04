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
        'color-gray': 'rgb(25, 25, 25)',
        'color-light-gray': '#757575',
        'color-medium-gray': '#474747'
      },
    },
  },
  plugins: [],
}

