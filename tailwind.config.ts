// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Vazirmatn"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: 'var(--color-mellat-50)',
          100: 'var(--color-mellat-100)',
          200: 'var(--color-mellat-200)',
          300: 'var(--color-mellat-300)',
          400: 'var(--color-mellat-400)',
          500: 'var(--color-mellat-500)',
          600: 'var(--color-mellat-600)',
          700: 'var(--color-mellat-700)',
          800: 'var(--color-mellat-800)',
          900: 'var(--color-mellat-900)',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // اگر index.css مشکل‌دار باشد
  },
} satisfies Config