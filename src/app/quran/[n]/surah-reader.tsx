"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { SURAH_BN } from "@/lib/surah-bn";
import { toBn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Ayah = { n: number; ar: string; tr: string; bn: string };
type Data = { number: number; name: string; englishName: string; ayahs: Ayah[] };

export function SurahReader({ number }: { number: number }) {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState(false);
  const [showTr, setShowTr] = useState(true);
  const [showBn, setShowBn] = useState(true);
  const [size, setSize] = useState(32);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,en.transliteration,bn.bengali`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => {
        const [ar, tr, bn] = j.data;
        setData({
          number,
          name: ar.name,
          englishName: ar.englishName,
          ayahs: ar.ayahs.map((a: { numberInSurah: number; text: string }, i: number) => ({
            n: a.numberInSurah,
            ar: a.text,
            tr: tr.ayahs[i].text,
            bn: bn.ayahs[i].text,
          })),
        });
      })
      .catch((e) => e.name !== "AbortError" && setErr(true));
    return () => ctrl.abort();
  }, [number]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/quran" className="text-sm text-primary hover:underline">← সব সূরা</Link>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={showTr ? "default" : "outline"} onClick={() => setShowTr((v) => !v)}>উচ্চারণ</Button>
          <Button size="sm" variant={showBn ? "default" : "outline"} onClick={() => setShowBn((v) => !v)}>বাংলা অর্থ</Button>
          <Button size="icon" variant="outline" className="size-8" aria-label="ফন্ট ছোট" onClick={() => setSize((s) => Math.max(22, s - 4))}><Minus /></Button>
          <Button size="icon" variant="outline" className="size-8" aria-label="ফন্ট বড়" onClick={() => setSize((s) => Math.min(56, s + 4))}><Plus /></Button>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 p-8 text-center text-white">
        <p className="text-sm text-white/70">সূরা নং {toBn(number)}</p>
        <h1 className="mt-1 text-3xl font-bold">{SURAH_BN[number - 1]}</h1>
        <p className="font-arabic mt-2 text-4xl text-amber-200">{data?.name ?? ""}</p>
        {number !== 1 && number !== 9 && <p className="font-arabic mt-4 text-2xl">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>}
      </div>

      {err && <p className="text-sm text-destructive">সূরা লোড করা যায়নি। ইন্টারনেট সংযোগ দেখুন।</p>}
      {!data && !err && <p className="text-muted-foreground">লোড হচ্ছে…</p>}

      <div className="space-y-3">
        {data?.ayahs.map((a) => (
          <Card key={a.n} className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{toBn(a.n)}</span>
            </div>
            <p className="font-arabic leading-[2.1] text-right" dir="rtl" style={{ fontSize: size }}>
              {a.n === 1 && number !== 1 && number !== 9 ? a.ar.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim() || a.ar : a.ar}
            </p>
            {showTr && <p className="mt-3 text-sm italic text-muted-foreground">{a.tr}</p>}
            {showBn && <p className="mt-2 leading-relaxed">{a.bn}</p>}
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        {number > 1 ? <Button asChild variant="outline"><Link href={`/quran/${number - 1}`}><ChevronLeft /> আগের সূরা</Link></Button> : <span />}
        {number < 114 ? <Button asChild variant="outline"><Link href={`/quran/${number + 1}`}>পরের সূরা <ChevronRight /></Link></Button> : <span />}
      </div>
      <p className="text-xs text-muted-foreground">তথ্যসূত্র: alquran.cloud (বিনামূল্যে API)। উচ্চারণ ইংরেজি ট্রান্সলিটারেশন, বাংলা অনুবাদ: মুহিউদ্দীন খান।</p>
    </div>
  );
}
