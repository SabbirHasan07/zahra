"use client";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import type { Masjid } from "@/db/schema";
import { deleteMasjid, saveMasjid } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FIELDS = [
  { name: "fajr", label: "ফজর" },
  { name: "dhuhr", label: "যোহর" },
  { name: "asr", label: "আসর" },
  { name: "maghrib", label: "মাগরিব" },
  { name: "isha", label: "এশা" },
  { name: "jummah", label: "জুমা" },
] as const;

export function MasjidForm({ masjid }: { masjid?: Masjid }) {
  const [state, action, pending] = useActionState(saveMasjid, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      toast.success("সংরক্ষণ হয়েছে");
      if (!masjid) formRef.current?.reset();
    } else if (state?.error) toast.error(state.error);
  }, [state, masjid]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {masjid ? masjid.name : (<><Plus className="size-4" /> নতুন মসজিদ যোগ করুন</>)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={action} className="space-y-4">
          {masjid && <input type="hidden" name="id" value={masjid.id} />}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor={`name-${masjid?.id ?? "new"}`}>মসজিদের নাম</Label>
              <Input id={`name-${masjid?.id ?? "new"}`} name="name" defaultValue={masjid?.name} required />
            </div>
            <div className="space-y-1.5">
              <Label>ঠিকানা</Label>
              <Input name="address" defaultValue={masjid?.address ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label>শহর/এলাকা</Label>
              <Input name="city" defaultValue={masjid?.city ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
            {FIELDS.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label>{f.label}</Label>
                <Input type="time" name={f.name} defaultValue={(masjid?.[f.name] as string | null) ?? ""} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              <Save /> {masjid ? "আপডেট" : "যোগ করুন"}
            </Button>
          </div>
        </form>
        {masjid && (
          <form action={deleteMasjid} className="mt-2">
            <input type="hidden" name="id" value={masjid.id} />
            <Button type="submit" variant="destructive" size="sm">
              <Trash2 /> মুছুন
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
