
import type { Metadata } from "next";
import { listMasjids } from "@/lib/masjids";
import { MasjidDistrictList } from "@/components/masjid-district-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "মসজিদের জামাতের সময়",
};

export default async function MasjidsPage() {
  const { data, error } = await listMasjids();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          মসজিদের জামাতের সময়
        </h1>

        <p className="mt-1 text-muted-foreground">
          স্থানীয় মসজিদ কমিটির দেওয়া জামাতের সময়সূচি।
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && (
        <MasjidDistrictList masjids={data} />
      )}
    </div>
  );
}
