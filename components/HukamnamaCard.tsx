"use client";
import { hukamnamaSiteUrl, x } from "@/lib/extra";
import type { Hukamnama } from "@/lib/hukamnama";
import type { Locale } from "@/lib/i18n";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

type State = { data: Hukamnama | null; isCurrent: boolean } | null; // null = loading

export default function HukamnamaCard({ locale }: { locale: Locale }) {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/hukamnama", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setState(j ?? { data: null, isCurrent: false }))
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ data: null, isCurrent: false });
      });
    return () => ctrl.abort();
  }, []);

  const hukam = state?.data ?? null;
 const dateText = hukam?.date
  ? new Date(`${hukam.date}T00:00:00Z`).toLocaleDateString(
      locale === "pa" ? "pa-IN" : "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }
    )
  : "";

  return (
    <div className="rounded-2xl bg-navy p-5 text-white">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gold">
        <BookOpen size={20} /> {x.hukamnamaTitle[locale]}
      </h2>
      {dateText && <p className="mt-1 text-sm text-white/60">{dateText}</p>}

      {state === null ? (
        <div className="mt-4 space-y-3" role="status" aria-busy="true">
          <p className="text-sm text-white/70">{x.hukamnamaLoading[locale]}</p>
          <div className="h-6 w-4/5 animate-pulse rounded bg-white/15" />
          <div className="h-6 w-3/5 animate-pulse rounded bg-white/15" />
          <div className="h-6 w-2/3 animate-pulse rounded bg-white/15" />
        </div>
      ) : hukam ? (
        <>
          {!state.isCurrent && (
            <p className="mt-3 rounded-lg bg-gold/20 p-2 text-sm text-gold">{x.hukamnamaPending[locale]}</p>
          )}

          <p className="mt-2 text-sm text-white/70">
            {x.ang[locale]} {hukam.pageNo}
            {hukam.raag.pa ? (
              <>
                {" • "}
                <span lang="pa">{hukam.raag.pa}</span>
              </>
            ) : null}
            {hukam.raag.en ? ` (${hukam.raag.en})` : ""}
            {hukam.writer ? ` • ${hukam.writer}` : ""}
          </p>

          <div className="mt-4 space-y-4">
            {hukam.verses.map((v) => (
              <div key={v.id}>
                <p lang="pa" className="text-xl font-semibold leading-relaxed text-gold">
                  {v.gurmukhi}
                </p>
                {v.punjabi ? (
                  <p lang="pa" className="mt-1 text-white/90">
                    {v.punjabi}
                  </p>
                ) : null}
                {v.english ? (
                  <p lang="en" className="mt-1 text-sm text-white/70">
                    {v.english}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 text-white/80">{x.hukamnamaDown[locale]}</p>
      )}

      <a
        href={hukamnamaSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded-xl bg-gold px-5 py-2 font-bold text-navy active:scale-95"
      >
        {x.hukamnamaRead[locale]}
      </a>
    </div>
  );
}