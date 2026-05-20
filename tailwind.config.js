/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#071018',
          panel: '#0F1722',
          border: '#1E293B',
          text: '#F8FAFC',
          muted: '#94A3B8',
          accent: '#14B8A6',
          bull: '#22C55E',
          bear: '#EF4444',
        },
      },
      boxShadow: {
        panel: '0 8px 24px rgba(2, 8, 20, 0.35)',
      },
    },
  },
  plugins: [],
}
