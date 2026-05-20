/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#08141A',
          panel: '#102129',
          elevated: '#16313A',
          border: '#24444D',
          text: '#E6F4F1',
          muted: '#8CA7A3',
          accent: '#10B981',
          mint: '#DFF7F2',
          bull: '#34A67B',
          bear: '#D16F6F',
          teal: '#0F5F5A',
        },
      },
      boxShadow: {
        panel: '0 4px 16px rgba(6, 20, 26, 0.28)',
      },
    },
  },
  plugins: [],
}
