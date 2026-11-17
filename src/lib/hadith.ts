
export const HADITH_BOOKS = [
  {
    slug: "bukhari",
    name: "সহীহ বুখারী",
    nameAr: "صحيح البخاري",
    folder: "Bukhari",
    metaFile: "bukhari.json",
  },
  {
    slug: "muslim",
    name: "সহীহ মুসলিম",
    nameAr: "صحيح مسلم",
    folder: "Muslim",
    metaFile: "muslim.json",
  },
  {
    slug: "tirmidi",
    name: "জামে আত-তিরমিযী",
    nameAr: "جامع الترمذي",
    folder: "At-tirmizi",
    metaFile: "at-tirmizi.json",
  },
] as const;

export type HadithBookSlug =
  (typeof HADITH_BOOKS)[number]["slug"];

export function getHadithBook(slug: string) {
  return HADITH_BOOKS.find((book) => book.slug === slug);
}

export const HADITH_CDN =
  "https://cdn.jsdelivr.net/gh/kafelanetwork/hadith-api@main";
