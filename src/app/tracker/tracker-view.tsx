"use client";
import { useState, useSyncExternalStore } from "react";
import { Check, ChevronLeft, ChevronRight, Flame, Trophy } from "lucide-react";
import { FARD_ORDER, PRAYER_META } from "@/lib/prayer";
import { cn, toBn } from "@/lib/utils";
import { useTracker, ymd } from "@/hooks/use-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BN_WD = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
const BN_MONTH = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

const subscribeNone = () => () => {};
function useToday() {
  // stable string snapshot so hydration is safe
  return useSyncExternalStore(subscribeNone, () => ymd(new Date()), () => "");
}

export function TrackerView() {
  const today = useToday();
  const { data, toggle } = useTracker();
  const [offset, setOffset] = useState(0); // month offset

  if (!today) return <div className="h-96" />;

  const [ty, tm, td] = today.split("-").map(Number);
  const todayDate = new Date(ty, tm - 1, td);
  const done = data[today] ?? [];

  // streak: consecutive days (ending today/yesterday) with all 5 prayers
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    const full = (data[ymd(d)] ?? []).length >= 5;
    if (full) streak++;
    else if (i === 0) continue;
    else break;
  }

  const view = new Date(ty, tm - 1 + offset, 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const lead = view.getDay();
  let monthTotal = 0;
  for (let d = 1; d <= daysInMonth; d++) monthTotal += Math.min(5, (data[ymd(new Date(view.getFullYear(), view.getMonth(), d))] ?? []).length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">নামাজ ট্র্যাকার</h1>
        <p className="mt-1 text-muted-foreground">আজ কোন কোন নামাজ পড়েছেন তা চিহ্নিত করুন। তথ্য শুধু আপনার ডিভাইসে সংরক্ষিত থাকে।</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-5"><Check className="size-8 text-primary" /><div><p className="text-2xl font-bold">{toBn(done.length)}/৫</p><p className="text-sm text-muted-foreground">আজকের নামাজ</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Flame className="size-8 text-gold" /><div><p className="text-2xl font-bold">{toBn(streak)} দিন</p><p className="text-sm text-muted-foreground">টানা ৫ ওয়াক্ত</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Trophy className="size-8 text-primary" /><div><p className="text-2xl font-bold">{toBn(monthTotal)}</p><p className="text-sm text-muted-foreground">এই মাসের মোট নামাজ</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>আজকের ওয়াক্ত</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-5">
          {FARD_ORDER.map((k) => {
            const on = done.includes(k);
            return (
              <button
                key={k}
                onClick={() => toggle(today, k)}
                aria-pressed={on}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                  on ? "border-primary bg-primary text-primary-foreground shadow-md" : "hover:border-primary/50 hover:bg-accent"
                )}
              >
                <span className={cn("grid size-9 place-items-center rounded-full", on ? "bg-white/20" : "bg-muted")}>
                  {on ? <Check className="size-5" /> : <span className="size-2 rounded-full bg-muted-foreground/40" />}
                </span>
                <span className="font-semibold">{PRAYER_META[k].bn}</span>
                <span className="font-arabic text-sm opacity-80">{PRAYER_META[k].ar}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{BN_MONTH[view.getMonth()]} {toBn(view.getFullYear())}</CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" aria-label="আগের মাস" onClick={() => setOffset((o) => o - 1)}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label="পরের মাস" disabled={offset >= 0} onClick={() => setOffset((o) => o + 1)}><ChevronRight /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground">
            {BN_WD.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {Array.from({ length: lead }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(view.getFullYear(), view.getMonth(), i + 1);
              const key = ymd(date);
              const n = Math.min(5, (data[key] ?? []).length);
              const future = date > todayDate;
              return (
                <div
                  key={key}
                  className={cn(
                    "grid aspect-square place-items-center rounded-lg text-sm",
                    future ? "text-muted-foreground/40" : n === 5 ? "bg-primary text-primary-foreground" : n > 0 ? "bg-primary/25" : "bg-muted",
                    key === today && "ring-2 ring-gold"
                  )}
                  title={`${toBn(n)}/৫`}
                >
                  {toBn(i + 1)}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">গাঢ় সবুজ = ৫ ওয়াক্ত পূর্ণ · হালকা সবুজ = আংশিক</p>
        </CardContent>
      </Card>
    </div>
  );
}
