import "server-only";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { masjids, type Masjid } from "@/db/schema";

export async function listMasjids(): Promise<{ data: Masjid[]; error?: string }> {
  if (!process.env.DATABASE_URL) return { data: [], error: "DATABASE_URL সেট করা নেই" };
  try {
    const data = await getDb().select().from(masjids).orderBy(asc(masjids.name));
    return { data };
  } catch {
    return { data: [], error: "ডাটাবেস থেকে তথ্য আনা যায়নি (টেবিল তৈরি হয়েছে? npm run db:push চালান)" };
  }
}
