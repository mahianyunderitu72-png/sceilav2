import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MiniappIcon } from "@/components/miniapp-icon";
import { Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { listMiniapps } from "@/lib/server/catalog-fns";
import type { Miniapp } from "@/lib/types";

export const Route = createFileRoute("/miniapps/")({ component: MiniappsIndex });

function MiniappsIndex() {
  const [apps, setApps] = useState<Miniapp[]>([]);
  useEffect(() => {
    void listMiniapps().then(setApps);
  }, []);
  return (
    <Page>
      <p className="kicker">Demand</p>
      <h1 className="mt-3 font-display text-4xl">Miniapps</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Specialized applications that send real work to Sceila agents and buoys.
        Each one is built and owned by its developer. They are the demand side of
        the protocol — accounting desks, studios, tutoring rooms, ERP floors.
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <Link
            key={app.slug}
            to="/miniapps/$slug"
            params={{ slug: app.slug }}
            className="panel p-5 transition-colors duration-150 hover:bg-elevated"
          >
            <div className="flex items-center justify-between">
              <MiniappIcon slug={app.slug} className="size-5 text-accent" />
              <Badge>{app.category}</Badge>
            </div>
            <h2 className="mt-4 font-display text-2xl">{app.name}</h2>
            <p className="mt-1 text-sm text-fg">{app.tagline}</p>
            <p className="mt-3 line-clamp-3 text-sm text-muted">{app.description}</p>
            <p className="mt-4 text-xs text-subtle">
              {app.publisher} · {app.price_model}
            </p>
          </Link>
        ))}
      </div>
    </Page>
  );
}
