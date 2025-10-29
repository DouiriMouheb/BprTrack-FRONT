/**
 * Service for handling JWT Authentication API calls
 */

// Environment-based configuration
const AUTH_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Create fetch request with timeout
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
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
 * Login user and get JWT token
 * @param {string} usernameOrEmail - User's username or email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object containing token and user info
 * @throws {Error} If login fails
 */
export const login = async (usernameOrEmail, password) => {
  if (!usernameOrEmail || !password) {
    throw new Error('Username/Email and password are required');
  }

  const url = `${AUTH_API_BASE_URL}/auth/login`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameOrEmail, password }),
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
      
      // Handle invalid credentials or other errors
      if (data.message) {
        throw new Error(data.message);
      }
      
      throw new Error(`Login failed with status ${response.status}`);
    }

    // Store token and user info in localStorage
    if (data.token) {
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_info', JSON.stringify({
        username: data.username,
        email: data.email,
        roles: data.roles || [],
        expiresAt: data.expiresAt
      }));
    }

    return {
      success: true,
      token: data.token,
      user: {
        username: data.username,
        email: data.email,
        roles: data.roles || [],
        expiresAt: data.expiresAt
      }
    };
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object containing token and user info
 * @throws {Error} If registration fails
 */
export const register = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required');
  }

  const url = `${AUTH_API_BASE_URL}/auth/register`;

  try {
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
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
      
      // Handle other errors
      if (data.message) {
        throw new Error(data.message);
      }
      
      throw new Error(`Registration failed with status ${response.status}`);
    }

    // Store token and user info in localStorage
    if (data.token) {
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_info', JSON.stringify({
        username: data.username,
        email: data.email,
        roles: data.roles || [],
        expiresAt: data.expiresAt
      }));
    }

    return {
      success: true,
      token: data.token,
      user: {
        username: data.username,
        email: data.email,
        roles: data.roles || [],
        expiresAt: data.expiresAt
      }
    };
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Logout user and clear stored token
 */
export const logout = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
};

/**
 * Get stored JWT token
 * @returns {string|null} The stored JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem('jwt_token');
};

/**
 * Get stored user info
 * @returns {Object|null} The stored user info or null
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const userInfo = getUserInfo();
    
    // Check using expiresAt from response if available
    if (userInfo && userInfo.expiresAt) {
      const expirationTime = new Date(userInfo.expiresAt).getTime();
      if (Date.now() >= expirationTime) {
        logout(); // Clear expired token
        return false;
      }
      return true;
    }
    
    // Fallback: Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    
    // Check if token is expired
    if (Date.now() >= expirationTime) {
      logout(); // Clear expired token
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    logout();
    return false;
  }
};

/**
 * Get authorization header for API requests
 * @returns {Object} Headers object with Authorization header
 */
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
  };
};
