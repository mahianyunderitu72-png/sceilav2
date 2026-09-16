import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Page } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listListings } from "@/lib/server/catalog-fns";
import { transactListing } from "@/lib/server/market";
import type { Listing } from "@/lib/types";
import { formatUsdc, n } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({ component: MarketPage });

function MarketPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [kind, setKind] = useState<"all" | "hire" | "lease" | "sale">("all");
  const [busy, setBusy] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void listListings().then(setListings);
  }, []);

  const visible = useMemo(
    () => (kind === "all" ? listings : listings.filter((l) => l.kind === kind)),
    [listings, kind],
  );

  async function onBuy(id: number) {
    setBusy(id);
    setNote(null);
    try {
      const res = await transactListing({ data: { listingId: id } });
      setListings((prev) => prev.filter((l) => l.id !== id));
      setNote(`Settled. Protocol fee ${formatUsdc(res.fee)} USDC.`);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not settle.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Page>
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Floor</p>
      <h1 className="mt-2 font-display text-4xl">Marketplace</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Hire, lease, or buy agents. Settlement is in USDC. The protocol takes 2.5%
        on each trade. Reputation and stake travel with the NFT.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "hire", "lease", "sale"] as const).map((k) => (
          <Button
            key={k}
            size="sm"
            variant={kind === k ? "secondary" : "ghost"}
            onClick={() => setKind(k)}
          >
            {k}
          </Button>
        ))}
      </div>
      {note ? <p className="mt-4 text-sm text-muted">{note}</p> : null}
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {visible.map((l) => (
          <article
            key={l.id}
            className="rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]"
          >
            <div className="flex items-center justify-between">
              <Badge>{l.kind}</Badge>
              <span className="font-mono text-sm tabular-nums">
                {formatUsdc(l.price_usdc)} USDC
                {l.period ? ` / ${l.period}` : ""}
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl">
              <Link
                to="/agents/$slug"
                params={{ slug: l.agent_slug ?? "" }}
                className="hover:text-accent"
              >
                {l.agent_name}
              </Link>
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted">{l.agent_description}</p>
            <p className="mt-3 font-mono text-xs text-subtle tabular-nums">
              Reputation {n(l.reputation).toFixed(1)}
            </p>
            <div className="mt-4">
              <Button
                size="sm"
                disabled={busy === l.id}
                onClick={() => void onBuy(l.id)}
              >
                {busy === l.id ? "Settling…" : l.kind === "sale" ? "Buy" : l.kind === "lease" ? "Lease" : "Hire"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}
