/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sensor1: '#ef4444', // red-500
        sensor2: '#3b82f6', // blue-500
        sensor3: '#10b981', // emerald-500
      }
    },
  },
  plugins: [],
}