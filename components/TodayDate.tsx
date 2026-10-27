"use client";

import type { Locale } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function TodayDate({ locale }: { locale: Locale }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const update = () =>
      setText(
        new Date().toLocaleDateString(locale === "pa" ? "pa-IN" : "en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }),
      );

    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [locale]);

  return <span className="inline-block min-h-5">{text}</span>;
}
