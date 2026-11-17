
"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import type { Masjid } from "@/db/schema";
import { CITIES } from "@/lib/locations";
import { usePlace } from "@/hooks/use-place";
import { LocationPicker } from "@/components/location-picker";
import { MasjidCard } from "@/components/masjid-list";

export function MasjidDistrictList({
  masjids,
}: {
  masjids: Masjid[];
}) {
  const [place] = usePlace();

  const selectedCity = CITIES.find(
    (city) => city.id === place.cityId
  );

  const district = selectedCity?.bn;

  const filteredMasjids = useMemo(() => {
    if (!district) return [];

    return masjids
      .filter((masjid) => masjid.district === district)
      .sort((a, b) =>
        new Intl.Collator("bn-BD").compare(a.name, b.name)
      );
  }, [masjids, district]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {district
              ? `${district} জেলার মসজিদ`
              : "আপনার জেলা নির্বাচন করুন"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {district
              ? "শুধুমাত্র নির্বাচিত জেলার মসজিদের জামাতের সময় দেখানো হচ্ছে।"
              : "আপনার জেলার মসজিদের জামাতের সময় দেখতে লোকেশন নির্বাচন করুন।"}
          </p>
        </div>

        <LocationPicker />
      </div>

      {!district ? (
        <div className="rounded-xl border p-8 text-center">
          <MapPin className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            প্রথমে আপনার জেলা নির্বাচন করুন।
          </p>
        </div>
      ) : filteredMasjids.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="font-medium">
            {district} জেলায় কোনো মসজিদ পাওয়া যায়নি।
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            এই জেলার মসজিদ যুক্ত হলে এখানে দেখা যাবে।
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            মোট {filteredMasjids.length}টি মসজিদ
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredMasjids.map((masjid) => (
              <MasjidCard key={masjid.id} m={masjid} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
