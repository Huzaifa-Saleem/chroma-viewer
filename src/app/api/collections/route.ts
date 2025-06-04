import { NextResponse } from "next/server";
import { ChromaClient } from "chromadb";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "ChromaDB URL is required" },
        { status: 400 }
      );
    }

    // Create a ChromaDB client with the provided URL
    const client = new ChromaClient({ path: url });
    
    try {
      // List all collections using the ChromaDB client
      const collections = await client.listCollections();
      
      if (collections && Array.isArray(collections)) {
        // Extract collection names
        const collectionNames = collections.map((collection: any) => {
          // Handle both string collections and object collections with name property
          return typeof collection === 'string' ? collection : collection.name;
        });
        return NextResponse.json(collectionNames);
      }
      
      return NextResponse.json([]);
    } catch (clientError: any) {
      console.error('ChromaDB client error:', clientError);
      return NextResponse.json(
        { error: `ChromaDB client error: ${clientError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: `Failed to fetch collections: ${error.message}` },
      { status: 500 }
    );
  }
}
