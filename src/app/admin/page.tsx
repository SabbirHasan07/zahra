import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { listMasjids } from "@/lib/masjids";
import { logout } from "./actions";
import { MasjidForm } from "./masjid-form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "অ্যাডমিন প্যানেল" };

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const { data, error } = await listMasjids();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">অ্যাডমিন প্যানেল</h1>
          <p className="text-muted-foreground">মসজিদ যোগ করুন এবং জামাতের সময় নির্ধারণ করুন।</p>
        </div>
        <form action={logout}>
          <Button variant="outline" type="submit">
            <LogOut /> লগআউট
          </Button>
        </form>
      </div>
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <MasjidForm />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">যোগ করা মসজিদ ({data.length})</h2>
        {data.map((m) => (
          <MasjidForm key={m.id} masjid={m} />
        ))}
      </div>
    </div>
  );
}
