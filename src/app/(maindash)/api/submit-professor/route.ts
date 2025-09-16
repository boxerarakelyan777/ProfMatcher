// /src/app/(maindash)/api/submit-professor/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { scrapeProfessorPage } from "../../../../utils/scraper";
import { storeProfessorData } from "../../../../utils/pinecone";
import { z } from "zod";

const BodySchema = z.object({
  url: z.string().url().refine(
    (u) => /ratemyprofessors\.com\/professor\/|rate*my*professor|ShowRatings\.jsp/i.test(u),
    "Only professor profile URLs are allowed."
  ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = BodySchema.parse(body);

    const professorData = await scrapeProfessorPage(url);

    const processed = {
      ...professorData,
      overallRating: typeof professorData.overallRating === "number" ? professorData.overallRating : 0,
    };

    await storeProfessorData(processed);

    return NextResponse.json(
      { message: "Professor data successfully scraped and stored", professorData: processed },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[submit-professor] error:", error);
    return NextResponse.json(
      {
        error: "Failed to process professor submission",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
