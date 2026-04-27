/**
 * Vereinfachte Wortmarke "AGILE HEROES INTELLIGENCE" mit Türkis/Pink-Verlauf.
 * Kein 1:1-Replikat des Logos – aber Brand-konform und schnell ladend.
 */
export function BrandLogo({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: { wrap: "text-xs tracking-[0.25em]", line2: "text-[0.7rem]" },
    md: { wrap: "text-sm tracking-[0.3em]", line2: "text-xs" },
    lg: { wrap: "text-2xl tracking-[0.32em]", line2: "text-lg" },
  };
  const s = sizeMap[size];
  return (
    <div className={`flex flex-col leading-tight ${s.wrap} ${className}`}>
      <span className="text-white font-light">AGILE HEROES</span>
      <span
        className={`font-light ${s.line2}`}
        style={{
          background:
            "linear-gradient(90deg, #db73a6 0%, #c194b8 50%, #87cdcb 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        INTELLIGENCE
      </span>
    </div>
  );
}
