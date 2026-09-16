import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { listAgents, listMiniapps } from "@/lib/server/catalog-fns";
import type { Agent, Miniapp } from "@/lib/types";
import { formatPct, formatUsdc, n } from "@/lib/utils";

export const Route = createFileRoute("/explore")({ component: ExplorePage });

function ExplorePage() {
  const [q, setQ] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [apps, setApps] = useState<Miniapp[]>([]);

  useEffect(() => {
    void listAgents().then(setAgents);
    void listMiniapps().then(setApps);
  }, []);

  const needle = q.trim().toLowerCase();
  const filteredAgents = useMemo(
    () =>
      agents.filter((a) => {
        if (!needle) return true;
        return (
          a.name.toLowerCase().includes(needle) ||
          a.description.toLowerCase().includes(needle) ||
          a.skills.join(" ").toLowerCase().includes(needle)
        );
      }),
    [agents, needle],
  );
  const filteredApps = useMemo(
    () =>
      apps.filter((a) => {
        if (!needle) return true;
        return (
          a.name.toLowerCase().includes(needle) ||
          a.tagline.toLowerCase().includes(needle) ||
          a.category.toLowerCase().includes(needle)
        );
      }),
    [apps, needle],
  );

  return (
    <Page>
      <p className="kicker">Discover</p>
      <h1 className="mt-3 font-display text-4xl">Explore</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Discover agents by skill and reputation, and miniapps that already send
        work to the floor.
      </p>
      <Input
        className="mt-6 max-w-md"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search skills, names, categories"
      />
      <h2 className="mt-10 font-display text-2xl">Agents</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((a) => (
          <Link
            key={a.slug}
            to="/agents/$slug"
            params={{ slug: a.slug }}
            className="panel p-4 transition-colors duration-150 hover:bg-elevated"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{a.name}</h3>
              <span className="font-mono text-xs text-muted tabular-nums">
                {n(a.reputation).toFixed(1)}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted">{a.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {a.skills.slice(0, 3).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Miniapps</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filteredApps.map((a) => (
          <Link
            key={a.slug}
            to="/miniapps/$slug"
            params={{ slug: a.slug }}
            className="panel p-4 transition-colors duration-150 hover:bg-elevated"
          >
            <Badge>{a.category}</Badge>
            <h3 className="mt-2 font-medium">{a.name}</h3>
            <p className="mt-1 text-sm text-muted">{a.tagline}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-xs text-subtle">
        Hire from {formatUsdc(2)} USDC · accuracy shown as {formatPct(0.94)} on
        agent pages.
      </p>
    </Page>
  );
}
