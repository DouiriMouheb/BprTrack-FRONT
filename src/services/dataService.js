/**
 * Service for handling Data API calls
 */

// Environment-based configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const CERT_API_BASE_URL = import.meta.env.VITE_CERT_API_BASE_URL || 'http://172.31.95.29:5001/api';
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
 * Get all data records
 * @returns {Promise<Array>} Array of all data records
 * @throws {Error} If the request fails
 */
export const getAllData = async () => {
  const url = `${API_BASE_URL}/data`;

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
 * Request certification for pending records
 * @param {Object} certificationData - Certification request payload
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
export const requestCertification = async (certificationData) => {
  const url = `${CERT_API_BASE_URL}/requestCert`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certificationData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    // Handle network errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Batch update ticket for multiple records
 * @param {string} ticket - The ticket ID to set
 * @param {Array<string>} recordIds - Array of record IDs to update
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
export const batchUpdateTicket = async (ticket, recordIds) => {
  const url = `${API_BASE_URL}/data/batch-update`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket,
        recordIds,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    // Handle network errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Get gas price for certification
 * @returns {Promise<any>} The API response data with gas price information
 * @throws {Error} If the request fails
 */
export const getGasPrice = async () => {
  const url = `${CERT_API_BASE_URL}/getGasPrice`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Finalize certification with gas price
 * @param {Object} certifyData - Certification finalization payload
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
export const finalizeCertification = async (certifyData) => {
  const url = `${CERT_API_BASE_URL}/certify`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certifyData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Batch update price information for multiple records
 * @param {number} priceEUR - The price in EUR
 * @param {number} changeEUR - The change in EUR
 * @param {Array<string>} recordIds - Array of record IDs to update
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
export const batchUpdatePrice = async (priceEUR, changeEUR, recordIds) => {
  const url = `${API_BASE_URL}/data/batch-update-price`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceEUR,
        changeEUR,
        recordIds,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Download certificate with proofs
 * @param {string} owner - The owner name
 * @param {string} ticket - The ticket ID
 * @returns {Promise<any>} The API response data with proofs
 * @throws {Error} If the request fails
 */
export const downloadCertificate = async (owner, ticket) => {
  const url = `${CERT_API_BASE_URL}/downloadCert?owner=${encodeURIComponent(owner)}&ticket=${encodeURIComponent(ticket)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Update proofs for multiple records
 * @param {Array} proofs - Array of proof objects with id and proof
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
export const updateProofs = async (proofs) => {
  const url = `${API_BASE_URL}/data/update-profs`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ proofs }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

/**
 * Batch update certified status for multiple records
 * @param {boolean} certified - The certified status to set
 * @param {Array<string>} recordIds - Array of record IDs to update
 * @returns {Promise<any>} The API response data
 * @throws {Error} If the request fails
 */
export const batchUpdateCertified = async (certified, recordIds) => {
  const url = `${API_BASE_URL}/data/batch-update-certified`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        certified,
        recordIds,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data && data.message) {
        throw new Error(data.message);
      }
      throw new Error(`Server responded with ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};
