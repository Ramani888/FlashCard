/**
 * Unit tests for utility functions
 */
import {
  isValidEmail,
  isStrongPassword,
  formatDate,
  formatRelativeTime,
  truncateText,
  generateRandomColor,
  capitalize,
  formatBytes,
  shuffleArray,
  isEmpty,
  removeDuplicates,
  groupBy,
  safeJSONParse,
  generateUUID,
} from '../../src/utils';

describe('Utility Functions', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should return true for strong passwords', () => {
      expect(isStrongPassword('Password1')).toBe(true);
      expect(isStrongPassword('MySecure123')).toBe(true);
    });

    it('should return false for weak passwords', () => {
      expect(isStrongPassword('password')).toBe(false);
      expect(isStrongPassword('12345678')).toBe(false);
      expect(isStrongPassword('Short1')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(truncateText('Hello World', 8, '…')).toBe('Hello W…');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('HELLO');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
    });

    it('should respect decimal places', () => {
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
    });
  });

  describe('shuffleArray', () => {
    it('should return array of same length', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.length).toBe(arr.length);
    });

    it('should contain same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not mutate original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty objects', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty objects', () => {
      expect(isEmpty({key: 'value'})).toBe(false);
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate primitives', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should remove duplicates by key', () => {
      const arr = [
        {id: 1, name: 'A'},
        {id: 2, name: 'B'},
        {id: 1, name: 'C'},
      ];
      expect(removeDuplicates(arr, 'id')).toEqual([
        {id: 1, name: 'A'},
        {id: 2, name: 'B'},
      ]);
    });
  });

  describe('groupBy', () => {
    it('should group items by key', () => {
      const arr = [
        {type: 'A', value: 1},
        {type: 'B', value: 2},
        {type: 'A', value: 3},
      ];
      const grouped = groupBy(arr, 'type');
      expect(grouped).toEqual({
        A: [
          {type: 'A', value: 1},
          {type: 'A', value: 3},
        ],
        B: [{type: 'B', value: 2}],
      });
    });
  });

  describe('safeJSONParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJSONParse('{"key": "value"}')).toEqual({key: 'value'});
    });

    it('should return fallback for invalid JSON', () => {
      expect(safeJSONParse('invalid', null)).toBeNull();
      expect(safeJSONParse('invalid', {default: true})).toEqual({default: true});
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUUID());
      }
      expect(uuids.size).toBe(100);
    });
  });

  describe('generateRandomColor', () => {
    it('should return a valid hex color', () => {
      const color = generateRandomColor();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
