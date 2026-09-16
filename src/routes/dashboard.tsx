import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AccessGate, Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLANS } from "@/lib/catalog";
import { useProfile } from "@/hooks/use-profile";
import { listMyAgents } from "@/lib/server/agents";
import { changePlan, issueApiKey, listApiKeys, listMyLedger, listMyTasks } from "@/lib/server/market";
import type { TaskRow } from "@/lib/server/market";
import { attachWallet, generateWallet } from "@/lib/server/profile";
import type { Agent, LedgerRow } from "@/lib/types";
import { formatUsdc, n, shortAddress } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

type Tab = "agents" | "tasks" | "money" | "keys";

function DashboardPage() {
  const { profile, setProfile, ready } = useProfile();
  const [tab, setTab] = useState<Tab>("agents");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [ledger, setLedger] = useState<LedgerRow[]>([]);
  const [keys, setKeys] = useState<Array<{ id: number; label: string; prefix: string; created_at: string }>>([]);
  const [wallet, setWallet] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || profile.waitlist_status !== "approved") return;
    void listMyAgents().then(setAgents);
    void listMyTasks().then(setTasks);
    void listMyLedger().then(setLedger);
    void listApiKeys().then(setKeys);
  }, [profile]);

  return (
    <AccessGate profileStatus={profile?.waitlist_status} ready={ready}>
      <Page>
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Skipper</p>
        <h1 className="mt-2 font-display text-4xl">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Manage agents, tasks, the purse, and API keys. Plan: {profile?.plan}. Credits:{" "}
          <span className="tabular-nums">{n(profile?.credits).toFixed(0)}</span>
        </p>

        <div className="mt-6 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-xs text-muted">Attached wallet (Base)</p>
          <p className="mt-1 font-mono text-sm">{shortAddress(profile?.wallet_address)}</p>
          <form
            className="mt-3 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void attachWallet({ data: { address: wallet } })
                .then((p) => {
                  if (p) setProfile(p);
                  setNote("Wallet attached.");
                })
                .catch((err) => setNote(err instanceof Error ? err.message : "Failed"));
            }}
          >
            <Input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0x…"
              className="max-w-sm"
            />
            <Button type="submit" size="sm" variant="secondary">
              Attach
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                void generateWallet().then((p) => {
                  if (p) setProfile(p);
                  setNote("Simulated Base wallet generated for testnet.");
                });
              }}
            >
              Generate testnet wallet
            </Button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["agents", "tasks", "money", "keys"] as const).map((t) => (
            <Button key={t} size="sm" variant={tab === t ? "secondary" : "ghost"} onClick={() => setTab(t)}>
              {t}
            </Button>
          ))}
        </div>
        {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}

        {tab === "agents" ? (
          <div className="mt-6 grid gap-3">
            <div className="flex gap-2">
              <Link to="/buoy">
                <Button size="sm">Create a buoy</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="outline">
                  Register an agent
                </Button>
              </Link>
            </div>
            {agents.length === 0 ? (
              <p className="text-sm text-muted">No agents on this account yet.</p>
            ) : (
              agents.map((a) => (
                <Link
                  key={a.id}
                  to="/agents/$slug"
                  params={{ slug: a.slug }}
                  className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
                >
                  <span>
                    {a.name}{" "}
                    <Badge className="ml-2">{a.kind}</Badge>
                  </span>
                  <span className="font-mono text-xs text-muted tabular-nums">
                    {formatUsdc(a.stake_usdc)} USDC · {n(a.reputation).toFixed(1)}
                  </span>
                </Link>
              ))
            )}
          </div>
        ) : null}

        {tab === "tasks" ? (
          <div className="mt-6 grid gap-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted">No tasks yet. Ask from chat or a miniapp.</p>
            ) : (
              tasks.map((t) => (
                <div
                  key={String(t.id)}
                  className="rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
                >
                  <p className="text-sm">{t.prompt.slice(0, 140)}</p>
                  <p className="mt-1 font-mono text-[11px] text-subtle">
                    {t.classification} · {t.consensus_method} · {t.status}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : null}

        {tab === "money" ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-xl">Plans</h2>
              <div className="mt-3 grid gap-3">
                {PLANS.map((p) => (
                  <div key={p.id} className="rounded-[var(--radius-md)] bg-surface p-4 shadow-[var(--shadow-border)]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{p.name}</h3>
                      <span className="text-sm text-muted">{p.price}</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-muted">
                      {p.perks.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <Button
                      className="mt-3"
                      size="sm"
                      variant={profile?.plan === p.id ? "secondary" : "outline"}
                      onClick={() => {
                        void changePlan({ data: { plan: p.id } }).then(() => {
                          setNote(`Plan set to ${p.name}.`);
                          if (profile) setProfile({ ...profile, plan: p.id, credits: String(p.credits) });
                        });
                      }}
                    >
                      {profile?.plan === p.id ? "Current" : "Switch"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl">Ledger</h2>
              <ul className="mt-3 space-y-2">
                {ledger.map((row) => (
                  <li key={row.id} className="flex justify-between text-sm">
                    <span className="text-muted">
                      {row.kind} · {row.note}
                    </span>
                    <span className="font-mono tabular-nums">{formatUsdc(row.amount_usdc)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {tab === "keys" ? (
          <div className="mt-6 max-w-lg">
            <p className="text-sm text-muted">
              Keys call the unified API. The secret is shown once.
            </p>
            <Button
              className="mt-3"
              size="sm"
              onClick={() => {
                void issueApiKey({ data: { label: "desk" } }).then((k) => {
                  setSecret(k.full);
                  setKeys((prev) => [
                    { id: Date.now(), label: "desk", prefix: k.prefix, created_at: new Date().toISOString() },
                    ...prev,
                  ]);
                });
              }}
            >
              Issue key
            </Button>
            {secret ? (
              <p className="mt-3 break-all font-mono text-xs text-warn">
                {secret} — copy now, it will not be shown again.
              </p>
            ) : null}
            <ul className="mt-4 space-y-2">
              {keys.map((k) => (
                <li key={k.id} className="font-mono text-sm text-muted">
                  {k.prefix}… · {k.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Page>
    </AccessGate>
  );
}
