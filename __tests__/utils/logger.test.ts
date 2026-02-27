/**
 * Tests for logger utility
 */
import logger, {logApiCall, logPerformance} from '../../src/utils/logger';

// Mock console methods
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
  table: console.table,
  group: console.group,
  groupEnd: console.groupEnd,
};

describe('Logger Utility', () => {
  beforeEach(() => {
    // Mock console methods
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.debug = jest.fn();
    console.table = jest.fn();
    console.group = jest.fn();
    console.groupEnd = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original console
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.debug = originalConsole.debug;
    console.table = originalConsole.table;
    console.group = originalConsole.group;
    console.groupEnd = originalConsole.groupEnd;
  });

  describe('log', () => {
    it('should log messages in development mode', () => {
      logger.log('Test message');
      expect(console.log).toHaveBeenCalledWith('Test message');
    });

    it('should log multiple arguments', () => {
      logger.log('Test', 'message', 123);
      expect(console.log).toHaveBeenCalledWith('Test', 'message', 123);
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Info message');
      expect(console.info).toHaveBeenCalledWith('Info message');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Warning message');
      expect(console.warn).toHaveBeenCalledWith('Warning message');
    });
  });

  describe('error', () => {
    it('should log error messages in development', () => {
      logger.error('Error message');
      expect(console.error).toHaveBeenCalled();
    });

    it('should log error with details', () => {
      const error = new Error('Test error');
      logger.error('Error occurred:', error);
      expect(console.error).toHaveBeenCalledWith('Error occurred:', error);
    });
  });

  describe('debug', () => {
    it('should log debug messages with prefix', () => {
      logger.debug('Debug message');
      expect(console.debug).toHaveBeenCalledWith('[DEBUG]', 'Debug message');
    });
  });

  describe('table', () => {
    it('should call console.table if available', () => {
      const data = [{name: 'Test', value: 123}];
      logger.table(data);
      expect(console.table).toHaveBeenCalledWith(data);
    });
  });

  describe('group', () => {
    it('should start a console group', () => {
      logger.group('Group label');
      expect(console.group).toHaveBeenCalledWith('Group label');
    });
  });

  describe('groupEnd', () => {
    it('should end a console group', () => {
      logger.groupEnd();
      expect(console.groupEnd).toHaveBeenCalled();
    });
  });

  describe('logHistory', () => {
    it('should store log history', () => {
      logger.log('Test 1');
      logger.info('Test 2');
      const history = logger.getHistory();
      expect(history.length).toBeGreaterThan(0);
    });

    it('should limit history size', () => {
      // Add more than maxHistorySize logs
      for (let i = 0; i < 150; i++) {
        logger.log(`Test ${i}`);
      }
      const history = logger.getHistory();
      expect(history.length).toBeLessThanOrEqual(100);
    });
  });

  describe('clearHistory', () => {
    it('should clear log history', () => {
      logger.log('Test');
      logger.clearHistory();
      const history = logger.getHistory();
      expect(history.length).toBe(0);
    });
  });

  describe('API logging', () => {
    it('should log API calls', () => {
      logApiCall('GET', '/api/users', undefined, {status: 200});
      expect(console.group).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Performance logging', () => {
    it('should log performance metrics', () => {
      const startTime = Date.now() - 150;
      logPerformance('Test operation', startTime);
      expect(console.log).toHaveBeenCalled();
    });
  });
});
