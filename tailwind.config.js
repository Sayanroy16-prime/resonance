/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        obsidian: {
          bg: '#090A0C',
          surface: '#101216',
          surfaceHover: '#191B22',
          card: '#14161A',
          cardHover: '#1E2027',
        },
        accent: {
          green: '#00E676',
          greenHover: '#10FE84',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'soundwave': 'soundwave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        soundwave: {
          '0%': { transform: 'scaleY(0.2)' },
          '100%': { transform: 'scaleY(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
