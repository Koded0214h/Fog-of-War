// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#63df20",
        "background-light": "#f7f8f6",
        "background-dark": "#172111",
        "bgDark": '#0f0f0f',
        "bgCard": '#1a1a1a',
        "bgSecondary": '#172a11',
        "accentGreen": '#63df20',
        "accentYellow": '#facc15',
        "accentRed": '#D9534F',
        "textPrimary": '#f0f5ed',
        "textSecondary": '#a6c695',
        "borderDark": '#314625',
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "mono": ["Roboto Mono", "monospace"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-out': 'fadeInOut 5s forwards',
        'fade-out': 'fadeOut 5s forwards',
        'float-up': 'floatUp 1.5s ease-out forwards',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-30px)', opacity: 0 },
        },
        pulseGold: {
          '0%, 100%': { borderColor: '#FFD700', boxShadow: '0 0 10px #FFD700' },
          '50%': { borderColor: '#fff', boxShadow: '0 0 20px #FFD700' },
        },
      }
    },
  },
  plugins: [],
}