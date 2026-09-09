/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        board: '#1C1B29',
        'board-alt': '#262439',
        paper: '#FBF8F2',
        coral: '#FF6B5B',
        mint: '#3ED9A7',
        sun: '#FFC24B',
        lav: '#9B8CFF',
      },
      boxShadow: {
        note: '0 16px 34px -14px rgba(0,0,0,.55)',
      },
    },
  },
  plugins: [],
}
