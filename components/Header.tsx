"use client";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export default function Header({
  locale, items, name, switchLabel,
}: { locale: Locale; items: Item[]; name: string; switchLabel: string }) {
  const pathname = usePathname();
  const other: Locale = locale === "pa" ? "en" : "pa";
  const switchHref = pathname.replace(`/${locale}`, `/${other}`);
  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="text-lg font-bold text-gold">
          {name}
        </Link>

        <nav className="hidden gap-6 md:flex">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`border-b-2 py-1 text-sm font-medium ${
                isActive(i.href) ? "border-gold text-gold" : "border-transparent hover:text-gold"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <Link
          href={switchHref}
          className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy active:scale-95"
        >
          {switchLabel}
        </Link>
      </div>
      <div className="h-1 bg-saffron" />
    </header>
  );
}