/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          'bg-primary': '#071018',
          'bg-secondary': '#0D1B22',
          'bg-elevated': '#13262F',
          hover: '#18323D',
          'border-subtle': '#1F3942',
          'border-strong': '#1F3942',
          'text-primary': '#E8F1F3',
          'text-secondary': '#8FA6AD',
          'accent-primary': '#14B8A6',
          success: '#22C55E',
          danger: '#EF4444',
          warning: '#F59E0B',
        },
      },
      fontSize: {
        'label-xs': ['11px', { lineHeight: '16px' }],
        'secondary-sm': ['13px', { lineHeight: '18px' }],
        'value-xl': ['26px', { lineHeight: '32px' }],
        'section-title': ['20px', { lineHeight: '28px' }],
        'page-title': ['32px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
}
