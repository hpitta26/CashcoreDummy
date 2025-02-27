/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1E4D40',
        'dark': '#1E1E1E',
        'darker': '#141414',
        'light-gray': '#2A2A2A',
        'primary-green': '#27CE78',
        'primary-red': '#FF0004'
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'pulse-sequence': {
          '0%': { 
            transform: 'scale(0)',
            opacity: '0'
          },
          '25%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
          '75%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
          '100%': { 
            transform: 'scale(0)',
            opacity: '0'
          }
        },
      },
      animation: {
        'pulse-sequence': 'pulse-sequence 5120ms cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      })
    },
  ],
}

