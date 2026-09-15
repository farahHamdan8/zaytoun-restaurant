/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#ffab00',
          light: '#00695c',
          dark: '#ffab00',
        },
      },
      fontFamily: {
        // English display / body
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Manrope"', 'sans-serif'],
        // Arabic display / body
        'display-ar': ['"Markazi Text"', 'serif'],
        'sans-ar': ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      
      backgroundImage: {
        'radial-fade':
          'radial-gradient(ellipse at top, rgba(20,18,12,8%), transparent 60%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.25s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};


