"use client";

import { useState, useEffect } from "react";

interface CollectionDataProps {
  collectionName: string;
  data: any[];
  onBack: () => void;
  loading: boolean;
  error: string;
}

export default function CollectionData({
  collectionName,
  data,
  onBack,
  loading,
  error,
}: CollectionDataProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedEmbeddings, setExpandedEmbeddings] = useState<
    Record<string, boolean>
  >({});
  const [animate, setAnimate] = useState(false);

  // Add animation effect on component mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    // Search in ID
    if (item.id && item.id.toLowerCase().includes(term)) return true;

    // Search in document content
    if (
      item.document &&
      typeof item.document === "string" &&
      item.document.toLowerCase().includes(term)
    )
      return true;

    // Search in metadata if it's an object
    if (item.metadata && typeof item.metadata === "object") {
      return Object.entries(item.metadata).some(([key, value]) => {
        if (key.toLowerCase().includes(term)) return true;
        if (
          value &&
          typeof value === "string" &&
          value.toLowerCase().includes(term)
        )
          return true;
        return false;
      });
    }

    return false;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Toggle embedding visibility
  const toggleEmbedding = (id: string) => {
    setExpandedEmbeddings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Format metadata or embedding for display
  const formatObject = (obj: any) => {
    if (!obj) return "null";
    if (typeof obj !== "object") return String(obj);

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
          className={`w-8 h-8 flex items-center justify-center text-sm ${
            currentPage === 1
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium"
              : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          1
        </button>
      );

      // Add ellipsis if needed
      if (currentPage > 4) {
        pageNumbers.push(
          <span
            key="ellipsis1"
            className="w-8 h-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"
          >
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
          className={`w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 ${
            currentPage === i
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium"
              : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 3) {
      pageNumbers.push(
        <span
          key="ellipsis2"
          className="w-8 h-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"
        >
          •••
        </span>
      );

      // Always show last page
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium"
              : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
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
            className={`w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 ${
              currentPage === i
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium"
                : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            {i}
          </button>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div
      className={`max-w-7xl mx-auto transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="relative p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                {collectionName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                {filteredData.length} items found
              </p>
            </div>

            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm flex items-center shadow-sm transition-all duration-200 hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Collections
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm border-l-4 border-red-500 animate-pulse">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID, document content, or metadata..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-5 py-3 pl-12 text-lg border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
                <div
                  className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin opacity-70"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              {currentItems.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No Items Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? "No matching items found. Try a different search term."
                      : "This collection doesn't have any items yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Document
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Metadata
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Embedding
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {currentItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs mr-2">
                                {index + 1}
                              </div>
                              {item.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs overflow-hidden text-ellipsis">
                            <div className="max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                              {item.document || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                            <div className="max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                              <pre className="text-xs whitespace-pre-wrap">
                                {formatObject(item.metadata)}
                              </pre>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {item.embedding ? (
                              <div>
                                <button
                                  onClick={() => toggleEmbedding(item.id)}
                                  className="text-purple-600 dark:text-purple-400 hover:underline flex items-center transition-all hover:translate-x-1 duration-200"
                                >
                                  <span>
                                    {expandedEmbeddings[item.id]
                                      ? "Hide"
                                      : "Show"}{" "}
                                    Embedding
                                  </span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ml-1 transition-transform ${
                                      expandedEmbeddings[item.id]
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>

                                {expandedEmbeddings[item.id] && (
                                  <div className="mt-2 max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                                    <pre className="text-xs whitespace-pre-wrap">
                                      {Array.isArray(item.embedding)
                                        ? `[${item.embedding
                                            .slice(0, 10)
                                            .join(", ")}${
                                            item.embedding.length > 10
                                              ? ", ..."
                                              : ""
                                          }] (${
                                            item.embedding.length
                                          } dimensions)`
                                        : String(item.embedding)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Showing {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                      {filteredData.length} items
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 duration-200"
                        aria-label="First page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 duration-200"
                        aria-label="Previous page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <div className="flex mx-1 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                        {renderPagination()}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 duration-200"
                        aria-label="Next page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 duration-200"
                        aria-label="Last page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Items per page:
                      </span>
                      <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
