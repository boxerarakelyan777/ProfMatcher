// /src/app/(maindash)/api/advanced-search/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

const SearchSchema = z.object({
  teacherName: z.string().trim().optional(),
  schoolName: z.string().trim().optional(),
  department: z.string().trim().optional(),
  minRating: z.number().min(0).max(5).optional(),
  courseLevel: z.string().trim().optional(),   // kept for UI parity, but not faked
  teachingStyle: z.string().trim().optional(), // kept for UI parity, but not faked
});

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

async function fetchWithRetry(url: string, tries = 3) {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await axios.get(url, {
        headers: { "User-Agent": UA, Accept: "text/html,*/*" },
        timeout: 12000,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      return res.data as string;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastErr;
}

type Prof = {
  name: string;
  school: string;
  department: string;
  rating: number;
  profileUrl?: string;
};

function parseSearch(html: string): Prof[] {
  const $ = cheerio.load(html);

  // Try multiple selector fallbacks to survive CSS churn
  const cards = $(
    [
      ".TeacherCard__StyledTeacherCard-syjs0d-0",
      "[data-testid='teacher-card']",
      ".RatingsSearch__TeacherCard", // fallback
    ].join(",")
  );

  const list: Prof[] = [];
  cards.each((_, el) => {
    const $el = $(el);

    const name =
      $el.find(".NameTitle__Name-dowf0z-0, [data-testid='teacher-name']").text().trim() ||
      $el.find("a, h3, h2").first().text().trim();

    const school =
      $el.find(".NameTitle__Title-dowf0z-1").first().text().trim() ||
      $el.find("[data-testid='teacher-school']").text().trim();

    const department =
      $el.find(".Department__StyledDepartment-sc-1v5glsi-0").text().trim() ||
      $el.find("[data-testid='teacher-department']").text().trim();

    const ratingText =
      $el.find(".CardNumRating__CardNumRatingNumber-sc-17t4b9u-2").text().trim() ||
      $el.find("[data-testid='card-num-rating']").text().trim();

    const rating = ratingText ? parseFloat(ratingText) : 0;

    const profileUrl = $el.find("a[href*='/professor/'], a[href*='/ShowRatings.jsp']")
      .attr("href");

    if (name) list.push({ name, school, department, rating, profileUrl });
  });

  return list;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const criteria = SearchSchema.parse(body);

    const searchQuery = [criteria.teacherName, criteria.schoolName, criteria.department]
      .filter(Boolean)
      .join(" ");

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Please provide at least one of: teacherName, schoolName, department." },
        { status: 400 }
      );
    }

    const url = `https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(
      searchQuery
    )}`;

    const html = await fetchWithRetry(url);
    const professors = parseSearch(html);

    const filtered = professors.filter((p) => {
      const schoolOk = !criteria.schoolName || p.school.toLowerCase().includes(criteria.schoolName.toLowerCase());
      const deptOk = !criteria.department || p.department.toLowerCase().includes(criteria.department.toLowerCase());
      const ratingOk = p.rating >= (criteria.minRating ?? 0);
      return schoolOk && deptOk && ratingOk;
    });

    const ranked = filtered
      .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
      .slice(0, 12);

    return NextResponse.json({ results: ranked });
  } catch (error: any) {
    console.error("[advanced-search] error:", error?.message || error);
    return NextResponse.json({ error: "Failed to perform advanced search" }, { status: 500 });
  }
}
