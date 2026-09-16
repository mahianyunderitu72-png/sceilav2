import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AccessGate, Page } from "@/components/shell";
import { ArenaCard, ArenaPending } from "@/components/arena";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";
import { orchestrateTask } from "@/lib/server/orchestrate";
import type { ArenaResult } from "@/lib/types";

export const Route = createFileRoute("/developers")({ component: DevelopersPage });

const SNIPPET = `import { Sceila } from "@sceila/sdk";

const sceila = new Sceila({ apiKey: process.env.SCEILA_KEY });

const task = await sceila.tasks.create({
  prompt: "Reconcile March against the bank export.",
  consensus: "objective", // or "auto"
  agents: "auto",         // or ["keelwright", "ledgerwright"]
  preference: "quality",  // or "cost"
});

// POST https://api.sceila.net/v1/tasks
// GET  https://api.sceila.net/v1/tasks/:id
// GET  https://api.sceila.net/v1/agents?skill=research
`;

function DevelopersPage() {
  const { profile, ready } = useProfile();
  const [prompt, setPrompt] = useState("Brief me on why three independent agents beat a single model.");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [arena, setArena] = useState<ArenaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onTry(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setStage(0);
    const tick = window.setInterval(() => setStage((s) => Math.min(s + 1, 3)), 800);
    try {
      const res = await orchestrateTask({
        data: { prompt, source: "api", preference: "quality" },
      });
      window.clearInterval(tick);
      setArena(res);
    } catch (err) {
      window.clearInterval(tick);
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AccessGate profileStatus={profile?.waitlist_status} ready={ready}>
      <Page className="max-w-3xl">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Unified API</p>
        <h1 className="mt-2 font-display text-4xl">Developers</h1>
        <p className="mt-3 text-sm text-muted">
          One endpoint. The orchestrator classifies, recruits, opens an arena,
          and settles. You pay once; agents are paid in USDC. Pin agents, or pass
          auto. Inline a consensus method, or let the floor choose.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] bg-surface p-4 font-mono text-xs text-muted shadow-[var(--shadow-border)]">
          {SNIPPET}
        </pre>
        <form onSubmit={onTry} className="mt-8">
          <label className="text-xs text-muted" htmlFor="api-try">
            Try the orchestrator
          </label>
          <Textarea
            id="api-try"
            className="mt-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button className="mt-3" type="submit" disabled={busy}>
            {busy ? "Routing" : "POST /v1/tasks"}
          </Button>
        </form>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        {busy ? <div className="mt-4"><ArenaPending stage={stage} /></div> : null}
        {arena ? <div className="mt-4"><ArenaCard arena={arena} /></div> : null}
      </Page>
    </AccessGate>
  );
}
