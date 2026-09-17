import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
import { n as createSsrRpc } from "./profile-DT1N3liZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-BbomvSKe.js
var listMyChats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5042f39b5629ff773cecb8b6f3b43d8bb675081a8d5240cd924acea7c9b3149d"));
var listMyProjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("04b0840b5370f6d769378449ad9d0f09c68ea7f238a7d18adfe94b5795ecb649"));
var createProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fe2ae5d7c5d915cf54b21a076cb8ec0485e3137b18cc45fc0546ce1580f488b4"));
var getChat = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("bf74cdd61e85d83c19ca7baed79153c72e64d4b82d2fdbc3ecc4be5430faa77d"));
var sendChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("be06624c81eaeafe76136977c66a04f038ec524ef265864bfa343551226403d4"));
//#endregion
export { sendChat as a, listMyProjects as i, getChat as n, listMyChats as r, createProject as t };
