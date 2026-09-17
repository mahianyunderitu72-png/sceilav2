import { createHash } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireApproved } from "@/lib/server/profile";
import type { LedgerRow, Listing } from "@/lib/types";

export const transactListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { listingId: number }) => input)
  .handler(async ({ context, data }) => {
    const profile = await requireApproved(context.userId);
    const sql = await getSql();
    const rows = await sql<Listing>`
      select id, seller_user_id, agent_id, kind, price_usdc, period, status, buyer_user_id, created_at
      from listings where id = ${data.listingId}
    `;
    const listing = rows[0];
    if (!listing || listing.status !== "open") throw new Error("Listing is no longer open.");
    if (listing.seller_user_id === context.userId) throw new Error("You already hold this listing.");

    const fee = +(Number(listing.price_usdc) * 0.025).toFixed(2);
    if (listing.kind === "sale") {
      await sql`
        update listings set status = 'sold', buyer_user_id = ${context.userId} where id = ${listing.id}
      `;
      await sql`
        update agents set owner_user_id = ${context.userId} where id = ${listing.agent_id}
      `;
    } else {
      await sql`
        update listings set status = ${listing.kind === "lease" ? "leased" : "hired"},
          buyer_user_id = ${context.userId}
        where id = ${listing.id}
      `;
    }
    await sql`
      insert into ledger (user_id, kind, amount_usdc, note)
      values (
        ${context.userId},
        'purchase',
        ${Number(listing.price_usdc) + fee},
        ${listing.kind + " listing #" + listing.id + " (incl. 2.5% protocol fee)"}
      )
    `;
    void profile;
    return { ok: true as const, fee };
  });

export const listMyLedger = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<LedgerRow>`
      select id, user_id, kind, amount_usdc, note, created_at
      from ledger where user_id = ${context.userId}
      order by id desc
      limit 40
    `;
  });

export type TaskRow = {
  id: number;
  source: string;
  miniapp_slug: string | null;
  prompt: string;
  classification: string | null;
  consensus_method: string | null;
  status: string;
  confidence: string | null;
  agreement: string | null;
  reward_usdc: string;
  created_at: string;
};

export const listMyTasks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<TaskRow>`
      select id, source, miniapp_slug, prompt, classification, consensus_method, status,
             confidence, agreement, reward_usdc, created_at
      from tasks where user_id = ${context.userId}
      order by id desc
      limit 40
    `;
  });

export const voteProposal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { proposalId: number; choice: "for" | "against" }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const existing = await sql<{ choice: string }>`
      select choice from votes where proposal_id = ${data.proposalId} and user_id = ${context.userId}
    `;
    if (existing[0]) throw new Error("You already voted on this proposal.");
    await sql`
      insert into votes (proposal_id, user_id, choice)
      values (${data.proposalId}, ${context.userId}, ${data.choice})
    `;
    if (data.choice === "for") {
      await sql`update proposals set votes_for = votes_for + 1 where id = ${data.proposalId}`;
    } else {
      await sql`update proposals set votes_against = votes_against + 1 where id = ${data.proposalId}`;
    }
    return { ok: true as const };
  });

export const changePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { plan: string }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const credits = data.plan === "studio" ? 1000 : data.plan === "pro" ? 200 : 25;
    const sql = await getSql();
    await sql`
      update profiles set plan = ${data.plan}, credits = ${credits}
      where user_id = ${context.userId}
    `;
    return { ok: true as const, credits };
  });

export const issueApiKey = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { label: string }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const rand = [...crypto.getRandomValues(new Uint8Array(12))]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const prefix = `sk_live_${rand.slice(0, 8)}`;
    const full = `sk_live_${rand}`;
    const keyHash = createHash("sha256").update(full).digest("hex");
    const sql = await getSql();
    await sql`
      insert into api_keys (user_id, label, prefix, key_hash)
      values (${context.userId}, ${data.label.trim() || "default"}, ${prefix}, ${keyHash})
    `;
    return { prefix, full };
  });

export const listApiKeys = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ id: number; label: string; prefix: string; created_at: string }>`
      select id, label, prefix, created_at from api_keys
      where user_id = ${context.userId}
      order by id desc
    `;
  });
