/**
 * Service for handling Data API calls
 */

// Environment-based configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Create fetch request with timeout
 * @param {string} url - The URL to fetch
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
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
 * Search for data by chiaveRicerca
 * @param {string} chiaveRicerca - The search key
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
export const searchData = async (chiaveRicerca) => {
  if (!chiaveRicerca || !chiaveRicerca.trim()) {
    throw new Error('Search key is required');
  }

  const encodedKey = encodeURIComponent(chiaveRicerca.trim());
  const url = `${API_BASE_URL}/Data/${encodedKey}`;

  try {
    const response = await fetchWithTimeout(url);

    // Try to parse JSON response for both success and error cases
    const data = await response.json();

    if (!response.ok) {
      // If the response has a message property, use it for the error
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Get API base URL (useful for debugging)
 * @returns {string}
 */
export const getApiBaseUrl = () => API_BASE_URL;
