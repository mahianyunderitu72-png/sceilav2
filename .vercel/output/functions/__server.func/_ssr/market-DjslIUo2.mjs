import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-CuzAb3Pn.mjs";
import { t as authMiddleware } from "./middleware-BOQMsh2Y.mjs";
import { a as requireApproved } from "./profile-BZGV6Lgo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-DjslIUo2.js
var transactListing_createServerFn_handler = createServerRpc({
	id: "e89078337f70e76e43bd593ceb716748e4dc73935391ee2b85f4c511763a11bd",
	name: "transactListing",
	filename: "src/lib/server/market.ts"
}, (opts) => transactListing.__executeServer(opts));
var transactListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(transactListing_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	const listing = (await sql`
      select id, seller_user_id, agent_id, kind, price_usdc, period, status, buyer_user_id, created_at
      from listings where id = ${data.listingId}
    `)[0];
	if (!listing || listing.status !== "open") throw new Error("Listing is no longer open.");
	if (listing.seller_user_id === context.userId) throw new Error("You already hold this listing.");
	const fee = +(Number(listing.price_usdc) * .025).toFixed(2);
	if (listing.kind === "sale") {
		await sql`
        update listings set status = 'sold', buyer_user_id = ${context.userId} where id = ${listing.id}
      `;
		await sql`
        update agents set owner_user_id = ${context.userId} where id = ${listing.agent_id}
      `;
	} else await sql`
        update listings set status = ${listing.kind === "lease" ? "leased" : "hired"},
          buyer_user_id = ${context.userId}
        where id = ${listing.id}
      `;
	await sql`
      insert into ledger (user_id, kind, amount_usdc, note)
      values (
        ${context.userId},
        'purchase',
        ${Number(listing.price_usdc) + fee},
        ${listing.kind + " listing #" + listing.id + " (incl. 2.5% protocol fee)"}
      )
    `;
	return {
		ok: true,
		fee
	};
});
var listMyLedger_createServerFn_handler = createServerRpc({
	id: "3ec08173b851079d122f2df5bdec5258de6e7ec441592dbe30d86a5674426c6a",
	name: "listMyLedger",
	filename: "src/lib/server/market.ts"
}, (opts) => listMyLedger.__executeServer(opts));
var listMyLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyLedger_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, user_id, kind, amount_usdc, note, created_at
      from ledger where user_id = ${context.userId}
      order by id desc
      limit 40
    `;
});
var listMyTasks_createServerFn_handler = createServerRpc({
	id: "21ab2199020cbc28030dd8fbeb0b88bfa722c4e57112c17c2ba3b5253917f99e",
	name: "listMyTasks",
	filename: "src/lib/server/market.ts"
}, (opts) => listMyTasks.__executeServer(opts));
var listMyTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyTasks_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, source, miniapp_slug, prompt, classification, consensus_method, status,
             confidence, agreement, reward_usdc, created_at
      from tasks where user_id = ${context.userId}
      order by id desc
      limit 40
    `;
});
var voteProposal_createServerFn_handler = createServerRpc({
	id: "b3dd73a695b18ecde66512c39ce972502548b886b7829ab81dc78fa91375b080",
	name: "voteProposal",
	filename: "src/lib/server/market.ts"
}, (opts) => voteProposal.__executeServer(opts));
var voteProposal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(voteProposal_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	if ((await sql`
      select choice from votes where proposal_id = ${data.proposalId} and user_id = ${context.userId}
    `)[0]) throw new Error("You already voted on this proposal.");
	await sql`
      insert into votes (proposal_id, user_id, choice)
      values (${data.proposalId}, ${context.userId}, ${data.choice})
    `;
	if (data.choice === "for") await sql`update proposals set votes_for = votes_for + 1 where id = ${data.proposalId}`;
	else await sql`update proposals set votes_against = votes_against + 1 where id = ${data.proposalId}`;
	return { ok: true };
});
var changePlan_createServerFn_handler = createServerRpc({
	id: "ea07c7fe35ccd893de5be19bf2f16afdc3e698f40e6e47df51dc5e9dd5030c86",
	name: "changePlan",
	filename: "src/lib/server/market.ts"
}, (opts) => changePlan.__executeServer(opts));
var changePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(changePlan_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const credits = data.plan === "studio" ? 1e3 : data.plan === "pro" ? 200 : 25;
	await (await getSql())`
      update profiles set plan = ${data.plan}, credits = ${credits}
      where user_id = ${context.userId}
    `;
	return {
		ok: true,
		credits
	};
});
var issueApiKey_createServerFn_handler = createServerRpc({
	id: "59119985d8a54b9241c8248344ca5887ce198c2f8bcd821f34aa65cc820d3a13",
	name: "issueApiKey",
	filename: "src/lib/server/market.ts"
}, (opts) => issueApiKey.__executeServer(opts));
var issueApiKey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(issueApiKey_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const rand = [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(12))].map((b) => b.toString(16).padStart(2, "0")).join("");
	const prefix = `sk_live_${rand.slice(0, 8)}`;
	const full = `sk_live_${rand}`;
	await (await getSql())`
      insert into api_keys (user_id, label, prefix)
      values (${context.userId}, ${data.label.trim() || "default"}, ${prefix})
    `;
	return {
		prefix,
		full
	};
});
var listApiKeys_createServerFn_handler = createServerRpc({
	id: "99851023b2539f5a39f7e26b067719b1a9a53b9f6a660f19d646cb32d0ec7219",
	name: "listApiKeys",
	filename: "src/lib/server/market.ts"
}, (opts) => listApiKeys.__executeServer(opts));
var listApiKeys = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listApiKeys_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, label, prefix, created_at from api_keys
      where user_id = ${context.userId}
      order by id desc
    `;
});
//#endregion
export { changePlan_createServerFn_handler, issueApiKey_createServerFn_handler, listApiKeys_createServerFn_handler, listMyLedger_createServerFn_handler, listMyTasks_createServerFn_handler, transactListing_createServerFn_handler, voteProposal_createServerFn_handler };
