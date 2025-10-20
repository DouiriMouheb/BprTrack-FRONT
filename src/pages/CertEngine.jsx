import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CertEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useTranslation();

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    // Simulate search - replace with actual search logic
    setTimeout(() => {
      console.log('Searching for:', searchQuery);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0 85% 60%)] bg-clip-text text-transparent">
            Cert Engine
          </h1>
          <p className="text-[hsl(var(--text-black))] text-lg font-medium">
            Search and manage your certificates efficiently
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              {/* Search Icon */}
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="text-[hsl(var(--text-white))] group-focus-within:text-[hsl(var(--red))] transition-colors" size={24} />
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certificates..."
                disabled={isSearching}
                className="w-full pl-16 pr-40 py-6 text-lg bg-[hsl(var(--black))] border-2 border-[hsl(var(--border-white))] rounded-2xl 
                         focus:border-[hsl(var(--red))] focus:ring-4 focus:ring-[hsl(var(--red))/0.2] 
                         transition-all duration-200 shadow-lg hover:shadow-xl
                         text-[hsl(var(--text-white))] placeholder:text-[hsl(var(--text-white))/0.5]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:border-[hsl(var(--red))]"
                autoFocus
              />

              {/* Search Button */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="btn btn-primary px-6 py-3 rounded-xl font-bold text-base
                           shadow-lg hover:shadow-xl transition-all duration-200
                           flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Placeholder for search results */}
        {searchQuery && !isSearching && (
          <div className="mt-12 p-8 bg-[hsl(var(--gray))] border-2 border-[hsl(var(--border-black))] rounded-2xl text-center shadow-lg">
            <p className="text-[hsl(var(--text-black))] font-medium text-lg">
              Search results will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertEngine;
