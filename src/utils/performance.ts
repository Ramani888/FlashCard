/**
 * Performance optimization utilities for the FlashCard application
 * Provides memoization, debouncing, and list optimization helpers
 */

/**
 * Memoize a function with a simple cache
 * Useful for expensive computations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options?: {
    maxSize?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
  },
): T {
  const {maxSize = 100, keyGenerator} = options || {};
  const cache = new Map<string, ReturnType<T>>();
  const keys: string[] = [];

  const memoized = (...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator
      ? keyGenerator(...args)
      : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = fn(...args) as ReturnType<T>;

    // Manage cache size
    if (keys.length >= maxSize) {
      const oldestKey = keys.shift();
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }

    cache.set(key, result);
    keys.push(key);

    return result;
  };

  return memoized as T;
}

/**
 * Create a debounced function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): T & {cancel: () => void} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn as T & {cancel: () => void};
}

/**
 * Create a throttled function
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number,
): T & {cancel: () => void} {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttledFn = (...args: Parameters<T>) => {
    if (inThrottle) {
      lastArgs = args;
      return;
    }

    fn(...args);
    inThrottle = true;

    timeoutId = setTimeout(() => {
      inThrottle = false;
      if (lastArgs) {
        fn(...lastArgs);
        lastArgs = null;
      }
    }, limit);
  };

  throttledFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    inThrottle = false;
    lastArgs = null;
  };

  return throttledFn as T & {cancel: () => void};
}

/**
 * Batch multiple updates into a single render cycle
 */
export function batchUpdates(updates: (() => void)[]): void {
  // Use React Native's InteractionManager in production
  // For simplicity, we batch updates using setTimeout
  setTimeout(() => {
    updates.forEach(update => update());
  }, 0);
}

/**
 * Key extractor for FlatList with consistent key generation
 */
export const createKeyExtractor = <T extends {_id?: string; id?: string}>(
  prefix = 'item',
) => {
  return (item: T, index: number): string => {
    return item._id || item.id || `${prefix}-${index}`;
  };
};

/**
 * Optimized getItemLayout for items with fixed height
 * Improves FlatList performance significantly
 */
export const createGetItemLayout = (itemHeight: number, separatorHeight = 0) => {
  return (_data: unknown, index: number) => ({
    length: itemHeight,
    offset: (itemHeight + separatorHeight) * index,
    index,
  });
};

/**
 * Calculate window size for virtualized list based on item height
 */
export const calculateWindowSize = (
  itemHeight: number,
  screenHeight: number,
  bufferMultiplier = 2,
): number => {
  const visibleItems = Math.ceil(screenHeight / itemHeight);
  return Math.max(5, visibleItems * bufferMultiplier);
};

/**
 * Shallow equality check for memoization
 */
export const shallowEqual = <T extends object>(
  objA: T | null | undefined,
  objB: T | null | undefined,
): boolean => {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  const keysA = Object.keys(objA) as (keyof T)[];
  const keysB = Object.keys(objB) as (keyof T)[];

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(key => objA[key] === objB[key]);
};

/**
 * Deep equality check (use sparingly due to performance cost)
 */
export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  
  if (typeof a !== typeof b) return false;
  
  if (a === null || b === null) return a === b;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(objA[key], objB[key]));
  }
  
  return false;
};

/**
 * Create a stable callback reference
 * Useful for preventing unnecessary re-renders
 */
export const createStableCallback = <T extends (...args: unknown[]) => unknown>(
  fn: T,
): {current: T} => {
  const ref = {current: fn};
  return ref;
};

/**
 * Image caching configuration helper
 */
export const getImageCacheConfig = () => ({
  // Recommended cache settings for react-native-fast-image
  priority: 'normal' as const,
  cache: 'immutable' as const,
});

export default {
  memoize,
  debounce,
  throttle,
  batchUpdates,
  createKeyExtractor,
  createGetItemLayout,
  calculateWindowSize,
  shallowEqual,
  deepEqual,
  createStableCallback,
  getImageCacheConfig,
};
