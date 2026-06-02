/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff8ff',
          100: '#dbeefe',
          200: '#bfe1fe',
          300: '#93ccfd',
          400: '#60aefa',
          500: '#3b8ff6',
          600: '#2570eb',
          700: '#1d5cd8',
          800: '#1e4cae',
          900: '#1e4289'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
