/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#e8f5ed',
          100: '#c5e6d1',
          200: '#9fd6b3',
          300: '#78c595',
          400: '#4db577',
          500: '#1A4D2E',
          600: '#174428',
          700: '#133a22',
          800: '#0f2f1b',
          900: '#0a2515',
          950: '#061a0e',
        },
        neon: {
          DEFAULT: '#00FF66',
          50: '#e6fff0',
          100: '#b3ffce',
          200: '#80ffad',
          300: '#4dff8c',
          400: '#1aff6b',
          500: '#00FF66',
          600: '#00cc52',
          700: '#00993d',
          800: '#006629',
          900: '#003314',
        },
        surface: {
          DEFAULT: '#f5f7f6',
          50: '#ffffff',
          100: '#f5f7f6',
          200: '#eff1f0',
          300: '#e5e8e6',
          400: '#d1d5d3',
          500: '#b8bebb',
        },
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 1.4s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(120px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 102, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 102, 0.4)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
