import type { Metadata } from "next";
import { SurahList } from "./surah-list";

export const metadata: Metadata = { title: "কুরআন মজিদ" };

export default function QuranPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">কুরআন মজিদ</h1>
        <p className="mt-1 text-muted-foreground">১১৪টি সূরা — আরবি, উচ্চারণ ও বাংলা অর্থসহ।</p>
      </div>
      <SurahList />
    </div>
  );
}
