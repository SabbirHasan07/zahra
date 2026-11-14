"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { timingSafeEqual } from "node:crypto";
import { getDb } from "@/db";
import { masjids } from "@/db/schema";
import { createSession, destroySession, isAdmin } from "@/lib/auth";

function safeEqual(a: string, b: string) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

export async function login(_: { error?: string } | undefined, formData: FormData) {
  const user = String(formData.get("username") ?? "");
  const pass = String(formData.get("password") ?? "");
  const eu = process.env.ADMIN_USERNAME;
  const ep = process.env.ADMIN_PASSWORD;
  if (!eu || !ep) return { error: "সার্ভারে ADMIN_USERNAME / ADMIN_PASSWORD সেট করা নেই" };
  if (!safeEqual(user, eu) || !safeEqual(pass, ep)) {
    // slow down brute-force attempts
    await new Promise((r) => setTimeout(r, 1500));
    return { error: "ইউজারনেম বা পাসওয়ার্ড ভুল" };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
function t(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return TIME.test(s) ? s : null;
}

export async function saveMasjid(_: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  if (!(await isAdmin())) return { error: "অনুমতি নেই" };
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "মসজিদের নাম দিন" };
  const id = Number(formData.get("id") || 0);
  const values = {
    name,
    address: String(formData.get("address") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    fajr: t(formData.get("fajr")),
    dhuhr: t(formData.get("dhuhr")),
    asr: t(formData.get("asr")),
    maghrib: t(formData.get("maghrib")),
    isha: t(formData.get("isha")),
    jummah: t(formData.get("jummah")),
    updatedAt: new Date(),
  };
  try {
    const db = getDb();
    if (id) await db.update(masjids).set(values).where(eq(masjids.id, id));
    else await db.insert(masjids).values(values);
  } catch {
    return { error: "সংরক্ষণ করা যায়নি। ডাটাবেস কানেকশন দেখুন।" };
  }
  revalidatePath("/masjids");
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMasjid(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = Number(formData.get("id"));
  if (!id) return;
  await getDb().delete(masjids).where(eq(masjids.id, id));
  revalidatePath("/masjids");
  revalidatePath("/");
  revalidatePath("/admin");
}
