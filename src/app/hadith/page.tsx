
import type { Metadata } from "next";
import HadithReader from "@/components/hadith-reader";

export const metadata: Metadata = {
  title: "হাদীস গ্রন্থ | Noor",
  description: "সহীহ বুখারী, সহীহ মুসলিম ও জামে আত-তিরমিযীর হাদিস পড়ুন।",
};

export default function HadithPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <HadithReader />
    </main>
  );
}
