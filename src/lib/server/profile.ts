import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Profile } from "@/lib/types";

async function loadProfile(userId: string): Promise<Profile | null> {
  const sql = await getSql();
  const rows = await sql<Profile>`
    select id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
           wallet_address, plan, credits, is_admin, created_at
    from profiles where user_id = ${userId}
  `;
  return rows[0] ?? null;
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const existing = await loadProfile(context.userId);
    if (existing) return existing;
    const sql = await getSql();
    const inserted = await sql<Profile>`
      insert into profiles (user_id, waitlist_status)
      values (${context.userId}, 'pending')
      returning id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
                wallet_address, plan, credits, is_admin, created_at
    `;
    return inserted[0];
  });

export const joinWaitlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { intent: string; note: string; name: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, display_name, waitlist_status, waitlist_intent, waitlist_note)
      values (${context.userId}, ${data.name.trim() || null}, 'approved', ${data.intent}, ${data.note.trim() || null})
      on conflict (user_id) do update set
        display_name = excluded.display_name,
        waitlist_status = 'approved',
        waitlist_intent = excluded.waitlist_intent,
        waitlist_note = excluded.waitlist_note
    `;
    return loadProfile(context.userId);
  });

export const attachWallet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { address: string }) => input)
  .handler(async ({ context, data }) => {
    const address = data.address.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error("Enter a 42-character 0x address.");
    }
    const sql = await getSql();
    await sql`update profiles set wallet_address = ${address.toLowerCase()} where user_id = ${context.userId}`;
    return loadProfile(context.userId);
  });

export const generateWallet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    const address =
      "0x" + [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    const sql = await getSql();
    await sql`update profiles set wallet_address = ${address} where user_id = ${context.userId}`;
    return loadProfile(context.userId);
  });

export async function requireApproved(userId: string): Promise<Profile> {
  const sql = await getSql();
  const rows = await sql<Profile>`
    select id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
           wallet_address, plan, credits, is_admin, created_at
    from profiles where user_id = ${userId}
  `;
  const profile = rows[0];
  if (!profile || profile.waitlist_status !== "approved") {
    const err = new Error("WAITLIST");
    throw err;
  }
  return profile;
}
