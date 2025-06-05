"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Import our components
import UrlInput from "../components/UrlInput";
import CollectionsList from "../components/CollectionsList";
import CollectionData from "@/components/CollectionData.backup";

// Define the step types for our multi-page flow
type Step = "url" | "collections" | "data";

export default function Home() {
  // State for multi-page navigation
  const [currentStep, setCurrentStep] = useState<Step>("url");

  // Connection states
  const [url, setUrl] = useState("");
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  // Collection data states
  const [collectionData, setCollectionData] = useState<any[]>([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCollections = async (inputUrl: string) => {
    if (!inputUrl) {
      setError("Please enter a ChromaDB URL");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/collections", { url: inputUrl });
      setUrl(inputUrl); // Save the URL
      setCollections(response.data);
      setSelectedCollection("");
      setCollectionData([]);

      // Move to collections step if successful
      if (response.data && response.data.length > 0) {
        setCurrentStep("collections");
      }
    } catch (err: any) {
      setError(
        `Failed to fetch collections: ${err.message}. Please check the URL and ensure ChromaDB is running.`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCollectionData = async (collectionName: string) => {
    if (!url || !collectionName) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/collection-data", {
        url,
        collectionName,
      });
      setCollectionData(response.data);

      // Move to data step if successful
      if (response.data) {
        setCurrentStep("data");
      }
    } catch (err: any) {
      setError(`Failed to fetch collection data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to previous step
  const goBack = () => {
    if (currentStep === "data") {
      setCurrentStep("collections");
    } else if (currentStep === "collections") {
      setCurrentStep("url");
    }
  };

  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionData(selectedCollection);
    }
  }, [selectedCollection]);

  return (
    <main className="flex flex-col min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="flex-grow">
      {currentStep === "url" && (
        <UrlInput
          onConnect={fetchCollections}
          loading={loading}
          error={error}
        />
      )}

      {currentStep === "collections" && (
        <CollectionsList
          collections={collections}
          onSelectCollection={setSelectedCollection}
          onBack={goBack}
          loading={loading}
          error={error}
        />
      )}

      {currentStep === "data" && (
        <CollectionData
          collectionName={selectedCollection}
          data={collectionData}
          onBack={goBack}
          loading={loading}
          error={error}
        />
      )}
      </div>
      
      <footer className="mt-8 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <a 
            href="https://github.com/Huzaifa-Saleem/chroma-viewer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-purple-400 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub Repository
          </a>
        </div>
        <p>© {new Date().getFullYear()} Huzaifa Saleem. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
