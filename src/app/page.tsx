import Link from "next/link";
import { BookMarked, BookOpenText, CheckSquare, Droplets, Landmark, MoonStar, ScrollText } from "lucide-react";
import { PrayerDashboard } from "@/components/prayer-dashboard";
import { WeatherCard } from "@/components/weather-card";
import { MasjidCard } from "@/components/masjid-list";
import { listMasjids } from "@/lib/masjids";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/tracker", title: "নামাজ ট্র্যাকার", desc: "প্রতিদিনের ৫ ওয়াক্ত নামাজের হিসাব রাখুন", Icon: CheckSquare },
  { href: "/quran", title: "কুরআন মজিদ", desc: "আরবি, উচ্চারণ ও বাংলা অর্থসহ", Icon: BookOpenText },
  { href: "/hadith", title: "হাদীস ও ব্যাখ্যা", desc: "বুখারী, মুসলিম, তিরমিযী থেকে বাছাই করা হাদীস", Icon: BookMarked },
  { href: "/guide/wudu", title: "অজুর নিয়ম", desc: "ফরজ, সুন্নত ও ধাপে ধাপে পদ্ধতি", Icon: Droplets },
  { href: "/guide/ghusl", title: "গোসলের ফরজ", desc: "মৌলিক নিয়ম ও ফরজসমূহ", Icon: ScrollText },
  { href: "/guide/rakat", title: "ওয়াক্ত অনুযায়ী রাকাত", desc: "ফরজ, সুন্নত, ওয়াজিব ও নফল", Icon: MoonStar },
  { href: "/guide/tahajjud", title: "তাহাজ্জুদের নিয়ম", desc: "সময়, রাকাত ও পদ্ধতি", Icon: Landmark },
];

export default async function Home() {
  const { data } = await listMasjids();
  const preview = data.slice(0, 2);
  return (
    <div className="space-y-8">
      <PrayerDashboard />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <WeatherCard />
        </div>
        <div className="space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">মসজিদের জামাত</h2>
            <Link href="/masjids" className="text-sm text-primary hover:underline">সব দেখুন →</Link>
          </div>
          {preview.length === 0 ? (
            <Card>
              <CardContent className="p-5 text-sm text-muted-foreground">অ্যাডমিন মসজিদ যোগ করলে এখানে জামাতের সময় দেখা যাবে।</CardContent>
            </Card>
          ) : (
            preview.map((m) => <MasjidCard key={m.id} m={m} />)
          )}
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">দ্রুত শিখুন ও ব্যবহার করুন</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map(({ href, title, desc, Icon }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-md">
                <CardHeader className="flex-row items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
