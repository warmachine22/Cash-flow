/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#22c55e', // green-500
        'danger': '#ef4444', // red-500
        'light': '#f1f5f9', // slate-100
        'dark': '#0f172a', // slate-900
      },
    },
  },
  plugins: [],
}
