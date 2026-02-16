/**
 * API Service - Centralized API call functions
 * Handles authentication, request formatting, and error handling
 */
import store from '../redux/newStore';

/**
 * Standard API response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

/**
 * Get auth token from Redux store
 * This replaces direct usage of global.token
 */
const getAuthToken = (): string | null => {
  const state = store.getState();
  return state.auth?.token || null;
};

/**
 * Build request headers with authentication
 */
const setAuthHeader = (userToken?: string, isFormData: boolean = false): Headers => {
  const myHeaders = new Headers();
  // Use token from Redux store if not provided explicitly
  const token = userToken || getAuthToken();
  if (token) {
    myHeaders.append('Authorization', token);
  }

  if (!isFormData) {
    myHeaders.append('Content-Type', 'application/json');
  }

  return myHeaders;
};

/**
 * Perform GET request
 */
export const apiGet = async <T = ApiResponse>(
  url: string,
  userToken?: string,
): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: setAuthHeader(userToken),
    });
    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
};

/**
 * Perform POST request
 */
export const apiPost = async <T = ApiResponse>(
  url: string,
  userToken?: string,
  body?: string | FormData,
): Promise<T> => {
  try {
    const isFormData = body instanceof FormData;

    const response = await fetch(url, {
      method: 'POST',
      headers: setAuthHeader(userToken, isFormData),
      body: body,
    });

    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
};

/**
 * Perform PUT request
 */
export const apiPut = async <T = ApiResponse>(
  url: string,
  userToken?: string,
  body?: string | FormData,
): Promise<T> => {
  try {
    const isFormData = body instanceof FormData;

    const response = await fetch(url, {
      method: 'PUT',
      headers: setAuthHeader(userToken, isFormData),
      body: body,
    });
    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error('Error in PUT request:', error);
    throw error;
  }
};

/**
 * Perform DELETE request
 */
export const apiDelete = async <T = ApiResponse>(
  url: string,
  userToken?: string,
): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: setAuthHeader(userToken),
    });
    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error('Error in DELETE request:', error);
    throw error;
  }
};

/**
 * Default export with all methods
 */
export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
