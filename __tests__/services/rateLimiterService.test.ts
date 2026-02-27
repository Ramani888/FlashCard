/**
 * Tests for rate limiter service
 */
import rateLimiter from '../../src/services/rateLimiterService';

describe('Rate Limiter Service', () => {
  beforeEach(() => {
    // Clear all rate limits before each test
    rateLimiter.clearAll();
  });

  describe('checkLimit - API type', () => {
    it('should allow requests within limit', () => {
      const result1 = rateLimiter.checkLimit('test-key', 'api');
      expect(result1.allowed).toBe(true);
      expect(result1.remainingRequests).toBeDefined();
    });

    it('should block requests exceeding limit', () => {
      // Make requests up to the limit (100 for api)
      for (let i = 0; i < 100; i++) {
        rateLimiter.checkLimit('test-key', 'api');
      }

      // Next request should be blocked
      const result = rateLimiter.checkLimit('test-key', 'api');
      expect(result.allowed).toBe(false);
    });

    it('should track remaining requests', () => {
      const result1 = rateLimiter.checkLimit('test-key', 'api');
      const result2 = rateLimiter.checkLimit('test-key', 'api');
      
      expect(result1.remainingRequests).toBeGreaterThan(result2.remainingRequests!);
    });
  });

  describe('checkLimit - Auth type', () => {
    it('should have stricter limits for auth', () => {
      // Auth type has max 5 requests
      for (let i = 0; i < 5; i++) {
        const result = rateLimiter.checkLimit('auth-key', 'auth');
        expect(result.allowed).toBe(true);
      }

      // 6th request should be blocked
      const result = rateLimiter.checkLimit('auth-key', 'auth');
      expect(result.allowed).toBe(false);
    });

    it('should block after limit exceeded', () => {
      // Exceed auth limit
      for (let i = 0; i < 6; i++) {
        rateLimiter.checkLimit('auth-key', 'auth');
      }

      const result = rateLimiter.checkLimit('auth-key', 'auth');
      expect(result.allowed).toBe(false);
      expect(result.blockedUntil).toBeDefined();
    });
  });

  describe('checkLimit - Upload type', () => {
    it('should have moderate limits for uploads', () => {
      // Upload type has max 10 requests per minute
      for (let i = 0; i < 10; i++) {
        const result = rateLimiter.checkLimit('upload-key', 'upload');
        expect(result.allowed).toBe(true);
      }

      // 11th request should be blocked
      const result = rateLimiter.checkLimit('upload-key', 'upload');
      expect(result.allowed).toBe(false);
    });
  });

  describe('checkLimit - Search type', () => {
    it('should have moderate limits for search', () => {
      // Search type has max 30 requests per minute
      for (let i = 0; i < 30; i++) {
        const result = rateLimiter.checkLimit('search-key', 'search');
        expect(result.allowed).toBe(true);
      }

      // 31st request should be blocked
      const result = rateLimiter.checkLimit('search-key', 'search');
      expect(result.allowed).toBe(false);
    });
  });

  describe('Different keys', () => {
    it('should track limits separately for different keys', () => {
      // Exceed limit for key1
      for (let i = 0; i < 6; i++) {
        rateLimiter.checkLimit('key1', 'auth');
      }

      // key2 should still be allowed
      const result = rateLimiter.checkLimit('key2', 'auth');
      expect(result.allowed).toBe(true);
    });
  });

  describe('clearAll', () => {
    it('should clear all limits', () => {
      // Create limits for multiple keys
      for (let i = 0; i < 6; i++) {
        rateLimiter.checkLimit('key1', 'auth');
        rateLimiter.checkLimit('key2', 'auth');
      }

      // Clear all
      rateLimiter.clearAll();

      // Both should be allowed again
      const result1 = rateLimiter.checkLimit('key1', 'auth');
      const result2 = rateLimiter.checkLimit('key2', 'auth');
      
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
    });
  });

  describe('Window reset', () => {
    it('should provide reset time', () => {
      const result = rateLimiter.checkLimit('test-key', 'api');
      expect(result.resetTime).toBeDefined();
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });
  });

  describe('Time remaining', () => {
    it('should format time remaining', () => {
      const futureTime = Date.now() + 120000; // 2 minutes from now
      const remaining = rateLimiter.getTimeRemaining(futureTime);
      expect(remaining).toContain('minute');
    });
  });
});
