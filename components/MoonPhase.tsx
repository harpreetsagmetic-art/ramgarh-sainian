export default function MoonPhase({ phase, size = 18 }: { phase: "full" | "new"; size?: number }) {
  const full = phase === "full";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12" cy="12" r="10"
        fill={full ? "#F4F1E6" : "#1D2951"}
        stroke={full ? "#1D2951" : "#FFC000"}
        strokeWidth="1.5"
      />
      {full && (
        <>
          <circle cx="9" cy="9" r="1.6" fill="#D9D4C2" />
          <circle cx="15" cy="14" r="2.2" fill="#D9D4C2" />
          <circle cx="8.5" cy="15.5" r="1.1" fill="#D9D4C2" />
        </>
      )}
    </svg>
  );
}