/**
 * Rate Limiter Service
 * Prevents brute force attacks and API abuse
 * Tracks request counts per endpoint and enforces limits
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  blockDurationMs?: number; // How long to block after limit exceeded
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

class RateLimiterService {
  private requestCounts: Map<string, RateLimitEntry> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  // Default configurations for different types of requests
  private readonly defaultConfigs = {
    // Login/Auth endpoints (stricter limits)
    auth: {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes block
    },
    // General API endpoints
    api: {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
      blockDurationMs: 5 * 60 * 1000, // 5 minutes block
    },
    // File upload endpoints
    upload: {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
      blockDurationMs: 10 * 60 * 1000, // 10 minutes block
    },
    // Search/query endpoints
    search: {
      maxRequests: 30,
      windowMs: 60 * 1000, // 1 minute
    },
  };

  constructor() {
    // Initialize with default configs
    this.configs.set('auth', this.defaultConfigs.auth);
    this.configs.set('api', this.defaultConfigs.api);
    this.configs.set('upload', this.defaultConfigs.upload);
    this.configs.set('search', this.defaultConfigs.search);

    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), 60 * 1000); // Every minute
  }

  /**
   * Check if request is allowed
   * Returns true if allowed, false if rate limit exceeded
   */
  checkLimit(key: string, type: keyof typeof this.defaultConfigs = 'api'): {
    allowed: boolean;
    remainingRequests?: number;
    resetTime?: number;
    blockedUntil?: number;
  } {
    const config = this.configs.get(type) || this.defaultConfigs.api;
    const now = Date.now();
    const rateLimitKey = `${type}:${key}`;

    let entry = this.requestCounts.get(rateLimitKey);

    // Check if currently blocked
    if (entry?.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        blockedUntil: entry.blockedUntil,
      };
    }

    // Initialize or reset if window expired
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      };
      this.requestCounts.set(rateLimitKey, entry);
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      // Block for specified duration
      if (config.blockDurationMs) {
        entry.blockedUntil = now + config.blockDurationMs;
      }

      return {
        allowed: false,
        resetTime: entry.resetTime,
        blockedUntil: entry.blockedUntil,
      };
    }

    // Request allowed
    return {
      allowed: true,
      remainingRequests: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Record a successful request
   */
  recordRequest(key: string, type: keyof typeof this.defaultConfigs = 'api'): void {
    this.checkLimit(key, type);
  }

  /**
   * Reset rate limit for a specific key
   * Use for password reset, logout, etc.
   */
  resetLimit(key: string, type: keyof typeof this.defaultConfigs = 'api'): void {
    const rateLimitKey = `${type}:${key}`;
    this.requestCounts.delete(rateLimitKey);
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string, type: keyof typeof this.defaultConfigs = 'api'): {
    count: number;
    limit: number;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  } | null {
    const config = this.configs.get(type) || this.defaultConfigs.api;
    const rateLimitKey = `${type}:${key}`;
    const entry = this.requestCounts.get(rateLimitKey);

    if (!entry) {
      return {
        count: 0,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs,
        blocked: false,
      };
    }

    const now = Date.now();
    const isBlocked = entry.blockedUntil ? entry.blockedUntil > now : false;

    return {
      count: entry.count,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      blocked: isBlocked,
    };
  }

  /**
   * Configure custom rate limit
   */
  setConfig(
    type: string,
    config: RateLimitConfig,
  ): void {
    this.configs.set(type, config);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.requestCounts.forEach((entry, key) => {
      // Remove if reset time passed and not blocked
      if (entry.resetTime <= now && (!entry.blockedUntil || entry.blockedUntil <= now)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.requestCounts.delete(key));
  }

  /**
   * Clear all rate limits (use for testing)
   */
  clearAll(): void {
    this.requestCounts.clear();
  }

  /**
   * Get formatted time remaining
   */
  getTimeRemaining(timestamp: number): string {
    const now = Date.now();
    const diff = timestamp - now;

    if (diff <= 0) return 'now';

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}

// Export singleton instance
const rateLimiter = new RateLimiterService();
export default rateLimiter;

/**
 * Rate limit decorator for async functions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  key: string,
  type: keyof typeof rateLimiter['defaultConfigs'] = 'api',
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const check = rateLimiter.checkLimit(key, type);

    if (!check.allowed) {
      const timeRemaining = check.blockedUntil
        ? rateLimiter.getTimeRemaining(check.blockedUntil)
        : check.resetTime
          ? rateLimiter.getTimeRemaining(check.resetTime)
          : 'soon';

      throw new Error(
        `Rate limit exceeded. Please try again in ${timeRemaining}.`,
      );
    }

    return fn(...args);
  }) as T;
}
