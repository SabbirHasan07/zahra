import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t py-8 text-center text-sm text-muted-foreground">
      <p className="font-arabic text-xl text-primary">بسم الله الرحمن الرحيم</p>
      <p className="mt-2">Zahra — নামাজের সময়, কুরআন ও ইসলামিক শিক্ষা</p>
      <p className="mt-2">any queries, email:engr.sabbirhasan@proton.me</p>
      <p className="mt-1">
        <Link href="/admin" className="underline-offset-4 hover:underline">
          অ্যাডমিন
        </Link>
      </p>
    </footer>
  );
}
