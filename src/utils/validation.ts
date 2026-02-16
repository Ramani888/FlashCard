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
  options?: {minLength?: number; requireNumbers?: boolean; requireSpecial?: boolean},
): ValidationResult => {
  const {minLength = 6, requireNumbers = false, requireSpecial = false} = options || {};

  if (!password) {
    return {isValid: false, error: 'Password is required'};
  }

  if (password.length < minLength) {
    return {isValid: false, error: `Password must be at least ${minLength} characters`};
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {isValid: false, error: 'Password must contain at least one number'};
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {isValid: false, error: 'Password must contain at least one special character'};
  }

  return {isValid: true};
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
