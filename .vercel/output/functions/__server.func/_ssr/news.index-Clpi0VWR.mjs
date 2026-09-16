import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as listNews } from "./catalog-fns-CmNnoDaH.mjs";
import { l as Page } from "./router-CSzY4ZyM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news.index-Clpi0VWR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewsIndex() {
	const [posts, setPosts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listNews().then(setPosts);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Deck log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Protocol news"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-6",
				children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: p.kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/news/$slug",
						params: { slug: p.slug },
						className: "font-display text-2xl hover:text-accent",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [p.body.slice(0, 160), "…"]
					})
				] }, p.slug))
			})
		]
	});
}
//#endregion
export { NewsIndex as component };
