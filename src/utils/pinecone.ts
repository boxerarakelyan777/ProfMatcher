// src/utils/pinecone.ts
import { Pinecone } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

export interface ProfessorData {
  name: string;
  department: string;
  institution: string;
  overallRating: number; // normalized to number in submit route
  reviews: { text: string; rating: number | null; date: string }[];
}

const INDEX = process.env.PINECONE_INDEX || "rag";
const NAMESPACE = process.env.PINECONE_NAMESPACE || "nsl";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// Metadata shapes (union) so review nodes can have professorName, text, etc.
type ProfessorMeta = {
  type: "professor";
  name: string;
  department: string;
  institution: string;
  overallRating: string; // store as string in metadata
};

type ReviewMeta = {
  type: "review";
  professorName: string;
  text: string;
  rating: string; // "N/A" or "4.5"
  date: string;
};

type UpsertVector = {
  id: string;
  values: number[];
  metadata: ProfessorMeta | ReviewMeta;
};

export async function storeProfessorData(professorData: ProfessorData) {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });
    const index = pc.Index(INDEX).namespace(NAMESPACE);

    const embedder = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
      model: "sentence-transformers/all-MiniLM-L6-v2",
    });

    const profId = `professor_${slugify(professorData.name)}_${slugify(
      professorData.institution
    )}`;

    // --- Overall professor node ---
    const profEmbedding = await embedder.embedQuery(
      `${professorData.name} ${professorData.department} ${professorData.institution}`
    );

    const upserts: UpsertVector[] = [
      {
        id: profId,
        values: profEmbedding,
        metadata: {
          type: "professor",
          name: professorData.name,
          department: professorData.department,
          institution: professorData.institution,
          overallRating: String(professorData.overallRating),
        },
      },
    ];

    // --- Reviews as separate nodes (deterministic-ish suffix) ---
    for (const r of professorData.reviews) {
      const reviewEmbedding = await embedder.embedQuery(r.text);
      const key = slugify(`${r.date}_${r.text.slice(0, 32)}`);

      upserts.push({
        id: `${profId}_review_${key}`,
        values: reviewEmbedding,
        metadata: {
          type: "review",
          professorName: professorData.name,
          text: r.text,
          rating: r.rating === null ? "N/A" : String(r.rating),
          date: r.date,
        },
      });
    }

    await index.upsert(upserts);
    console.log("Pinecone upsert complete:", upserts.length, "vectors");
  } catch (error: unknown) {
    console.error("Detailed error in storing professor data:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to store professor data: ${error.message}`);
    } else {
      throw new Error("Failed to store professor data: An unknown error occurred");
    }
  }
}
