
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Compass,
  Crosshair,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
} from "lucide-react";

const KAABA = {
  lat: 21.4225,
  lng: 39.8262,
};

type Location = {
  lat: number;
  lng: number;
  accuracy: number;
};

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function getQiblaBearing(lat: number, lng: number) {
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA.lat);
  const deltaLng = toRadians(KAABA.lng - lng);

  const y = Math.sin(deltaLng);
  const x =
    Math.cos(lat1) * Math.tan(lat2) -
    Math.sin(lat1) * Math.cos(deltaLng);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function getDistance(lat: number, lng: number) {
  const R = 6371;
  const dLat = toRadians(KAABA.lat - lat);
  const dLng = toRadians(KAABA.lng - lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat)) *
      Math.cos(toRadians(KAABA.lat)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toDirection(degrees: number) {
  const directions = [
    "উত্তর",
    "উত্তর-পূর্ব",
    "পূর্ব",
    "দক্ষিণ-পূর্ব",
    "দক্ষিণ",
    "দক্ষিণ-পশ্চিম",
    "পশ্চিম",
    "উত্তর-পশ্চিম",
  ];

  return directions[Math.round(degrees / 45) % 8];
}

export function Qibla() {
  const [location, setLocation] = useState<Location | null>(null);
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [compassSupported, setCompassSupported] = useState(true);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("আপনার ব্রাউজারে GPS সাপোর্ট নেই।");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
        });

        setBearing(getQiblaBearing(latitude, longitude));
        setLoading(false);
      },
      (err) => {
        setLoading(false);

        if (err.code === err.PERMISSION_DENIED) {
          setError("GPS ব্যবহারের অনুমতি দিন।");
        } else if (err.code === err.TIMEOUT) {
          setError("লোকেশন পেতে সময় শেষ হয়েছে। আবার চেষ্টা করুন।");
        } else {
          setError("আপনার বর্তমান লোকেশন পাওয়া যায়নি।");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  const enableCompass = async () => {
    setError("");

    try {
      const OrientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

      if (typeof OrientationEvent.requestPermission === "function") {
        const permission = await OrientationEvent.requestPermission();

        if (permission !== "granted") {
          setError("কম্পাস ব্যবহারের অনুমতি দেওয়া হয়নি।");
          return;
        }
      }

      if (!("DeviceOrientationEvent" in window)) {
        setCompassSupported(false);
        return;
      }

      window.addEventListener("deviceorientation", handleOrientation, true);
      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
    } catch {
      setError("কম্পাস চালু করা যায়নি।");
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    const compassEvent = event as DeviceOrientationEvent & {
      webkitCompassHeading?: number;
    };

    let direction: number | null = null;

    if (typeof compassEvent.webkitCompassHeading === "number") {
      direction = compassEvent.webkitCompassHeading;
    } else if (event.alpha !== null) {
      direction = (360 - event.alpha) % 360;
    }

    if (direction !== null && Number.isFinite(direction)) {
      setHeading(direction);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
    };
  }, []);

  const distance = location
    ? getDistance(location.lat, location.lng)
    : null;

  const compassRotation =
    bearing !== null && heading !== null
      ? bearing - heading
      : bearing ?? 0;

  return (
    <div className="mx-auto w-full max-w-xl space-y-5">
      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Compass className="size-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold">কিবলা কম্পাস</h2>
            <p className="text-sm text-muted-foreground">
              আপনার অবস্থান থেকে কাবার দিক নির্ণয় করুন
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center">
          <div className="absolute inset-3 rounded-full border-2 border-dashed border-muted-foreground/30" />

          <div className="absolute inset-7 rounded-full border border-border" />

          <span className="absolute top-1 text-sm font-bold">উত্তর</span>
          <span className="absolute bottom-1 text-sm font-bold">দক্ষিণ</span>
          <span className="absolute left-1 text-sm font-bold">পশ্চিম</span>
          <span className="absolute right-1 text-sm font-bold">পূর্ব</span>

          <div
            className="relative flex size-[190px] items-center justify-center rounded-full border-4 border-primary/20 bg-muted/40 shadow-inner transition-transform duration-200"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            <div className="absolute -top-3 flex flex-col items-center">
              <Navigation className="size-9 fill-primary text-primary" />
              <span className="mt-1 text-xs font-bold text-primary">
                কিবলা
              </span>
            </div>

            <div className="flex size-14 items-center justify-center rounded-full bg-background shadow">
              <Compass className="size-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          {bearing !== null ? (
            <>
              <p className="text-sm text-muted-foreground">
                কাবার দিক
              </p>

              <p className="mt-1 text-4xl font-bold tabular-nums">
                {bearing.toFixed(1)}°
              </p>

              <p className="mt-1 text-sm font-medium text-primary">
                {toDirection(bearing)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              কিবলার দিক জানতে GPS চালু করুন
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={locate}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <LocateFixed className="size-4" />
            )}
            {loading ? "লোকেশন খোঁজা হচ্ছে" : "GPS চালু করুন"}
          </button>

          <button
            onClick={enableCompass}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-muted"
          >
            <Compass className="size-4" />
            কম্পাস চালু
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {!compassSupported && (
          <p className="mt-4 text-sm text-muted-foreground">
            আপনার ডিভাইসে কম্পাস সাপোর্ট পাওয়া যায়নি। ডিগ্রি অনুযায়ী
            কিবলার দিক ব্যবহার করুন।
          </p>
        )}

        {heading === null && bearing !== null && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            কম্পাস চালু না হওয়া পর্যন্ত নির্দেশকটি উত্তরকে ভিত্তি করে
            কিবলার দিক দেখাবে।
          </p>
        )}
      </div>

      {location && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              <span className="text-sm">আপনার অবস্থান</span>
            </div>
            <p className="text-sm font-semibold">
              {location.lat.toFixed(5)}° N
            </p>
            <p className="text-sm font-semibold">
              {location.lng.toFixed(5)}° E
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Navigation className="size-4" />
              <span className="text-sm">কাবার দূরত্ব</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {distance?.toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}
            </p>
            <p className="text-xs text-muted-foreground">কিলোমিটার</p>
          </div>

          <div className="col-span-2 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">GPS Accuracy</p>
                <p className="text-xs text-muted-foreground">
                  অবস্থান নির্ণয়ের আনুমানিক নির্ভুলতা
                </p>
              </div>
              <p className="font-semibold tabular-nums">
                ±{Math.round(location.accuracy)} মিটার
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
