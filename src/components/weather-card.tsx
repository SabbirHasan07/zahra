"use client";
import { useEffect, useState } from "react";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Droplets, Sun, Wind, Thermometer } from "lucide-react";
import { usePlace } from "@/hooks/use-place";
import { toBn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Weather = {
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  code: number;
  days: { date: string; max: number; min: number; rain: number; code: number }[];
};

function describe(code: number): { label: string; Icon: React.ComponentType<{ className?: string }> } {
  if (code === 0) return { label: "পরিষ্কার আকাশ", Icon: Sun };
  if (code <= 3) return { label: "আংশিক মেঘলা", Icon: Cloud };
  if (code <= 48) return { label: "কুয়াশা", Icon: CloudFog };
  if (code <= 57) return { label: "গুঁড়ি গুঁড়ি বৃষ্টি", Icon: CloudDrizzle };
  if (code <= 67) return { label: "বৃষ্টি", Icon: CloudRain };
  if (code <= 77) return { label: "তুষারপাত", Icon: CloudSnow };
  if (code <= 82) return { label: "ভারী বৃষ্টি", Icon: CloudRain };
  return { label: "বজ্রসহ বৃষ্টি", Icon: CloudLightning };
}

const BN_DAYS = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"];

export function WeatherCard() {
  const [place] = usePlace();
  const [w, setW] = useState<Weather | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto&forecast_days=4`;
    fetch(url, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => {
        setErr(false);
        setW({
          temp: j.current.temperature_2m,
          feels: j.current.apparent_temperature,
          humidity: j.current.relative_humidity_2m,
          wind: j.current.wind_speed_10m,
          code: j.current.weather_code,
          days: j.daily.time.map((d: string, i: number) => ({
            date: d,
            max: j.daily.temperature_2m_max[i],
            min: j.daily.temperature_2m_min[i],
            rain: j.daily.precipitation_probability_max[i],
            code: j.daily.weather_code[i],
          })),
        });
      })
      .catch((e) => e.name !== "AbortError" && setErr(true));
    return () => ctrl.abort();
  }, [place.lat, place.lng]);

  const cur = w ? describe(w.code) : null;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>আবহাওয়া · {place.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {err && <p className="text-sm text-destructive">আবহাওয়ার তথ্য আনা যায়নি।</p>}
        {!w && !err && <p className="text-sm text-muted-foreground">লোড হচ্ছে…</p>}
        {w && cur && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <cur.Icon className="size-14 text-gold" />
              <div>
                <p className="text-4xl font-bold tabular-nums">{toBn(Math.round(w.temp))}°C</p>
                <p className="text-sm text-muted-foreground">{cur.label}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-muted p-2"><Thermometer className="mx-auto mb-1 size-4 text-primary" />অনুভূত {toBn(Math.round(w.feels))}°</div>
              <div className="rounded-xl bg-muted p-2"><Droplets className="mx-auto mb-1 size-4 text-primary" />আর্দ্রতা {toBn(w.humidity)}%</div>
              <div className="rounded-xl bg-muted p-2"><Wind className="mx-auto mb-1 size-4 text-primary" />বাতাস {toBn(Math.round(w.wind))} কিমি/ঘ</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {w.days.map((d, i) => {
                const D = describe(d.code);
                const dt = new Date(d.date + "T00:00:00");
                return (
                  <div key={d.date} className="rounded-xl border p-2 text-center text-xs">
                    <p className="font-medium">{i === 0 ? "আজ" : BN_DAYS[dt.getDay()]}</p>
                    <D.Icon className="mx-auto my-1 size-5 text-primary" />
                    <p className="tabular-nums">{toBn(Math.round(d.max))}° / {toBn(Math.round(d.min))}°</p>
                    <p className="text-muted-foreground">বৃষ্টি {toBn(d.rain ?? 0)}%</p>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground">তথ্যসূত্র: Open-Meteo (বিনামূল্যে)</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
