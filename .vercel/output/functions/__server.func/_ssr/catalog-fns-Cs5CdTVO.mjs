import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-CuzAb3Pn.mjs";
import { t as asStringArray } from "./parse-DmEVgOz0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-fns-Cs5CdTVO.js
function mapAgent(row) {
	return {
		...row,
		skills: asStringArray(row.skills),
		capabilities: asStringArray(row.capabilities),
		tools: asStringArray(row.tools),
		models: asStringArray(row.models)
	};
}
var listAgents_createServerFn_handler = createServerRpc({
	id: "d92c84e21d610363283ba192a363b1cef81df5117d940e6cc10a1aa8e6b2f365",
	name: "listAgents",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => listAgents.__executeServer(opts));
var listAgents = createServerFn({ method: "GET" }).handler(listAgents_createServerFn_handler, async () => {
	return (await (await getSql())`
    select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
           skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
           accuracy, status, hire_price_usdc, created_at
    from agents
    where status = 'active'
    order by reputation desc
  `).map(mapAgent);
});
var getAgentBySlug_createServerFn_handler = createServerRpc({
	id: "75b2369e4cce02526f74163bdf971d349dbfb3706b7c0ca376b2b522a98a592f",
	name: "getAgentBySlug",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => getAgentBySlug.__executeServer(opts));
var getAgentBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getAgentBySlug_createServerFn_handler, async ({ data: slug }) => {
	const rows = await (await getSql())`
      select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
             skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
             accuracy, status, hire_price_usdc, created_at
      from agents where slug = ${slug}
    `;
	return rows[0] ? mapAgent(rows[0]) : null;
});
var listMiniapps_createServerFn_handler = createServerRpc({
	id: "6ebcfcef6f927e8c7992e4f0baa6894bd4f12a4808969d096639e10393bf50e6",
	name: "listMiniapps",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => listMiniapps.__executeServer(opts));
var listMiniapps = createServerFn({ method: "GET" }).handler(listMiniapps_createServerFn_handler, async () => {
	return (await getSql())`
    select id, slug, name, tagline, description, category, publisher, price_model, status,
           prompt_hint, consensus_method, submitter_user_id
    from miniapps
    where status = 'published'
    order by id
  `;
});
var getMiniapp_createServerFn_handler = createServerRpc({
	id: "c51ee76ed743057f2b31b296886c9a20ceb46249687bf940d661ab80ab9b29c5",
	name: "getMiniapp",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => getMiniapp.__executeServer(opts));
var getMiniapp = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getMiniapp_createServerFn_handler, async ({ data: slug }) => {
	return (await (await getSql())`
      select id, slug, name, tagline, description, category, publisher, price_model, status,
             prompt_hint, consensus_method, submitter_user_id
      from miniapps where slug = ${slug}
    `)[0] ?? null;
});
var listListings_createServerFn_handler = createServerRpc({
	id: "6c1f9ea3699c58309a720fc68cef8121dd3f177e74ae8023621b22ba057d5b63",
	name: "listListings",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => listListings.__executeServer(opts));
var listListings = createServerFn({ method: "GET" }).handler(listListings_createServerFn_handler, async () => {
	return (await getSql())`
    select l.id, l.seller_user_id, l.agent_id, l.kind, l.price_usdc, l.period, l.status,
           l.buyer_user_id, l.created_at, a.name as agent_name, a.slug as agent_slug,
           a.description as agent_description, a.reputation
    from listings l
    join agents a on a.id = l.agent_id
    where l.status = 'open'
    order by l.kind, l.price_usdc
  `;
});
var listLessons_createServerFn_handler = createServerRpc({
	id: "4d9b796b8f0f01bc7afff393ccf7b24ce2a4e4f5498cc9e0465687814494f14b",
	name: "listLessons",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => listLessons.__executeServer(opts));
var listLessons = createServerFn({ method: "GET" }).handler(listLessons_createServerFn_handler, async () => {
	return (await getSql())`
    select id, slug, title, summary, body, sort_order
    from lessons where published = true
    order by sort_order
  `;
});
var getLesson_createServerFn_handler = createServerRpc({
	id: "17c0b34906ffe9ab0f358c5de8e37c6fd8ed7c79711f6f9999cdf991d507e360",
	name: "getLesson",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => getLesson.__executeServer(opts));
var getLesson = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getLesson_createServerFn_handler, async ({ data: slug }) => {
	return (await (await getSql())`
      select id, slug, title, summary, body, sort_order
      from lessons where slug = ${slug} and published = true
    `)[0] ?? null;
});
var listNews_createServerFn_handler = createServerRpc({
	id: "5a28eeb79f23733de7255595aed329139cf5d0281ed39a2a8efc2b11a979df66",
	name: "listNews",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => listNews.__executeServer(opts));
var listNews = createServerFn({ method: "GET" }).handler(listNews_createServerFn_handler, async () => {
	return (await getSql())`
    select id, slug, title, kicker, body, published_at
    from news order by published_at desc
  `;
});
var getNews_createServerFn_handler = createServerRpc({
	id: "796829c6ccb1cc4f36c29f6677a641af63942ab8c8524787713a5ed0b145ff0b",
	name: "getNews",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => getNews.__executeServer(opts));
var getNews = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getNews_createServerFn_handler, async ({ data: slug }) => {
	return (await (await getSql())`
      select id, slug, title, kicker, body, published_at
      from news where slug = ${slug}
    `)[0] ?? null;
});
var listProposals_createServerFn_handler = createServerRpc({
	id: "d401a6efde0ea1f2d5b4fd4d173361443ae137fd842454eb7f4aab8fc7f3fe52",
	name: "listProposals",
	filename: "src/lib/server/catalog-fns.ts"
}, (opts) => listProposals.__executeServer(opts));
var listProposals = createServerFn({ method: "GET" }).handler(listProposals_createServerFn_handler, async () => {
	return (await getSql())`
    select id, title, body, status, votes_for, votes_against, created_at
    from proposals order by id
  `;
});
//#endregion
export { getAgentBySlug_createServerFn_handler, getLesson_createServerFn_handler, getMiniapp_createServerFn_handler, getNews_createServerFn_handler, listAgents_createServerFn_handler, listLessons_createServerFn_handler, listListings_createServerFn_handler, listMiniapps_createServerFn_handler, listNews_createServerFn_handler, listProposals_createServerFn_handler };
