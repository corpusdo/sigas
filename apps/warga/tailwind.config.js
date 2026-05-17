/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan semua file termasuk shared packages
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Warna brand SIGAS — bisa disesuaikan nanti
      colors: {
        brand: {
          50:  '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
