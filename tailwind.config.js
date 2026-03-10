/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          50: '#e6f9ff',
          100: '#b3eeff',
          200: '#66dbff',
          300: '#1ac8ff',
          400: '#00b5e8',
          500: '#0099cc',
          600: '#007aaa',
          700: '#005c88',
          800: '#003d66',
          900: '#001f44',
        },
        dark: {
          50: '#1a1a2e',
          100: '#16213e',
          200: '#0f3460',
          300: '#0d0d0d',
          400: '#111111',
          500: '#0a0a0a',
          600: '#050505',
        }
      },
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 181, 232, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 181, 232, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 181, 232, 0.4)',
        'neon-lg': '0 0 40px rgba(0, 181, 232, 0.5)',
        'neon-xl': '0 0 60px rgba(0, 181, 232, 0.6)',
        'card': '0 4px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 48px rgba(0, 181, 232, 0.2)',
      },
    },
  },
  plugins: [],
}
