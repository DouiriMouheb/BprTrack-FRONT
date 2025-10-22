import { useState, useRef, useCallback } from 'react';
import { searchData } from '../services/dataService';

/**
 * Custom hook for searching data via the API with caching
 * @returns {Object} Hook state and methods
 */
export const useDataSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastSearchKey, setLastSearchKey] = useState(null);
  
  // Cache for storing previous search results
  const cacheRef = useRef(new Map());

  /**
   * Execute a search with caching
   * @param {string} chiaveRicerca - The search key
   * @param {boolean} forceRefresh - Force refresh ignoring cache
   */
  const search = useCallback(async (chiaveRicerca, forceRefresh = false) => {
    const trimmedKey = chiaveRicerca.trim();
    
    // Check cache first (unless force refresh)
    if (!forceRefresh && cacheRef.current.has(trimmedKey)) {
      const cachedData = cacheRef.current.get(trimmedKey);
      setResults(cachedData);
      setError(null);
      setLastSearchKey(trimmedKey);
      return;
    }

    setIsSearching(true);
    setError(null);
    setResults(null);
    setLastSearchKey(trimmedKey);

    try {
      const data = await searchData(trimmedKey);
      setResults(data);
      
      // Store in cache
      cacheRef.current.set(trimmedKey, data);
      
      // Limit cache size to 50 entries (LRU-like behavior)
      if (cacheRef.current.size > 50) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * Refresh the last search
   */
  const refresh = useCallback(() => {
    if (lastSearchKey) {
      search(lastSearchKey, true);
    }
  }, [lastSearchKey, search]);

  /**
   * Clear search results and error state
   */
  const clearSearch = useCallback(() => {
    setResults(null);
    setError(null);
    setLastSearchKey(null);
  }, []);

  /**
   * Clear the cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    isSearching,
    results,
    error,
    lastSearchKey,
    search,
    refresh,
    clearSearch,
    clearCache,
  };
};
