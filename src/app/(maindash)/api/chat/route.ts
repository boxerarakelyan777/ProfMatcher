// /src/app/(maindash)/api/chat/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Pinecone, QueryOptions } from "@pinecone-database/pinecone";
import {
  HuggingFaceInferenceEmbeddings,
  type HuggingFaceInferenceEmbeddingsParams,
} from "@langchain/community/embeddings/hf";
import Groq from "groq-sdk";
import { z } from "zod";

const MsgSchema = z.array(
  z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })
);

const groqApiKey = process.env.GROQ_API_KEY;
const pineconeKey = process.env.PINECONE_API_KEY;
const pineconeIndex = process.env.PINECONE_INDEX || "rag";
const pineconeNamespace = process.env.PINECONE_NAMESPACE || "nsl";
const hfKey = process.env.HUGGINGFACEHUB_API_TOKEN;

if (!groqApiKey || !pineconeKey || !hfKey) {
  console.warn(
    "[/api/chat] Missing GROQ_API_KEY, PINECONE_API_KEY, or HUGGINGFACEHUB_API_TOKEN"
  );
}

const groq = new Groq({ apiKey: groqApiKey });

function looksVague(s: string) {
  if (!s) return true;
  const q = s.toLowerCase();
  const hasCourse = /\b([a-z]{2,5})\s*\d{2,4}\b/i.test(q);
  const hasUniversity =
    /\b(university|college|institute|polytechnic|state|uw|ucla|asu|sfu|ubc|ualberta|toronto)\b/i.test(q);
  const hasProfessor = /\bprof|professor|instructor|lecturer\b/i.test(q);
  return s.trim().length < 12 && !(hasCourse || hasUniversity || hasProfessor);
}

function textStream(text: string) {
  return new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      controller.enqueue(enc.encode(text));
      controller.close();
    },
  });
}

const SYSTEM_PROMPT = `
You are ProfTracker, an assistant that recommends professors using ONLY the provided CONTEXT.
Rules:
- Do NOT mention databases, vectors, RAG, or data sources.
- Do NOT use brand names like "RateMyProfessor".
- NEVER invent names, courses, or ratings that are not present in CONTEXT.
- If CONTEXT is insufficient, ask 2–4 precise follow-ups (university, course, term, preferences like "clear grading").
- If sufficient, return up to 3 professors as:
  1) Name — Dept/Course — 1–2 sentence strengths (optionally rating/sentiment if present)
Be concise and helpful.
`;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const messages = MsgSchema.parse(data);

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const userText = lastUser?.content?.trim() || "";

    if (looksVague(userText)) {
      const clarifier = `To recommend professors, please include:
• University/college
• Course or subject (e.g., "CS 101")
• What you value (clear grading, engaging lectures, lighter workload, etc.)

Examples:
• "Best professors for CS 101 at University of Alberta who explain concepts clearly"
• "Top instructors for ECON 201 at UW with fair grading and helpful office hours"`;
      return new NextResponse(textStream(clarifier), {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
      });
    }

    // 1) Embed
    const hfParams: HuggingFaceInferenceEmbeddingsParams = {
      apiKey: hfKey!,
      // Strong, fast default (optional explicit model)
      model: "sentence-transformers/all-MiniLM-L6-v2",
    };
    const embedder = new HuggingFaceInferenceEmbeddings(hfParams);
    const embedding = await embedder.embedQuery(userText);

    // 2) Pinecone query
    const pc = new Pinecone({ apiKey: pineconeKey! });
    const index = pc.Index(pineconeIndex).namespace(pineconeNamespace);

    const queryOptions: QueryOptions = {
      topK: 8,
      includeMetadata: true,
      vector: embedding,
    };
    const results = await index.query(queryOptions);

    // 3) Build context
    const items = (results.matches ?? []).map((m) => {
      const md = (m.metadata || {}) as Record<string, any>;
      return {
        id: m.id,
        name: String(md.name ?? md.professor ?? "").trim(),
        subject: String(md.subject ?? md.course ?? md.department ?? "").trim(),
        stars: String(md.stars ?? md.rating ?? "").trim(),
        sentiment: String(md.sentiment ?? "").trim(),
        review: String(md.review ?? md.snippet ?? "").trim(),
      };
    });

    const usable = items.filter((i) => i.name && i.name.toLowerCase() !== "unknown");
    const CONTEXT = usable
      .map((c, i) => {
        const parts = [
          `#${i + 1}`,
          `Name: ${c.name}`,
          c.subject && `Course/Dept: ${c.subject}`,
          c.stars && `Rating: ${c.stars}`,
          c.sentiment && `Sentiment: ${c.sentiment}`,
          c.review && `Snippet: ${c.review}`,
        ].filter(Boolean);
        return parts.join(" | ");
      })
      .join("\n");

    if (!CONTEXT) {
      const clarifier = `I don’t have enough matches yet.
Please include:
• University name
• Course code/subject (e.g., "CS 101")
• Preferences (clear grading, engaging lectures, lighter workload, etc.)

Examples:
• "Best professors for CS 101 at University of Alberta who explain concepts clearly"
• "Looking for ECON 201 at UW — fair grading and helpful office hours"`;
      return new NextResponse(textStream(clarifier), {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
      });
    }

    // 4) LLM
    const chat = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content:
            `CONTEXT:\n${CONTEXT}\n\n` +
            `USER QUESTION:\n${userText}\n\n` +
            `INSTRUCTIONS:\n` +
            `- Recommend up to 3 professors found in CONTEXT only.\n` +
            `- Format: 1) Name — Dept/Course — brief strengths (optionally rating/sentiment)\n` +
            `- If unclear, ask 2–4 targeted follow-ups.\n` +
            `- Do NOT mention databases, brand names, or access limitations.\n` +
            `- Do NOT invent any new names/details.`,
        },
      ],
    });

    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const chunk of chat) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(enc.encode(content));
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (err: any) {
    console.error("[/api/chat] Error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}
