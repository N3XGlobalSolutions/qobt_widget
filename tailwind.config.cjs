/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(99,102,241,0.4)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(99,102,241,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-down': 'slide-down 0.25s ease-in forwards',
        'bounce-in': 'bounce-in 0.45s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
        'typing-dot': 'typing-dot 1.2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
