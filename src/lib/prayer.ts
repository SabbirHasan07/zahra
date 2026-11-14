export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export const PRAYER_META: Record<PrayerKey, { bn: string; ar: string; en: string; rakat?: string }> = {
  fajr: { bn: "ফজর", ar: "الفجر", en: "Fajr" },
  sunrise: { bn: "সূর্যোদয়", ar: "الشروق", en: "Sunrise" },
  dhuhr: { bn: "যোহর", ar: "الظهر", en: "Dhuhr" },
  asr: { bn: "আসর", ar: "العصر", en: "Asr" },
  maghrib: { bn: "মাগরিব", ar: "المغرب", en: "Maghrib" },
  isha: { bn: "এশা", ar: "العشاء", en: "Isha" },
};

export const PRAYER_ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
export const FARD_ORDER: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type DayTimings = {
  date: string; // YYYY-MM-DD (gregorian)
  times: Record<PrayerKey, string>; // "HH:MM" 24h
  hijri: { day: string; monthEn: string; monthAr: string; year: string };
  weekdayEn: string;
};

function clean(t: string) {
  return t.split(" ")[0];
}

export async function fetchTimings(lat: number, lng: number, d: Date, signal?: AbortSignal): Promise<DayTimings> {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  // method=1: University of Islamic Sciences, Karachi (widely used in Bangladesh), school=1: Hanafi Asr
  const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=1&school=1`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Prayer time request failed");
  const json = await res.json();
  const t = json.data.timings;
  const h = json.data.date.hijri;
  return {
    date: `${yyyy}-${mm}-${dd}`,
    times: {
      fajr: clean(t.Fajr),
      sunrise: clean(t.Sunrise),
      dhuhr: clean(t.Dhuhr),
      asr: clean(t.Asr),
      maghrib: clean(t.Maghrib),
      isha: clean(t.Isha),
    },
    hijri: { day: h.day, monthEn: h.month.en, monthAr: h.month.ar, year: h.year },
    weekdayEn: json.data.date.gregorian.weekday.en,
  };
}

export function toDate(base: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

export function format12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function getNextPrayer(timings: DayTimings, now: Date): { key: PrayerKey; at: Date } | null {
  for (const key of PRAYER_ORDER) {
    const at = toDate(now, timings.times[key]);
    if (at.getTime() > now.getTime()) return { key, at };
  }
  return null; // after Isha: next is tomorrow's Fajr (caller handles)
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

const HIJRI_BN: Record<string, string> = {
  Muharram: "মুহাররম",
  Safar: "সফর",
  "Rabīʿ al-awwal": "রবিউল আউয়াল",
  "Rabīʿ al-thānī": "রবিউস সানি",
  "Jumādá al-ūlá": "জমাদিউল আউয়াল",
  "Jumādá al-ākhirah": "জমাদিউস সানি",
  Rajab: "রজব",
  "Shaʿbān": "শা'বান",
  "Ramaḍān": "রমজান",
  Shawwāl: "শাওয়াল",
  "Dhū al-Qaʿdah": "জিলকদ",
  "Dhū al-Ḥijjah": "জিলহজ",
};
export function hijriMonthBn(en: string, ar: string) {
  return HIJRI_BN[en] ?? ar;
}
