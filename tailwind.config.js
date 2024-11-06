import { transform } from 'typescript'
const colors = require('tailwindcss/colors')

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

        'open-menu': 'onOpen 0.3s cubic-bezier(0, 0, 0.2, 1)',
        'close-menu': 'onClose 0.3s cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        scale: {
          '0%, 50%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.5)' },
        },
        onOpen: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        onClose: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      colors: {
        message_bg_author: colors.yellow[100],
        message_bg: colors.white,
        unread_messages_bg: colors.blue[100],
        message_username: colors.slate[500],
        reply_bg_author: colors.stone[700],
        reply_bg: colors.slate[200],
        reply_border_author: colors.orange[950],
        reply_border: colors.slate[400],
        reply_username_author: colors.orange[950],
        reply_username: colors.slate[700],
        message_time: colors.stone[900],
      },
    },
  },
  plugins: ['prettier-plugin-tailwindcss'],
}
