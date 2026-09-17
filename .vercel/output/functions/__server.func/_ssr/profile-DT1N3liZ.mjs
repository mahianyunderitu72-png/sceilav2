import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-D3KIes5h.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DT1N3liZ.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36"));
var joinWaitlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("62f85298f70c3534763d3abfef08fa74114e45d5d040cb689ac19027ca319364"));
var attachWallet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("50e8dd0e70874cfb9b471016fc219a0876aaa7f32ab9084bbd11a518250195d7"));
var generateWallet = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("cd5d038ffd6961a06412eddfe1a7cd752570dc1c9dcea26994e82502cbd36973"));
async function requireApproved(userId) {
	const profile = (await (await getSql())`
    select id, user_id, display_name, waitlist_status, waitlist_intent, waitlist_note,
           wallet_address, plan, credits, is_admin, created_at
    from profiles where user_id = ${userId}
  `)[0];
	if (!profile || profile.waitlist_status !== "approved") throw /* @__PURE__ */ new Error("WAITLIST");
	return profile;
}
//#endregion
export { joinWaitlist as a, getMyProfile as i, createSsrRpc as n, requireApproved as o, generateWallet as r, attachWallet as t };
