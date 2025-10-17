// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { // <-- ¡AQUÍ ES DONDE VA!
        primary: {
          // Puedes definir diferentes tonos, como los colores predeterminados de Tailwind
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Este es el color que te falta: primary-500
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Aquí puedes añadir otros colores personalizados como 'secondary'
      },
      // El resto de tus extensiones van aquí, fuera de 'colors'
      perspective: {
        'none': 'none',
        'sm': '500px',
        'md': '800px',
        'lg': '1000px',
        'xl': '1200px',
        'dramatic': '300px',
        'normal': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      animation: {
        'rotate-cube': 'rotate-cube 8s linear infinite',
        'blob': 'blob 25s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'rotate-cube': {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'rotateX(360deg) rotateY(360deg)' },
        },
        'blob': {
          '0%': { transform: 'translate(0vw, 0vh) scale(1)' },
          '20%': { transform: 'translate(-5vw, 15vh) scale(1.2)' },
          '40%': { transform: 'translate(10vw, -10vh) scale(0.9)' },
          '60%': { transform: 'translate(-15vw, -5vh) scale(1.1)' },
          '80%': { transform: 'translate(5vw, 20vh) scale(1.3)' },
          '100%': { transform: 'translate(0vw, 0vh) scale(1)' },
        },
      },
      translate: {
        '10': '40px',
      }
    },
  },
  plugins: [],
}