/**
 * Logger Utility
 * Provides safe logging that only works in development mode
 * Prevents sensitive data leaks in production
 */

const isDevelopment = __DEV__;

interface LoggerInterface {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  table: (data: unknown) => void;
  group: (label: string) => void;
  groupEnd: () => void;
}

class Logger implements LoggerInterface {
  private shouldLog: boolean;
  private logHistory: Array<{level: string; message: unknown[]; timestamp: Date}> = [];
  private maxHistorySize = 100;

  constructor() {
    this.shouldLog = isDevelopment;
  }

  /**
   * Log messages (only in development)
   */
  log(...args: unknown[]): void {
    if (this.shouldLog) {
      console.log(...args);
      this.addToHistory('log', args);
    }
  }

  /**
   * Log info messages
   */
  info(...args: unknown[]): void {
    if (this.shouldLog) {
      console.info(...args);
      this.addToHistory('info', args);
    }
  }

  /**
   * Log warnings (shown in both dev and production for critical issues)
   */
  warn(...args: unknown[]): void {
    if (this.shouldLog) {
      console.warn(...args);
      this.addToHistory('warn', args);
    }
  }

  /**
   * Log errors (always shown, but sanitized in production)
   */
  error(...args: unknown[]): void {
    if (this.shouldLog) {
      console.error(...args);
      this.addToHistory('error', args);
    } else {
      // In production, log generic error without details
      console.error('An error occurred. Please contact support if this persists.');
    }
  }

  /**
   * Debug logs (only in development)
   */
  debug(...args: unknown[]): void {
    if (this.shouldLog) {
      console.debug('[DEBUG]', ...args);
      this.addToHistory('debug', args);
    }
  }

  /**
   * Table logs (only in development)
   */
  table(data: unknown): void {
    if (this.shouldLog && console.table) {
      console.table(data);
    }
  }

  /**
   * Group logs (only in development)
   */
  group(label: string): void {
    if (this.shouldLog && console.group) {
      console.group(label);
    }
  }

  /**
   * End group logs
   */
  groupEnd(): void {
    if (this.shouldLog && console.groupEnd) {
      console.groupEnd();
    }
  }

  /**
   * Add entry to log history (development only)
   */
  private addToHistory(level: string, message: unknown[]): void {
    if (!this.shouldLog) return;

    this.logHistory.push({
      level,
      message,
      timestamp: new Date(),
    });

    // Keep history limited
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  /**
   * Get log history (development only)
   */
  getHistory(): typeof this.logHistory {
    return this.shouldLog ? this.logHistory : [];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Enable/disable logging (for testing purposes)
   */
  setLoggingEnabled(enabled: boolean): void {
    this.shouldLog = enabled && isDevelopment;
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;

/**
 * API Call Logger for development debugging
 */
export const logApiCall = (
  method: string,
  url: string,
  body?: unknown,
  response?: unknown,
): void => {
  if (!__DEV__) return;

  logger.group(`🌐 API ${method.toUpperCase()} - ${url}`);
  if (body) {
    logger.log('Request Body:', body);
  }
  if (response) {
    logger.log('Response:', response);
  }
  logger.groupEnd();
};

/**
 * Error logger with stack trace
 */
export const logError = (error: Error | unknown, context?: string): void => {
  if (!__DEV__) {
    // In production, just log generic error
    console.error('An error occurred');
    return;
  }

  logger.group(`❌ Error${context ? ` in ${context}` : ''}`);
  if (error instanceof Error) {
    logger.error('Message:', error.message);
    logger.error('Stack:', error.stack);
  } else {
    logger.error('Error:', error);
  }
  logger.groupEnd();
};

/**
 * Performance logger
 */
export const logPerformance = (label: string, startTime: number): void => {
  if (!__DEV__) return;

  const duration = Date.now() - startTime;
  logger.log(`⏱️ ${label}: ${duration}ms`);
};
