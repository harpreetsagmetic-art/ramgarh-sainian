"use client";
import { HandHeart, Home, Landmark, Radio, TreePine, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons: Record<string, LucideIcon> = {
  home: Home,
  village: TreePine,
  gurudwara: Landmark,
  live: Radio,
  donate: HandHeart,
};

type Item = { href: string; label: string; icon: string };

export default function BottomNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const isActive = (href: string, index: number) =>
    index === 0 ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-saffron bg-navy pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {items.map((i, idx) => {
          const Icon = icons[i.icon] ?? Home;
          const active = isActive(i.href, idx);
          return (
            <li key={i.href} className="min-w-0 flex-1">
              <Link
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 text-[11px] font-medium ${
                  active ? "text-gold" : "text-white/80"
                }`}
              >
                <Icon size={22} aria-hidden="true" />
                <span className="whitespace-nowrap text-center leading-normal">{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}