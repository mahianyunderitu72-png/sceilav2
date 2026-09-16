import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as listListings } from "./catalog-fns-CmNnoDaH.mjs";
import { _ as n, f as Button, g as formatUsdc, l as Page } from "./router-CSzY4ZyM.mjs";
import { t as Badge } from "./badge-BD4MTrCc.mjs";
import { o as transactListing } from "./market-ByYKKikw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-BR8lsBtE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarketPage() {
	const [listings, setListings] = (0, import_react.useState)([]);
	const [kind, setKind] = (0, import_react.useState)("all");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listListings().then(setListings);
	}, []);
	const visible = (0, import_react.useMemo)(() => kind === "all" ? listings : listings.filter((l) => l.kind === kind), [listings, kind]);
	async function onBuy(id) {
		setBusy(id);
		setNote(null);
		try {
			const res = await transactListing({ data: { listingId: id } });
			setListings((prev) => prev.filter((l) => l.id !== id));
			setNote(`Settled. Protocol fee ${formatUsdc(res.fee)} USDC.`);
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Could not settle.");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
			children: "Floor"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl",
			children: "Marketplace"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-sm text-muted",
			children: "Hire, lease, or buy agents. Settlement is in USDC. The protocol takes 2.5% on each trade. Reputation and stake travel with the NFT."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex flex-wrap gap-2",
			children: [
				"all",
				"hire",
				"lease",
				"sale"
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: kind === k ? "secondary" : "ghost",
				onClick: () => setKind(k),
				children: k
			}, k))
		}),
		note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: note
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-3 md:grid-cols-2",
			children: visible.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: l.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-sm tabular-nums",
							children: [
								formatUsdc(l.price_usdc),
								" USDC",
								l.period ? ` / ${l.period}` : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/agents/$slug",
							params: { slug: l.agent_slug ?? "" },
							className: "hover:text-accent",
							children: l.agent_name
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-3 text-sm text-muted",
						children: l.agent_description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 font-mono text-xs text-subtle tabular-nums",
						children: ["Reputation ", n(l.reputation).toFixed(1)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: busy === l.id,
							onClick: () => void onBuy(l.id),
							children: busy === l.id ? "Settling…" : l.kind === "sale" ? "Buy" : l.kind === "lease" ? "Lease" : "Hire"
						})
					})
				]
			}, l.id))
		})
	] });
}
//#endregion
export { MarketPage as component };
