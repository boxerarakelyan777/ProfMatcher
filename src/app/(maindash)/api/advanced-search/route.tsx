import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

export async function POST(req: Request) {
  try {
    const criteria = await req.json();

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });

    const index = pc.Index("rag").namespace("nsl");

    const hfie_params = {
      apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
    };

    const hfembeddingmodel = new HuggingFaceInferenceEmbeddings(hfie_params);

    // Create an embedding for the search query
    const queryEmbedding = await hfembeddingmodel.embedQuery(
      `${criteria.keywords} ${criteria.department} ${criteria.institution} ${criteria.teachingStyle} ${criteria.courseDifficulty}`
    );

    // Perform the vector search
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: 10,
      filter: {
        type: "professor",
        ...(criteria.minRating && { overallRating: { $gte: parseFloat(criteria.minRating) } }),
        ...(criteria.department && { department: criteria.department }),
        ...(criteria.institution && { institution: criteria.institution }),
      },
    });

    // Process and format the results
    const formattedResults = searchResults.matches.map(match => ({
      name: match.metadata.name,
      department: match.metadata.department,
      institution: match.metadata.institution,
      overallRating: match.metadata.overallRating,
    }));

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json({ error: 'Failed to perform advanced search' }, { status: 500 });
  }
}