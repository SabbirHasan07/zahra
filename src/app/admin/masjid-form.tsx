
"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2, ChevronDown } from "lucide-react";

import type { Masjid } from "@/db/schema";
import { districts } from "@/lib/bangladesh-districts";
import { deleteMasjid, saveMasjid } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [state, action, pending] = useActionState(
    saveMasjid,
    undefined
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      toast.success("সংরক্ষণ হয়েছে");

      if (!masjid) {
        formRef.current?.reset();
      }
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, masjid]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {masjid ? (
            masjid.name
          ) : (
            <>
              <Plus className="size-4" />
              নতুন মসজিদ যোগ করুন
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          ref={formRef}
          action={action}
          className="space-y-4"
        >
          {masjid && (
            <input
              type="hidden"
              name="id"
              value={masjid.id}
            />
          )}

          {/* Masjid Information */}
          <div className="grid gap-3 sm:grid-cols-3">

            {/* Masjid Name */}
            <div className="space-y-1.5">
              <Label htmlFor={`name-${masjid?.id ?? "new"}`}>
                মসজিদের নাম
              </Label>

              <Input
                id={`name-${masjid?.id ?? "new"}`}
                name="name"
                defaultValue={masjid?.name}
                placeholder="মসজিদের নাম লিখুন"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor={`address-${masjid?.id ?? "new"}`}>
                ঠিকানা
              </Label>

              <Input
                id={`address-${masjid?.id ?? "new"}`}
                name="address"
                defaultValue={masjid?.address ?? ""}
                placeholder="সম্পূর্ণ ঠিকানা"
              />
            </div>

            {/* District Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor={`district-${masjid?.id ?? "new"}`}>
                জেলা
              </Label>

              <div className="relative">
                <select
                  id={`district-${masjid?.id ?? "new"}`}
                  name="district"
                  defaultValue={masjid?.district ?? ""}
                  required
                  className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm shadow-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    জেলা নির্বাচন করুন
                  </option>

                  {districts.map((district) => (
                    <option
                      key={district}
                      value={district}
                    >
                      {district}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Jamaat Prayer Times */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
            {FIELDS.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={`${f.name}-${masjid?.id ?? "new"}`}>
                  {f.label}
                </Label>

                <Input
                  id={`${f.name}-${masjid?.id ?? "new"}`}
                  type="time"
                  name={f.name}
                  defaultValue={
                    (masjid?.[f.name] as string | null) ?? ""
                  }
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              <Save className="size-4" />

              {pending
                ? "সংরক্ষণ হচ্ছে..."
                : masjid
                  ? "আপডেট"
                  : "যোগ করুন"}
            </Button>
          </div>
        </form>

        {/* Delete */}
        {masjid && (
          <form action={deleteMasjid} className="mt-2">
            <input
              type="hidden"
              name="id"
              value={masjid.id}
            />

            <Button
              type="submit"
              variant="destructive"
              size="sm"
            >
              <Trash2 className="size-4" />
              মুছুন
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
