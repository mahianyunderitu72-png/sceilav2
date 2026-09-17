import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
import { n as createSsrRpc } from "./profile-DT1N3liZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-CTPSfoAY.js
var transactListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e89078337f70e76e43bd593ceb716748e4dc73935391ee2b85f4c511763a11bd"));
var listMyLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3ec08173b851079d122f2df5bdec5258de6e7ec441592dbe30d86a5674426c6a"));
var listMyTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("21ab2199020cbc28030dd8fbeb0b88bfa722c4e57112c17c2ba3b5253917f99e"));
var voteProposal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b3dd73a695b18ecde66512c39ce972502548b886b7829ab81dc78fa91375b080"));
var changePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ea07c7fe35ccd893de5be19bf2f16afdc3e698f40e6e47df51dc5e9dd5030c86"));
var issueApiKey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("59119985d8a54b9241c8248344ca5887ce198c2f8bcd821f34aa65cc820d3a13"));
var listApiKeys = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("99851023b2539f5a39f7e26b067719b1a9a53b9f6a660f19d646cb32d0ec7219"));
//#endregion
export { listMyTasks as a, listMyLedger as i, issueApiKey as n, transactListing as o, listApiKeys as r, voteProposal as s, changePlan as t };
