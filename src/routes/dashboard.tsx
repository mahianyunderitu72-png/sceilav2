import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AccessGate, Page } from "@/components/shell";
import { WalletConnect } from "@/components/wallet-connect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANS } from "@/lib/catalog";
import { useProfile } from "@/hooks/use-profile";
import { listMyAgents } from "@/lib/server/agents";
import { changePlan, issueApiKey, listApiKeys, listMyLedger, listMyTasks } from "@/lib/server/market";
import type { TaskRow } from "@/lib/server/market";
import type { Agent, LedgerRow } from "@/lib/types";
import { formatUsdc, n } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const { profile, setProfile, ready } = useProfile();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [ledger, setLedger] = useState<LedgerRow[]>([]);
  const [keys, setKeys] = useState<Array<{ id: number; label: string; prefix: string; created_at: string }>>([]);
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
        <p className="kicker">Skipper</p>
        <h1 className="mt-2 font-display text-4xl">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Manage agents, tasks, the purse, and API keys. Plan: {profile?.plan}. Credits:{" "}
          <span className="tabular-nums">{n(profile?.credits).toFixed(0)}</span>
        </p>

        <div className="mt-6">
          <WalletConnect profile={profile} onProfile={setProfile} />
        </div>

        {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}

        <Tabs defaultValue="agents" className="mt-8">
          <TabsList>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="money">Money</TabsTrigger>
            <TabsTrigger value="keys">Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <div className="flex flex-wrap gap-2">
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
              <p className="mt-4 text-sm text-muted">No agents on this account yet.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {agents.map((a) => (
                  <Link key={a.id} to="/agents/$slug" params={{ slug: a.slug }}>
                    <Card>
                      <CardContent className="flex items-center justify-between">
                        <span>
                          {a.name}{" "}
                          <Badge className="ml-2">{a.kind}</Badge>
                        </span>
                        <span className="font-mono text-xs text-muted tabular-nums">
                          {formatUsdc(a.stake_usdc)} USDC · {n(a.reputation).toFixed(1)}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted">No tasks yet. Ask from chat or a miniapp.</p>
            ) : (
              <div className="grid gap-2">
                {tasks.map((t) => (
                  <Card key={String(t.id)}>
                    <CardContent>
                      <p className="text-sm">{t.prompt.slice(0, 140)}</p>
                      <p className="mt-1 font-mono text-xs text-subtle">
                        {t.classification} · {t.consensus_method} · {t.status}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="money">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h2 className="font-display text-xl">Plans</h2>
                <div className="mt-3 grid gap-3">
                  {PLANS.map((p) => (
                    <Card key={p.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{p.name}</CardTitle>
                          <span className="text-sm text-muted">{p.price}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm text-muted">
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
                              if (profile) {
                                setProfile({ ...profile, plan: p.id, credits: String(p.credits) });
                              }
                            });
                          }}
                        >
                          {profile?.plan === p.id ? "Current" : "Switch"}
                        </Button>
                      </CardContent>
                    </Card>
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
          </TabsContent>

          <TabsContent value="keys">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle>Express API keys</CardTitle>
                <CardDescription>
                  Keys call POST /api/v1/tasks on the Node.js Express backend.
                  Header: Authorization: Bearer sk_live_… The secret is shown once.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="sm"
                  onClick={() => {
                    void issueApiKey({ data: { label: "desk" } }).then((k) => {
                      setSecret(k.full);
                      setKeys((prev) => [
                        {
                          id: Date.now(),
                          label: "desk",
                          prefix: k.prefix,
                          created_at: new Date().toISOString(),
                        },
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Page>
    </AccessGate>
  );
}
