// src/config/env.ts

function getRequiredEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]

  if (!value || !value.trim()) {
    throw new Error(`متغیر محیطی ${name} تنظیم نشده است.`)
  }

  return value.trim()
}

function removeTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export const env = {
  /**
   * آدرس پایه Backend API
   * نمونه:
   * http://localhost:3000/api
   */
  apiBaseUrl: removeTrailingSlash(
    getRequiredEnv('VITE_API_BASE_URL'),
  ),

  /**
   * فعال‌بودن لاگ‌های debug در Front
   */
  enableLogger:
    import.meta.env.VITE_ENABLE_LOGGER === 'true' ||
    import.meta.env.DEV,

  /**
   * محیط اجرای برنامه
   */
  mode: import.meta.env.MODE,

  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const