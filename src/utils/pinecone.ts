import { Pinecone } from '@pinecone-database/pinecone';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

interface ProfessorData {
  name: string;
  department: string;
  institution: string;
  overallRating: number;
  reviews: {
    text: string;
    rating: number | null;
    date: string;
  }[];
}

export async function storeProfessorData(professorData: ProfessorData) {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });

    const index = pc.Index("rag").namespace("nsl");

    const hfie_params = {
      apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
    };

    const hfembeddingmodel = new HuggingFaceInferenceEmbeddings(hfie_params);

    // Create an embedding for the professor's overall data
    const professorEmbedding = await hfembeddingmodel.embedQuery(
      `${professorData.name} ${professorData.department} ${professorData.institution}`
    );

    // Store the professor's overall data
    await index.upsert([{
      id: `professor_${professorData.name.replace(/\s+/g, '_').toLowerCase()}`,
      values: professorEmbedding,
      metadata: {
        type: 'professor',
        name: professorData.name,
        department: professorData.department,
        institution: professorData.institution,
        overallRating: professorData.overallRating,
      },
    }]);

    // Store each review separately
    for (const review of professorData.reviews) {
      const reviewEmbedding = await hfembeddingmodel.embedQuery(review.text);
      await index.upsert([{
        id: `review_${professorData.name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`,
        values: reviewEmbedding,
        metadata: {
          type: 'review',
          professorName: professorData.name,
          text: review.text,
          rating: review.rating !== null ? review.rating : 'N/A',
          date: review.date,
        },
      }]);
    }

    console.log('Professor data and reviews stored successfully');
  } catch (error: unknown) {
    console.error('Detailed error in storing professor data:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to store professor data: ${error.message}`);
    } else {
      throw new Error('Failed to store professor data: An unknown error occurred');
    }
  }
}