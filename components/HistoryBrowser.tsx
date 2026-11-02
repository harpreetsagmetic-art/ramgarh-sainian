"use client";
import { x } from "@/lib/extra";
import { groupOrder, type Group } from "@/lib/history-topics";
import type { Locale } from "@/lib/i18n";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Item = { slug: string; group: Group; name: { pa: string; en: string }; local?: boolean };

const groupLabel = {
  guru: x.groupGuru,
  event: x.groupEvent,
  battle: x.groupBattle,
  person: x.groupPerson,
  gurdwara: x.groupGurdwara,
  development: x.groupDevelopment,
} as const;

export default function HistoryBrowser({ items, locale }: { items: Item[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | Group>("all");

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      items.filter(
        (i) =>
          (group === "all" || i.group === group) &&
          (!q || i.name.pa.toLowerCase().includes(q) || i.name.en.toLowerCase().includes(q))
      ),
    [items, group, q]
  );

  const showLocal = group === "all" && !q;
  const local = items.filter((i) => i.local);

  const row = (i: Item) => (
    <Link
      key={i.slug}
      href={`/${locale}/history/${i.slug}`}
      className="block rounded-xl bg-white p-3 font-medium shadow-sm active:scale-95"
    >
      {i.name[locale]}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={x.searchHistory[locale]}
          aria-label={x.searchHistory[locale]}
          className="w-full rounded-xl border-2 border-navy/20 bg-white py-3 pl-10 pr-3 outline-none focus:border-saffron"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(["all", ...groupOrder] as const).map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={group === g}
            onClick={() => setGroup(g)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium active:scale-95 ${
              group === g ? "border-navy bg-navy text-gold" : "border-saffron bg-white"
            }`}
          >
            {g === "all" ? x.filterAll[locale] : groupLabel[g][locale]}
          </button>
        ))}
      </div>

      {showLocal && local.length > 0 && (
        <section className="rounded-2xl border-l-4 border-saffron bg-gold/20 p-4">
          <h2 className="mb-3 font-bold">{x.localHistory[locale]}</h2>
          <div className="grid gap-2 sm:grid-cols-2">{local.map(row)}</div>
        </section>
      )}

      {shown.length === 0 && (
        <p className="rounded-xl bg-white p-4 text-navy/70 shadow-sm">{x.noItems[locale]}</p>
      )}

      {groupOrder.map((g) => {
        const list = shown.filter((i) => i.group === g);
        if (list.length === 0) return null;
        return (
          <section key={g}>
            <h2 className="mb-3 text-xl font-bold">{groupLabel[g][locale]}</h2>
            <div className="grid gap-2 sm:grid-cols-2">{list.map(row)}</div>
          </section>
        );
      })}
    </div>
  );
}