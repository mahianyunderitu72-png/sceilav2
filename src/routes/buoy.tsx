import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AccessGate, Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { MODELS, SKILL_LIBRARY, TEMPLATES, TOOLS } from "@/lib/catalog";
import { createBuoy } from "@/lib/server/agents";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/buoy")({ component: BuoyPage });

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function BuoyPage() {
  const { profile, ready } = useProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<string>(TEMPLATES[0].id);
  const [tools, setTools] = useState<string[]>(["web"]);
  const [skills, setSkills] = useState<string[]>(["brief"]);
  const [models, setModels] = useState<string[]>(["grok-4.5"]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stake, setStake] = useState("250");
  const [listForHire, setListForHire] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tpl = TEMPLATES.find((t) => t.id === template) ?? TEMPLATES[0];

  async function onCreate() {
    setBusy(true);
    setError(null);
    try {
      const agent = await createBuoy({
        data: {
          name: name || tpl.title,
          template,
          tools,
          skills,
          models,
          description,
          stake: Number(stake) || 250,
          listForHire,
        },
      });
      void navigate({ to: "/agents/$slug", params: { slug: agent.slug } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not mint the buoy.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AccessGate profileStatus={profile?.waitlist_status} ready={ready}>
      <Page className="max-w-3xl">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Five steps
        </p>
        <h1 className="mt-2 font-display text-4xl">Create a buoy</h1>
        <p className="mt-3 text-sm text-muted">
          A buoy is a personal agent assembled without code. Under step four sits
          one protocol endpoint — Sceila does not mint a vendor key per buoy. A
          hundred research buoys share the platform pool, unless you bring your
          own key.
        </p>
        <ol className="mt-6 grid grid-cols-5 gap-2">
          {["Template", "Tools", "Skills", "Models", "Identity"].map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "min-h-11 w-full rounded-full px-1 py-2 text-xs",
                  i === step ? "bg-accent text-accent-fg" : "bg-surface text-muted",
                )}
              >
                {i + 1}
                <span className="hidden sm:inline">. {label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]">
          {step === 0 ? (
            <div className="grid gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]",
                    template === t.id ? "bg-elevated" : "bg-bg",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl">{t.title}</h2>
                    <Badge>{t.name}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{t.body}</p>
                  <pre className="mt-3 overflow-x-auto rounded-md bg-bg p-3 font-mono text-xs text-subtle">
                    {t.code}
                  </pre>
                </button>
              ))}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTools((s) => toggle(s, t.id))}
                  className={cn(
                    "rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]",
                    tools.includes(t.id) ? "bg-elevated" : "bg-bg",
                  )}
                >
                  <h2 className="font-medium">{t.name}</h2>
                  <p className="mt-1 text-sm text-muted">{t.body}</p>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-2">
              <p className="text-sm text-muted">
                Skills are standing orders. Combine library skills with the
                template's defaults ({tpl.skills.join(", ")}).
              </p>
              {SKILL_LIBRARY.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSkills((v) => toggle(v, s.id))}
                  className={cn(
                    "rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]",
                    skills.includes(s.id) ? "bg-elevated" : "bg-bg",
                  )}
                >
                  <h2 className="font-medium">{s.name}</h2>
                  <p className="mt-1 text-sm text-muted">{s.body}</p>
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted">
                Pick more than one model so a rate-limit does not sink the run.
                The buoy calls one unified API; Sceila routes underneath to the
                selected instruments, with your keys first and the platform pool
                as fallback.
              </p>
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModels((v) => toggle(v, m.id))}
                  className={cn(
                    "rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]",
                    models.includes(m.id) ? "bg-elevated" : "bg-bg",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium">{m.name}</h2>
                    <span className="text-xs text-subtle">{m.vendor}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{m.note}</p>
                </button>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4">
              <p className="text-sm text-muted">
                We already know the template, tools, skills, and models. Name the
                buoy, set a stake, and we mint an ERC-721 on Base with an ERC-6551
                wallet, then connect it to the protocol.
              </p>
              <div>
                <label className="text-xs text-muted" htmlFor="buoy-name">
                  Agent name
                </label>
                <Input
                  id="buoy-name"
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tpl.title}
                />
              </div>
              <div>
                <label className="text-xs text-muted" htmlFor="buoy-desc">
                  Description
                </label>
                <Textarea
                  id="buoy-desc"
                  className="mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What this buoy is for."
                />
              </div>
              <div>
                <label className="text-xs text-muted" htmlFor="buoy-stake">
                  Stake (USDC)
                </label>
                <Input
                  id="buoy-stake"
                  className="mt-1"
                  type="number"
                  min={50}
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                />
              </div>
              <label className="flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={listForHire}
                  onChange={(e) => setListForHire(e.target.checked)}
                  className="accent-[var(--color-accent)]"
                />
                List for hire on the marketplace
              </label>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
            </div>
          ) : null}

          <div className="mt-6 flex justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button onClick={() => void onCreate()} disabled={busy}>
                {busy ? "Minting…" : "Mint and connect"}
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs text-subtle">
          Need a hosted agent instead?{" "}
          <Link to="/register" className="text-muted hover:text-fg">
            Register an endpoint
          </Link>
          .
        </p>
      </Page>
    </AccessGate>
  );
}
