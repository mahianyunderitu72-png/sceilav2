import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as listMiniapps } from "./catalog-fns-CPd_Am5k.mjs";
import { f as Page } from "./router-ZNQP7vuZ.mjs";
import { t as Badge } from "./badge-EnynLPJx.mjs";
import { t as MiniappIcon } from "./miniapp-icon-_iJVDqZQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/miniapps.index-DyxMYtzq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MiniappsIndex() {
	const [apps, setApps] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listMiniapps().then(setApps);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker",
			children: "Demand"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-4xl",
			children: "Miniapps"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-sm text-muted",
			children: "Specialized applications that send real work to Sceila agents and buoys. Each one is built and owned by its developer. They are the demand side of the protocol — accounting desks, studios, tutoring rooms, ERP floors."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: apps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/miniapps/$slug",
				params: { slug: app.slug },
				className: "panel p-5 transition-colors duration-150 hover:bg-elevated",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniappIcon, {
							slug: app.slug,
							className: "size-5 text-accent"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: app.category })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-2xl",
						children: app.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-fg",
						children: app.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 line-clamp-3 text-sm text-muted",
						children: app.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-subtle",
						children: [
							app.publisher,
							" · ",
							app.price_model
						]
					})
				]
			}, app.slug))
		})
	] });
}
//#endregion
export { MiniappsIndex as component };
