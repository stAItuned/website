/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,svelte}', "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"],
  mode: 'jit',
  theme: {
    fontFamily: {
      //serif: 'Roboto Serif, serif',
      sans: 'Montserrat, sans-serif'
      //mono: 'JetBrains Mono, monospace'
    },
    extend: {
      colors: {
        primary: {
          50: '#9c9fba',
          100: '#888cac',
          200: '#74799e',
          300: '#606590',
          400: '#4c5282',
          500: '#383F74',
          600: '#323968',
          700: '#2d325d',
          800: '#272c51',
          900: '#222646',
        },
        secondary: {
          400: '#FFF7A8',
          500: '#FFF272',
          600: '#FFE700'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/line-clamp'), require('@tailwindcss/forms'), require('flowbite/plugin')]
}
