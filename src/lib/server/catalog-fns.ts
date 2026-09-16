import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { asStringArray } from "@/lib/server/parse";
import type { Agent, Lesson, Listing, Miniapp, NewsPost, Proposal } from "@/lib/types";

type AgentRow = Omit<Agent, "skills" | "capabilities" | "tools" | "models"> & {
  skills: unknown;
  capabilities: unknown;
  tools: unknown;
  models: unknown;
};

export function mapAgent(row: AgentRow): Agent {
  return {
    ...row,
    skills: asStringArray(row.skills),
    capabilities: asStringArray(row.capabilities),
    tools: asStringArray(row.tools),
    models: asStringArray(row.models),
  };
}

export const listAgents = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<AgentRow>`
    select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
           skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
           accuracy, status, hire_price_usdc, created_at
    from agents
    where status = 'active'
    order by reputation desc
  `;
  return rows.map(mapAgent);
});

export const getAgentBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<AgentRow>`
      select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
             skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
             accuracy, status, hire_price_usdc, created_at
      from agents where slug = ${slug}
    `;
    return rows[0] ? mapAgent(rows[0]) : null;
  });

export const listMiniapps = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<Miniapp>`
    select id, slug, name, tagline, description, category, publisher, price_model, status,
           prompt_hint, consensus_method, submitter_user_id
    from miniapps
    where status = 'published'
    order by id
  `;
});

export const getMiniapp = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<Miniapp>`
      select id, slug, name, tagline, description, category, publisher, price_model, status,
             prompt_hint, consensus_method, submitter_user_id
      from miniapps where slug = ${slug}
    `;
    return rows[0] ?? null;
  });

export const listListings = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<Listing>`
    select l.id, l.seller_user_id, l.agent_id, l.kind, l.price_usdc, l.period, l.status,
           l.buyer_user_id, l.created_at, a.name as agent_name, a.slug as agent_slug,
           a.description as agent_description, a.reputation
    from listings l
    join agents a on a.id = l.agent_id
    where l.status = 'open'
    order by l.kind, l.price_usdc
  `;
});

export const listLessons = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<Lesson>`
    select id, slug, title, summary, body, sort_order
    from lessons where published = true
    order by sort_order
  `;
});

export const getLesson = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<Lesson>`
      select id, slug, title, summary, body, sort_order
      from lessons where slug = ${slug} and published = true
    `;
    return rows[0] ?? null;
  });

export const listNews = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<NewsPost>`
    select id, slug, title, kicker, body, published_at
    from news order by published_at desc
  `;
});

export const getNews = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    const rows = await sql<NewsPost>`
      select id, slug, title, kicker, body, published_at
      from news where slug = ${slug}
    `;
    return rows[0] ?? null;
  });

export const listProposals = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  return sql<Proposal>`
    select id, title, body, status, votes_for, votes_against, created_at
    from proposals order by id
  `;
});
