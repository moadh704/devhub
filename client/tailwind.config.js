/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0908',
          900: '#12100e',
          850: '#1a1714',
          800: '#221e1a',
          700: '#2e2924',
          600: '#3d3630',
          500: '#5c534a',
          400: '#8a7f74',
          300: '#b5a99c',
          200: '#d9d0c5',
          100: '#efe8df',
          50: '#f7f3ee',
        },
        ember: {
          DEFAULT: '#e85d04',
          soft: '#f48c06',
          deep: '#dc2f02',
          glow: '#ff9f1c',
          muted: 'rgba(232, 93, 4, 0.15)',
        },
        mist: {
          DEFAULT: '#c8facc',
          dim: '#7ddf8a',
        },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04), 0 12px 40px -16px rgba(0,0,0,0.55)',
        lift: '0 20px 50px -20px rgba(232, 93, 4, 0.25)',
        glow: '0 0 0 1px rgba(232, 93, 4, 0.35), 0 0 40px -8px rgba(232, 93, 4, 0.45)',
      },
      backgroundImage: {
        'grain':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        'radial-ember':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232, 93, 4, 0.18), transparent 60%)',
        'radial-spot':
          'radial-gradient(circle at 100% 0%, rgba(244, 140, 6, 0.08), transparent 40%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
