/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',   // ✅ enables manual toggle with 'dark' class
  theme: {
    extend: {},
  },
  plugins: [],
}