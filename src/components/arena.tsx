import { Link } from "@tanstack/react-router";
import { BearingMark } from "@/components/mark";
import { Badge } from "@/components/ui/badge";
import type { ArenaResult } from "@/lib/types";
import { formatPct, formatUsdc, n } from "@/lib/utils";

const STAGES = ["Classifying", "Recruiting", "Commit", "Review", "Settled"] as const;

export function ArenaPending({ stage }: { stage: number }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-3">
        <BearingMark className="size-8" />
        <div>
          <p className="text-sm font-medium">Arena underway</p>
          <p className="text-xs text-muted">{STAGES[Math.min(stage, STAGES.length - 1)]}</p>
        </div>
      </div>
      <ol className="mt-4 grid grid-cols-5 gap-1">
        {STAGES.map((s, i) => (
          <li
            key={s}
            className={i <= stage ? "h-1 rounded-full bg-accent" : "h-1 rounded-full bg-elevated"}
          />
        ))}
      </ol>
    </div>
  );
}

export function ArenaCard({ arena }: { arena: ArenaResult }) {
  const workers = arena.submissions.filter((s) => s.role === "worker");
  const referee = arena.submissions.find((s) => s.role === "referee");
  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{arena.task.consensus_method}</Badge>
        <Badge>{arena.task.classification}</Badge>
        <span className="font-mono text-xs text-muted tabular-nums">
          {formatPct(arena.task.confidence)} confidence · {formatPct(arena.task.agreement)} agreement
        </span>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {arena.task.consensus_answer}
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {workers.map((s) => (
          <article key={s.id} className="rounded-md border border-border bg-bg p-3">
            <div className="flex items-center justify-between gap-2">
              <Link
                to="/agents/$slug"
                params={{ slug: s.agent_slug ?? "" }}
                className="text-sm font-medium hover:text-accent"
              >
                {s.agent_name}
              </Link>
              <span className="font-mono text-xs text-muted tabular-nums">
                {formatPct(s.score_accuracy)}
              </span>
            </div>
            <p className="mt-2 line-clamp-5 text-xs leading-relaxed text-muted">{s.answer}</p>
            {s.evidence?.length ? (
              <ul className="mt-2 space-y-1">
                {s.evidence.slice(0, 3).map((e) => (
                  <li key={e} className="text-xs text-subtle">
                    {e}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-2 font-mono text-xs text-subtle tabular-nums">
              +{formatUsdc(s.reward_usdc)} · slash {formatUsdc(s.slashed_usdc)}
            </p>
          </article>
        ))}
      </div>
      {referee ? (
        <p className="mt-4 text-xs text-muted">
          Referee {referee.agent_name}: {referee.answer}
          {n(referee.reward_usdc) ? ` · paid ${formatUsdc(referee.reward_usdc)} USDC` : ""}
        </p>
      ) : null}
    </div>
  );
}
