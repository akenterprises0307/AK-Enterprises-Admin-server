/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pulled from the AK Enterprises logo
        brandBlue: '#2E3192',
        brandAccent: '#C61F6A',
        brandDark: '#0B1030',
      },
      fontFamily: {
        display: ['MoMo Trust Display', 'system-ui', 'sans-serif'],
        body: ['Ubuntu', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}

