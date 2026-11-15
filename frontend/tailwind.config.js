/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          base: '#0B0620',
          card: '#140D33',
          cardBorder: '#2A1D5C',
          pink: '#FF2E93',
          lime: '#C6FF00',
          cyan: '#00E5FF',
          orange: '#FF8A00',
          yellow: '#FFD60A',
          purple: '#9B51E0',
          text: '#FFFFFF',
          muted: '#9FA2B4',
          darkBg: '#080417',
          // Sunset Theme Accents
          sunsetBase: '#1F0B24',
          sunsetCard: '#2E1235'
        }
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', 'monospace'],
        display: ['Bungee', 'cursive'],
        vt: ['VT323', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'brutal-pink': '5px 5px 0px #000, 0 0 15px rgba(255, 46, 147, 0.45)',
        'brutal-lime': '5px 5px 0px #000, 0 0 15px rgba(198, 255, 0, 0.45)',
        'brutal-cyan': '5px 5px 0px #000, 0 0 15px rgba(0, 229, 255, 0.45)',
        'brutal-yellow': '5px 5px 0px #000, 0 0 15px rgba(255, 214, 10, 0.45)',
        'brutal-orange': '5px 5px 0px #000, 0 0 15px rgba(255, 138, 0, 0.45)',
        'brutal-black': '5px 5px 0px #000',
        'brutal-black-lg': '8px 8px 0px #000',
        'neon-glow-pink': '0 0 25px rgba(255, 46, 147, 0.6)',
        'neon-glow-cyan': '0 0 25px rgba(0, 229, 255, 0.6)',
        'neon-glow-lime': '0 0 25px rgba(198, 255, 0, 0.6)',
      },
      animation: {
        'glitch': 'glitch 0.4s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-arcade': 'floatArcade 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        floatArcade: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
