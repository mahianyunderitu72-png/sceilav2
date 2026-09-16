import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AccessGate, Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";
import { addLesson, adminSnapshot, publishMiniapp, setWaitlistStatus, submitMiniapp } from "@/lib/server/admin";
import type { Miniapp, Profile } from "@/lib/types";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { profile, ready } = useProfile();
  const [waitlist, setWaitlist] = useState<Profile[]>([]);
  const [pending, setPending] = useState<Miniapp[]>([]);
  const [counts, setCounts] = useState<{ agents: number; tasks: number; chats: number } | null>(null);
  const [app, setApp] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    category: "General",
    consensus: "evidence",
    hint: "",
  });
  const [lesson, setLesson] = useState({ title: "", summary: "", body: "" });
  const [note, setNote] = useState<string | null>(null);

  function refresh() {
    void adminSnapshot().then((s) => {
      setWaitlist(s.waitlist);
      setPending(s.pendingApps);
      setCounts(s.counts);
    });
  }

  useEffect(() => {
    if (profile?.waitlist_status === "approved") refresh();
  }, [profile]);

  return (
    <AccessGate profileStatus={profile?.waitlist_status} ready={ready}>
      <Page>
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Ops</p>
        <h1 className="mt-2 font-display text-4xl">Protocol ops</h1>
        <p className="mt-2 text-sm text-muted">
          Waitlist, miniapp intake, and academy lessons. Testnet lets every
          approved sailor see the desk.
        </p>
        {counts ? (
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
              <dt className="text-xs text-muted">Agents</dt>
              <dd className="font-display text-2xl tabular-nums">{counts.agents}</dd>
            </div>
            <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
              <dt className="text-xs text-muted">Tasks</dt>
              <dd className="font-display text-2xl tabular-nums">{counts.tasks}</dd>
            </div>
            <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
              <dt className="text-xs text-muted">Chats</dt>
              <dd className="font-display text-2xl tabular-nums">{counts.chats}</dd>
            </div>
          </dl>
        ) : null}

        {note ? <p className="mt-4 text-sm text-muted">{note}</p> : null}

        <h2 className="mt-10 font-display text-2xl">Waitlist</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-subtle">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Intent</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2"> </th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((w) => (
                <tr key={w.id} className="border-t border-border">
                  <td className="py-3 pr-4">{w.display_name ?? w.user_id.slice(0, 8)}</td>
                  <td className="py-3 pr-4 text-muted">{w.waitlist_intent ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={w.waitlist_status === "approved" ? "ok" : "warn"}>
                      {w.waitlist_status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const next = w.waitlist_status === "approved" ? "pending" : "approved";
                        void setWaitlistStatus({ data: { userId: w.user_id, status: next } }).then(refresh);
                      }}
                    >
                      Toggle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-display text-2xl">Pending miniapps</h2>
        <div className="mt-3 grid gap-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted">No pending submissions.</p>
          ) : (
            pending.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-border)]"
              >
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted">{m.tagline}</p>
                </div>
                <Button size="sm" onClick={() => void publishMiniapp({ data: { id: m.id } }).then(refresh)}>
                  Publish
                </Button>
              </div>
            ))
          )}
        </div>

        <h2 className="mt-10 font-display text-2xl">Submit a miniapp</h2>
        <form
          className="mt-3 grid max-w-lg gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void submitMiniapp({ data: app })
              .then(() => {
                setNote("Submitted for review.");
                refresh();
              })
              .catch((err) => setNote(err instanceof Error ? err.message : "Failed"));
          }}
        >
          <Input placeholder="Name" value={app.name} onChange={(e) => setApp({ ...app, name: e.target.value })} />
          <Input placeholder="slug" value={app.slug} onChange={(e) => setApp({ ...app, slug: e.target.value })} />
          <Input placeholder="Tagline" value={app.tagline} onChange={(e) => setApp({ ...app, tagline: e.target.value })} />
          <Textarea
            placeholder="Description"
            value={app.description}
            onChange={(e) => setApp({ ...app, description: e.target.value })}
          />
          <Button type="submit" size="sm">
            Submit
          </Button>
        </form>

        <h2 className="mt-10 font-display text-2xl">New academy lesson</h2>
        <form
          className="mt-3 grid max-w-lg gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void addLesson({ data: lesson }).then(() => setNote("Lesson published."));
          }}
        >
          <Input
            placeholder="Title"
            value={lesson.title}
            onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
          />
          <Input
            placeholder="Summary"
            value={lesson.summary}
            onChange={(e) => setLesson({ ...lesson, summary: e.target.value })}
          />
          <Textarea
            placeholder="Body"
            value={lesson.body}
            onChange={(e) => setLesson({ ...lesson, body: e.target.value })}
          />
          <Button type="submit" size="sm" variant="secondary">
            Publish lesson
          </Button>
        </form>
      </Page>
    </AccessGate>
  );
}
