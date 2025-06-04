import { NextResponse } from "next/server";
import { ChromaClient } from "chromadb";

export async function POST(request: Request) {
  try {
    const { url, collectionName } = await request.json();

    if (!url || !collectionName) {
      return NextResponse.json(
        {
          error: "ChromaDB URL and collection name are required",
        },
        { status: 400 }
      );
    }

    // Create a ChromaDB client with the provided URL
    const client = new ChromaClient({ path: url });
    
    try {
      // Get the collection
      const collection = await client.getCollection({
        name: collectionName
      });
      
      // Get all items from the collection
      // This matches the Python code approach: collection.get()
      const result = await collection.get();
      
      if (result && result.ids && result.ids.length > 0) {
        const { ids, metadatas, documents, embeddings } = result;
        
        // Combine the data into a more usable format
        const collectionData = ids.map((id: string, index: number) => ({
          id,
          metadata: metadatas ? metadatas[index] : null,
          document: documents ? documents[index] : null,
          embedding: embeddings ? embeddings[index] : null,
        }));
        
        return NextResponse.json(collectionData);
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
    console.error("Error fetching collection data:", error);
    return NextResponse.json(
      { error: `Failed to fetch collection data: ${error.message}` },
      { status: 500 }
    );
  }
}
