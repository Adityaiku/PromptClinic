/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1220',
          800: '#0F172A',
        },
        brand: {
          blue: '#2563EB',
          pro: '#1E5BFF',
          dark: '#0B1220',
          green: '#16A34A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'btn': '14px',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(15, 23, 42, 0.06)',
        'soft-hover': '0 16px 36px rgba(15, 23, 42, 0.1)',
        'blue-glow': '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
        'badge': '0 4px 14px rgba(15, 23, 42, 0.08)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(-6px)' },
          '50%': { transform: 'translateY(6px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orbit-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'float-reverse': 'float-reverse 6s ease-in-out infinite',
        marquee: 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        blink: 'blink 1s step-start infinite',
        orbit: 'orbit 60s linear infinite',
        'orbit-reverse': 'orbit-reverse 60s linear infinite',
      }
    },
  },
  plugins: [],
}
