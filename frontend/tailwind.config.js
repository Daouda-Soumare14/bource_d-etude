/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Identité DGBE — bleu institutionnel & or
        dgbe: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faedc8',
          200: '#f5dd95',
          300: '#f8d775',
          400: '#f5c542',
          500: '#e0a82e',
          600: '#bd8420',
        },
        ink: {
          900: '#0b1220',
          800: '#111a2b',
          700: '#1b2638',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)',
        card: '0 4px 16px -4px rgba(16,24,40,.08), 0 2px 6px -2px rgba(16,24,40,.05)',
        elevate: '0 12px 32px -8px rgba(16,24,40,.16), 0 4px 12px -4px rgba(16,24,40,.08)',
        glow: '0 0 0 1px rgba(59,130,246,.12), 0 8px 24px -6px rgba(37,99,235,.35)',
      },
      backgroundImage: {
        'grid-dgbe':
          'linear-gradient(to right, rgba(37,99,235,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,.06) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(59,130,246,.18), transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.16,1,.3,1) both',
        'fade-in': 'fade-in .8s ease both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
