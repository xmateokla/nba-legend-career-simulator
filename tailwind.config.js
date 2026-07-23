/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Bebas Neue', 'impact', 'sans-serif'],
      },
      colors: {
        nba: {
          blue: '#1D4ED8',
          red: '#DC2626',
          gold: '#F59E0B',
          purple: '#7C3AED',
          dark: '#0B0F19',
          card: '#111827',
          cardHover: '#1F2937',
          border: '#1F2937',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(245, 158, 11, 0.8), 0 0 10px rgba(29, 78, 216, 0.5)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}
