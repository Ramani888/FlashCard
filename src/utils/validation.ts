/**
 * Validation utilities for the FlashCard application
 * Provides consistent validation patterns across the app
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return {isValid: false, error: 'Email is required'};
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return {isValid: false, error: 'Please enter a valid email address'};
  }

  return {isValid: true};
};

// Password validation
export const validatePassword = (
  password: string,
  options?: {minLength?: number; requireNumbers?: boolean; requireSpecial?: boolean; requireUppercase?: boolean; requireLowercase?: boolean},
): ValidationResult => {
  const {
    minLength = 8,
    requireNumbers = true,
    requireSpecial = true,
    requireUppercase = true,
    requireLowercase = true,
  } = options || {};

  if (!password) {
    return {isValid: false, error: 'Password is required'};
  }

  if (password.length < minLength) {
    return {isValid: false, error: `Password must be at least ${minLength} characters`};
  }

  if (password.length > 128) {
    return {isValid: false, error: 'Password must be less than 128 characters'};
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {isValid: false, error: 'Password must contain at least one uppercase letter'};
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {isValid: false, error: 'Password must contain at least one lowercase letter'};
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {isValid: false, error: 'Password must contain at least one number'};
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {isValid: false, error: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'};
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return {isValid: false, error: 'This password is too common. Please choose a stronger password'};
  }

  return {isValid: true};
};

/**
 * Strong password validator for sensitive operations
 * Requires uppercase, lowercase, number, special character, and minimum 10 characters
 */
export const validateStrongPassword = (password: string): ValidationResult => {
  return validatePassword(password, {
    minLength: 10,
    requireNumbers: true,
    requireSpecial: true,
    requireUppercase: true,
    requireLowercase: true,
  });
};

/**
 * Calculate password strength (0-5 scale)
 * 0 = Very Weak, 5 = Very Strong
 */
export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  feedback: string[];
} => {
  if (!password) {
    return {score: 0, label: 'Very Weak', feedback: ['Password is required']};
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length < 8) {
    feedback.push('Use at least 8 characters');
  }

  // Character diversity
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('Add special characters');

  // Penalize common patterns
  if (/^(.)\1+$/.test(password)) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid repeating characters');
  }

  if (/12345|qwerty|password/i.test(password)) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns');
  }

  // Normalize score to 0-5
  score = Math.min(5, Math.max(0, Math.floor((score / 7) * 5)));

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return {
    score,
    label: labels[score],
    feedback: feedback.length > 0 ? feedback : ['Great password!'],
  };
};

// Name validation
export const validateName = (name: string, fieldName = 'Name'): ValidationResult => {
  if (!name || name.trim() === '') {
    return {isValid: false, error: `${fieldName} is required`};
  }

  if (name.trim().length < 2) {
    return {isValid: false, error: `${fieldName} must be at least 2 characters`};
  }

  if (name.trim().length > 50) {
    return {isValid: false, error: `${fieldName} must be less than 50 characters`};
  }

  return {isValid: true};
};

// OTP validation
export const validateOTP = (otp: string, length = 6): ValidationResult => {
  if (!otp) {
    return {isValid: false, error: 'OTP is required'};
  }

  if (!/^\d+$/.test(otp)) {
    return {isValid: false, error: 'OTP must contain only numbers'};
  }

  if (otp.length !== length) {
    return {isValid: false, error: `OTP must be ${length} digits`};
  }

  return {isValid: true};
};

// Required field validation
export const validateRequired = (value: unknown, fieldName: string): ValidationResult => {
  if (value === null || value === undefined) {
    return {isValid: false, error: `${fieldName} is required`};
  }

  if (typeof value === 'string' && value.trim() === '') {
    return {isValid: false, error: `${fieldName} is required`};
  }

  if (Array.isArray(value) && value.length === 0) {
    return {isValid: false, error: `${fieldName} is required`};
  }

  return {isValid: true};
};

// URL validation
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const validateURL = (url: string): ValidationResult => {
  if (!url || url.trim() === '') {
    return {isValid: false, error: 'URL is required'};
  }

  if (!URL_REGEX.test(url.trim())) {
    return {isValid: false, error: 'Please enter a valid URL'};
  }

  return {isValid: true};
};

// Form validation helper
export interface FormField {
  value: unknown;
  validators: ((value: unknown) => ValidationResult)[];
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export const validateForm = (fields: Record<string, FormField>): {
  isValid: boolean;
  errors: FormErrors;
} => {
  const errors: FormErrors = {};
  let isValid = true;

  for (const [fieldName, field] of Object.entries(fields)) {
    for (const validator of field.validators) {
      const result = validator(field.value);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        break;
      }
    }
  }

  return {isValid, errors};
};

// Confirm password validation
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword) {
    return {isValid: false, error: 'Please confirm your password'};
  }

  if (password !== confirmPassword) {
    return {isValid: false, error: 'Passwords do not match'};
  }

  return {isValid: true};
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateOTP,
  validateRequired,
  validateURL,
  validateForm,
  validateConfirmPassword,
};
