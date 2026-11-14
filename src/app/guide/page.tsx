import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "ইসলামিক শিক্ষা" };

export default function GuideIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ইসলামিক শিক্ষা</h1>
        <p className="mt-1 text-muted-foreground">নামাজ, অজু ও গোসলের মৌলিক নিয়ম বাংলায়।</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guide/${g.slug}`}>
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
              <CardHeader>
                <CardTitle>{g.title}</CardTitle>
                <CardDescription>{g.summary}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
