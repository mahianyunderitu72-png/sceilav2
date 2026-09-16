import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-CuzAb3Pn.mjs";
import { t as authMiddleware } from "./middleware-BOQMsh2Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Cft2ZPB-.js
async function loadProfile(userId) {
	return (await (await getSql())`
    select id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
           wallet_address, plan, credits, is_admin, created_at
    from profiles where user_id = ${userId}
  `)[0] ?? null;
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36",
	name: "getMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const existing = await loadProfile(context.userId);
	if (existing) return existing;
	return (await (await getSql())`
      insert into profiles (user_id, waitlist_status)
      values (${context.userId}, 'pending')
      returning id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
                wallet_address, plan, credits, is_admin, created_at
    `)[0];
});
var joinWaitlist_createServerFn_handler = createServerRpc({
	id: "62f85298f70c3534763d3abfef08fa74114e45d5d040cb689ac19027ca319364",
	name: "joinWaitlist",
	filename: "src/lib/server/profile.ts"
}, (opts) => joinWaitlist.__executeServer(opts));
var joinWaitlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(joinWaitlist_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
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
var attachWallet_createServerFn_handler = createServerRpc({
	id: "50e8dd0e70874cfb9b471016fc219a0876aaa7f32ab9084bbd11a518250195d7",
	name: "attachWallet",
	filename: "src/lib/server/profile.ts"
}, (opts) => attachWallet.__executeServer(opts));
var attachWallet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(attachWallet_createServerFn_handler, async ({ context, data }) => {
	const address = data.address.trim();
	if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new Error("Enter a 42-character 0x address.");
	await (await getSql())`update profiles set wallet_address = ${address.toLowerCase()} where user_id = ${context.userId}`;
	return loadProfile(context.userId);
});
var generateWallet_createServerFn_handler = createServerRpc({
	id: "cd5d038ffd6961a06412eddfe1a7cd752570dc1c9dcea26994e82502cbd36973",
	name: "generateWallet",
	filename: "src/lib/server/profile.ts"
}, (opts) => generateWallet.__executeServer(opts));
var generateWallet = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(generateWallet_createServerFn_handler, async ({ context }) => {
	const address = "0x" + [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(20))].map((b) => b.toString(16).padStart(2, "0")).join("");
	await (await getSql())`update profiles set wallet_address = ${address} where user_id = ${context.userId}`;
	return loadProfile(context.userId);
});
//#endregion
export { attachWallet_createServerFn_handler, generateWallet_createServerFn_handler, getMyProfile_createServerFn_handler, joinWaitlist_createServerFn_handler };
