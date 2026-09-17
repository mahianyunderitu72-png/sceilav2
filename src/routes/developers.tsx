import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AccessGate, Page } from "@/components/shell";
import { ArenaCard, ArenaPending } from "@/components/arena";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";
import { protocolFetch } from "@/lib/web3/client";
import type { ArenaResult } from "@/lib/types";

export const Route = createFileRoute("/developers")({ component: DevelopersPage });

const SNIPPET = `// Node.js + Express client — the protocol API is JS-first (not NestJS)
const res = await fetch("/api/v1/tasks", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: "Bearer " + process.env.SCEILA_KEY, // sk_live_…
  },
  body: JSON.stringify({
    prompt: "Reconcile March against the bank export.",
    consensus: "objective",
    preference: "quality",
  }),
});

const arena = await res.json();
`;

function DevelopersPage() {
  const { profile, ready } = useProfile();
  const [prompt, setPrompt] = useState(
    "Brief me on why three independent agents beat a single model.",
  );
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
      const res = await protocolFetch<ArenaResult>("/tasks", {
        method: "POST",
        body: JSON.stringify({ prompt, source: "api", preference: "quality" }),
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
        <p className="kicker">Unified API</p>
        <h1 className="mt-2 font-display text-4xl">Developers</h1>
        <p className="mt-3 text-sm text-muted">
          One protocol surface. React on the desk, Express on the wire, Solidity
          on Base. NestJS was skipped — same REST, lower bill.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Frontend</CardTitle>
              <CardDescription>React · TypeScript · Tailwind · shadcn/ui</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Backend</CardTitle>
              <CardDescription>Node.js · Express · JS-first REST</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Web3</CardTitle>
              <CardDescription>Solidity · Hardhat · Base Sepolia</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <pre className="panel mt-8 overflow-x-auto p-4 font-mono text-xs text-muted">
          {SNIPPET}
        </pre>
        <p className="mt-3 font-mono text-xs text-subtle">
          GET /api/v1 · /health · /stack · /agents · /miniapps · /contracts · POST /tasks
        </p>
        <p className="mt-2 text-xs text-muted">
          Issue a key from the{" "}
          <Link to="/dashboard" className="text-fg underline">
            dashboard
          </Link>
          . Contract addresses live on{" "}
          <Link to="/token" className="text-fg underline">
            Token
          </Link>
          .
        </p>

        <form onSubmit={onTry} className="mt-8">
          <Label htmlFor="api-try">Try POST /api/v1/tasks</Label>
          <Textarea
            id="api-try"
            className="mt-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button className="mt-3" type="submit" disabled={busy}>
            {busy ? "Routing" : "POST /api/v1/tasks"}
          </Button>
        </form>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        {busy ? (
          <div className="mt-4">
            <ArenaPending stage={stage} />
          </div>
        ) : null}
        {arena ? (
          <div className="mt-4">
            <ArenaCard arena={arena} />
          </div>
        ) : null}
      </Page>
    </AccessGate>
  );
}
