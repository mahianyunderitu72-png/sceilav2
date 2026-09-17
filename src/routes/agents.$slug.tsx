import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CompassMark } from "@/components/mark";
import { Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAgentBySlug } from "@/lib/server/catalog-fns";
import { restakeAgent } from "@/lib/server/agents";
import { useProfile } from "@/hooks/use-profile";
import type { Agent } from "@/lib/types";
import { formatPct, formatUsdc, n, shortAddress } from "@/lib/utils";
import { ADDRESSES, CHAIN } from "@/lib/web3/protocol";

export const Route = createFileRoute("/agents/$slug")({ component: AgentPage });

function AgentPage() {
  const { slug } = Route.useParams();
  const { profile } = useProfile();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [amount, setAmount] = useState("100");
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void getAgentBySlug({ data: slug }).then(setAgent);
  }, [slug]);

  if (!agent) {
    return (
      <Page>
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-surface" />
      </Page>
    );
  }

  const mine = profile && agent.owner_user_id === profile.user_id;

  return (
    <Page className="max-w-3xl">
      <Link to="/explore" className="text-sm text-muted hover:text-fg">
        Explore
      </Link>
      <div className="mt-6 flex items-start gap-4">
        <CompassMark className="size-14" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-4xl">{agent.name}</h1>
            <Badge>{agent.kind}</Badge>
            <Badge tone="ok">{agent.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted">{agent.description}</p>
        </div>
      </div>
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
          <dt className="text-xs text-muted">Reputation</dt>
          <dd className="mt-1 font-display text-2xl tabular-nums">{n(agent.reputation).toFixed(1)}</dd>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
          <dt className="text-xs text-muted">Stake</dt>
          <dd className="mt-1 font-display text-2xl tabular-nums">{formatUsdc(agent.stake_usdc)}</dd>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
          <dt className="text-xs text-muted">Accuracy</dt>
          <dd className="mt-1 font-display text-2xl tabular-nums">{formatPct(agent.accuracy)}</dd>
        </div>
      </dl>
      <div className="mt-8 grid gap-3 text-sm">
        <p>
          <span className="text-muted">Token </span>
          <span className="font-mono">#{agent.token_id}</span>
        </p>
        <p>
          <span className="text-muted">TBA </span>
          <span className="font-mono">{shortAddress(agent.tba_address)}</span>
        </p>
        <p>
          <span className="text-muted">Identity </span>
          <span className="font-mono">{shortAddress(ADDRESSES.identity)}</span>
          <span className="text-muted"> · {CHAIN.name}</span>
        </p>
        <p>
          <span className="text-muted">Endpoint </span>
          <span className="break-all font-mono text-xs">{agent.endpoint}</span>
        </p>
        <p>
          <span className="text-muted">Tasks completed </span>
          <span className="tabular-nums">{agent.tasks_completed.toLocaleString()}</span>
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-1">
        {agent.skills.map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {agent.tools.map((s) => (
          <Badge key={s} tone="muted">
            {s}
          </Badge>
        ))}
      </div>
      {mine ? (
        <form
          className="mt-8 flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void restakeAgent({ data: { agentId: agent.id, amount: Number(amount) || 0 } })
              .then(() => {
                setNote("Stake recorded.");
                void getAgentBySlug({ data: slug }).then(setAgent);
              })
              .catch((err) => setNote(err instanceof Error ? err.message : "Failed"));
          }}
        >
          <div>
            <label className="text-xs text-muted" htmlFor="restake">
              Restake USDC
            </label>
            <Input
              id="restake"
              className="mt-1 w-40"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm">
            Add stake
          </Button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-muted">
          Hire from {formatUsdc(agent.hire_price_usdc)} USDC per task on the{" "}
          <Link to="/marketplace" className="underline-offset-2 hover:underline">
            marketplace
          </Link>
          .
        </p>
      )}
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
    </Page>
  );
}
