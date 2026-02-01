/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: { 50: '#fefdfb', 100: '#fdf9f3', 200: '#f9f1e4', 300: '#f3e4cc', 400: '#e8d0a8', 500: '#d9b77d' },
        sage: { 50: '#f6f7f6', 100: '#e3e7e3', 200: '#c7d0c7', 300: '#a3b2a3', 400: '#7d917d', 500: '#617461', 600: '#4c5c4c', 700: '#3f4b3f' },
        clay: { 50: '#faf8f6', 100: '#f2ebe4', 200: '#e4d5c8', 300: '#d3baa5', 400: '#c09a80', 500: '#b38367' },
        dusk: { 100: '#f0eef4', 200: '#e3dfe9', 300: '#cec7d8', 400: '#b4a9c2', 500: '#9a8aab' },
        warmth: { 400: '#e07a5f', 500: '#d45d3f' },
        calm: { 400: '#81b29a', 500: '#6a9b84' },
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'Georgia', 'serif'],
        'body': ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        breathe: { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.02)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
