import React, { useState, useMemo } from 'react';
import { Search, Loader2, RefreshCw, Database, FileSearch, TrendingUp, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDataSearch } from '../hooks/useDataSearch';
import DataTable from '../components/DataTable';

const CertEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSearching, results, error, lastSearchKey, search, refresh } = useDataSearch();
  const { t } = useTranslation();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    search(searchQuery);
  };

  const handleRefresh = () => {
    if (lastSearchKey) {
      refresh();
    }
  };

  // Extract dati array from results
  const tableData = useMemo(() => {
    return results?.dati && Array.isArray(results.dati) ? results.dati : null;
  }, [results]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!tableData || tableData.length === 0) return null;

    return {
      total: tableData.length,
      searchKey: lastSearchKey,
    };
  }, [tableData, lastSearchKey]);

  return (
    <div className="min-h-screen p-2 md:p-6">
      <div className="max-w-[98%] 2xl:max-w-[1800px] mx-auto">
        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(var(--black))] via-[hsl(0_0%_10%)] to-[hsl(var(--red))/0.3] p-8 md:p-12 mb-8 shadow-2xl border-2 border-[hsl(var(--border-white))/0.1]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--red))/0.1] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[hsl(var(--red))/0.15] rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[hsl(var(--red))] rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Database className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  Cert Engine
                </h1>
                <p className="text-white/70 text-sm md:text-base font-medium mt-1">
                  Advanced certificate search and management
                </p>
              </div>
            </div>
           
            {/* Search Bar and Stats in Same Line */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Enhanced Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 w-full">
                <div className="relative group">
                  {/* Glow effect on focus */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] rounded-2xl opacity-0 group-focus-within:opacity-20 blur-lg transition-all duration-300"></div>
                  
                  <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/50 group-focus-within:border-[hsl(var(--red))] transition-all duration-300">
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                      <div className="p-2 bg-[hsl(var(--red))/0.1] rounded-lg group-focus-within:bg-[hsl(var(--red))/0.2] transition-colors">
                        <Search className="text-[hsl(var(--red))] group-focus-within:scale-110 transition-transform" size={24} />
                      </div>
                    </div>

                    {/* Search Input */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by certificate ID, name, or reference key..."
                      disabled={isSearching}
                      className="w-full pl-20 pr-44 py-6 text-lg bg-transparent border-0 rounded-2xl 
                               focus:outline-none
                               text-[hsl(var(--text-black))] placeholder:text-[hsl(var(--text-black))/0.4]
                               disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      autoFocus
                    />

                    {/* Clear Button */}
                    {searchQuery && !isSearching && (
                      <div className="absolute inset-y-0 right-36 flex items-center">
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="p-2 text-[hsl(var(--text-black))/0.4] hover:text-[hsl(var(--red))] hover:bg-[hsl(var(--red))/0.1] rounded-lg transition-all"
                          title="Clear search"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}

                    {/* Search Button */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="submit"
                        disabled={isSearching || !searchQuery.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white rounded-xl font-bold text-base
                               shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95
                               transition-all duration-200
                               flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                               border-2 border-transparent hover:border-white/30"
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="animate-spin" size={22} />
                            <span className="hidden sm:inline">Searching...</span>
                          </>
                        ) : (
                          <>
                            <Search size={22} />
                            <span className="hidden sm:inline">Search</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Quick Stats Banner */}
              {stats && (
                <div className="flex flex-wrap gap-3 animate-fadeIn lg:flex-nowrap">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl border border-green-400/30 shadow-lg">
                    <CheckCircle2 className="text-green-300" size={20} />
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Results</p>
                      <p className="text-white font-bold text-base">{stats.total}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30 shadow-lg">
                    <FileSearch className="text-blue-300" size={20} />
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Key</p>
                      <p className="text-white font-bold text-base">{stats.searchKey}</p>
                    </div>
                  </div>
                  {lastSearchKey && (
                    <button
                      onClick={handleRefresh}
                      disabled={isSearching}
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[hsl(var(--red))]/20 to-orange-500/20 backdrop-blur-sm rounded-xl border border-[hsl(var(--red))]/30 shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                      title="Refresh results"
                    >
                      <RefreshCw className={`text-red-300 ${isSearching ? 'animate-spin' : ''}`} size={20} />
                      <div>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Refresh</p>
                        <p className="text-white font-bold text-sm">Update</p>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Results Section */}
        <div className="space-y-6">
          {/* Loading State */}
          {isSearching && (
            <div className="bg-white rounded-2xl border-2 border-[hsl(var(--border-black))] p-12 text-center shadow-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-[hsl(var(--red))/0.1] rounded-full">
                  <Loader2 className="animate-spin text-[hsl(var(--red))]" size={48} />
                </div>
                <div>
                  <p className="text-[hsl(var(--text-black))] font-bold text-xl mb-2">Searching Database...</p>
                  <p className="text-[hsl(var(--text-black))/0.6]">Please wait while we fetch your results</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 rounded-2xl border-2 border-red-300 p-8 text-center shadow-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <XCircle className="text-red-600" size={48} />
                </div>
                <div>
                  <p className="text-red-800 font-bold text-xl mb-2">Search Error</p>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results with Data */}
          {results && !isSearching && (
            <div className="space-y-4">
           

              {/* Display message if present */}
              {typeof results === 'object' && results !== null && results.message ? (
                <div className="bg-blue-50 rounded-2xl border-2 border-blue-300 p-8 text-center shadow-lg">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-full">
                      <AlertCircle className="text-blue-600" size={48} />
                    </div>
                    <p className="text-blue-800 font-bold text-lg">{results.message}</p>
                  </div>
                </div>
              ) : tableData ? (
                <div className="animate-fadeIn">
                  <DataTable data={tableData} excludeColumns={['CHIAVE']} />
                </div>
              ) : (
                /* Fallback for other response types */
                <div className="bg-white rounded-2xl border-2 border-[hsl(var(--border-black))] p-6 shadow-lg">
                  <h2 className="text-[hsl(var(--text-black))] font-bold text-xl mb-4 flex items-center gap-2">
                    <Database size={24} />
                    Raw Results
                  </h2>
                  <div className="bg-[hsl(var(--gray))] rounded-xl p-4 border border-[hsl(var(--border-black))/0.2]">
                    <pre className="text-left text-sm max-h-80 overflow-auto whitespace-pre-wrap text-[hsl(var(--text-black))]">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!results && !error && !isSearching && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-[hsl(var(--border-black))/0.3 p-12 text-center shadow-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-[hsl(var(--gray))] rounded-full">
                  <FileSearch className="text-[hsl(var(--text-black))/0.4" size={64} />
                </div>
                <div>
                  <p className="text-[hsl(var(--text-black))] font-bold text-xl mb-2">Ready to Search</p>
                  <p className="text-[hsl(var(--text-black))/0.6] max-w-md mx-auto">
                    Enter a search term above to find certificates in the database
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertEngine;
