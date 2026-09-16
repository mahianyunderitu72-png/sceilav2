import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/shell";
import { getLesson } from "@/lib/server/catalog-fns";
import type { Lesson } from "@/lib/types";

export const Route = createFileRoute("/academy/$slug")({ component: LessonPage });

function LessonPage() {
  const { slug } = Route.useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  useEffect(() => {
    void getLesson({ data: slug }).then(setLesson);
  }, [slug]);
  if (!lesson) {
    return (
      <Page>
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-surface" />
      </Page>
    );
  }
  return (
    <Page className="max-w-2xl">
      <Link to="/academy" className="text-sm text-muted hover:text-fg">
        Academy
      </Link>
      <h1 className="mt-4 font-display text-4xl">{lesson.title}</h1>
      <p className="mt-2 text-sm text-muted">{lesson.summary}</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-fg">
        {lesson.body.split("\n\n").map((para) => (
          <p key={para.slice(0, 24)} className="whitespace-pre-wrap text-muted">
            {para}
          </p>
        ))}
      </div>
    </Page>
  );
}
