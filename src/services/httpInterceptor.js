/**
 * HTTP Interceptor for handling authentication errors
 * Optional: Use this to automatically handle 401 Unauthorized responses
 */

import { logout, isAuthenticated } from './authService';

/**
 * Enhanced fetch wrapper with authentication error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  try {
    // Check if user is authenticated before making request
    if (!isAuthenticated()) {
      // Optionally redirect to login or throw error
      console.warn('User is not authenticated. Token may be expired.');
    }

    const response = await fetch(url, options);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error('Unauthorized request - logging out user');
      logout();
      
      // Optionally redirect to login page
      // window.location.href = '/';
      
      throw new Error('Session expired. Please login again.');
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }

    return response;
  } catch (error) {
    // Re-throw the error for the calling function to handle
    throw error;
  }
};

/**
 * Example: How to use this interceptor in dataService.js
 * 
 * Instead of:
 *   const response = await fetch(url, options);
 * 
 * Use:
 *   const response = await authenticatedFetch(url, options);
 * 
 * This will automatically handle 401 errors and logout the user
 */
