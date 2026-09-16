import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/shell";
import { getNews } from "@/lib/server/catalog-fns";
import type { NewsPost } from "@/lib/types";

export const Route = createFileRoute("/news/$slug")({ component: NewsPostPage });

function NewsPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<NewsPost | null>(null);
  useEffect(() => {
    void getNews({ data: slug }).then(setPost);
  }, [slug]);
  if (!post) {
    return (
      <Page>
        <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-surface" />
      </Page>
    );
  }
  return (
    <Page className="max-w-2xl">
      <Link to="/news" className="text-sm text-muted hover:text-fg">
        News
      </Link>
      <p className="kicker mt-4">{post.kicker}</p>
      <h1 className="mt-2 font-display text-4xl">{post.title}</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted">{post.body}</p>
    </Page>
  );
}
