/**
 * Performance optimization utilities for React Native
 */
import {useRef, useCallback} from 'react';

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Custom hook for debounced callback
 * @param {Function} callback - Callback to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced callback
 */
export const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
};

/**
 * Custom hook for throttled callback
 * @param {Function} callback - Callback to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled callback
 */
export const useThrottledCallback = (callback, limit) => {
  const lastRunRef = useRef(Date.now());

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastRunRef.current >= limit) {
        lastRunRef.current = now;
        callback(...args);
      }
    },
    [callback, limit],
  );
};

/**
 * Memoize expensive calculations with a simple cache
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * FlatList optimization props
 * Use these props for better FlatList performance
 */
export const FLATLIST_PERF_PROPS = {
  initialNumToRender: 10,
  maxToRenderPerBatch: 10,
  windowSize: 5,
  removeClippedSubviews: true,
  updateCellsBatchingPeriod: 50,
  legacyImplementation: false,
};

/**
 * Get optimized FlatList props with getItemLayout
 * @param {number} itemHeight - Height of each item
 * @returns {Object} FlatList optimization props
 */
export const getFlatListOptimizationProps = (itemHeight) => ({
  ...FLATLIST_PERF_PROPS,
  getItemLayout: (_, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  }),
});

/**
 * Image optimization settings
 */
export const IMAGE_DEFAULTS = {
  resizeMode: 'cover',
  fadeDuration: 0, // Disable fade animation for better performance
};

/**
 * Check if two props objects are shallowly equal
 * Useful for React.memo comparison
 * @param {Object} prevProps - Previous props
 * @param {Object} nextProps - Next props
 * @returns {boolean} Whether props are equal
 */
export const arePropsEqual = (prevProps, nextProps) => {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
};

export default {
  debounce,
  throttle,
  useDebouncedCallback,
  useThrottledCallback,
  memoize,
  FLATLIST_PERF_PROPS,
  getFlatListOptimizationProps,
  IMAGE_DEFAULTS,
  arePropsEqual,
};
