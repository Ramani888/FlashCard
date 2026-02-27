/**
 * JWT Utilities Tests
 */
import {
  decodeJWT,
  isTokenExpired,
  getTokenExpiry,
  getTokenRemainingTime,
} from '../../src/utils/jwtUtils';

// Base64 encode helper for tests (React Native compatible)
const base64UrlEncode = (str: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  
  for (let i = 0; i < str.length; i += 3) {
    const chr1 = str.charCodeAt(i);
    const chr2 = i + 1 < str.length ? str.charCodeAt(i + 1) : NaN;
    const chr3 = i + 2 < str.length ? str.charCodeAt(i + 2) : NaN;
    
    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    const enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    const enc4 = chr3 & 63;
    
    if (isNaN(chr2)) {
      output += chars[enc1] + chars[enc2] + '==';
    } else if (isNaN(chr3)) {
      output += chars[enc1] + chars[enc2] + chars[enc3] + '=';
    } else {
      output += chars[enc1] + chars[enc2] + chars[enc3] + chars[enc4];
    }
  }
  
  // Convert to URL-safe base64
  return output.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

describe('JWT Utils', () => {
  // Mock token with 30 days expiry (similar to backend)
  const createMockToken = (expiresInDays: number): string => {
    const header = {alg: 'HS256', typ: 'JWT'};
    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = currentTime + expiresInDays * 24 * 60 * 60;
    const payload = {
      userId: 'test-user-id',
      iat: currentTime,
      exp: expiryTime,
    };

    const encodeBase64 = (obj: any): string => {
      const json = JSON.stringify(obj);
      return base64UrlEncode(json);
    };

    const encodedHeader = encodeBase64(header);
    const encodedPayload = encodeBase64(payload);
    const signature = 'fake-signature';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  };

  const validToken = createMockToken(30); // 30 days from now
  const expiredToken = createMockToken(-1); // Expired yesterday

  describe('decodeJWT', () => {
    it('should decode a valid JWT token', () => {
      const decoded = decodeJWT(validToken);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe('test-user-id');
      expect(decoded?.exp).toBeDefined();
    });

    it('should return null for invalid token format', () => {
      const decoded = decodeJWT('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for empty token', () => {
      const decoded = decodeJWT('');
      expect(decoded).toBeNull();
    });

    it('should return null for malformed JWT', () => {
      const decoded = decodeJWT('header.payload');
      expect(decoded).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const expired = isTokenExpired(validToken);
      expect(expired).toBe(false);
    });

    it('should return true for expired token', () => {
      const expired = isTokenExpired(expiredToken);
      expect(expired).toBe(true);
    });

    it('should return true for invalid token', () => {
      const expired = isTokenExpired('invalid-token');
      expect(expired).toBe(true);
    });

    it('should return true for token without expiry', () => {
      const header = {alg: 'HS256', typ: 'JWT'};
      const payload = {userId: 'test-user-id'}; // No exp field
      const encodeBase64 = (obj: any): string => {
        return base64UrlEncode(JSON.stringify(obj));
      };
      const token = `${encodeBase64(header)}.${encodeBase64(payload)}.signature`;
      const expired = isTokenExpired(token);
      expect(expired).toBe(true);
    });
  });

  describe('getTokenExpiry', () => {
    it('should return expiry date for valid token', () => {
      const expiry = getTokenExpiry(validToken);
      expect(expiry).toBeInstanceOf(Date);
      expect(expiry!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return null for invalid token', () => {
      const expiry = getTokenExpiry('invalid-token');
      expect(expiry).toBeNull();
    });

    it('should return null for token without expiry', () => {
      const header = {alg: 'HS256', typ: 'JWT'};
      const payload = {userId: 'test-user-id'};
      const encodeBase64 = (obj: any): string => {
        return base64UrlEncode(JSON.stringify(obj));
      };
      const token = `${encodeBase64(header)}.${encodeBase64(payload)}.signature`;
      const expiry = getTokenExpiry(token);
      expect(expiry).toBeNull();
    });
  });

  describe('getTokenRemainingTime', () => {
    it('should return positive time for valid token', () => {
      const remaining = getTokenRemainingTime(validToken);
      expect(remaining).toBeGreaterThan(0);
      // Should be close to 30 days (25-31 days to account for test execution time)
      const daysRemaining = remaining / (1000 * 60 * 60 * 24);
      expect(daysRemaining).toBeGreaterThan(25);
      expect(daysRemaining).toBeLessThan(31);
    });

    it('should return 0 for expired token', () => {
      const remaining = getTokenRemainingTime(expiredToken);
      expect(remaining).toBe(0);
    });

    it('should return 0 for invalid token', () => {
      const remaining = getTokenRemainingTime('invalid-token');
      expect(remaining).toBe(0);
    });
  });

  describe('Token expiry', () => {
    it('should not consider token expired if it has not reached expiry time', () => {
      // Create a token that expires in 4 minutes
      const header = {alg: 'HS256', typ: 'JWT'};
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = currentTime + 4 * 60; // 4 minutes from now
      const payload = {
        userId: 'test-user-id',
        exp: expiryTime,
      };
      const encodeBase64 = (obj: any): string => {
        return base64UrlEncode(JSON.stringify(obj));
      };
      const token = `${encodeBase64(header)}.${encodeBase64(payload)}.signature`;

      // Should still be valid (no buffer applied)
      const expired = isTokenExpired(token);
      expect(expired).toBe(false);
    });

    it('should not consider token expired if more than 5 minutes remaining', () => {
      // Create a token that expires in 10 minutes
      const header = {alg: 'HS256', typ: 'JWT'};
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = currentTime + 10 * 60; // 10 minutes from now
      const payload = {
        userId: 'test-user-id',
        exp: expiryTime,
      };
      const encodeBase64 = (obj: any): string => {
        return base64UrlEncode(JSON.stringify(obj));
      };
      const token = `${encodeBase64(header)}.${encodeBase64(payload)}.signature`;

      // Should still be valid
      const expired = isTokenExpired(token);
      expect(expired).toBe(false);
    });

    it('should consider token expired if past expiry time', () => {
      // Create a token that expired 1 minute ago
      const header = {alg: 'HS256', typ: 'JWT'};
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = currentTime - 60; // 1 minute ago
      const payload = {
        userId: 'test-user-id',
        exp: expiryTime,
      };
      const encodeBase64 = (obj: any): string => {
        return base64UrlEncode(JSON.stringify(obj));
      };
      const token = `${encodeBase64(header)}.${encodeBase64(payload)}.signature`;

      // Should be expired
      const expired = isTokenExpired(token);
      expect(expired).toBe(true);
    });
  });
});
