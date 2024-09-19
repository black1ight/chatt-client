import { transform } from 'typescript'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      padding: '1rem',
      center: true,
    },
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        outer: '0 0 15px -3px rgb(0 0 0 / 0.1), 0 0 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'scale-slow': 'scale 0.8s linear infinite ',
        'scale-middle': 'scale 0.8s linear infinite 0.2s',
        'scale-fast': 'scale 0.8s linear infinite 0.4s',
      },
      keyframes: {
        scale: {
          '0%, 50%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.5)' },
        },
      },
    },
  },
  plugins: ['prettier-plugin-tailwindcss'],
}
