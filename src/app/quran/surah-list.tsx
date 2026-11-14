"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { SURAH_BN } from "@/lib/surah-bn";
import { toBn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Surah = { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string };

export function SurahList() {
  const [list, setList] = useState<Surah[] | null>(null);
  const [err, setErr] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((j) => setList(j.data))
      .catch(() => setErr(true));
  }, []);

  const filtered = useMemo(() => {
    if (!list) return [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (x) =>
        x.englishName.toLowerCase().includes(s) ||
        SURAH_BN[x.number - 1].includes(s) ||
        String(x.number) === s
    );
  }, [list, q]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="সূরার নাম বা নম্বর খুঁজুন…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {err && <p className="text-sm text-destructive">সূরার তালিকা আনা যায়নি। ইন্টারনেট সংযোগ দেখুন।</p>}
      {!list && !err && <p className="text-muted-foreground">লোড হচ্ছে…</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Link key={s.number} href={`/quran/${s.number}`}>
            <Card className="flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 font-semibold text-primary">{toBn(s.number)}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{SURAH_BN[s.number - 1]}</p>
                <p className="truncate text-xs text-muted-foreground">{s.englishName} · {toBn(s.numberOfAyahs)} আয়াত</p>
              </div>
              <div className="text-right">
                <p className="font-arabic text-xl">{s.name.replace("سورة", "").trim()}</p>
                <Badge variant="secondary" className="mt-1">{s.revelationType === "Meccan" ? "মক্কী" : "মাদানী"}</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
