/**
 * Dezenter Hintergrund mit Punkten und Linien, inspiriert vom Brand-Element
 * "Netzwerk-Linien". Pures SVG, kein JS, sehr leichtgewichtig.
 */
export function NetworkLines({
  className = "",
  intensity = 0.35,
}: {
  className?: string;
  intensity?: number;
}) {
  // Festes Punkt-Set, damit der Hintergrund zwischen Renders nicht springt.
  const nodes: Array<[number, number, "p" | "t"]> = [
    [12, 18, "t"], [22, 12, "t"], [38, 22, "t"], [55, 8, "t"], [72, 18, "t"],
    [88, 14, "t"], [18, 38, "p"], [42, 42, "t"], [62, 36, "p"], [82, 44, "t"],
    [10, 60, "p"], [30, 68, "p"], [48, 60, "p"], [68, 72, "p"], [88, 64, "p"],
    [22, 86, "p"], [44, 90, "p"], [64, 84, "p"], [80, 92, "p"], [94, 80, "t"],
  ];
  const links: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [0, 6], [6, 7], [7, 2], [7, 8], [8, 4], [8, 9], [9, 5],
    [6, 10], [10, 11], [11, 12], [12, 7], [12, 13], [13, 8], [13, 14], [14, 9],
    [10, 15], [15, 16], [16, 12], [16, 17], [17, 13], [17, 18], [18, 14], [18, 19],
  ];
  return (
    <svg
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ opacity: intensity }}
    >
      {links.map(([a, b], i) => {
        const [x1, y1, c1] = nodes[a];
        const [x2, y2] = nodes[b];
        const stroke = c1 === "t" ? "#87cdcb" : "#db73a6";
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={stroke}
            strokeWidth={0.15}
          />
        );
      })}
      {nodes.map(([x, y, c], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={0.5}
          fill={c === "t" ? "#87cdcb" : "#db73a6"}
        />
      ))}
    </svg>
  );
}
