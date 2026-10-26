"use client";
import { HandHeart, Home, Images, Landmark, TreePine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  home: Home, village: TreePine, gurudwara: Landmark, gallery: Images, donate: HandHeart,
} as const;

type Item = { href: string; label: string; icon: string };

export default function BottomNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const isActive = (href: string, index: number) =>
    index === 0 ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-saffron bg-navy md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((i, idx) => {
          const Icon = icons[i.icon as keyof typeof icons];
          const active = isActive(i.href, idx);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                  active ? "text-gold" : "text-white/80"
                }`}
              >
                <Icon size={22} />
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}