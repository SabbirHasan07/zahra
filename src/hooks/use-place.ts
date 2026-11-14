"use client";
import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_CITY, cityToPlace, type Place } from "@/lib/locations";

const KEY = "noor:place";
const listeners = new Set<() => void>();
const DEFAULT_PLACE = cityToPlace(DEFAULT_CITY);
let cached: Place = DEFAULT_PLACE;
let cachedRaw: string | null = null;

function read(): Place {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    cached = raw ? (JSON.parse(raw) as Place) : DEFAULT_PLACE;
    return cached;
  } catch {
    return DEFAULT_PLACE;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function usePlace() {
  const place = useSyncExternalStore(subscribe, read, () => DEFAULT_PLACE);
  const setPlace = useCallback((p: Place) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {}
    listeners.forEach((l) => l());
  }, []);
  return [place, setPlace] as const;
}
