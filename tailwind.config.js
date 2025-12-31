/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#D4AF37', // Imperial Gold
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
        black: {
          DEFAULT: '#000000',
          light: '#1A1A1A',
          dark: '#0D0D0D'
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        'display-en': ['Playfair Display', 'serif'],
        'body-en': ['Inter', 'system-ui', 'sans-serif'],
        'display-ar': ['Cairo', 'system-ui', 'sans-serif'],
        'body-ar': ['IBM Plex Arabic', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(0, 0, 0, 0.08)',
        'luxury-lg': '0 25px 50px rgba(0, 0, 0, 0.12)',
        'luxury-xl': '0 35px 60px rgba(0, 0, 0, 0.16)',
        'gold': '0 10px 30px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 20px 50px rgba(212, 175, 55, 0.25)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #FACC15 100%)',
        'gradient-gold-light': 'linear-gradient(135deg, #FEF9C3 0%, #FDE047 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
      }
    }
  },
  plugins: [],
}