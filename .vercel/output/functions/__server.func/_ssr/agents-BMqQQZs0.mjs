import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-D3KIes5h.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
import { o as requireApproved } from "./profile-DT1N3liZ.mjs";
import { d as mapAgent } from "./catalog-fns-CPd_Am5k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-BMqQQZs0.js
function slugify(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "buoy";
}
async function nextToken(sql) {
	const rows = await sql`select coalesce(max(token_id), 8003) as m from agents`;
	return Number(rows[0]?.m ?? 8003) + 1;
}
function tba(tokenId) {
	return `0x6551${tokenId.toString(16).padStart(8, "0")}0000000000000000000000base`;
}
var listMyAgents_createServerFn_handler = createServerRpc({
	id: "5c2b66210153406dcaf04fbbd9a74279cbcffd828149e11f801151a63f4f9f6d",
	name: "listMyAgents",
	filename: "src/lib/server/agents.ts"
}, (opts) => listMyAgents.__executeServer(opts));
var listMyAgents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyAgents_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
             skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
             accuracy, status, hire_price_usdc, created_at
      from agents where owner_user_id = ${context.userId}
      order by id desc
    `).map(mapAgent);
});
var registerAgent_createServerFn_handler = createServerRpc({
	id: "ff5089bd902d7659e2536cf235b193888129ab22203bb7bb948b1f1e5416671c",
	name: "registerAgent",
	filename: "src/lib/server/agents.ts"
}, (opts) => registerAgent.__executeServer(opts));
var registerAgent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(registerAgent_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	if (!data.name.trim() || !data.description.trim()) throw new Error("Name and description are required.");
	if (!data.endpoint.trim().startsWith("https://")) throw new Error("Endpoint must be an https URL.");
	const sql = await getSql();
	const tokenId = await nextToken(sql);
	let slug = slugify(data.name);
	if ((await sql`select count(*)::int as n from agents where slug = ${slug}`)[0]?.n) slug = `${slug}-${tokenId}`;
	const stake = Math.max(100, Number(data.stake) || 1e3);
	const rows = await sql`
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
	return mapAgent(rows[0]);
});
var createBuoy_createServerFn_handler = createServerRpc({
	id: "242916fdcb85092e33f82cd758954a28824fabae8a3b059a594f99d8e359a63d",
	name: "createBuoy",
	filename: "src/lib/server/agents.ts"
}, (opts) => createBuoy.__executeServer(opts));
var createBuoy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createBuoy_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	const tokenId = await nextToken(sql);
	let slug = slugify(data.name);
	if ((await sql`select count(*)::int as n from agents where slug = ${slug}`)[0]?.n) slug = `${slug}-${tokenId}`;
	const stake = Math.max(50, Number(data.stake) || 250);
	const desc = data.description.trim() || `Buoy assembled from the ${data.template} template. Tools: ${data.tools.join(", ")}.`;
	const rows = await sql`
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
	if (data.listForHire) await sql`
        insert into listings (seller_user_id, agent_id, kind, price_usdc, period, status)
        values (${context.userId}, ${agent.id}, 'hire', ${agent.hire_price_usdc}, 'per-task', 'open')
      `;
	await sql`
      insert into ledger (user_id, kind, amount_usdc, note)
      values (${context.userId}, 'stake', ${stake}, ${"Buoy stake for " + slug})
    `;
	return agent;
});
var restakeAgent_createServerFn_handler = createServerRpc({
	id: "1b6067293dc59bd17e66ffd5d29cd09b067b6ca902bafe95523c4d174e6b231c",
	name: "restakeAgent",
	filename: "src/lib/server/agents.ts"
}, (opts) => restakeAgent.__executeServer(opts));
var restakeAgent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(restakeAgent_createServerFn_handler, async ({ context, data }) => {
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
//#endregion
export { createBuoy_createServerFn_handler, listMyAgents_createServerFn_handler, registerAgent_createServerFn_handler, restakeAgent_createServerFn_handler };
