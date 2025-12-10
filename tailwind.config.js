/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'poetz-blauw': '#007BA4',
        'poetz-oranje': '#E85127',
        'poetz-zeegroen': '#24B1A0',
        'kerst-goud': '#FFD700',
        'kerst-zilver': '#C0C0C0',
        'kerst-warmwit': '#FFF8E7',
        'kerst-rood': '#C41E3A',
        'kerst-groen': '#228B22',
        'bg-night': '#0a1628'
      }
    }
  },
  plugins: []
};



