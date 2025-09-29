/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDFDFF',
          100: '#F4F4F5',
          500: '#0046E2',
          600: '#0046E2',
          700: '#0046E2',
        },
        gray: {
          50: '#FDFDFF',
          100: '#F4F4F5',
          500: '#8E9099',
          900: '#262626',
        },
        orange: {
          100: '#FED7AA',
          800: '#9A3412',
        },
        yellow: {
          100: '#FEF3C7',
          800: '#92400E',
        },
        green: {
          100: '#D1FAE5',
          800: '#065F46',
        },
        background: '#FDFDFF',
        foreground: '#000000',
        card: '#FFFFFF',
        border: '#F4F4F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
}
