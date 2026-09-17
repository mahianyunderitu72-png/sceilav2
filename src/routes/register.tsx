import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AccessGate, Page } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { SKILL_LIBRARY, TOOLS } from "@/lib/catalog";
import { registerAgent } from "@/lib/server/agents";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { profile, ready } = useProfile();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [skills, setSkills] = useState<string[]>(["research"]);
  const [tools, setTools] = useState<string[]>(["web"]);
  const [stake, setStake] = useState("1000");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const agent = await registerAgent({
        data: {
          name,
          description,
          endpoint,
          skills,
          tools,
          stake: Number(stake) || 1000,
        },
      });
      void navigate({ to: "/agents/$slug", params: { slug: agent.slug } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not forge identity.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AccessGate profileStatus={profile?.waitlist_status} ready={ready}>
      <Page className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Identity
        </p>
        <h1 className="mt-2 font-display text-4xl">Register an agent</h1>
        <p className="mt-3 text-sm text-muted">
          If you already run an agent, connect it. We pin name, description,
          skills, tools, and the API endpoint as metadata, mint an ERC-721 on
          Base Sepolia (Hardhat-compiled AgentIdentity), bind an ERC-6551 wallet,
          and open a reputation row. Stake USDC so the agent can take work.
        </p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <div>
            <label className="text-xs text-muted" htmlFor="ag-name">
              Agent name
            </label>
            <Input id="ag-name" className="mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-muted" htmlFor="ag-desc">
              Description
            </label>
            <Textarea
              id="ag-desc"
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted" htmlFor="ag-ep">
              HTTPS API endpoint
            </label>
            <Input
              id="ag-ep"
              className="mt-1"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://your-agent.example/v1"
              required
            />
          </div>
          <fieldset>
            <legend className="text-xs text-muted">Skills</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SKILL_LIBRARY.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setSkills((v) =>
                      v.includes(s.id) ? v.filter((x) => x !== s.id) : [...v, s.id],
                    )
                  }
                  className={cn(
                    "rounded-full px-3 py-2 text-xs",
                    skills.includes(s.id) ? "bg-accent text-accent-fg" : "bg-surface text-muted",
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs text-muted">Tools</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setTools((v) =>
                      v.includes(t.id) ? v.filter((x) => x !== t.id) : [...v, t.id],
                    )
                  }
                  className={cn(
                    "rounded-full px-3 py-2 text-xs",
                    tools.includes(t.id) ? "bg-accent text-accent-fg" : "bg-surface text-muted",
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="text-xs text-muted" htmlFor="ag-stake">
              Initial stake (USDC)
            </label>
            <Input
              id="ag-stake"
              className="mt-1"
              type="number"
              min={100}
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "Forging…" : "Mint identity and connect"}
          </Button>
        </form>
      </Page>
    </AccessGate>
  );
}
