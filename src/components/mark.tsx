import { cn } from "@/lib/utils";

type BearingProps = {
  className?: string;
  title?: string;
};

const LINES = [
  { x1: 25.2725, y1: 18.1148, delay: "0s", dash: 12 },
  { x1: 9.8852, y1: 25.2725, delay: "0.28s", dash: 12 },
  { x1: 2.7275, y1: 9.8852, delay: "0.56s", dash: 12 },
  { x1: 18.1148, y1: 2.7275, delay: "0.84s", dash: 12 },
] as const;

export function BearingMark({ className, title }: BearingProps) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={cn("text-accent", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g opacity="0.18" stroke="currentColor" fill="none">
        <circle cx="14" cy="14" r="11.28" />
        <circle cx="14" cy="14" r="7.44" strokeDasharray="2 6" />
        <circle cx="14" cy="14" r="3.6" strokeDasharray="2 6" />
      </g>
      {LINES.map((l) => (
        <line
          key={`${l.x1}-${l.y1}`}
          x1={l.x1}
          y1={l.y1}
          x2="14"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="bearing-line"
          style={{
            ["--dash" as string]: String(l.dash),
            strokeDasharray: l.dash,
            animationDelay: l.delay,
          }}
        />
      ))}
      <circle cx="14" cy="14" r="1.26" fill="var(--color-signal)" opacity="0.16" className="bearing-pulse" />
      <circle cx="14" cy="14" r="0.392" fill="var(--color-signal)" />
    </svg>
  );
}

export function BearingHero({ className }: { className?: string }) {
  const scale = 20;
  return (
    <svg
      viewBox="0 0 560 560"
      className={cn("h-auto w-full text-accent", className)}
      role="img"
      aria-label="Several independent bearings converging on a single point"
    >
      <g opacity="0.18" stroke="currentColor" fill="none">
        <circle cx="280" cy="280" r={11.28 * scale} />
        <circle cx="280" cy="280" r={7.44 * scale} strokeDasharray="8 24" />
        <circle cx="280" cy="280" r={3.6 * scale} strokeDasharray="8 24" />
      </g>
      {LINES.map((l) => (
        <line
          key={`${l.x1}-${l.y1}`}
          x1={l.x1 * scale}
          y1={l.y1 * scale}
          x2="280"
          y2="280"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="bearing-line"
          style={{
            ["--dash" as string]: String(l.dash * scale),
            strokeDasharray: l.dash * scale,
            animationDelay: l.delay,
          }}
        />
      ))}
      <circle
        cx="280"
        cy="280"
        r={1.26 * scale}
        fill="var(--color-signal)"
        opacity="0.16"
        className="bearing-pulse"
      />
      <circle cx="280" cy="280" r={0.392 * scale} fill="var(--color-signal)" />
    </svg>
  );
}

export function CompassMark(props: BearingProps) {
  return <BearingMark {...props} />;
}

export function ThreeCompasses({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-md", className)}>
      <BearingHero />
    </div>
  );
}
