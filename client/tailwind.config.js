/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Merriweather', 'serif'],
        sans: ['Inter', 'Nunito Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'journal': {
          bg: '#FEFDF9',     // Custom parchment background
          text: '#3F3F46',   // zinc-800 equivalent
          accent: {
            primary: '#065F46',    // emerald-800
            secondary: '#D97706',  // amber-600
            interactive: '#0284C7', // sky-600
          }
        }
      },
    },
  },
  plugins: [],
}