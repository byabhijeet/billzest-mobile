/**
 * Logger utility for consistent logging across the app
 * Automatically guards console logs in production builds
 * Supports crash reporting integration
 */

const isDev = __DEV__;

// Crash reporting service (can be extended with Sentry, Bugsnag, etc.)
let crashReportingService: {
  captureException?: (error: Error, context?: Record<string, any>) => void;
  captureMessage?: (message: string, level?: 'error' | 'warning' | 'info') => void;
} | null = null;

/**
 * Initialize crash reporting service
 * Call this in App.tsx or index.js
 */
export const initCrashReporting = (service: typeof crashReportingService) => {
  crashReportingService = service;
};

/**
 * Format error for logging
 */
const formatError = (error: any): string => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }
  return String(error);
};

export const logger = {
  /**
   * Log debug information (only in development)
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log errors (always logged, sent to crash reporting in production)
   * Supports both old format (logger.error(...args)) and new format (logger.error(message, error, context))
   */
  error: (...args: any[]) => {
    // Handle both old and new formats
    if (args.length === 1 && args[0] instanceof Error) {
      // Old format: logger.error(error)
      const error = args[0];
      if (isDev) {
        console.error('[ERROR]', error);
      } else if (crashReportingService?.captureException) {
        crashReportingService.captureException(error);
      }
    } else if (args.length >= 1) {
      // New format: logger.error(message, error?, context?)
      const message = String(args[0]);
      const error = args[1];
      const context = args[2];
      
      if (isDev) {
        console.error('[ERROR]', message, error, context);
      } else {
        // In production, send to crash reporting
        if (crashReportingService?.captureException && error instanceof Error) {
          crashReportingService.captureException(error, {
            message,
            ...context,
          });
        } else if (crashReportingService?.captureMessage) {
          crashReportingService.captureMessage(
            `${message}: ${formatError(error)}`,
            'error'
          );
        }
      }
    }
  },

  /**
   * Log warnings (only in development, can be sent to crash reporting)
   */
  warn: (message: string, context?: Record<string, any>) => {
    if (isDev) {
      console.warn('[WARN]', message, context);
    } else if (crashReportingService?.captureMessage) {
      crashReportingService.captureMessage(message, 'warning');
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },
};

