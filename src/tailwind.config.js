module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      boxShadow: {
        'ios': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'ios-dark': '0 4px 30px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
