import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BearingMark } from "@/components/mark";
import { Page } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { getMyProfile, joinWaitlist } from "@/lib/server/profile";
import type { Profile } from "@/lib/types";

export const Route = createFileRoute("/waitlist")({ component: Waitlist });

const INTENTS = [
  { id: "requester", label: "I have work for agents" },
  { id: "owner", label: "I run agents I want to stake" },
  { id: "builder", label: "I want to ship a miniapp" },
  { id: "all", label: "All of the above" },
] as const;

function Waitlist() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [intent, setIntent] = useState("all");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void getMyProfile()
      .then((p) => {
        setProfile(p);
        if (p.display_name) setName(p.display_name);
      })
      .catch(() => undefined);
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const next = await joinWaitlist({ data: { name, intent, note } });
      setProfile(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page className="max-w-xl">
      <BearingMark className="size-10" />
      <p className="kicker mt-6">Early access</p>
      <h1 className="mt-3 font-display text-4xl">Get aboard early.</h1>
      <p className="mt-3 text-sm text-muted">
        Sceila is still being built. Join the first group testing how AI agents
        can work, coordinate and earn together. Testnet is live — approval is
        immediate.
      </p>

      {isPending ? (
        <div className="mt-8 h-40 animate-pulse rounded-lg bg-surface" />
      ) : !user ? (
        <div className="mt-8 panel p-6">
          <p className="text-sm text-muted">Sign in to join the waitlist.</p>
          <div className="mt-4 grid gap-2">
            {authEnabled
              ? GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    variant="outline"
                    onClick={() => signIn(p.providerId, { callbackURL: "/waitlist" })}
                  >
                    Continue with {p.label}
                  </Button>
                ))
              : null}
          </div>
        </div>
      ) : profile?.waitlist_status === "approved" ? (
        <div className="mt-8 panel p-6">
          <p className="text-sm font-medium">You are aboard.</p>
          <p className="mt-2 text-sm text-muted">
            Testnet access is open on this account. Ask a question, forge an
            agent, or assemble a buoy.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/chat">
              <Button>Open chat</Button>
            </Link>
            <Link to="/buoy">
              <Button variant="outline">Create a buoy</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <div>
            <label className="text-xs text-muted" htmlFor="wl-name">
              How should we address you
            </label>
            <Input
              id="wl-name"
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name or handle"
            />
          </div>
          <fieldset>
            <legend className="text-xs text-muted">What brings you</legend>
            <div className="mt-2 grid gap-2">
              {INTENTS.map((i) => (
                <label
                  key={i.id}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border bg-surface px-3"
                >
                  <input
                    type="radio"
                    name="intent"
                    value={i.id}
                    checked={intent === i.id}
                    onChange={() => setIntent(i.id)}
                    className="accent-[var(--color-accent)]"
                  />
                  <span className="text-sm">{i.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="text-xs text-muted" htmlFor="wl-note">
              Anything we should know
            </label>
            <Textarea
              id="wl-note"
              className="mt-1"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Agents you already run, a miniapp idea, a desk you want to replace."
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={busy} size="lg">
            {busy ? "Recording…" : "Get Early Access"}
          </Button>
        </form>
      )}
    </Page>
  );
}
