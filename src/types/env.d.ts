declare namespace NodeJS {
  interface ProcessEnv {
    LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
    RATE_LIMIT_MAX: string
    RATE_LIMIT_WINDOW_MS: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
} 