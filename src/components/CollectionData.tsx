"use client";

import { useState, useEffect } from "react";
import ChevronDown from "../icons/ChevronDown";
import ChevronUp from "../icons/ChevronUp";
import ArrowLeft from "../icons/ArrowLeft";
import Search from "../icons/Search";
import Warning from "../icons/Warning";
import ChevronRight from "../icons/ChevronRight";

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
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
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
