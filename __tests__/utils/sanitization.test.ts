/**
 * Tests for sanitization utilities
 */
import {
  sanitizeString,
  sanitizeHTML,
  sanitizeURL,
  sanitizeEmail,
  sanitizeFilename,
  sanitizePhoneNumber,
  sanitizeSearchQuery,
  sanitizeObject,
} from '../../src/utils/sanitization';

describe('Sanitization Utilities', () => {
  describe('sanitizeString', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeString(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('should escape ampersands', () => {
      const result = sanitizeString('Tom & Jerry');
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should escape quotes', () => {
      const result = sanitizeString('He said "hello"');
      expect(result).toBe('He said &quot;hello&quot;');
    });

    it('should handle empty string', () => {
      const result = sanitizeString('');
      expect(result).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
    });
  });

  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const input = '<div>Hello<script>alert("XSS")</script>World</div>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('HelloWorld');
    });

    it('should remove event handlers', () => {
      const input = '<div onclick="alert(\'XSS\')">Click me</div>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onclick');
    });

    it('should remove javascript: protocol', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Link</a>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('javascript:');
    });

    it('should remove data:text/html protocol', () => {
      const input = '<a href="data:text/html,<script>alert(\'XSS\')</script>">Link</a>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('data:text/html');
    });

    it('should handle empty string', () => {
      const result = sanitizeHTML('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeURL', () => {
    it('should allow http URLs', () => {
      const url = 'http://example.com';
      const result = sanitizeURL(url);
      expect(result).toBe(url);
    });

    it('should allow https URLs', () => {
      const url = 'https://example.com';
      const result = sanitizeURL(url);
      expect(result).toBe(url);
    });

    it('should allow mailto URLs', () => {
      const url = 'mailto:test@example.com';
      const result = sanitizeURL(url);
      expect(result).toBe(url);
    });

    it('should allow tel URLs', () => {
      const url = 'tel:+1234567890';
      const result = sanitizeURL(url);
      expect(result).toBe(url);
    });

    it('should block javascript: protocol', () => {
      const url = 'javascript:alert("XSS")';
      const result = sanitizeURL(url);
      expect(result).toBe('');
    });

    it('should block data: protocol', () => {
      const url = 'data:text/html,<script>alert("XSS")</script>';
      const result = sanitizeURL(url);
      expect(result).toBe('');
    });

    it('should block vbscript: protocol', () => {
      const url = 'vbscript:msgbox("XSS")';
      const result = sanitizeURL(url);
      expect(result).toBe('');
    });

    it('should block file: protocol', () => {
      const url = 'file:///etc/passwd';
      const result = sanitizeURL(url);
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = sanitizeURL('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('should convert to lowercase', () => {
      const result = sanitizeEmail('Test@Example.COM');
      expect(result).toBe('test@example.com');
    });

    it('should remove spaces', () => {
      const result = sanitizeEmail(' test@example.com ');
      expect(result).toBe('test@example.com');
    });

    it('should remove invalid characters', () => {
      const result = sanitizeEmail('test!#$@example.com');
      expect(result).toBe('test@example.com');
    });

    it('should reject emails without @', () => {
      const result = sanitizeEmail('testexample.com');
      expect(result).toBe('');
    });

    it('should reject emails with multiple @', () => {
      const result = sanitizeEmail('test@@example.com');
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = sanitizeEmail('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove directory traversal attempts', () => {
      const result = sanitizeFilename('../../etc/passwd');
      expect(result).not.toContain('..');
    });

    it('should remove path separators', () => {
      const result = sanitizeFilename('path/to/file.txt');
      expect(result).not.toContain('/');
      expect(result).toBe('pathtofile.txt');
    });

    it('should remove null bytes', () => {
      const result = sanitizeFilename('file\0.txt');
      expect(result).not.toContain('\0');
    });

    it('should limit length to 255 characters', () => {
      const longName = 'a'.repeat(300);
      const result = sanitizeFilename(longName);
      expect(result.length).toBeLessThanOrEqual(255);
    });

    it('should handle empty string', () => {
      const result = sanitizeFilename('');
      expect(result).toBe('');
    });
  });

  describe('sanitizePhoneNumber', () => {
    it('should allow + at the beginning', () => {
      const result = sanitizePhoneNumber('+1234567890');
      expect(result).toBe('+1234567890');
    });

    it('should remove non-numeric characters except leading +', () => {
      const result = sanitizePhoneNumber('+1 (234) 567-890');
      expect(result).toBe('+1234567890');
    });

    it('should remove spaces', () => {
      const result = sanitizePhoneNumber('123 456 7890');
      expect(result).toBe('1234567890');
    });

    it('should handle phone without country code', () => {
      const result = sanitizePhoneNumber('1234567890');
      expect(result).toBe('1234567890');
    });

    it('should handle empty string', () => {
      const result = sanitizePhoneNumber('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should trim and limit length', () => {
      const longQuery = 'a'.repeat(300);
      const result = sanitizeSearchQuery(longQuery);
      expect(result.length).toBeLessThanOrEqual(200);
    });

    it('should remove SQL injection attempts', () => {
      const result = sanitizeSearchQuery("test' OR '1'='1");
      expect(result).not.toContain("'");
    });

    it('should handle normal search queries', () => {
      const result = sanitizeSearchQuery('test search query');
      expect(result).toBe('test search query');
    });

    it('should handle empty string', () => {
      const result = sanitizeSearchQuery('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string values in object', () => {
      const obj = {
        name: '<script>alert("XSS")</script>',
        email: 'Test@Example.com',
        age: 25,
      };
      const result = sanitizeObject(obj);
      expect(result.name).not.toContain('<script>');
      expect(result.age).toBe(25);
    });

    it('should handle nested objects', () => {
      const obj = {
        user: {
          name: '<script>XSS</script>',
          profile: {
            bio: '<script>XSS</script>',
          },
        },
      };
      const result = sanitizeObject(obj);
      expect(result.user.name).not.toContain('<script>');
      expect(result.user.profile.bio).not.toContain('<script>');
    });

    it('should handle arrays', () => {
      const obj = {
        tags: ['<script>XSS</script>', 'safe tag'],
      };
      const result = sanitizeObject(obj);
      expect(result.tags[0]).not.toContain('<script>');
      expect(result.tags[1]).toBe('safe tag');
    });

    it('should handle null and undefined values', () => {
      const obj = {
        name: null,
        email: undefined,
        age: 25,
      };
      const result = sanitizeObject(obj);
      expect(result.name).toBeNull();
      expect(result.email).toBeUndefined();
      expect(result.age).toBe(25);
    });

    it('should handle empty object', () => {
      const result = sanitizeObject({});
      expect(result).toEqual({});
    });
  });
});
