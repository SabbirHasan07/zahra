import type { Metadata } from "next";
import { Info, Quote } from "lucide-react";
import { HADITH_BOOKS } from "@/lib/hadith";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "হাদীস ও ব্যাখ্যা" };

export default function HadithPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">হাদীস ও ব্যাখ্যা</h1>
        <p className="mt-1 text-muted-foreground">বুখারী, মুসলিম ও তিরমিযী থেকে ২টি করে হাদীস — আরবি, বাংলা অনুবাদ ও ব্যাখ্যাসহ।</p>
      </div>

      {HADITH_BOOKS.map((book) => (
        <section key={book.slug} className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b pb-3">
            <div>
              <h2 className="text-2xl font-semibold text-primary">{book.name}</h2>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
            <p className="font-arabic text-2xl text-gold">{book.nameAr}</p>
          </div>
          <p className="text-sm text-muted-foreground">{book.about}</p>

          {book.hadiths.map((h) => (
            <Card key={h.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="gold">{book.name}</Badge>
                  <span className="text-xs text-muted-foreground">বর্ণনায়: {h.narrator}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-arabic text-2xl leading-[2.2] text-right" dir="rtl">{h.arabic}</p>
                <p className="flex gap-2 leading-relaxed">
                  <Quote className="mt-1 size-4 shrink-0 text-primary" />
                  <span>{h.bn}</span>
                </p>
                <div className="rounded-xl bg-muted p-4">
                  <CardTitle className="mb-1 text-sm text-primary">ব্যাখ্যা</CardTitle>
                  <p className="text-sm leading-relaxed text-foreground/90">{h.explanation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ))}

      <p className="flex gap-2 rounded-xl bg-gold/10 p-3 text-sm text-foreground/80">
        <Info className="mt-0.5 size-4 shrink-0 text-gold" />
        অনুবাদ ও ব্যাখ্যা সংক্ষিপ্ত। হাদীস নম্বর ও পূর্ণ সনদ মূল গ্রন্থ বা নির্ভরযোগ্য বাংলা অনুবাদ থেকে মিলিয়ে নিন এবং বিস্তারিত জানতে আলেমদের শরণাপন্ন হোন।
      </p>
    </div>
  );
}
