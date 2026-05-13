/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00E5FF", // Neon Cyan
          light: "#80F2FF",
          dark: "#00B3CC",
          glow: "rgba(0, 229, 255, 0.5)",
        },
        dark: {
          DEFAULT: "#0B0F19", // Deep space blue/black
          card: "rgba(17, 24, 39, 0.7)", // Semi-transparent for glass
          border: "rgba(255, 255, 255, 0.1)",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 229, 255, 0.3)',
        'glow-lg': '0 0 30px rgba(0, 229, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)', boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '50%': { opacity: .8, filter: 'brightness(1.5)', boxShadow: '0 0 30px rgba(0, 229, 255, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}