/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0A1730',
        bgSecondary: '#0E2041',
        cardBg: 'rgba(18,35,60,0.70)',
        cardBgGlass: 'rgba(255, 255, 255, 0.08)',
        accentCyan: '#00D4C8',
        accentBlue: '#4DA8FF',
        accentPurple: '#9B5CF6',
        accentOrange: '#F59E0B',
        textPrimary: '#FFFFFF',
        textSecondary: '#B8C2CC',
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
