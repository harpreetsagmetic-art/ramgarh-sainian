"use client";
import { useMemo } from "react";

export default function DaysLeft({
  date,
  daysLabel,
  todayLabel,
}: {
  date: string;
  daysLabel: string;
  todayLabel: string;
}) {
  const n = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    return Math.round(
      (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
        86_400_000,
    );
  }, [date]);

  if (n === null) return <span className="inline-block min-h-5" />;
  if (n < 0) return null;
  if (n === 0) return <span>{todayLabel}</span>;
  return (
    <span>
      {n} {daysLabel}
    </span>
  );
}
