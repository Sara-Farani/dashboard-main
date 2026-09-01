// src/utils/logger.ts

// VITE_LOG_LEVEL=debug
// VITE_LOG_LEVEL=info
// VITE_LOG_LEVEL=warn
// VITE_LOG_LEVEL=error
// VITE_LOG_LEVEL=silent

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

function getLogLevel(): LogLevel {
  const level = import.meta.env.VITE_LOG_LEVEL?.toLowerCase()

  if (
    level === 'debug' ||
    level === 'info' ||
    level === 'warn' ||
    level === 'error' ||
    level === 'silent'
  ) {
    return level
  }

  // در محیط توسعه debug و در production فقط error نمایش داده شود
  return import.meta.env.DEV ? 'debug' : 'error'
}

const currentLogLevel = getLogLevel()

function canLog(level: LogLevel): boolean {
  return logLevels[level] >= logLevels[currentLogLevel]
}

export const logger = {
  debug: (...args: unknown[]): void => {
    if (canLog('debug')) {
      console.log('[DEBUG]', ...args)
    }
  },

  info: (...args: unknown[]): void => {
    if (canLog('info')) {
      console.info('[INFO]', ...args)
    }
  },

  warn: (...args: unknown[]): void => {
    if (canLog('warn')) {
      console.warn('[WARN]', ...args)
    }
  },

  error: (...args: unknown[]): void => {
    if (canLog('error')) {
      console.error('[ERROR]', ...args)
    }
  },
}