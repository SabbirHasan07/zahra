import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { GUIDES, getGuide, type Block } from "@/lib/guides";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return { title: g?.title ?? "শিক্ষা", description: g?.summary };
}

function Render({ b }: { b: Block }) {
  switch (b.type) {
    case "p":
      return <p className="leading-relaxed">{b.text}</p>;
    case "ol":
      return (
        <ol className="space-y-2">
          {b.items.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
              <span className="leading-relaxed">{t}</span>
            </li>
          ))}
        </ol>
      );
    case "ul":
      return (
        <ul className="list-disc space-y-2 pl-5 marker:text-primary">
          {b.items.map((t, i) => (
            <li key={i} className="leading-relaxed">{t}</li>
          ))}
        </ul>
      );
    case "arabic":
      return (
        <div className="rounded-2xl bg-muted p-4">
          <p className="font-arabic text-2xl leading-[2.1]" dir="rtl">{b.text}</p>
          {b.bn && <p className="mt-2 text-sm text-muted-foreground">{b.bn}</p>}
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>{b.head.map((h) => <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t">
                  {r.map((c, j) => <td key={j} className={`px-3 py-2 ${j === 0 ? "font-semibold" : ""}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <p className="flex gap-2 rounded-xl bg-gold/10 p-3 text-sm text-foreground/80">
          <Info className="mt-0.5 size-4 shrink-0 text-gold" /> {b.text}
        </p>
      );
  }
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/guide" className="text-sm text-primary hover:underline">← সব বিষয়</Link>
      <div>
        <h1 className="text-3xl font-bold">{g.title}</h1>
        <p className="mt-1 text-muted-foreground">{g.summary}</p>
      </div>
      {g.sections.map((s) => (
        <Card key={s.heading}>
          <CardHeader><CardTitle>{s.heading}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {s.blocks.map((b, i) => <Render key={i} b={b} />)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
