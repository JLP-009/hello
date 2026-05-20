/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          'bg-primary': '#071218',
          'bg-secondary': '#0D1C24',
          'bg-elevated': '#132833',
          'border-subtle': '#1E3945',
          'border-strong': '#2B4B57',
          'text-primary': '#E8F2EE',
          'text-secondary': '#8EA6AF',
          'accent-primary': '#3AA886',
          success: '#4DAA83',
          danger: '#C67272',
          warning: '#C39A63',
        },
      },
      boxShadow: {
        panel: '0 2px 10px rgba(2,10,14,0.28)',
        hover: '0 6px 18px rgba(2,10,14,0.32)',
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
