import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Reusable dynamic data table component with sorting
 * @param {Object} props
 * @param {Array} props.data - Array of data objects to display
 * @param {Array} props.excludeColumns - Optional array of column keys to exclude
 */
const DataTable = ({ data, excludeColumns = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Extract column headers from first data item
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(key => !excludeColumns.includes(key));
  }, [data, excludeColumns]);

  // Sort data based on current sort configuration
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  // Handle column header click for sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Format column header text
  const formatHeader = (key) => {
    return key.replace(/_/g, ' ');
  };

  // Format cell value
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 bg-white border-2 border-[hsl(var(--border-black))] rounded-2xl text-center shadow-lg">
        <p className="text-[hsl(var(--text-black))] font-semibold text-lg">No data available</p>
        <p className="text-[hsl(var(--text-black))/0.6] text-sm mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[hsl(var(--border-black))] rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gradient-to-r from-[hsl(var(--black))] to-[hsl(0_0%_15%)] border-b-2 border-[hsl(var(--red))]">
            <tr>
              {columns.map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-4 text-left text-xs font-bold text-[hsl(var(--text-white))] uppercase tracking-wider cursor-pointer hover:bg-[hsl(var(--red))/0.3] transition-all duration-200 select-none group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    <span className="group-hover:text-[hsl(var(--red))/0.2] transition-colors">{formatHeader(key)}</span>
                    {sortConfig.key === key ? (
                      <span className="text-[hsl(var(--red))] flex-shrink-0 animate-pulse">
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    ) : (
                      <span className="text-[hsl(var(--text-white))/0.3] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronUp size={16} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border-black))/0.1">
            {sortedData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[hsl(var(--gray))] transition-colors duration-150 group"
              >
                {columns.map((key) => (
                  <td
                    key={key}
                    className="px-6 py-4 text-sm text-[hsl(var(--text-black))] font-medium whitespace-nowrap"
                  >
                    {formatValue(item[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with row count and gradient */}
      <div className="px-6 py-3 bg-gradient-to-r from-[hsl(var(--black))] to-[hsl(0_0%_15%)] border-t-2 border-[hsl(var(--red))]">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[hsl(var(--text-white))] font-semibold">
            Total: <span className="text-[hsl(var(--red))]">{data.length}</span> {data.length === 1 ? 'record' : 'records'}
          </p>
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--text-white))/0.7">
            <span>Click column headers to sort</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
