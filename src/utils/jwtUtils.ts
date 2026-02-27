/**
 * JWT Token Utilities
 * Decode and validate JWT tokens without external dependencies
 */

interface JWTPayload {
  userId: string;
  exp?: number; // Expiry timestamp in seconds
  iat?: number; // Issued at timestamp
  [key: string]: any;
}

/**
 * Base64 decode for React Native
 * @param str - Base64 encoded string
 * @returns Decoded string
 */
const base64UrlDecode = (str: string): string => {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  const padLength = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(padLength);
  
  // Decode base64 in React Native compatible way
  // Using a simple base64 decoder implementation
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  
  for (let i = 0; i < base64.length; i += 4) {
    const enc1 = chars.indexOf(base64[i]);
    const enc2 = chars.indexOf(base64[i + 1]);
    const enc3 = chars.indexOf(base64[i + 2]);
    const enc4 = chars.indexOf(base64[i + 3]);
    
    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;
    
    output += String.fromCharCode(chr1);
    
    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }
  
  return output;
};

/**
 * Decode JWT token payload
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT has 3 parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Decode base64
    const decodedPayload = base64UrlDecode(payload);
    
    // Parse JSON
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid, false if still valid
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    if (!payload) {
      console.log('[JWT] Failed to decode token');
      return true;
    }
    
    if (!payload.exp) {
      console.log('[JWT] Token has no expiry field');
      return true;
    }

    // JWT exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired (no buffer for now to avoid premature expiry)
    const isExpired = payload.exp < currentTime;
    
    const expiryDate = new Date(payload.exp * 1000);
    const remainingDays = (payload.exp - currentTime) / (60 * 60 * 24);
    
    console.log('[JWT] Token check:', {
      currentTime,
      expiryTime: payload.exp,
      expiryDate: expiryDate.toISOString(),
      remainingDays: remainingDays.toFixed(2),
      isExpired,
    });
    
    return isExpired;
  } catch (error) {
    console.error('[JWT] Failed to check token expiry:', error);
    return true; // Treat errors as expired for safety
  }
};

/**
 * Get token expiry time
 * @param token - JWT token string
 * @returns Expiry date or null if invalid
 */
export const getTokenExpiry = (token: string): Date | null => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return null;
    }
    // Convert seconds to milliseconds
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Failed to get token expiry:', error);
    return null;
  }
};

/**
 * Get remaining time until token expires
 * @param token - JWT token string
 * @returns Remaining milliseconds or 0 if expired
 */
export const getTokenRemainingTime = (token: string): number => {
  try {
    const expiry = getTokenExpiry(token);
    if (!expiry) {
      return 0;
    }
    const remaining = expiry.getTime() - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error('Failed to get token remaining time:', error);
    return 0;
  }
};
