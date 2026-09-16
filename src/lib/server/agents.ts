import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { mapAgent } from "@/lib/server/catalog-fns";
import { requireApproved } from "@/lib/server/profile";
import type { Agent } from "@/lib/types";

type AgentRow = Parameters<typeof mapAgent>[0];

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 28);
  return base || "buoy";
}

async function nextToken(sql: Awaited<ReturnType<typeof getSql>>): Promise<number> {
  const rows = await sql<{ m: number }>`select coalesce(max(token_id), 8003) as m from agents`;
  return Number(rows[0]?.m ?? 8003) + 1;
}

function tba(tokenId: number): string {
  const hex = tokenId.toString(16).padStart(8, "0");
  return `0x6551${hex}0000000000000000000000base`;
}

export const listMyAgents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<AgentRow>`
      select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
             skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
             accuracy, status, hire_price_usdc, created_at
      from agents where owner_user_id = ${context.userId}
      order by id desc
    `;
    return rows.map(mapAgent);
  });

export const registerAgent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      description: string;
      endpoint: string;
      skills: string[];
      tools: string[];
      stake: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const profile = await requireApproved(context.userId);
    if (!data.name.trim() || !data.description.trim()) throw new Error("Name and description are required.");
    if (!data.endpoint.trim().startsWith("https://")) throw new Error("Endpoint must be an https URL.");
    const sql = await getSql();
    const tokenId = await nextToken(sql);
    let slug = slugify(data.name);
    const clash = await sql<{ n: number }>`select count(*)::int as n from agents where slug = ${slug}`;
    if (clash[0]?.n) slug = `${slug}-${tokenId}`;
    const stake = Math.max(100, Number(data.stake) || 1000);
    const rows = await sql<AgentRow>`
      insert into agents (
        owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
        skills, capabilities, tools, models, stake_usdc, reputation, hire_price_usdc
      ) values (
        ${context.userId}, ${tokenId}, ${tba(tokenId)}, ${slug}, ${data.name.trim()},
        ${data.description.trim()}, 'hosted', ${data.endpoint.trim()},
        ${JSON.stringify(data.skills)}::jsonb,
        ${JSON.stringify(["network work", "owner tasks"])}::jsonb,
        ${JSON.stringify(data.tools)}::jsonb,
        ${JSON.stringify(["grok-4.5"])}::jsonb,
        ${stake}, 50, 2.50
      )
      returning id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
                skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
                accuracy, status, hire_price_usdc, created_at
    `;
    await sql`
      insert into ledger (user_id, kind, amount_usdc, note)
      values (${context.userId}, 'stake', ${stake}, ${"Stake for " + slug})
    `;
    void profile;
    return mapAgent(rows[0]);
  });

export const createBuoy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      template: string;
      tools: string[];
      skills: string[];
      models: string[];
      description: string;
      stake: number;
      listForHire: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const tokenId = await nextToken(sql);
    let slug = slugify(data.name);
    const clash = await sql<{ n: number }>`select count(*)::int as n from agents where slug = ${slug}`;
    if (clash[0]?.n) slug = `${slug}-${tokenId}`;
    const stake = Math.max(50, Number(data.stake) || 250);
    const desc =
      data.description.trim() ||
      `Buoy assembled from the ${data.template} template. Tools: ${data.tools.join(", ")}.`;
    const rows = await sql<AgentRow>`
      insert into agents (
        owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
        skills, capabilities, tools, models, template, stake_usdc, reputation, hire_price_usdc
      ) values (
        ${context.userId}, ${tokenId}, ${tba(tokenId)}, ${slug}, ${data.name.trim() || "Buoy"},
        ${desc}, 'buoy', ${"https://buoys.sceila.net/" + slug},
        ${JSON.stringify(data.skills)}::jsonb,
        ${JSON.stringify(["owner tasks", "network optional"])}::jsonb,
        ${JSON.stringify(data.tools)}::jsonb,
        ${JSON.stringify(data.models)}::jsonb,
        ${data.template}, ${stake}, 55, 1.50
      )
      returning id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
                skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
                accuracy, status, hire_price_usdc, created_at
    `;
    const agent = mapAgent(rows[0]);
    if (data.listForHire) {
      await sql`
        insert into listings (seller_user_id, agent_id, kind, price_usdc, period, status)
        values (${context.userId}, ${agent.id}, 'hire', ${agent.hire_price_usdc}, 'per-task', 'open')
      `;
    }
    await sql`
      insert into ledger (user_id, kind, amount_usdc, note)
      values (${context.userId}, 'stake', ${stake}, ${"Buoy stake for " + slug})
    `;
    return agent;
  });

export const restakeAgent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { agentId: number; amount: number }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const amount = Math.max(1, Number(data.amount) || 0);
    const sql = await getSql();
    await sql`
      update agents set stake_usdc = stake_usdc + ${amount}
      where id = ${data.agentId} and owner_user_id = ${context.userId}
    `;
    await sql`
      insert into ledger (user_id, kind, amount_usdc, note)
      values (${context.userId}, 'stake', ${amount}, ${"Restake agent " + data.agentId})
    `;
    return { ok: true };
  });
