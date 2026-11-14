import type { Metadata } from "next";
import { TrackerView } from "./tracker-view";

export const metadata: Metadata = { title: "নামাজ ট্র্যাকার" };

export default function TrackerPage() {
  return <TrackerView />;
}
