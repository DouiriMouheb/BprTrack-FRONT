/**
 * Service for handling User Management API calls
 */

import { getAuthHeaders } from './authService';

// Environment-based configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Create fetch request with timeout
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options (headers, method, body, etc.)
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, options = {}, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} Array of all users
 * @throws {Error} If the request fails
 */
export const getAllUsers = async () => {
  const url = `${API_BASE_URL}/Users`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User object
 * @throws {Error} If the request fails
 */
export const getUserById = async (userId) => {
  const url = `${API_BASE_URL}/Users/${userId}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Get user by email
 * @param {string} email - The user email
 * @returns {Promise<Object>} User object
 * @throws {Error} If the request fails
 */
export const getUserByEmail = async (email) => {
  const url = `${API_BASE_URL}/Users/email/${encodeURIComponent(email)}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Update user
 * @param {string} userId - The user ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If the request fails
 */
export const updateUser = async (userId, userData) => {
  const url = `${API_BASE_URL}/Users/${userId}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors (400)
      if (response.status === 400 && data.errors) {
        const errorMessages = [];
        for (const field in data.errors) {
          errorMessages.push(...data.errors[field]);
        }
        throw new Error(errorMessages.join('. '));
      }
      
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Delete user
 * @param {string} userId - The user ID
 * @returns {Promise<void>}
 * @throws {Error} If the request fails
 */
export const deleteUser = async (userId) => {
  const url = `${API_BASE_URL}/Users/${userId}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};
