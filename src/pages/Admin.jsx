import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, Database, Home, Loader2, RefreshCw, CheckCircle2, XCircle, FileSearch, ChevronDown, ChevronUp, Search, Filter, Download, TrendingUp, Activity, ChevronLeft, ChevronRight, Award, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllData } from '../services/dataService';
import { certifyAllRecords } from '../services/certificationService';
import DataTable from '../components/DataTable';
import CertificationProgressModal from '../components/CertificationProgressModal';
import UserManagement from '../components/UserManagement';
import toast from 'react-hot-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'certified', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCertifying, setIsCertifying] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progressError, setProgressError] = useState(null);
  const [activeTab, setActiveTab] = useState('data'); // 'data' or 'users'

  // Check if user has Admin role
  const isAdmin = user?.roles?.includes('Admin');

  const certificationSteps = [
    {
      title: 'Request Certification',
      description: 'Sending certification request to blockchain...',
      info: 'Processing your certification request'
    },
    {
      title: 'Update Ticket Records',
      description: 'Updating database with ticket information...',
      info: 'Saving ticket ID to records'
    },
    {
      title: 'Get Gas Price',
      description: 'Fetching current blockchain gas prices...',
      info: 'Retrieving optimal gas price for transaction'
    },
    {
      title: 'Finalize Certification',
      description: 'Completing certification on blockchain...',
      info: 'Finalizing the certification process'
    },
    {
      title: 'Update Price Information',
      description: 'Updating records with transaction costs...',
      info: 'Saving blockchain transaction price data'
    },
    {
      title: 'Download Certificate',
      description: 'Downloading certificate with proofs...',
      info: 'Retrieving blockchain proofs'
    },
    {
      title: 'Update Proofs',
      description: 'Saving proofs to database...',
      info: 'Storing cryptographic proofs for verification'
    },
    {
      title: 'Mark as Certified',
      description: 'Updating certification status...',
      info: 'Marking records as certified'
    }
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAllData();
      setData(result);
      toast.success(`Loaded ${result.length} records`);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Ensure non-admin users can't access user management tab
  useEffect(() => {
    if (!isAdmin && activeTab === 'users') {
      setActiveTab('data');
    }
  }, [isAdmin, activeTab]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return { total: 0, certified: 0, pending: 0, totalItems: 0 };

    const totalItems = data.reduce((sum, record) => sum + (record.dati?.length || 0), 0);

    return {
      total: data.length,
      certified: data.filter(record => record.certified).length,
      pending: data.filter(record => !record.certified).length,
      totalItems,
    };
  }, [data]);

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    // Apply status filter
    if (filterStatus === 'certified') {
      filtered = filtered.filter(record => record.certified);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(record => !record.certified);
    }

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.chiave_ricerca?.toLowerCase().includes(term) ||
        record.owner?.toLowerCase().includes(term) ||
        record.client?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [data, searchTerm, filterStatus]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Get all pending records
  const pendingRecords = useMemo(() => {
    return data.filter(record => !record.certified);
  }, [data]);

  // Handle certification request
  const handleCertifyAll = async () => {
    if (pendingRecords.length === 0) {
      toast.error('No pending records to certify');
      return;
    }

    // Confirm action
    if (!window.confirm(`Are you sure you want to certify ${pendingRecords.length} pending record(s)?`)) {
      return;
    }

    setIsCertifying(true);
    setShowProgressModal(true);
    setCurrentStep(0);
    setProgressError(null);

    try {
      // Use the certification service to handle the entire workflow
      const result = await certifyAllRecords(
        pendingRecords,
        (step) => setCurrentStep(step),
        (error) => setProgressError(error)
      );

      toast.success(
        `Successfully certified ${result.recordCount} record(s) | Ticket: ${result.ticketId} | Proofs: ${result.proofsUpdated} updated`,
        { duration: 6000 }
      );

      // Wait a bit to show completion before closing modal
      setTimeout(() => {
        setShowProgressModal(false);
        fetchData(); // Refresh data
      }, 2000);

    } catch (err) {
      console.error('Certification error:', err);
      setProgressError(err.message);
      toast.error(`Certification failed: ${err.message}`);
    } finally {
      setIsCertifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 flex-col fixed h-full z-10">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[hsl(var(--red))] to-[hsl(0_85%_60%)] rounded-2xl shadow-xl">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
              ${activeTab === 'data'
                ? 'bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Database size={20} />
            <span>Data Records</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
                ${activeTab === 'users'
                  ? 'bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Users size={20} />
              <span>User Management</span>
            </button>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200/50 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition-all"
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[hsl(var(--red))] to-[hsl(0_85%_60%)] rounded-xl">
                <Shield className="text-white" size={20} />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Home size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 bg-[hsl(var(--red))] text-white rounded-lg"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          {/* Mobile Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all
                ${activeTab === 'data'
                  ? 'bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              Data Records
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-4 py-2 rounded-xl font-semibold text-sm transition-all
                  ${activeTab === 'users'
                    ? 'bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white'
                    : 'bg-gray-100 text-gray-600'
                  }`}
              >
                Users
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Data Records Tab */}
          {activeTab === 'data' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Enhanced Header with Search and Filters */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[hsl(var(--red))] to-[hsl(0_85%_60%)] rounded-xl shadow-lg">
                  <Database className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Data Records</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} records
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={fetchData}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white rounded-xl font-bold
                           shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95
                           transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <RefreshCw className={isLoading ? 'animate-spin' : ''} size={20} />
                  <span>Refresh</span>
                </button>

                {/* Certify All Button - Only show if there are pending records */}
                {pendingRecords.length > 0 && (
                  <button
                    onClick={handleCertifyAll}
                    disabled={isCertifying || isLoading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold
                             shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95
                             transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isCertifying ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Certifying...</span>
                      </>
                    ) : (
                      <>
                        <Award size={20} />
                        <span>Certify All ({pendingRecords.length})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by key, owner, or client..."
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl 
                           focus:outline-none focus:border-[hsl(var(--red))] transition-colors
                           text-gray-900 placeholder:text-gray-400 font-medium shadow-sm"
                />
              </div>

              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700
                           focus:outline-none focus:border-[hsl(var(--red))] transition-colors shadow-sm cursor-pointer"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
                    ${filterStatus === 'all' 
                      ? 'bg-gray-900 text-white shadow-lg' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                  <Filter size={18} />
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('certified')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
                    ${filterStatus === 'certified' 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                  <CheckCircle2 size={18} />
                  <span className="hidden sm:inline">Certified</span>
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
                    ${filterStatus === 'pending' 
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' 
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                  <XCircle size={18} />
                  <span className="hidden sm:inline">Pending</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8">

            {/* Loading State */}
            {isLoading && (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--red))] to-[hsl(0_85%_60%)] rounded-full blur-xl opacity-30"></div>
                    <div className="relative p-5 bg-gradient-to-br from-[hsl(var(--red))]/10 to-[hsl(0_85%_60%)]/10 rounded-full">
                      <Loader2 className="animate-spin text-[hsl(var(--red))]" size={48} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-xl mb-2">Loading Data...</p>
                    <p className="text-gray-500">Fetching all records from the database</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl border border-red-200 p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-5 bg-red-100 rounded-full shadow-lg shadow-red-500/20">
                    <XCircle className="text-red-600" size={48} />
                  </div>
                  <div>
                    <p className="text-red-900 font-bold text-xl mb-2">Error Loading Data</p>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Records */}
            {!isLoading && !error && paginatedData.length > 0 && (
              <div className="space-y-3">
                {paginatedData.map((record, index) => (
                  <div 
                    key={record._id} 
                    className="group relative bg-gradient-to-br from-white to-gray-50/50 border border-gray-200 rounded-2xl overflow-hidden 
                             hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--red))]/0 to-blue-500/0 group-hover:from-[hsl(var(--red))]/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                    
                    <div className="relative p-5">
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold">
                            #{startIndex + index + 1}
                          </span>
                          <span className="text-gray-900 font-bold text-lg">
                            {record.chiave_ricerca}
                          </span>
                          {record.certified ? (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-green-500/30">
                              <CheckCircle2 size={14} />
                              Certified
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/30">
                              <XCircle size={14} />
                              Pending
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedRecord(selectedRecord === record._id ? null : record._id)}
                          className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl text-sm font-semibold 
                                   transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        >
                          {selectedRecord === record._id ? (
                            <>
                              <ChevronUp size={18} />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown size={18} />
                              Show Details
                            </>
                          )}
                        </button>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white/80 rounded-xl border border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Owner</span>
                          <span className="text-gray-900 font-bold">{record.owner || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Client</span>
                          <span className="text-gray-900 font-bold">{record.client || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Status</span>
                          <span className="text-gray-900 font-bold">
                            {record.status && record.status.trim() !== '' ? record.status : 'Not opened yet'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Items</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-bold">{record.dati?.length || 0}</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">
                              items
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {selectedRecord === record._id && record.dati && record.dati.length > 0 && (
                        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 animate-fadeIn">
                          <DataTable data={record.dati} excludeColumns={['CHIAVE']} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && !error && filteredData.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/80 rounded-2xl border border-gray-200">
                <div className="text-sm text-gray-600 font-medium">
                  Page {currentPage} of {totalPages} ({filteredData.length} total records)
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold
                             transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg border border-gray-200
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 shadow-md
                              ${currentPage === pageNum
                                ? 'bg-gradient-to-r from-[hsl(var(--red))] to-[hsl(0_85%_60%)] text-white shadow-lg'
                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2 py-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold
                             transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg border border-gray-200
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State - No Results */}
            {!isLoading && !error && data.length > 0 && filteredData.length === 0 && (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                    <FileSearch className="text-gray-400" size={64} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-xl mb-2">No Matching Records</p>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State - No Data */}
            {!isLoading && !error && data.length === 0 && (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                    <Database className="text-gray-400" size={64} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-xl mb-2">No Records Found</p>
                    <p className="text-gray-500">The database is currently empty</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && isAdmin && (
          <UserManagement />
        )}

        {/* Certification Progress Modal */}
        <CertificationProgressModal
          isOpen={showProgressModal}
          steps={certificationSteps}
          currentStep={currentStep}
          error={progressError}
        />
        </div>
      </div>
    </div>
  );
};

export default Admin;
