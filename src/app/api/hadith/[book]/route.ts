
import { NextResponse } from "next/server";
import { getHadithBook, HADITH_CDN } from "@/lib/hadith";

export const revalidate = 86400;

export async function GET(
  _request: Request,
  context: { params: Promise<{ book: string }> }
) {
  try {
    const { book: slug } = await context.params;
    const book = getHadithBook(slug);

    if (!book) {
      return NextResponse.json(
        { error: "Invalid hadith book" },
        { status: 400 }
      );
    }

    const url = `${HADITH_CDN}/${book.folder}/Meta/${book.metaFile}`;

    const response = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`CDN error: ${response.status}`);
    }

    const data = await response.json();

    const chapters = Object.entries(data).map(
      ([number, value]: [string, any]) => ({
        id: number,
        chSerial: number,
        nameBengali: value.title,
        nameEnglish: "",
        range: value.hadis_range,
      })
    );

    return NextResponse.json({
      book: book.name,
      chapters,
    });
  } catch (error) {
    console.error("Hadith chapters error:", error);

    return NextResponse.json(
      { error: "Could not load hadith chapters" },
      { status: 502 }
    );
  }
}
