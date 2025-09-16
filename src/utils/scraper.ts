// src/utils/scraper.ts
import axios from "axios";
import * as cheerio from "cheerio";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

export interface ProfessorData {
  name: string;
  department: string;
  institution: string;
  overallRating: number | null;
  reviews: { text: string; rating: number | null; date: string }[];
}

async function fetchHtml(url: string, tries = 3): Promise<string> {
  let last: any;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await axios.get(url, {
        headers: { "User-Agent": UA, Accept: "text/html,*/*" },
        timeout: 15000,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      if (typeof res.data !== "string") throw new Error("Unexpected response");
      return res.data as string;
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 600 * (i + 1)));
    }
  }
  throw last;
}

export async function scrapeProfessorPage(url: string): Promise<ProfessorData> {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const name =
    $(".NameTitle__Name-sc-19mggdt-0, [data-testid='professor-name']").first().text().trim() ||
    $("h1, h2").first().text().trim() ||
    "N/A";

  // Some pages put dept + school together; split if comma-separated
  const titleBlock =
    $(".NameTitle__Title-sc-19mggdt-1, [data-testid='professor-school']").first().text().trim();

  let department = "N/A";
  let institution = "N/A";
  if (titleBlock && titleBlock.includes("at")) {
    const [deptPart, schoolPart] = titleBlock.split("at").map((s) => s.trim());
    department = deptPart || "N/A";
    institution = schoolPart || "N/A";
  } else if (titleBlock && titleBlock.includes(",")) {
    const [deptPart, schoolPart] = titleBlock.split(",").map((s) => s.trim());
    department = deptPart || "N/A";
    institution = schoolPart || "N/A";
  } else {
    department =
      $(".Department__StyledDepartment-sc-1v5glsi-0").first().text().trim() || "N/A";
    institution =
      $("[data-testid='school-name']").first().text().trim() ||
      $(".School__StyledSchool").first().text().trim() ||
      "N/A";
  }

  const ratingText =
    $(".RatingValue__Numerator-qw8sqy-2, [data-testid='rating-value']")
      .first()
      .text()
      .trim() || "";
  const overallRating = ratingText ? parseFloat(ratingText) : null;

  const reviews = [] as ProfessorData["reviews"];
  $(
    ".Rating__RatingBody-sc-1rhvpxz-0, [data-testid='rating-body'], .Rating__StyledRating"
  ).each((_, el) => {
    const $r = $(el);
    const text =
      $r.find(".Comments__StyledComments-dzzyvm-0, [data-testid='comment']").text().trim() || "N/A";
    const rt =
      $r
        .find(".RatingHeader__RatingNumber-sc-1dlkqw1-1, [data-testid='rating-number']")
        .text()
        .trim() || "";
    const rating = rt ? parseFloat(rt) : null;
    const date =
      $r.find(".TimeStamp__StyledTimeStamp-sc-9q2r30-0, time").first().text().trim() || "N/A";
    if (text) reviews.push({ text, rating, date });
  });

  return { name, department, institution, overallRating, reviews };
}
