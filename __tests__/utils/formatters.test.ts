/**
 * Tests for formatter utilities
 */
import {
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatNumber,
  formatCurrency,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  getInitials,
  formatPhoneNumber,
  formatPercentage,
  pluralize,
  formatCount,
} from '../../src/utils/formatters';

describe('Formatter Utilities', () => {
  describe('formatDate', () => {
    it('should format Date object', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });

    it('should handle invalid date', () => {
      const result = formatDate('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "Just now" for recent dates', () => {
      const date = new Date();
      const result = formatRelativeTime(date);
      expect(result).toBe('Just now');
    });

    it('should return minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toBe('5 minutes ago');
    });

    it('should return hours ago', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toBe('3 hours ago');
    });

    it('should handle singular forms', () => {
      const date = new Date(Date.now() - 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toBe('1 minute ago');
    });

    it('should handle invalid date', () => {
      const result = formatRelativeTime('invalid');
      expect(result).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle zero', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });
  });

  describe('formatNumber', () => {
    it('should format number with thousand separators', () => {
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('should format with decimal places', () => {
      expect(formatNumber(1234.567, 2)).toBe('1,234.57');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(42)).toBe('42');
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      const result = formatCurrency(99.99, 'USD');
      expect(result).toContain('99.99');
      expect(result).toContain('$');
    });

    it('should format EUR currency', () => {
      const result = formatCurrency(50, 'EUR', 'de-DE');
      expect(result).toContain('50');
      expect(result).toContain('€');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const result = truncateText('This is a very long text that needs truncation', 20);
      expect(result).toBe('This is a very lo...');
      expect(result.length).toBe(20);
    });

    it('should not truncate short text', () => {
      const result = truncateText('Short', 20);
      expect(result).toBe('Short');
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalizeFirst('a')).toBe('A');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize all words', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalizeWords('')).toBe('');
    });
  });

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should limit initials', () => {
      expect(getInitials('John Michael Doe', 2)).toBe('JM');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone number', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    it('should format 11-digit US phone number', () => {
      expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890');
    });

    it('should return original for other formats', () => {
      expect(formatPhoneNumber('12345')).toBe('12345');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage', () => {
      expect(formatPercentage(0.75)).toBe('75%');
    });

    it('should format with decimals', () => {
      expect(formatPercentage(0.7534, 2)).toBe('75.34%');
    });
  });

  describe('pluralize', () => {
    it('should return singular for count 1', () => {
      expect(pluralize(1, 'card')).toBe('card');
    });

    it('should return plural for count > 1', () => {
      expect(pluralize(5, 'card')).toBe('cards');
    });

    it('should use custom plural', () => {
      expect(pluralize(5, 'child', 'children')).toBe('children');
    });
  });

  describe('formatCount', () => {
    it('should format count with label', () => {
      expect(formatCount(5, 'card')).toBe('5 cards');
    });

    it('should format singular', () => {
      expect(formatCount(1, 'item')).toBe('1 item');
    });

    it('should format large numbers', () => {
      expect(formatCount(1000, 'user')).toBe('1,000 users');
    });
  });
});
