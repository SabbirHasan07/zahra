
import { NextResponse } from "next/server";
import { getHadithBook, HADITH_CDN } from "@/lib/hadith";

export const revalidate = 86400;

const PAGE_SIZE = 20;

function toEnglishDigits(value: string) {
  const bengaliDigits = "০১২৩৪৫৬৭৮৯";

  return value.replace(/[০-৯]/g, (digit) =>
    String(bengaliDigits.indexOf(digit))
  );
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ book: string; chapter: string }>;
  }
) {
  try {
    const { book: slug, chapter } = await context.params;
    const book = getHadithBook(slug);

    if (!book) {
      return NextResponse.json(
        { error: "Invalid hadith book" },
        { status: 400 }
      );
    }

    const chapterNumber = Number(chapter);

    if (!Number.isInteger(chapterNumber) || chapterNumber < 0) {
      return NextResponse.json(
        { error: "Invalid chapter number" },
        { status: 400 }
      );
    }

    const url = `${HADITH_CDN}/${book.folder}/Meta/${book.metaFile}`;

    const metaResponse = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!metaResponse.ok) {
      throw new Error("Could not load chapter metadata");
    }

    const metadata = await metaResponse.json();
    const chapterInfo = metadata[String(chapterNumber)];

    if (!chapterInfo) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    const range = toEnglishDigits(chapterInfo.hadis_range);
    const match = range.match(/(\d+)\s*[-–—]\s*(\d+)/);

    if (!match) {
      throw new Error(`Invalid hadith range: ${range}`);
    }

    const start = Number(match[1]);
    const end = Number(match[2]);

    const { searchParams } = new URL(request.url);
    const requestedPage = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const totalHadiths = end - start + 1;
    const totalPages = Math.ceil(totalHadiths / PAGE_SIZE);

    const currentPage = Math.min(requestedPage, totalPages);
    const firstId = start + (currentPage - 1) * PAGE_SIZE;
    const lastId = Math.min(firstId + PAGE_SIZE - 1, end);

    const ids = Array.from(
      { length: lastId - firstId + 1 },
      (_, index) => firstId + index
    );

    const results = await Promise.all(
      ids.map(async (id) => {
        const hadithUrl =
          `${HADITH_CDN}/${book.folder}/hadith/${id}.json`;

        const response = await fetch(hadithUrl, {
          next: { revalidate: 86400 },
        });

        if (!response.ok) {
          console.error(`Hadith ${id} failed: ${response.status}`);
          return null;
        }

        const result = await response.json();
        const item = result?.hadith;

        if (!item) return null;

        return {
          id: item.hadith_id,
          hadithNo: item.hadith_id,
          hadithArabic: item.ar || "",
          hadithBengali: item.bn || "",
          rabiNameBn: item.narrator || "",
          topicName: chapterInfo.title,
          checkStatus: item.grade || "",
          note: item.note || "",
          chapterId: chapterNumber,
        };
      })
    );

    return NextResponse.json({
      chapter: chapterInfo.title,
      range: chapterInfo.hadis_range,
      currentPage,
      totalPages,
      pages: Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ),
      hadiths: results.filter(Boolean),
    });
  } catch (error) {
    console.error("Hadith reading error:", error);

    return NextResponse.json(
      { error: "Could not load hadiths" },
      { status: 502 }
    );
  }
}
