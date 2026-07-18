/** @type {import('tailwindcss').Config} */
/** Orbit-family design tokens — keep in sync with DESIGN.md */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        deep: '#07080A',
        base: '#0A0B0D',
        elevated: '#111214',
        input: '#111214',
        surface: {
          DEFAULT: '#111214',
          hover: '#16181C',
          raised: '#1C1E22',
        },
        fg: {
          DEFAULT: '#E6E7EA',
          muted: '#9CA0A8',
          subtle: '#5A5E66',
        },
        accent: {
          DEFAULT: '#7C5CFF',
          bright: '#8B6FFF',
          hover: '#6B4FE0',
          glow: 'rgba(124,92,255,0.25)',
          dim: 'rgba(124,92,255,0.12)',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          hover: 'rgba(255,255,255,0.12)',
          accent: 'rgba(124,92,255,0.25)',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        base: ['13px', { lineHeight: '1.5' }],
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
        '2xl': '12px',
      },
      boxShadow: {
        // Orbit: almost no shadows on dark — keep minimal rings only
        card: 'none',
        'card-hover': 'none',
        cta: 'none',
        'cta-hover': 'none',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
        ring: '0 0 0 3px rgba(124,92,255,0.12)',
      },
      backgroundImage: {
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'depth-radial':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,92,255,0.08) 0%, transparent 55%), #0A0B0D',
        'grid-64':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'text-fade':
          'linear-gradient(to bottom, #E6E7EA, rgba(230,231,234,0.85))',
        'accent-shimmer':
          'linear-gradient(90deg, #7C5CFF, #A78BFA, #7C5CFF)',
      },
      backgroundSize: {
        grid: '64px 64px',
        shimmer: '200% 100%',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        250: '250ms',
        300: '300ms',
        600: '600ms',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatAlt: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.65' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        menuIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 10s ease-in-out infinite',
        'float-slow': 'floatAlt 12s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'menu-in': 'menuIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};
