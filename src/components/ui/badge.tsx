import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "accent" | "ok" | "warn" | "danger";
}) {
  const tones = {
    muted: "border-border bg-surface text-muted",
    accent: "border-accent/40 bg-accent/10 text-accent",
    ok: "border-signal/40 bg-signal/10 text-signal",
    warn: "border-warn/40 bg-warn/10 text-warn",
    danger: "border-danger/40 bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
