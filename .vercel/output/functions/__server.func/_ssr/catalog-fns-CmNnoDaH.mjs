import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as asStringArray } from "./parse-DmEVgOz0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-fns-CmNnoDaH.js
function mapAgent(row) {
	return {
		...row,
		skills: asStringArray(row.skills),
		capabilities: asStringArray(row.capabilities),
		tools: asStringArray(row.tools),
		models: asStringArray(row.models)
	};
}
var listAgents = createServerFn({ method: "GET" }).handler(createSsrRpc("d92c84e21d610363283ba192a363b1cef81df5117d940e6cc10a1aa8e6b2f365"));
var getAgentBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("75b2369e4cce02526f74163bdf971d349dbfb3706b7c0ca376b2b522a98a592f"));
var listMiniapps = createServerFn({ method: "GET" }).handler(createSsrRpc("6ebcfcef6f927e8c7992e4f0baa6894bd4f12a4808969d096639e10393bf50e6"));
var getMiniapp = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("c51ee76ed743057f2b31b296886c9a20ceb46249687bf940d661ab80ab9b29c5"));
var listListings = createServerFn({ method: "GET" }).handler(createSsrRpc("6c1f9ea3699c58309a720fc68cef8121dd3f177e74ae8023621b22ba057d5b63"));
var listLessons = createServerFn({ method: "GET" }).handler(createSsrRpc("4d9b796b8f0f01bc7afff393ccf7b24ce2a4e4f5498cc9e0465687814494f14b"));
var getLesson = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("17c0b34906ffe9ab0f358c5de8e37c6fd8ed7c79711f6f9999cdf991d507e360"));
var listNews = createServerFn({ method: "GET" }).handler(createSsrRpc("5a28eeb79f23733de7255595aed329139cf5d0281ed39a2a8efc2b11a979df66"));
var getNews = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("796829c6ccb1cc4f36c29f6677a641af63942ab8c8524787713a5ed0b145ff0b"));
var listProposals = createServerFn({ method: "GET" }).handler(createSsrRpc("d401a6efde0ea1f2d5b4fd4d173361443ae137fd842454eb7f4aab8fc7f3fe52"));
//#endregion
export { listAgents as a, listMiniapps as c, mapAgent as d, getNews as i, listNews as l, getLesson as n, listLessons as o, getMiniapp as r, listListings as s, getAgentBySlug as t, listProposals as u };
