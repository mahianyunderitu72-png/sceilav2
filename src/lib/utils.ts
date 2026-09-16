import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function n(v: string | number | null | undefined): number {
  if (v == null || v === "") return 0;
  return typeof v === "number" ? v : Number.parseFloat(v);
}

export function formatUsdc(v: string | number | null | undefined): string {
  const x = n(v);
  return x.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function shortAddress(addr?: string | null): string {
  if (!addr) return "—";
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatPct(v: string | number | null | undefined): string {
  const x = n(v);
  const pct = x <= 1 ? x * 100 : x;
  return `${pct.toFixed(1)}%`;
}
