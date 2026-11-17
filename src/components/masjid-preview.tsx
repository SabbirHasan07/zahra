
"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";

import type { Masjid } from "@/db/schema";
import { CITIES } from "@/lib/locations";
import { usePlace } from "@/hooks/use-place";
import { LocationPicker } from "@/components/location-picker";
import { MasjidCard } from "@/components/masjid-list";
import { Card, CardContent } from "@/components/ui/card";

export function MasjidPreview({
  masjids,
}: {
  masjids: Masjid[];
}) {
  const [place] = usePlace();

  const selectedCity = CITIES.find(
    (city) => city.id === place.cityId
  );

  const district = selectedCity?.bn;

  const districtMasjids = useMemo(() => {
    if (!district) return [];

    return masjids
      .filter((m) => m.district === district)
      .sort((a, b) =>
        new Intl.Collator("bn-BD").compare(a.name, b.name)
      );
  }, [masjids, district]);

  const featuredMasjid = districtMasjids[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            মসজিদের জামাত
          </h2>

          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {district ?? "জেলা নির্বাচন করুন"}
          </p>
        </div>

        <LocationPicker />
      </div>

      {!district ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            মসজিদের জামাত দেখতে জেলা নির্বাচন করুন।
          </CardContent>
        </Card>
      ) : !featuredMasjid ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">
            {district} জেলায় এখনো কোনো মসজিদ যোগ করা হয়নি।
          </CardContent>
        </Card>
      ) : (
        <MasjidCard m={featuredMasjid} />
      )}
    </div>
  );
}
