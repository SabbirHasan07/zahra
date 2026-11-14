import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SURAH_BN } from "@/lib/surah-bn";
import { SurahReader } from "./surah-reader";

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const num = Number(n);
  return { title: num >= 1 && num <= 114 ? `সূরা ${SURAH_BN[num - 1]}` : "কুরআন" };
}

export default async function SurahPage({ params }: Props) {
  const { n } = await params;
  const num = Number(n);
  if (!Number.isInteger(num) || num < 1 || num > 114) notFound();
  return <SurahReader key={num} number={num} />;
}
