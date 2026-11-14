"use client";
import { useCallback, useSyncExternalStore } from "react";

export type TrackerData = Record<string, string[]>; // "YYYY-MM-DD" -> prayed keys
const KEY = "noor:tracker";
const EMPTY: TrackerData = {};
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cached: TrackerData = EMPTY;

function read(): TrackerData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    cached = raw ? (JSON.parse(raw) as TrackerData) : EMPTY;
    return cached;
  } catch {
    return EMPTY;
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

export function useTracker() {
  const data = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((date: string, prayer: string) => {
    const cur = read();
    const set = new Set(cur[date] ?? []);
    if (set.has(prayer)) set.delete(prayer);
    else set.add(prayer);
    const next = { ...cur, [date]: Array.from(set) };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    listeners.forEach((l) => l());
  }, []);
  return { data, toggle };
}

export function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
