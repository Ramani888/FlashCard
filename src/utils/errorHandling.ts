/**
 * Error handling utilities for the FlashCard application
 * Provides consistent error handling across the app
 */
import showMessageonTheScreen from '../component/ShowMessageOnTheScreen';

// Error types
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  originalError?: unknown;
}

export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

/**
 * Parse error into a consistent AppError format
 */
export const parseError = (error: unknown): AppError => {
  // Handle null/undefined
  if (!error) {
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN',
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'UNKNOWN',
    };
  }

  // Handle Error objects
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('Network request failed')) {
      return {
        message: 'Network connection failed. Please check your internet.',
        code: 'NETWORK_ERROR',
        originalError: error,
      };
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT',
        originalError: error,
      };
    }

    return {
      message: error.message,
      code: 'UNKNOWN',
      originalError: error,
    };
  }

  // Handle API response errors
  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;

    if (errObj.message && typeof errObj.message === 'string') {
      return {
        message: errObj.message,
        code: (errObj.code as string) || 'UNKNOWN',
        status: errObj.status as number | undefined,
        originalError: error,
      };
    }

    if (errObj.error && typeof errObj.error === 'string') {
      return {
        message: errObj.error,
        code: 'UNKNOWN',
        originalError: error,
      };
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN',
    originalError: error,
  };
};

/**
 * Get user-friendly error message based on error code
 */
export const getErrorMessage = (code: ErrorCode): string => {
  const messages: Record<ErrorCode, string> = {
    NETWORK_ERROR: 'Please check your internet connection and try again.',
    AUTH_ERROR: 'Authentication failed. Please sign in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    TIMEOUT: 'Request timed out. Please try again.',
    UNKNOWN: 'An unexpected error occurred. Please try again.',
  };

  return messages[code];
};

/**
 * Handle error with consistent logging and user notification
 */
export const handleError = (
  error: unknown,
  options?: {
    showMessage?: boolean;
    logToConsole?: boolean;
    context?: string;
  },
): AppError => {
  const {showMessage = true, logToConsole = true, context} = options || {};
  const parsedError = parseError(error);

  // Log to console in development
  if (logToConsole && __DEV__) {
    console.error(
      `[${context || 'Error'}]:`,
      parsedError.message,
      parsedError.originalError,
    );
  }

  // Show user-friendly message
  if (showMessage) {
    showMessageonTheScreen(parsedError.message);
  }

  return parsedError;
};

/**
 * Wrap async function with error handling
 */
export const withErrorHandling = <T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  options?: {
    showMessage?: boolean;
    context?: string;
    onError?: (error: AppError) => void;
  },
): ((...args: Args) => Promise<T | null>) => {
  return async (...args: Args): Promise<T | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const parsedError = handleError(error, {
        showMessage: options?.showMessage ?? true,
        context: options?.context,
      });

      if (options?.onError) {
        options.onError(parsedError);
      }

      return null;
    }
  };
};

/**
 * Create a retry wrapper for async operations
 */
export const withRetry = <T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    delayMs?: number;
    shouldRetry?: (error: AppError) => boolean;
  },
): Promise<T> => {
  const {maxRetries = 3, delayMs = 1000, shouldRetry} = options || {};

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        attempts++;
        const parsedError = parseError(error);

        // Check if we should retry
        const canRetry = shouldRetry
          ? shouldRetry(parsedError)
          : parsedError.code === 'NETWORK_ERROR' ||
            parsedError.code === 'TIMEOUT';

        if (attempts < maxRetries && canRetry) {
          setTimeout(attempt, delayMs * attempts);
        } else {
          reject(error);
        }
      }
    };

    attempt();
  });
};

export default {
  parseError,
  getErrorMessage,
  handleError,
  withErrorHandling,
  withRetry,
};
