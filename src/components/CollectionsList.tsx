"use client";

import { useState, useEffect } from "react";

interface CollectionsListProps {
  collections: string[];
  onSelectCollection: (collection: string) => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

export default function CollectionsList({
  collections,
  onSelectCollection,
  onBack,
  loading,
  error
}: CollectionsListProps) {
  const [animate, setAnimate] = useState(false);

  // Add animation effect on component mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={`max-w-5xl mx-auto transition-all duration-700 ease-out ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="relative p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">ChromaDB Collections</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Select a collection to explore</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm flex items-center shadow-sm transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to URL Input
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm border-l-4 border-red-500 animate-pulse">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin opacity-70" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
            </div>
          ) : (
            <>
              {collections.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Collections Found</h3>
                  <p className="text-gray-500 dark:text-gray-400">This ChromaDB instance doesn't have any collections yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {collections.map((collection, index) => (
                    <button
                      key={collection}
                      onClick={() => onSelectCollection(collection)}
                      className="group p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] text-left relative overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div className="font-medium text-lg text-gray-900 dark:text-gray-100">{collection}</div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 ml-11">Click to view collection data</div>
                        <div className="mt-4 ml-11 flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                          Explore data
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
