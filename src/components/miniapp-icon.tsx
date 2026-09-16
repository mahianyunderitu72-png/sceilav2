import {
  BookOpen,
  Clapperboard,
  Code2,
  Compass,
  GraduationCap,
  Headset,
  Newspaper,
  Palette,
  PenLine,
  Scale,
  Ship,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ledger: BookOpen,
  keel: Code2,
  chartroom: Compass,
  helm: Ship,
  quill: PenLine,
  atlas: GraduationCap,
  draft: Palette,
  loom: Clapperboard,
  harbor: Scale,
  beacon: Headset,
  masthead: Newspaper,
  ticker: TrendingUp,
};

export function MiniappIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? Compass;
  return <Icon className={className} strokeWidth={1.5} aria-hidden />;
}
