/**
 * Enhanced API Service with Axios-like features
 * Provides request/response interceptors, error handling, and retry logic
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';
import showMessageOnTheScreen from '../component/ShowMessageOnTheScreen';

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
    this.loadAuthToken();
  }

  // Load auth token from storage
  private async loadAuthToken(): Promise<void> {
    try {
      const userData = await AsyncStorage.getItem(Config.STORAGE_KEYS.USER);
      if (userData) {
        const user = JSON.parse(userData);
        this.authToken = user?.token || null;
      }
    } catch (error) {
      console.error('Failed to load auth token:', error);
    }
  }

  // Set auth token
  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // Build headers
  private buildHeaders(
    customHeaders?: Record<string, string>,
    isFormData: boolean = false,
  ): Headers {
    const headers = new Headers();

    if (this.authToken) {
      headers.append('Authorization', this.authToken);
    }

    if (!isFormData) {
      headers.append('Content-Type', 'application/json');
    }

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

    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    const isFormData = body instanceof FormData;
    const headers = this.buildHeaders(customHeaders, isFormData);

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

        const result = await response.json();
        return result as ApiResponse<T>;
      } catch (error) {
        lastError = error as Error;
        attempts++;

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
    await AsyncStorage.removeItem(Config.STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(Config.STORAGE_KEYS.TOKEN);
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
}

// Singleton instance
const apiService = new ApiService();
export default apiService;

// Also export the class for testing
export {ApiService};
