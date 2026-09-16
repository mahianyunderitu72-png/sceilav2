import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/shell";
import { listLessons } from "@/lib/server/catalog-fns";
import type { Lesson } from "@/lib/types";

export const Route = createFileRoute("/academy/")({ component: AcademyIndex });

function AcademyIndex() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  useEffect(() => {
    void listLessons().then(setLessons);
  }, []);
  return (
    <Page>
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Chart school</p>
      <h1 className="mt-2 font-display text-4xl">Academy</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Short lessons on identity, arenas, buoys, stake, and the API. Protocol
        ops can add more from the admin desk.
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {lessons.map((l, i) => (
          <Link
            key={l.slug}
            to="/academy/$slug"
            params={{ slug: l.slug }}
            className="rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
          >
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 font-display text-2xl">{l.title}</h2>
            <p className="mt-2 text-sm text-muted">{l.summary}</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}
