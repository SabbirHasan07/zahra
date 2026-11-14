"use client";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Sunrise, Sunset, Sun, Moon, CloudSun, BellRing } from "lucide-react";
import {
  FARD_ORDER,
  PRAYER_META,
  PRAYER_ORDER,
  fetchTimings,
  format12,
  formatCountdown,
  getNextPrayer,
  hijriMonthBn,
  toDate,
  type DayTimings,
  type PrayerKey,
} from "@/lib/prayer";
import { toBn } from "@/lib/utils";
import { usePlace } from "@/hooks/use-place";
import { LocationPicker } from "@/components/location-picker";
import { Card, CardContent } from "@/components/ui/card";

const ICONS: Record<PrayerKey, React.ComponentType<{ className?: string }>> = {
  fajr: Moon,
  sunrise: Sunrise,
  dhuhr: Sun,
  asr: CloudSun,
  maghrib: Sunset,
  isha: Moon,
};

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const BN_WEEKDAY = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const BN_MONTH = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

function subscribeClock(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}
const clockSnapshot = () => Math.floor(Date.now() / 1000);
const clockServerSnapshot = () => 0;

export function PrayerDashboard() {
  const [place] = usePlace();
  const ts = useSyncExternalStore(subscribeClock, clockSnapshot, clockServerSnapshot);
  const now = useMemo(() => (ts ? new Date(ts * 1000) : null), [ts]);
  const [today, setToday] = useState<DayTimings | null>(null);
  const [tomorrow, setTomorrow] = useState<DayTimings | null>(null);
  const [error, setError] = useState("");

  const todayKey = now ? dayKey(now) : "";

  // fetch timings whenever location or calendar day changes => times update automatically
  useEffect(() => {
    if (!todayKey) return;
    const ctrl = new AbortController();
    const base = new Date();
    const next = new Date(base);
    next.setDate(base.getDate() + 1);
    Promise.all([
      fetchTimings(place.lat, place.lng, base, ctrl.signal),
      fetchTimings(place.lat, place.lng, next, ctrl.signal),
    ])
      .then(([a, b]) => {
        setError("");
        setToday(a);
        setTomorrow(b);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError("নামাজের সময় আনা যায়নি। ইন্টারনেট সংযোগ দেখুন।");
      });
    return () => ctrl.abort();
  }, [place.lat, place.lng, todayKey]);

  const next = useMemo(() => {
    if (!today || !now) return null;
    const n = getNextPrayer(today, now);
    if (n) return n;
    if (tomorrow) {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      return { key: "fajr" as PrayerKey, at: toDate(d, tomorrow.times.fajr) };
    }
    return null;
  }, [today, tomorrow, now]);

  const nowDate = now ?? new Date(0);
  const dateLine = now ? `${BN_WEEKDAY[now.getDay()]}, ${toBn(now.getDate())} ${BN_MONTH[now.getMonth()]} ${toBn(now.getFullYear())}` : "";
  const hijriLine = today ? `${toBn(today.hijri.day)} ${hijriMonthBn(today.hijri.monthEn, today.hijri.monthAr)} ${toBn(today.hijri.year)} হিজরি` : "";
  const timeLine = now ? now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";

  return (
    <section className="space-y-5">
      <div className="islamic-pattern relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/70">{dateLine}</p>
            <p className="text-sm text-amber-200">{hijriLine}</p>
          </div>
          <LocationPicker tone="onDark" />
        </div>

        <div className="mt-8 grid items-end gap-6 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <BellRing className="size-4" /> পরবর্তী ওয়াক্ত
            </p>
            <h2 className="mt-1 text-5xl font-bold tracking-tight sm:text-6xl">
              {next ? PRAYER_META[next.key].bn : "—"}
            </h2>
            <p className="font-arabic text-2xl text-amber-200">{next ? PRAYER_META[next.key].ar : ""}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-white/70">বাকি সময়</p>
            <p className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl" suppressHydrationWarning>
              {next && now ? toBn(formatCountdown(next.at.getTime() - now.getTime())) : "--:--:--"}
            </p>
            <p className="mt-1 text-sm text-white/70">{next ? `${format12(`${String(next.at.getHours()).padStart(2, "0")}:${String(next.at.getMinutes()).padStart(2, "0")}`)} — ${place.name}` : place.name}</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-white/50" suppressHydrationWarning>এখন: {timeLine}</p>
      </div>

      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PRAYER_ORDER.map((key) => {
          const Icon = ICONS[key];
          const isNext = next?.key === key;
          const time = today?.times[key];
          const passed = !!(today && now && toDate(nowDate, today.times[key]).getTime() <= nowDate.getTime());
          return (
            <Card
              key={key}
              className={`transition-all ${isNext ? "border-primary ring-2 ring-primary/40 shadow-lg" : ""} ${passed && !isNext ? "opacity-60" : ""}`}
            >
              <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
                <Icon className={`size-5 ${isNext ? "text-gold" : "text-primary"}`} />
                <p className="font-semibold">{PRAYER_META[key].bn}</p>
                <p className="font-arabic text-sm text-muted-foreground">{PRAYER_META[key].ar}</p>
                <p className="mt-1 text-lg font-bold tabular-nums">{time ? toBn(format12(time)) : "…"}</p>
                {key !== "sunrise" && FARD_ORDER.includes(key) && <span className="text-[10px] text-muted-foreground">ফরজ ওয়াক্ত</span>}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        সময়সূচি: Aladhan API (University of Islamic Sciences, Karachi · হানাফি আসর)। প্রতিদিন ও স্থান পরিবর্তনে স্বয়ংক্রিয়ভাবে আপডেট হয়।
      </p>
    </section>
  );
}
