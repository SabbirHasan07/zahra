import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Zahra — নামাজের সময়, কুরআন ও ইসলামিক শিক্ষা", template: "%s | Zahra" },
  description: "স্বয়ংক্রিয় নামাজের সময়সূচি, মসজিদের জামাতের সময়, আবহাওয়া, নামাজ ট্র্যাকার, কুরআন ও ইসলামিক গাইড।",
};

export const viewport: Viewport = { themeColor: "#0b1f1d", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <SiteFooter />
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}
