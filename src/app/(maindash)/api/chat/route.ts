// /src/app/(maindash)/api/chat/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Pinecone, QueryOptions } from "@pinecone-database/pinecone";
import {
  HuggingFaceInferenceEmbeddings,
  HuggingFaceInferenceEmbeddingsParams,
} from "@langchain/community/embeddings/hf";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function looksVague(s: string) {
  if (!s) return true;
  const q = s.toLowerCase();
  const hasCourse = /\b([a-z]{2,5})\s*\d{2,4}\b/i.test(q);
  const hasUniversity =
    /\b(university|college|institute|polytechnic|state|uw|ucla|asu|sfu|ubc|ualberta|toronto)\b/i.test(
      q
    );
  const hasProfessor = /\bprof|professor|instructor|lecturer\b/i.test(q);
  return s.trim().length < 12 && !(hasCourse || hasUniversity || hasProfessor);
}

function streamText(text: string) {
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
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Use only the last user message
    const lastUser = [...data].reverse().find((m) => m?.role === "user");
    const userText: string =
      typeof lastUser?.content === "string" ? lastUser.content : "";

    if (looksVague(userText)) {
      const clarifier =
        `To recommend professors, please include:\n` +
        `• University/college\n` +
        `• Course or subject (e.g., "CS 101")\n` +
        `• What you value (clear grading, engaging lectures, lighter workload, etc.)\n\n` +
        `Examples:\n` +
        `• "Best professors for CS 101 at University of Alberta who explain concepts clearly"\n` +
        `• "Top instructors for ECON 201 at UW with fair grading and helpful office hours"`;
      return new NextResponse(streamText(clarifier), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    // 1) Embed
    const hfParams: HuggingFaceInferenceEmbeddingsParams = {
      apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
    };
    const embedder = new HuggingFaceInferenceEmbeddings(hfParams);
    const embedding = await embedder.embedQuery(userText);

    // 2) Pinecone query
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });
    const index = pc.Index(process.env.PINECONE_INDEX ?? "rag").namespace(
      process.env.PINECONE_NAMESPACE ?? "nsl"
    );

    const queryOptions: QueryOptions = {
      topK: 6,
      includeMetadata: true,
      vector: embedding,
    };
    const results = await index.query(queryOptions);

    // 3) Build context
    const items = (results.matches ?? []).map((m) => {
      const md = (m.metadata || {}) as Record<string, any>;
      const name = (md.name ?? md.professor ?? "").toString().trim();
      return {
        id: m.id,
        name,
        subject: (md.subject ?? md.course ?? md.department ?? "").toString().trim(),
        stars: (md.stars ?? md.rating ?? "").toString().trim(),
        sentiment: (md.sentiment ?? "").toString().trim(),
        review: (md.review ?? md.snippet ?? "").toString().trim(),
      };
    });

    const usable = items.filter(
      (i) => i.name && i.name.toLowerCase() !== "unknown"
    );

    const CONTEXT =
      usable.length === 0
        ? ""
        : usable
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
      const clarifier =
        `I don’t have enough matches yet.\n` +
        `Please include:\n` +
        `• University name\n` +
        `• Course code/subject (e.g., "CS 101")\n` +
        `• Preferences (clear grading, engaging lectures, lighter workload, etc.)\n\n` +
        `Examples:\n` +
        `• "Best professors for CS 101 at University of Alberta who explain concepts clearly"\n` +
        `• "Looking for ECON 201 at UW — fair grading and helpful office hours"`;
      return new NextResponse(streamText(clarifier), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    // 4) LLM
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      {
        role: "user" as const,
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
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      stream: true,
      messages,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(encoder.encode(content));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("[/api/chat] Error:", err);
    const msg = err?.message || err?.error?.error?.message || "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
