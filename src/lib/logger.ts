import pino from 'pino'

/**
 * Application logger configuration
 * Provides structured logging with timestamps and level formatting
 * 
 * Log Levels: 
 * - fatal: System is unusable
 * - error: Action failed and needs immediate attention
 * - warn: Something unexpected occurred but the app can continue
 * - info: Normal operation events
 * - debug: Detailed information for debugging
 * - trace: Very detailed debugging information
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label }
    }
  },
  // ISO 8601 timestamp format
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  // Redact sensitive information
  redact: ['password', 'token', 'secret']
})

export default logger 