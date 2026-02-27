/**
 * Input Sanitization Utilities
 * Protects against XSS, SQL injection, and other malicious inputs
 */

/**
 * Sanitize string to prevent XSS attacks
 * Removes/escapes potentially dangerous characters
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize HTML content
 * Removes script tags and dangerous attributes
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
};

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export const sanitizeURL = (url: string): string => {
  if (!url) return '';

  // Convert to lowercase for checking
  const lowerURL = url.toLowerCase().trim();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  for (const protocol of dangerousProtocols) {
    if (lowerURL.startsWith(protocol)) {
      return '';
    }
  }

  // Only allow http, https, mailto, tel
  const allowedProtocols = ['http://', 'https://', 'mailto:', 'tel:'];
  const hasValidProtocol = allowedProtocols.some(protocol =>
    lowerURL.startsWith(protocol),
  );

  if (!hasValidProtocol && lowerURL.includes(':')) {
    return '';
  }

  return url;
};

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';

  // Remove spaces and convert to lowercase
  let sanitized = email.trim().toLowerCase();

  // Remove any characters that aren't allowed in emails
  sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, '');

  // Ensure only one @ symbol
  const atCount = (sanitized.match(/@/g) || []).length;
  if (atCount !== 1) {
    return '';
  }

  return sanitized;
};

/**
 * Sanitize filename to prevent directory traversal
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename) return '';

  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');

  // Remove path separators
  sanitized = sanitized.replace(/[/\\]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized;
};

/**
 * Sanitize phone number
 */
export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-numeric characters except + at start
  let sanitized = phone.trim();

  // Allow + only at the beginning
  if (sanitized.startsWith('+')) {
    sanitized = '+' + sanitized.slice(1).replace(/[^0-9]/g, '');
  } else {
    sanitized = sanitized.replace(/[^0-9]/g, '');
  }

  return sanitized;
};

/**
 * Sanitize user input for search queries
 * Removes special characters that could cause issues
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query) return '';

  // Trim and limit length
  let sanitized = query.trim().substring(0, 200);

  // Remove SQL injection attempts
  const sqlKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'CREATE',
    'ALTER',
    'EXEC',
    'EXECUTE',
    'UNION',
    'SCRIPT',
  ];

  for (const keyword of sqlKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '');
  }

  // Remove special SQL characters
  sanitized = sanitized.replace(/[';"`]/g, '');

  return sanitized;
};

/**
 * Sanitize JSON input
 * Prevents JSON injection attacks
 */
export const sanitizeJSON = (jsonString: string): string | null => {
  if (!jsonString) return null;

  try {
    // First validate it's proper JSON
    const parsed = JSON.parse(jsonString);

    // Re-stringify to ensure no injected code
    return JSON.stringify(parsed);
  } catch (error) {
    return null;
  }
};

/**
 * Sanitize object properties recursively
 * Useful for form data before sending to API
 */
export const sanitizeObject = <T extends Record<string, unknown>>(
  obj: T,
): T => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string'
          ? sanitizeString(item)
          : typeof item === 'object' && item !== null
            ? sanitizeObject(item as Record<string, unknown>)
            : item,
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};

/**
 * Strip out any potentially dangerous characters from user input
 */
export const stripDangerousChars = (input: string): string => {
  if (!input) return '';

  // Remove null bytes
  let result = input.replace(/\0/g, '');

  // Remove non-printable characters
  result = result.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  return result.trim();
};

/**
 * Validate and sanitize base64 encoded data
 */
export const sanitizeBase64 = (base64: string): string | null => {
  if (!base64) return null;

  // Remove any non-base64 characters
  const sanitized = base64.replace(/[^A-Za-z0-9+/=]/g, '');

  // Validate it's proper base64
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(sanitized)) {
    return null;
  }

  return sanitized;
};
