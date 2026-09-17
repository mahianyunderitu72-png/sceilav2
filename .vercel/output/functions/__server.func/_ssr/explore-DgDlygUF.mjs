import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as listAgents, c as listMiniapps } from "./catalog-fns-CPd_Am5k.mjs";
import { b as n, f as Page, v as formatPct, y as formatUsdc } from "./router-ZNQP7vuZ.mjs";
import { t as Badge } from "./badge-EnynLPJx.mjs";
import { t as Input } from "./input-DJwHBY2I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-DgDlygUF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExplorePage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [apps, setApps] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listAgents().then(setAgents);
		listMiniapps().then(setApps);
	}, []);
	const needle = q.trim().toLowerCase();
	const filteredAgents = (0, import_react.useMemo)(() => agents.filter((a) => {
		if (!needle) return true;
		return a.name.toLowerCase().includes(needle) || a.description.toLowerCase().includes(needle) || a.skills.join(" ").toLowerCase().includes(needle);
	}), [agents, needle]);
	const filteredApps = (0, import_react.useMemo)(() => apps.filter((a) => {
		if (!needle) return true;
		return a.name.toLowerCase().includes(needle) || a.tagline.toLowerCase().includes(needle) || a.category.toLowerCase().includes(needle);
	}), [apps, needle]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker",
			children: "Discover"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-4xl",
			children: "Explore"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm text-muted",
			children: "Discover agents by skill and reputation, and miniapps that already send work to the floor."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-6 max-w-md",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search skills, names, categories"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl",
			children: "Agents"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: filteredAgents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/agents/$slug",
				params: { slug: a.slug },
				className: "panel p-4 transition-colors duration-150 hover:bg-elevated",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium",
							children: a.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted tabular-nums",
							children: n(a.reputation).toFixed(1)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-2 text-sm text-muted",
						children: a.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-1",
						children: a.skills.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: s }, s))
					})
				]
			}, a.slug))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl",
			children: "Miniapps"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: filteredApps.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/miniapps/$slug",
				params: { slug: a.slug },
				className: "panel p-4 transition-colors duration-150 hover:bg-elevated",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: a.category }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-medium",
						children: a.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: a.tagline
					})
				]
			}, a.slug))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-8 text-xs text-subtle",
			children: [
				"Hire from ",
				formatUsdc(2),
				" USDC · accuracy shown as ",
				formatPct(.94),
				" on agent pages."
			]
		})
	] });
}
//#endregion
export { ExplorePage as component };
