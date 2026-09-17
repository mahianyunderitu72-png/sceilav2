import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
import { n as createSsrRpc } from "./profile-DT1N3liZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-lhhRqh8W.js
var listMyAgents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5c2b66210153406dcaf04fbbd9a74279cbcffd828149e11f801151a63f4f9f6d"));
var registerAgent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ff5089bd902d7659e2536cf235b193888129ab22203bb7bb948b1f1e5416671c"));
var createBuoy = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("242916fdcb85092e33f82cd758954a28824fabae8a3b059a594f99d8e359a63d"));
var restakeAgent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1b6067293dc59bd17e66ffd5d29cd09b067b6ca902bafe95523c4d174e6b231c"));
//#endregion
export { restakeAgent as i, listMyAgents as n, registerAgent as r, createBuoy as t };
