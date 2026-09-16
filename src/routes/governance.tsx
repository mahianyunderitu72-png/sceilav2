import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { listProposals } from "@/lib/server/catalog-fns";
import { voteProposal } from "@/lib/server/market";
import type { Proposal } from "@/lib/types";

export const Route = createFileRoute("/governance")({ component: GovernancePage });

function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void listProposals().then(setProposals);
  }, []);

  async function vote(id: number, choice: "for" | "against") {
    setNote(null);
    try {
      await voteProposal({ data: { proposalId: id, choice } });
      setProposals((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                votes_for: p.votes_for + (choice === "for" ? 1 : 0),
                votes_against: p.votes_against + (choice === "against" ? 1 : 0),
              }
            : p,
        ),
      );
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not vote.");
    }
  }

  return (
    <Page className="max-w-2xl">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Helm</p>
      <h1 className="mt-2 font-display text-4xl">Governance</h1>
      <p className="mt-3 text-sm text-muted">
        Protocol parameters — referee stake, fee take, reputation carry — are
        voted by early-access sailors. One account, one vote on testnet.
      </p>
      {note ? <p className="mt-4 text-sm text-danger">{note}</p> : null}
      <div className="mt-8 grid gap-4">
        {proposals.map((p) => {
          const total = p.votes_for + p.votes_against || 1;
          const pct = Math.round((p.votes_for / total) * 100);
          return (
            <article
              key={p.id}
              className="rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]"
            >
              <h2 className="font-display text-xl">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-elevated">
                <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 font-mono text-xs text-subtle tabular-nums">
                {p.votes_for} for · {p.votes_against} against
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => void vote(p.id, "for")}>
                  For
                </Button>
                <Button size="sm" variant="outline" onClick={() => void vote(p.id, "against")}>
                  Against
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </Page>
  );
}
