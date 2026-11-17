"use client";

import { useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { CITIES, cityToPlace, getNearestCity } from "@/lib/locations";
import { usePlace } from "@/hooks/use-place";
import { Button } from "@/components/ui/button";

export function LocationPicker({
  tone = "default",
}: {
  tone?: "default" | "onDark";
}) {
  const [place, setPlace] = usePlace();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function locate() {
    if (!navigator.geolocation) {
      setErr("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না");
      return;
    }

    setBusy(true);
    setErr("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const nearest = getNearestCity(latitude, longitude);

        setPlace({
          name: "আমার অবস্থান",
          lat: latitude,
          lng: longitude,
          cityId: nearest.id,
        });

        setBusy(false);
      },
      () => {
        setErr("লোকেশন পাওয়া যায়নি। Permission পরীক্ষা করুন।");
        setBusy(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }

  const onDark = tone === "onDark";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="relative inline-flex items-center">
        

        <select
          value={place.cityId ?? ""}
          onChange={(e) => {
            const city = CITIES.find((c) => c.id === e.target.value);
            if (city) setPlace(cityToPlace(city));
          }}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none"
        >
          {CITIES.map((city) => (
            <option
              key={city.id}
              value={city.id}
              className="bg-white text-black"
            >
              {city.bn}
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
        className={
          onDark
            ? "border-white/25 text-white hover:bg-white/10 hover:text-white"
            : ""
        }
      >
        <LocateFixed />
        {busy ? "খুঁজছি..." : "আমার লোকেশন"}
      </Button>

      {err && <span className="text-xs text-destructive">{err}</span>}
    </div>
  );
}
