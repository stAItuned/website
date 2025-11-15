/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
          300: '#4d84d4',
          400: '#566096',
          500: '#383F74',
          600: '#1A1E3B'
        },
        secondary: {
          400: '#FFF7A8',
          500: '#FFF272',
          600: '#FFE700'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ]
}
