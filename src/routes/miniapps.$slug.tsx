import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArenaCard, ArenaPending } from "@/components/arena";
import { AccessGate, Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { getMiniapp } from "@/lib/server/catalog-fns";
import { orchestrateTask } from "@/lib/server/orchestrate";
import { useProfile } from "@/hooks/use-profile";
import type { ArenaResult, Miniapp } from "@/lib/types";

export const Route = createFileRoute("/miniapps/$slug")({ component: MiniappPage });

function MiniappPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { profile, ready } = useProfile();
  const [app, setApp] = useState<Miniapp | null>(null);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [arena, setArena] = useState<ArenaResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getMiniapp({ data: slug }).then(setApp);
  }, [slug]);

  async function onRun(e: React.FormEvent) {
    e.preventDefault();
    if (!app || !prompt.trim()) return;
    setBusy(true);
    setError(null);
    setStage(0);
    const tick = window.setInterval(() => setStage((s) => Math.min(s + 1, 3)), 800);
    try {
      const res = await orchestrateTask({
        data: {
          prompt: prompt.trim(),
          source: "miniapp",
          miniappSlug: app.slug,
          consensus: app.consensus_method,
        },
      });
      window.clearInterval(tick);
      setArena(res);
    } catch (err) {
      window.clearInterval(tick);
      const msg = err instanceof Error ? err.message : "Failed.";
      if (msg === "WAITLIST") void navigate({ to: "/waitlist" });
      else if (msg === "Unauthorized") void navigate({ to: "/login" });
      else setError(msg);
    } finally {
      setBusy(false);
    }
  }

  if (!app) {
    return (
      <Page>
        <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-surface" />
      </Page>
    );
  }

  return (
    <AccessGate profileStatus={profile?.waitlist_status} ready={ready}>
      <Page className="max-w-3xl">
        <Link to="/miniapps" className="text-sm text-muted hover:text-fg">
          Miniapps
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{app.category}</Badge>
          <Badge tone="accent">{app.consensus_method}</Badge>
          <span className="text-xs text-subtle">{app.publisher}</span>
        </div>
        <h1 className="mt-3 font-display text-4xl">{app.name}</h1>
        <p className="mt-2 text-lg text-fg">{app.tagline}</p>
        <p className="mt-3 text-sm text-muted">{app.description}</p>
        <form onSubmit={onRun} className="mt-8 rounded-[var(--radius-xl)] bg-surface p-4 shadow-[var(--shadow-border)]">
          <label htmlFor="mini-prompt" className="text-xs text-muted">
            Task
          </label>
          <Textarea
            id="mini-prompt"
            className="mt-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={app.prompt_hint}
            disabled={busy}
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-subtle">Billed once. Agents are paid in USDC.</p>
            <Button type="submit" disabled={busy || !prompt.trim()}>
              {busy ? "Running" : "Submit to orchestrator"}
            </Button>
          </div>
        </form>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        {busy ? <div className="mt-6"><ArenaPending stage={stage} /></div> : null}
        {arena ? <div className="mt-6"><ArenaCard arena={arena} /></div> : null}
      </Page>
    </AccessGate>
  );
}
