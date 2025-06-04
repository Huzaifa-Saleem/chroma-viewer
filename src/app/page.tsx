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
    <main className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
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
    </main>
  );
}
