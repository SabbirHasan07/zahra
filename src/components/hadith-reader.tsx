"use client";

import { useEffect, useMemo, useState } from "react";
import { HADITH_BOOKS } from "@/lib/hadith";

type Chapter = {
  id: string;
  chSerial: string;
  nameBengali: string;
  nameEnglish: string;
  range: string;
};

type Hadith = {
  id: number;
  hadithNo: number;
  hadithArabic: string;
  hadithBengali: string;
  rabiNameBn: string;
  topicName: string;
  checkStatus: string;
  note: string | null;
};

type HadithResponse = {
  chapter: string;
  range: string;
  currentPage: number;
  totalPages: number;
  pages: number[];
  hadiths: Hadith[];
};

export default function HadithReader() {
  const [selectedBook, setSelectedBook] = useState("bukhari");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<HadithResponse | null>(null);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingHadiths, setLoadingHadiths] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Load chapters
  useEffect(() => {
    const controller = new AbortController();

    async function loadChapters() {
      setLoadingChapters(true);
      setError("");
      setChapters([]);
      setSelectedChapter("");
      setData(null);
      setPage(1);

      try {
        const response = await fetch(`/api/hadith/${selectedBook}`, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "অধ্যায় লোড করা যায়নি");
        }

        setChapters(result.chapters || []);

        if (result.chapters?.length) {
          setSelectedChapter(String(result.chapters[0].id));
        } else {
          setError("কোনো অধ্যায় পাওয়া যায়নি।");
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingChapters(false);
        }
      }
    }

    loadChapters();

    return () => controller.abort();
  }, [selectedBook]);

  // Load hadiths
  useEffect(() => {
    if (!selectedChapter) return;

    const controller = new AbortController();

    async function loadHadiths() {
      setLoadingHadiths(true);
      setError("");
      setData(null);

      try {
        const response = await fetch(
          `/api/hadith/${selectedBook}/${selectedChapter}?page=${page}`,
          { signal: controller.signal },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "হাদিস লোড করা যায়নি");
        }

        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingHadiths(false);
        }
      }
    }

    loadHadiths();

    return () => controller.abort();
  }, [selectedBook, selectedChapter, page]);

  const filteredHadiths = useMemo(() => {
    if (!data?.hadiths) return [];

    const query = search.trim().toLowerCase();

    if (!query) return data.hadiths;

    return data.hadiths.filter((hadith) =>
      [
        hadith.hadithBengali,
        hadith.hadithArabic,
        hadith.rabiNameBn,
        String(hadith.hadithNo),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [data, search]);

  const currentBook = HADITH_BOOKS.find((book) => book.slug === selectedBook);

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">হাদীস গ্রন্থ</h1>
        <p className="text-sm text-muted-foreground">
          আরবি মূল হাদিস ও বাংলা অনুবাদ পড়ুন
        </p>
      </header>

      {/* Book selection */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {HADITH_BOOKS.map((book) => (
          <button
            key={book.slug}
            onClick={() => {
              setSelectedBook(book.slug);
              setSearch("");
            }}
            className={`rounded-xl border p-4 text-left transition ${
              selectedBook === book.slug
                ? "border-primary bg-primary/10"
                : "hover:bg-muted"
            }`}
          >
            <p className="font-semibold">{book.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{book.nameAr}</p>
          </button>
        ))}
      </div>

      {/* Chapter selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">অধ্যায় নির্বাচন করুন</label>

        <select
          value={selectedChapter}
          onChange={(event) => {
            setSelectedChapter(event.target.value);
            setPage(1);
            setSearch("");
          }}
          disabled={loadingChapters || chapters.length === 0}
          className="w-full rounded-lg border bg-background p-3"
        >
          {chapters.length === 0 && (
            <option value="">
              {loadingChapters ? "অধ্যায় লোড হচ্ছে..." : "অধ্যায় নেই"}
            </option>
          )}

          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.chSerial}. {chapter.nameBengali} ({chapter.range})
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="হাদিস, বর্ণনাকারী বা নম্বর দিয়ে খুঁজুন..."
        className="w-full rounded-lg border bg-background p-3"
      />

      {currentBook && (
        <div className="rounded-lg bg-muted p-3 text-sm">
          বর্তমানে পড়ছেন: <strong>{currentBook.name}</strong>
          {data?.chapter && <span> — {data.chapter}</span>}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-600">
          {error}
          <button
            onClick={() => {
              if (selectedChapter) {
                setPage((current) => current);
                setSelectedChapter((current) => current);
              } else {
                setSelectedBook((current) => current);
              }
            }}
            className="ml-2 underline"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {loadingChapters && (
        <p className="py-8 text-center text-muted-foreground">
          অধ্যায় লোড হচ্ছে...
        </p>
      )}

      {loadingHadiths && (
        <p className="py-8 text-center text-muted-foreground">
          হাদিস লোড হচ্ছে...
        </p>
      )}

      {!loadingHadiths && data && (
        <>
          <div className="space-y-5">
            {filteredHadiths.map((hadith) => (
              <article
                key={hadith.id}
                className="overflow-hidden rounded-xl border bg-card shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3">
                  <span className="font-semibold">
                    হাদিস নং {hadith.hadithNo}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {data.chapter}
                  </span>
                </div>

                {/* Book layout */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left: Bengali */}
                  <section className="order-2 border-t p-5 md:order-1 md:border-r md:border-t-0 md:p-7">
                    <h3 className="mb-4 font-bold text-primary">
                      বাংলা অনুবাদ
                    </h3>

                    <p className="whitespace-pre-line text-base leading-9">
                      {hadith.hadithBengali || "অনুবাদ পাওয়া যায়নি।"}
                    </p>

                    {hadith.rabiNameBn && (
                      <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">
                        বর্ণনাকারী: {hadith.rabiNameBn}
                      </p>
                    )}
                  </section>

                  {/* Right: Arabic + pronunciation */}
                  <section className="order-1 p-5 md:order-2 md:p-7">
                    <h3 className="mb-4 text-right font-bold text-primary">
                      আরবি মূল হাদিস
                    </h3>

                    <p
                      dir="rtl"
                      lang="ar"
                      className="text-right font-serif text-2xl leading-[2.3] md:text-3xl"
                    >
                      {hadith.hadithArabic || "আরবি পাঠ পাওয়া যায়নি।"}
                    </p>

                    <div className="mt-7 border-t pt-5">
                      <h3 className="mb-3 font-bold text-primary">
                        বাংলা উচ্চারণ
                      </h3>

                      
                    </div>
                  </section>
                </div>
              </article>
            ))}

            {filteredHadiths.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                কোনো হাদিস পাওয়া যায়নি।
              </p>
            )}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={page <= 1 || loadingHadiths}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                পূর্ববর্তী
              </button>

              <span className="px-3 text-sm">
                {data.currentPage} / {data.totalPages}
              </span>

              <button
                disabled={page >= data.totalPages || loadingHadiths}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                পরবর্তী
              </button>
            </div>
          )}
        </>
      )}

      <p className="text-center text-xs text-muted-foreground">
        তথ্যসূত্র: Kafela Hadith API dataset. বাংলা উচ্চারণ ও বিস্তারিত ব্যাখ্যা
        এই ডেটা থেকে সরবরাহ করা হচ্ছে না।
      </p>
    </div>
  );
}
