import { Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArenaCard, ArenaPending } from "@/components/arena";
import { AccessGate, Page } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { getChat, listMyChats, listMyProjects, sendChat, createProject } from "@/lib/server/chat";
import { getTaskArena } from "@/lib/server/orchestrate";
import { getMyProfile } from "@/lib/server/profile";
import type { ArenaResult, Chat, Message, Profile, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChatDesk({ activeId }: { activeId?: number }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [arenas, setArenas] = useState<Record<number, ArenaResult>>({});
  const [prompt, setPrompt] = useState("");
  const [projectId, setProjectId] = useState<number | undefined>();
  const [preference, setPreference] = useState<"quality" | "cost">("quality");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [projName, setProjName] = useState("");
  const [projInstr, setProjInstr] = useState("");
  const [showProj, setShowProj] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void getMyProfile()
      .then((p) => {
        setProfile(p);
        setReady(true);
      })
      .catch(() => setReady(true));
    void listMyChats()
      .then(setChats)
      .catch(() => setChats([]));
    void listMyProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    void getChat({ data: activeId })
      .then((res) => {
        if (!res) return;
        setMessages(res.messages);
        for (const m of res.messages) {
          if (m.task_id && !arenas[m.task_id]) {
            void getTaskArena({ data: m.task_id }).then((a) => {
              if (a) setArenas((prev) => ({ ...prev, [a.task.id]: a }));
            });
          }
        }
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const title = useMemo(
    () => chats.find((c) => c.id === activeId)?.title ?? "New bearing",
    [chats, activeId],
  );

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError(null);
    setStage(0);
    const tick = window.setInterval(() => setStage((s) => Math.min(s + 1, 3)), 900);
    try {
      const res = await sendChat({
        data: {
          prompt: prompt.trim(),
          chatId: activeId,
          projectId,
          preference,
        },
      });
      window.clearInterval(tick);
      setPrompt("");
      setMessages(res.messages);
      setArenas((prev) => ({ ...prev, [res.arena.task.id]: res.arena }));
      setChats((prev) => {
        const rest = prev.filter((c) => c.id !== res.chat.id);
        return [res.chat, ...rest];
      });
      if (!activeId) {
        void navigate({ to: "/chat/$id", params: { id: String(res.chat.id) } });
      }
    } catch (err) {
      window.clearInterval(tick);
      const msg = err instanceof Error ? err.message : "The arena could not open.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function onProject(e: React.FormEvent) {
    e.preventDefault();
    const p = await createProject({ data: { name: projName, instructions: projInstr } });
    setProjects((prev) => [p, ...prev]);
    setProjectId(p.id);
    setShowProj(false);
    setProjName("");
    setProjInstr("");
  }

  return (
    <AccessGate profileStatus={profile?.waitlist_status} ready={ready}>
      <div className="mx-auto grid min-h-[calc(100dvh-8rem)] max-w-7xl gap-0 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-border md:block">
          <div className="flex items-center justify-between px-4 py-4">
            <p className="font-mono text-xs tracking-widest text-muted uppercase">Desk</p>
            <Link to="/chat">
              <Button size="xs" variant="ghost">
                <Plus className="size-4" />
                New
              </Button>
            </Link>
          </div>
          <div className="px-3 pb-3">
            <p className="px-1 text-xs text-subtle">Projects</p>
            <button
              type="button"
              className="mt-1 min-h-11 w-full rounded-md px-2 py-2 text-left text-sm text-muted hover:text-fg"
              onClick={() => setShowProj((v) => !v)}
            >
              New project
            </button>
            {showProj ? (
              <form onSubmit={onProject} className="mt-2 grid gap-2">
                <Input
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="Desk name"
                />
                <Textarea
                  className="min-h-20"
                  value={projInstr}
                  onChange={(e) => setProjInstr(e.target.value)}
                  placeholder="Standing instructions"
                />
                <Button type="submit" size="sm">
                  Save
                </Button>
              </form>
            ) : null}
            <ul className="mt-1">
              {projects.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setProjectId(p.id)}
                    className={cn(
                      "min-h-11 w-full truncate rounded-md px-2 py-2 text-left text-sm",
                      projectId === p.id ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-3 pb-6">
            <p className="px-1 text-xs text-subtle">History</p>
            <ul className="mt-1">
              {chats.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/chat/$id"
                    params={{ id: String(c.id) }}
                    className={cn(
                      "block truncate rounded-md px-2 py-3 text-sm",
                      activeId === c.id ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <section className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div>
              <p className="font-display text-lg">{title}</p>
              <p className="text-xs text-subtle">
                {preference === "quality" ? "Quality route" : "Cost route"}
                {projectId ? " · project attached" : ""}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                size="xs"
                variant={preference === "quality" ? "secondary" : "ghost"}
                onClick={() => setPreference("quality")}
              >
                Quality
              </Button>
              <Button
                size="xs"
                variant={preference === "cost" ? "secondary" : "ghost"}
                onClick={() => setPreference("cost")}
              >
                Cost
              </Button>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
            {messages.length === 0 && !busy ? (
              <div className="mx-auto max-w-lg py-12 text-center">
                <h2 className="font-display text-3xl">Take a bearing</h2>
                <p className="mt-2 text-sm text-muted">
                  Ask anything. The orchestrator will classify the task, recruit
                  three agents, seat a referee, and settle a consensus.
                </p>
              </div>
            ) : null}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "ml-auto max-w-xl" : "max-w-3xl"}>
                {m.role === "user" ? (
                  <div className="rounded-lg border border-border bg-elevated px-4 py-3 text-sm">
                    {m.content}
                  </div>
                ) : m.task_id && arenas[m.task_id] ? (
                  <ArenaCard arena={arenas[m.task_id]} />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                )}
              </div>
            ))}
            {busy ? <ArenaPending stage={stage} /> : null}
          </div>
          <form onSubmit={onSend} className="border-t border-border p-4 sm:p-6">
            <div className="panel p-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you need done?"
                className="min-h-20 border-0 bg-transparent focus-visible:ring-0"
                disabled={busy}
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <p className="text-xs text-subtle">One credit per arena</p>
                <Button type="submit" disabled={busy || !prompt.trim()}>
                  {busy ? "Recruiting" : "Send"}
                </Button>
              </div>
            </div>
            {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          </form>
        </section>
      </div>
    </AccessGate>
  );
}

export function ChatFallback() {
  return (
    <Page>
      <div className="h-64 animate-pulse rounded-lg bg-surface" />
    </Page>
  );
}
