/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F17',
          800: '#111827',
          700: '#1F2937',
          600: '#374151'
        },
        brand: {
          primary: '#6366F1',
          accent: '#EC4899',
          gold: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Hind Siliguri', 'sans-serif'],
        bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
