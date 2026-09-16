import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/shell";
import { listNews } from "@/lib/server/catalog-fns";
import type { NewsPost } from "@/lib/types";

export const Route = createFileRoute("/news/")({ component: NewsIndex });

function NewsIndex() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  useEffect(() => {
    void listNews().then(setPosts);
  }, []);
  return (
    <Page className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Deck log</p>
      <h1 className="mt-2 font-display text-4xl">Protocol news</h1>
      <ul className="mt-8 space-y-6">
        {posts.map((p) => (
          <li key={p.slug}>
            <p className="text-xs text-subtle">{p.kicker}</p>
            <Link
              to="/news/$slug"
              params={{ slug: p.slug }}
              className="font-display text-2xl hover:text-accent"
            >
              {p.title}
            </Link>
            <p className="mt-1 text-sm text-muted">{p.body.slice(0, 160)}…</p>
          </li>
        ))}
      </ul>
    </Page>
  );
}
