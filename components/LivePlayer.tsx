"use client";
import { x } from "@/lib/extra";
import type { Locale } from "@/lib/i18n";
import type { LiveState } from "@/lib/live";
import { useEffect, useState } from "react";

type State = LiveState | null; // null = loading

export default function LivePlayer({
  locale,
  fallbackEmbedUrl,
}: {
  locale: Locale;
  fallbackEmbedUrl: string;
}) {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/live", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: LiveState | null) => setState(j ?? { mode: "unknown" }))
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ mode: "unknown" });
      });
    return () => ctrl.abort();
  }, []);

  const src =
    state === null
      ? null
      : state.mode === "unknown"
        ? fallbackEmbedUrl
        : `https://www.youtube-nocookie.com/embed/${state.videoId}?rel=0&playsinline=1`;

  const known = state && state.mode !== "unknown" ? state : null;
  const dateText = known
    ? new Date(known.publishedAt).toLocaleDateString(locale === "pa" ? "pa-IN" : "en-IN", {
        day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
      })
    : "";

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border-4 border-gold bg-black shadow-lg">
        <div className="aspect-video">
          {src ? (
            <iframe
              src={src}
              title={known?.title ?? x.liveTitle[locale]}
              className="size-full"
              allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div
              role="status"
              className="flex size-full animate-pulse items-center justify-center text-white/60"
            >
              {x.playerLoading[locale]}
            </div>
          )}
        </div>
      </div>

      {known && (
        <div>
          {known.mode === "live" ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
              <span className="size-2 animate-pulse rounded-full bg-white" />
              {x.liveBadge[locale]}
            </span>
          ) : (
            <span className="inline-block rounded-full bg-gold px-3 py-1 text-sm font-bold text-navy">
              {x.latestBadge[locale]}
            </span>
          )}
          <p className="mt-2 font-bold">{known.title}</p>
          <p className="text-xs text-navy/60">{dateText}</p>
          {known.mode === "latest" && (
            <p className="mt-2 text-sm text-navy/70">{x.notLiveNote[locale]}</p>
          )}
        </div>
      )}

      {state?.mode === "unknown" && (
        <p className="text-sm text-navy/70">{x.liveNote[locale]}</p>
      )}
    </div>
  );
}