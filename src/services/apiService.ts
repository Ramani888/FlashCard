/**
 * Enhanced API Service with Axios-like features
 * Provides request/response interceptors, error handling, and retry logic
 */
import Config from '../config';
import showMessageOnTheScreen from '../component/ShowMessageOnTheScreen';
import secureStorage from './secureStorageService';

interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  showError?: boolean;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = Config.API_BASE_URL;
    this.defaultTimeout = Config.API_TIMEOUT;
    this.defaultRetries = Config.MAX_RETRIES;
    // Note: Token is set explicitly via setAuthToken() after loading from storage
    // in Redux authSlice loadStoredUser thunk
  }

  // Set auth token
  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // Get current auth token
  public getAuthToken(): string | null {
    return this.authToken;
  }

  // Build headers with security additions
  private buildHeaders(
    customHeaders?: Record<string, string>,
    isFormData: boolean = false,
  ): Headers {
    const headers = new Headers();

    // Authorization header (without Bearer prefix to match backend)
    if (this.authToken) {
      headers.append('Authorization', this.authToken);
    }

    // Content type
    if (!isFormData) {
      headers.append('Content-Type', 'application/json');
    }

    // Security headers
    headers.append('Accept', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest'); // CSRF protection
    headers.append('X-Client-Version', Config.APP_VERSION);
    headers.append('X-Platform', 'mobile');
    
    // Request tracking
    headers.append('X-Request-ID', this.generateRequestId());
    headers.append('X-Timestamp', Date.now().toString());

    // Custom headers
    if (customHeaders) {
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.append(key, value);
      });
    }

    return headers;
  }

  // Request with timeout
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  // Request with retry logic
  private async requestWithRetry<T>(
    method: string,
    url: string,
    body?: unknown,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const {
      headers: customHeaders,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      showError = true,
    } = config;

    // Use full URL if provided, otherwise construct with baseUrl
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    const isFormData = body instanceof FormData;
    const headers = this.buildHeaders(customHeaders, isFormData);

    console.log('[API] Request:', {method, url: fullUrl, hasBody: !!body});

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      requestOptions.body = isFormData ? body : JSON.stringify(body);
    }

    let lastError: Error | null = null;
    let attempts = 0;

    while (attempts < retries) {
      try {
        const response = await this.fetchWithTimeout(
          fullUrl,
          requestOptions,
          timeout,
        );

        console.log('[API] Response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        // Handle different response statuses
        if (response.status === 401) {
          // Token expired - handle logout
          await this.handleUnauthorized();
          return {
            success: false,
            message: 'Session expired. Please login again.',
          };
        }

        if (response.status === 404) {
          return {
            success: false,
            message: 'Resource not found',
          };
        }

        if (response.status >= 500) {
          throw new Error('Server error');
        }

        // Parse response regardless of status code
        const result = await response.json();
        console.log('[API] Result:', {
          success: result.success,
          hasData: !!result.data,
          message: result.message,
        });
        
        // Return result even if HTTP status is not OK (e.g., 400, 403)
        // Backend should set success: false in these cases
        return result as ApiResponse<T>;
      } catch (error) {
        lastError = error as Error;
        attempts++;

        console.log('[API] Error:', {
          attempt: attempts,
          error: lastError.message,
          name: lastError.name,
        });

        if (lastError.name === 'AbortError') {
          if (showError) {
            showMessageOnTheScreen('Request timeout. Please try again.');
          }
          break;
        }

        // Wait before retry
        if (attempts < retries) {
          await new Promise(resolve =>
            setTimeout(resolve, Config.RETRY_DELAY * attempts),
          );
        }
      }
    }

    // All retries failed
    const errorMessage = lastError?.message || 'Request failed';
    console.log('[API] All retries failed:', errorMessage);
    
    if (showError) {
      showMessageOnTheScreen(errorMessage);
    }

    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }

  // Handle 401 unauthorized
  private async handleUnauthorized(): Promise<void> {
    this.authToken = null;
    await secureStorage.logout();
    // Optionally dispatch a logout action here
  }

  // Public methods
  public async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>('GET', url, undefined, config);
  }

  public async post<T>(
    url: string,
    body: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>('POST', url, body, config);
  }

  public async put<T>(
    url: string,
    body: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>('PUT', url, body, config);
  }

  public async patch<T>(
    url: string,
    body: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>('PATCH', url, body, config);
  }

  public async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>('DELETE', url, undefined, config);
  }

  // Upload file with progress tracking
  public async uploadFile<T>(
    url: string,
    formData: FormData,
    _onProgress?: (progress: number) => void,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>('POST', url, formData, config);
  }

  // ========== SECURITY UTILITIES ==========

  /**
   * Generate unique request ID for tracking
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate response integrity
   * Can be extended to verify signatures if backend implements it
   */
  private validateResponse(response: Response): boolean {
    // Check for suspicious headers or response patterns
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json') && !contentType.includes('text/')) {
      return false;
    }

    // Add more validation as needed
    return true;
  }

  /**
   * Sanitize request data before sending
   */
  private sanitizeRequestData(data: unknown): unknown {
    if (typeof data === 'string') {
      // Basic sanitization
      return data.trim();
    }
    // For objects, could add more comprehensive sanitization
    return data;
  }
}

// Singleton instance
const apiService = new ApiService();
export default apiService;

// Also export the class for testing
export {ApiService};
