import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireApproved } from "@/lib/server/profile";
import type { Miniapp, Profile } from "@/lib/types";

export const adminSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const waitlist = await sql<Profile>`
      select id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
             wallet_address, plan, credits, is_admin, created_at
      from profiles order by created_at desc limit 40
    `;
    const pendingApps = await sql<Miniapp>`
      select id, slug, name, tagline, description, category, publisher, price_model, status,
             prompt_hint, consensus_method, submitter_user_id
      from miniapps where status != 'published' order by id desc
    `;
    const counts = await sql<{ agents: number; tasks: number; chats: number }>`
      select
        (select count(*)::int from agents) as agents,
        (select count(*)::int from tasks) as tasks,
        (select count(*)::int from chats) as chats
    `;
    return { waitlist, pendingApps, counts: counts[0] };
  });

export const setWaitlistStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; status: "pending" | "approved" }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    await sql`
      update profiles set waitlist_status = ${data.status} where user_id = ${data.userId}
    `;
    return { ok: true as const };
  });

export const submitMiniapp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      slug: string;
      tagline: string;
      description: string;
      category: string;
      consensus: string;
      hint: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const slug = data.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) throw new Error("Pick a slug.");
    const sql = await getSql();
    await sql`
      insert into miniapps (
        slug, name, tagline, description, category, publisher, price_model, status,
        prompt_hint, consensus_method, submitter_user_id
      ) values (
        ${slug}, ${data.name.trim()}, ${data.tagline.trim()}, ${data.description.trim()},
        ${data.category.trim() || "General"}, 'Independent', 'usage', 'pending',
        ${data.hint.trim() || "Describe the work."}, ${data.consensus || "evidence"}, ${context.userId}
      )
    `;
    return { ok: true as const, slug };
  });

export const publishMiniapp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    await sql`update miniapps set status = 'published' where id = ${data.id}`;
    return { ok: true as const };
  });

export const addLesson = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; summary: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const sql = await getSql();
    const order = await sql<{ m: number }>`select coalesce(max(sort_order), 0) as m from lessons`;
    await sql`
      insert into lessons (slug, title, summary, body, sort_order, published)
      values (
        ${slug || "lesson"}, ${data.title.trim()}, ${data.summary.trim()},
        ${data.body.trim()}, ${(order[0]?.m ?? 0) + 1}, true
      )
    `;
    return { ok: true as const };
  });
