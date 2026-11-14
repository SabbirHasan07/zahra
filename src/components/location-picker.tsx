"use client";
import { useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { CITIES, cityToPlace } from "@/lib/locations";
import { usePlace } from "@/hooks/use-place";
import { Button } from "@/components/ui/button";

export function LocationPicker({ tone = "default" }: { tone?: "default" | "onDark" }) {
  const [place, setPlace] = usePlace();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function locate() {
    if (!navigator.geolocation) return setErr("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না");
    setBusy(true);
    setErr("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPlace({ name: "আমার অবস্থান", lat: pos.coords.latitude, lng: pos.coords.longitude });
        setBusy(false);
      },
      () => {
        setErr("লোকেশন পাওয়া যায়নি");
        setBusy(false);
      },
      { timeout: 10000 }
    );
  }

  const onDark = tone === "onDark";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="relative inline-flex items-center">
        <MapPin className={`pointer-events-none absolute left-3 size-4 ${onDark ? "text-white/80" : "text-primary"}`} />
        <select
          aria-label="শহর নির্বাচন করুন"
          value={place.cityId ?? "custom"}
          onChange={(e) => {
            const c = CITIES.find((x) => x.id === e.target.value);
            if (c) setPlace(cityToPlace(c));
          }}
          className={`h-10 appearance-none rounded-xl border pl-9 pr-8 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            onDark ? "border-white/25 bg-white/10 text-white" : "border-border bg-card"
          }`}
        >
          {!place.cityId && <option value="custom">{place.name}</option>}
          {CITIES.map((c) => (
            <option key={c.id} value={c.id} className="text-black">
              {c.bn}
            </option>
          ))}
        </select>
      </label>
      <Button
        type="button"
        variant={onDark ? "outline" : "secondary"}
        size="sm"
        onClick={locate}
        disabled={busy}
        className={onDark ? "border-white/25 text-white hover:bg-white/10 hover:text-white" : ""}
      >
        <LocateFixed /> {busy ? "খুঁজছি..." : "আমার লোকেশন"}
      </Button>
      {err && <span className="text-xs text-destructive">{err}</span>}
    </div>
  );
}
