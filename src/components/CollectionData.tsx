"use client";

import { useState, useEffect } from "react";
import ChevronDown from "../icons/ChevronDown";
import ChevronUp from "../icons/ChevronUp";
import ArrowLeft from "../icons/ArrowLeft";
import Search from "../icons/Search";
import Warning from "../icons/Warning";
import ChevronRight from "../icons/ChevronRight";
import ChevronLeft from "../icons/ChevronLeft";

interface CollectionDataProps {
  collectionName: string;
  data: any[];
  onBack: () => void;
  loading: boolean;
  error: string;
}

type SortKey = 'id' | 'document' | 'metadata';
type SortDirection = 'asc' | 'desc';

export default function CollectionData({
  collectionName,
  data,
  onBack,
  loading,
  error
}: CollectionDataProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedEmbeddings, setExpandedEmbeddings] = useState<Record<string, boolean>>({});
  const [animate, setAnimate] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Add animation effect on component mount
  useEffect(() => {
    setAnimate(true);
  }, []);
  
  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle sorting
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if same key
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  // Filter data based on search term
  const filteredData = data.filter(item => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase();
    
    // Search in ID
    if (item.id && item.id.toLowerCase().includes(term)) return true;
    
    // Search in document content
    if (item.document && typeof item.document === 'string' && 
        item.document.toLowerCase().includes(term)) return true;
    
    // Search in metadata if it's an object
    if (item.metadata && typeof item.metadata === 'object') {
      return Object.entries(item.metadata).some(([key, value]) => {
        if (key.toLowerCase().includes(term)) return true;
        if (value && typeof value === 'string' && value.toLowerCase().includes(term)) return true;
        return false;
      });
    }
    
    return false;
  });
  
  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    
    let valueA, valueB;
    
    if (sortKey === 'id') {
      valueA = a.id || '';
      valueB = b.id || '';
    } else if (sortKey === 'document') {
      valueA = typeof a.document === 'string' ? a.document : JSON.stringify(a.document || '');
      valueB = typeof b.document === 'string' ? b.document : JSON.stringify(b.document || '');
    } else if (sortKey === 'metadata') {
      valueA = JSON.stringify(a.metadata || {});
      valueB = JSON.stringify(b.metadata || {});
    } else {
      return 0;
    }
    
    if (sortDirection === 'asc') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  // Toggle embedding visibility
  const toggleEmbedding = (id: string) => {
    setExpandedEmbeddings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Format metadata or embedding for display
  const formatObject = (obj: any) => {
    if (!obj) return "null";
    if (typeof obj !== 'object') return String(obj);
    
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(obj);
    }
  };
  
  // Render pagination buttons
  const renderPagination = () => {
    const pageNumbers = [];
    
    // Always show first page
    if (currentPage > 3) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`w-8 h-8 flex items-center justify-center text-sm ${currentPage === 1 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium' 
            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
        >
          1
        </button>
      );
      
      // Add ellipsis if needed
      if (currentPage > 4) {
        pageNumbers.push(
          <span key="ellipsis1" className="w-8 h-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700">
            •••
          </span>
        );
      }
    }
    
    // Show pages around current page
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 ${currentPage === i 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium' 
            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
        >
          {i}
        </button>
      );
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 3) {
      pageNumbers.push(
        <span key="ellipsis2" className="w-8 h-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700">
          •••
        </span>
      );
      
      // Always show last page
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 ${currentPage === totalPages 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium' 
            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
        >
          {totalPages}
        </button>
      );
    } else if (currentPage < totalPages - 1) {
      // Show last pages
      for (let i = currentPage + 2; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 ${currentPage === i 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium' 
              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          >
            {i}
          </button>
        );
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Back button and collection name */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{collectionName}</h2>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
          <Warning className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Search and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">No data found</p>
        </div>
      ) : (
        <>
          {/* Data table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th 
                    className="px-6 py-3 bg-gray-50 dark:bg-gray-750 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      <span>ID</span>
                      {sortKey === 'id' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 w-4 h-4" /> : 
                          <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 bg-gray-50 dark:bg-gray-750 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('document')}
                  >
                    <div className="flex items-center">
                      <span>Document</span>
                      {sortKey === 'document' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 w-4 h-4" /> : 
                          <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 bg-gray-50 dark:bg-gray-750 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('metadata')}
                  >
                    <div className="flex items-center">
                      <span>Metadata</span>
                      {sortKey === 'metadata' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 w-4 h-4" /> : 
                          <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 bg-gray-50 dark:bg-gray-750 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Embedding
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div className="max-h-40 overflow-y-auto">
                        {typeof item.document === 'string' ? (
                          item.document
                        ) : (
                          formatObject(item.document)
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      <div className="max-h-40 overflow-y-auto">
                        {item.metadata ? formatObject(item.metadata) : 'No metadata'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {item.embedding ? (
                        <button
                          onClick={() => toggleEmbedding(item.id)}
                          className="flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                        >
                          <span className="mr-1">View</span>
                          {expandedEmbeddings[item.id] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        'No embedding'
                      )}
                      {expandedEmbeddings[item.id] && item.embedding && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md max-h-40 overflow-y-auto">
                          {formatObject(item.embedding)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span className="sr-only">First Page</span>
                  <ChevronLeft className="w-4 h-4" />
                  <ChevronLeft className="w-4 h-4 -ml-2" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span className="sr-only">Previous Page</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {renderPagination()}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span className="sr-only">Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span className="sr-only">Last Page</span>
                  <ChevronRight className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4 -ml-2" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
