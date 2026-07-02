/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ninja-green':  '#67B946',
        'ninja-yellow': '#F6D853',
        'ninja-purple': '#5A287A',
        'ninja-black':  '#151515',
        'ninja-dark':   '#1C1C1C',
        'ninja-card':   '#1E1E1E',
        'ninja-border': '#2A2A2A',
        red: {
          50: '#FDFBFC',
          100: '#C75A58',
          500: '#BD211F',
          600: '#B01A19',
          700: '#B71F1D',
          900: '#AA0B0A',
          950: '#AA0B0A',
        },
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow-green': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(103,185,70,0.4)' },
          '50%':       { boxShadow: '0 0 20px 6px rgba(103,185,70,0.7)' },
        },
        'pulse-glow-purple': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(90,40,122,0.5)' },
          '50%':       { boxShadow: '0 0 22px 8px rgba(90,40,122,0.8)' },
        },
        'pulse-glow-red': {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(239,68,68,0.4)' },
          '50%':       { boxShadow: '0 0 20px 6px rgba(239,68,68,0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':       { transform: 'translateY(-8px) rotate(3deg)' },
        },
        'badge-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.7', transform: 'scale(0.95)' },
        },
        'live-blink': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.3' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(2%, 1%)' },
          '30%': { transform: 'translate(-1%, 2%)' },
          '40%': { transform: 'translate(3%, -1%)' },
          '50%': { transform: 'translate(-2%, 2%)' },
          '60%': { transform: 'translate(1%, -2%)' },
          '70%': { transform: 'translate(-3%, 1%)' },
          '80%': { transform: 'translate(2%, 3%)' },
          '90%': { transform: 'translate(-1%, -1%)' },
        },
      },
      animation: {
        'pulse-glow-green':  'pulse-glow-green 2s ease-in-out infinite',
        'pulse-glow-purple': 'pulse-glow-purple 2s ease-in-out infinite',
        'pulse-glow-red':    'pulse-glow-red 1.5s ease-in-out infinite',
        float:               'float 4s ease-in-out infinite',
        'float-slow':        'float-slow 6s ease-in-out infinite',
        'badge-pulse':       'badge-pulse 2s ease-in-out infinite',
        'live-blink':        'live-blink 1.2s ease-in-out infinite',
        shimmer:             'shimmer 3s linear infinite',
        'slide-up':          'slide-up 0.6s ease-out forwards',
        grain:               'grain 0.8s steps(1) infinite',
      },
      backgroundImage: {
        'halftone': 'radial-gradient(circle, rgba(170,11,10,0.15) 1px, transparent 1px)',
        'gradient-ninja': 'linear-gradient(135deg, #151515 0%, #1C1C1C 50%, #1a0f2e 100%)',
      },
      backgroundSize: {
        'halftone': '20px 20px',
      },
    },
  },
  plugins: [],
}
