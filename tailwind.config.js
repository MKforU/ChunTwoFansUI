/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 御姐风格主题色
        primary: '#E91E63',      // 玫红
        secondary: '#9C27B0',    // 深紫
        accent: '#B71C1C',       // 酒红
        dark: '#1A1A2E',         // 深灰背景
        'dark-lighter': '#16213E',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'vinyl-spin': 'vinyl-spin 8s linear infinite',
        'neon-flow': 'neon-flow 3s ease infinite',
      },
      keyframes: {
        'vinyl-spin': {
          to: { transform: 'rotate(360deg)' }
        },
        'neon-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    },
  },
  plugins: [],
}
