/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,svelte}'],
  mode: 'jit',
  theme: {
    fontFamily: {
      //serif: 'Roboto Serif, serif',
      sans: 'Montserrat, sans-serif'
      //mono: 'JetBrains Mono, monospace'
    },
    extend: {
      backgroundImage: {
        bgLearnCard: "url('/assets/general/learn-card.svg')"
      },
      colors: {
        primary: {
          400: '#566096',
          500: '#383F74',
          600: '#1A1E3B'
        },
        stayYellow: {
          400: '#FFF7A8',
          500: '#FFF272',
          600: '#FFE700'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')]
}
