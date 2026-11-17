
import { Clock, MapPin } from "lucide-react";
import type { Masjid } from "@/db/schema";
import { format12 } from "@/lib/prayer";
import { toBn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ROWS: { key: keyof Masjid; label: string }[] = [
  { key: "fajr", label: "ফজর" },
  { key: "dhuhr", label: "যোহর" },
  { key: "asr", label: "আসর" },
  { key: "maghrib", label: "মাগরিব" },
  { key: "isha", label: "এশা" },
  { key: "jummah", label: "জুমা" },
];

export function MasjidCard({ m }: { m: Masjid }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{m.name}</CardTitle>

        {(m.address || m.district) && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />

            {[m.address, m.district]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {ROWS.map((r) => {
            const v = m[r.key] as string | null;

            return (
              <div
                key={r.key}
                className="rounded-xl bg-muted p-2 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  {r.label}
                </p>

                <p className="flex items-center justify-center gap-1 text-sm font-semibold tabular-nums">
                  {v ? (
                    <>
                      <Clock className="size-3 text-primary" />
                      {toBn(format12(v))}
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
