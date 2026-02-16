/**
 * Tests for validation utilities
 */
import {
  validateEmail,
  validatePassword,
  validateName,
  validateOTP,
  validateRequired,
  validateURL,
  validateForm,
  validateConfirmPassword,
} from '../../src/utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return valid for correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return invalid for malformed email', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return invalid for email without domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return valid for password meeting requirements', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should return invalid for short password', () => {
      const result = validatePassword('12345', {minLength: 6});
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters');
    });

    it('should enforce number requirement when specified', () => {
      const result = validatePassword('password', {requireNumbers: true});
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one number');
    });

    it('should enforce special character requirement when specified', () => {
      const result = validatePassword('password123', {requireSpecial: true});
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must contain at least one special character');
    });

    it('should pass all requirements', () => {
      const result = validatePassword('Password123!', {
        minLength: 8,
        requireNumbers: true,
        requireSpecial: true,
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateName', () => {
    it('should return valid for correct name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should return invalid for short name', () => {
      const result = validateName('J');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('should use custom field name in error', () => {
      const result = validateName('', 'Username');
      expect(result.error).toBe('Username is required');
    });
  });

  describe('validateOTP', () => {
    it('should return valid for correct OTP', () => {
      const result = validateOTP('123456');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty OTP', () => {
      const result = validateOTP('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('OTP is required');
    });

    it('should return invalid for non-numeric OTP', () => {
      const result = validateOTP('12a456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('OTP must contain only numbers');
    });

    it('should return invalid for wrong length OTP', () => {
      const result = validateOTP('12345');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('OTP must be 6 digits');
    });

    it('should support custom OTP length', () => {
      const result = validateOTP('1234', 4);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateRequired', () => {
    it('should return valid for non-empty string', () => {
      const result = validateRequired('value', 'Field');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null value', () => {
      const result = validateRequired(null, 'Field');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should return invalid for undefined value', () => {
      const result = validateRequired(undefined, 'Field');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for empty string', () => {
      const result = validateRequired('  ', 'Field');
      expect(result.isValid).toBe(false);
    });

    it('should return invalid for empty array', () => {
      const result = validateRequired([], 'Items');
      expect(result.isValid).toBe(false);
    });

    it('should return valid for non-empty array', () => {
      const result = validateRequired(['item'], 'Items');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateURL', () => {
    it('should return valid for correct URL', () => {
      const result = validateURL('https://example.com');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for URL without protocol', () => {
      const result = validateURL('example.com');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for empty URL', () => {
      const result = validateURL('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('URL is required');
    });

    it('should return invalid for malformed URL', () => {
      const result = validateURL('not-a-url');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateConfirmPassword', () => {
    it('should return valid when passwords match', () => {
      const result = validateConfirmPassword('password123', 'password123');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid when passwords do not match', () => {
      const result = validateConfirmPassword('password123', 'password456');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should return invalid for empty confirm password', () => {
      const result = validateConfirmPassword('password123', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please confirm your password');
    });
  });

  describe('validateForm', () => {
    it('should validate form with multiple fields', () => {
      const result = validateForm({
        email: {
          value: 'test@example.com',
          validators: [value => validateEmail(value as string)],
        },
        password: {
          value: 'password123',
          validators: [value => validatePassword(value as string)],
        },
      });

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should return errors for invalid fields', () => {
      const result = validateForm({
        email: {
          value: 'invalid',
          validators: [value => validateEmail(value as string)],
        },
        password: {
          value: '',
          validators: [value => validatePassword(value as string)],
        },
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });
  });
});
