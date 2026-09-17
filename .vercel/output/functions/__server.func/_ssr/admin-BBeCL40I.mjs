import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-D3KIes5h.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
import { o as requireApproved } from "./profile-DT1N3liZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BBeCL40I.js
var adminSnapshot_createServerFn_handler = createServerRpc({
	id: "da460eb32c23131fc6753793b3375fc436f9b8760e89e5cb28f766951dcc4683",
	name: "adminSnapshot",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSnapshot.__executeServer(opts));
var adminSnapshot = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminSnapshot_createServerFn_handler, async ({ context }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	return {
		waitlist: await sql`
      select id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
             wallet_address, plan, credits, is_admin, created_at
      from profiles order by created_at desc limit 40
    `,
		pendingApps: await sql`
      select id, slug, name, tagline, description, category, publisher, price_model, status,
             prompt_hint, consensus_method, submitter_user_id
      from miniapps where status != 'published' order by id desc
    `,
		counts: (await sql`
      select
        (select count(*)::int from agents) as agents,
        (select count(*)::int from tasks) as tasks,
        (select count(*)::int from chats) as chats
    `)[0]
	};
});
var setWaitlistStatus_createServerFn_handler = createServerRpc({
	id: "3421c860c4204c87e83c75803da0e24306e5673b3e72770fa2774cf5ba6a0562",
	name: "setWaitlistStatus",
	filename: "src/lib/server/admin.ts"
}, (opts) => setWaitlistStatus.__executeServer(opts));
var setWaitlistStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setWaitlistStatus_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	await (await getSql())`
      update profiles set waitlist_status = ${data.status} where user_id = ${data.userId}
    `;
	return { ok: true };
});
var submitMiniapp_createServerFn_handler = createServerRpc({
	id: "b834bcfe62c229c66b76b09c8a8853fab30efb645539318e94dd2d21251da565",
	name: "submitMiniapp",
	filename: "src/lib/server/admin.ts"
}, (opts) => submitMiniapp.__executeServer(opts));
var submitMiniapp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(submitMiniapp_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	if (!slug) throw new Error("Pick a slug.");
	await (await getSql())`
      insert into miniapps (
        slug, name, tagline, description, category, publisher, price_model, status,
        prompt_hint, consensus_method, submitter_user_id
      ) values (
        ${slug}, ${data.name.trim()}, ${data.tagline.trim()}, ${data.description.trim()},
        ${data.category.trim() || "General"}, 'Independent', 'usage', 'pending',
        ${data.hint.trim() || "Describe the work."}, ${data.consensus || "evidence"}, ${context.userId}
      )
    `;
	return {
		ok: true,
		slug
	};
});
var publishMiniapp_createServerFn_handler = createServerRpc({
	id: "a94ba99fd2e8eecea596c37f3a6395ed5844da65b17b794f6f6b026c6950be8b",
	name: "publishMiniapp",
	filename: "src/lib/server/admin.ts"
}, (opts) => publishMiniapp.__executeServer(opts));
var publishMiniapp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(publishMiniapp_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	await (await getSql())`update miniapps set status = 'published' where id = ${data.id}`;
	return { ok: true };
});
var addLesson_createServerFn_handler = createServerRpc({
	id: "12fe6cedad94fd129f5bd564416915fd9ca5c7f56dc16aab86bf5b29391bbdbe",
	name: "addLesson",
	filename: "src/lib/server/admin.ts"
}, (opts) => addLesson.__executeServer(opts));
var addLesson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addLesson_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
	const sql = await getSql();
	const order = await sql`select coalesce(max(sort_order), 0) as m from lessons`;
	await sql`
      insert into lessons (slug, title, summary, body, sort_order, published)
      values (
        ${slug || "lesson"}, ${data.title.trim()}, ${data.summary.trim()},
        ${data.body.trim()}, ${(order[0]?.m ?? 0) + 1}, true
      )
    `;
	return { ok: true };
});
//#endregion
export { addLesson_createServerFn_handler, adminSnapshot_createServerFn_handler, publishMiniapp_createServerFn_handler, setWaitlistStatus_createServerFn_handler, submitMiniapp_createServerFn_handler };
