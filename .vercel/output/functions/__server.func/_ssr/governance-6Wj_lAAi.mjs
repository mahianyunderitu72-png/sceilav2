import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { u as listProposals } from "./catalog-fns-CPd_Am5k.mjs";
import { f as Page, h as Button } from "./router-ZNQP7vuZ.mjs";
import { s as voteProposal } from "./market-CTPSfoAY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/governance-6Wj_lAAi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GovernancePage() {
	const [proposals, setProposals] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		listProposals().then(setProposals);
	}, []);
	async function vote(id, choice) {
		setNote(null);
		try {
			await voteProposal({ data: {
				proposalId: id,
				choice
			} });
			setProposals((prev) => prev.map((p) => p.id === id ? {
				...p,
				votes_for: p.votes_for + (choice === "for" ? 1 : 0),
				votes_against: p.votes_against + (choice === "against" ? 1 : 0)
			} : p));
		} catch (err) {
			setNote(err instanceof Error ? err.message : "Could not vote.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Helm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Governance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Protocol parameters — referee stake, fee take, reputation carry — are voted by early-access sailors. One account, one vote on testnet."
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4",
				children: proposals.map((p) => {
					const total = p.votes_for + p.votes_against || 1;
					const pct = Math.round(p.votes_for / total * 100);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: p.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-1 overflow-hidden rounded-full bg-elevated",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-accent",
									style: { width: `${pct}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-xs text-subtle tabular-nums",
								children: [
									p.votes_for,
									" for · ",
									p.votes_against,
									" against"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "secondary",
									onClick: () => void vote(p.id, "for"),
									children: "For"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => void vote(p.id, "against"),
									children: "Against"
								})]
							})
						]
					}, p.id);
				})
			})
		]
	});
}
//#endregion
export { GovernancePage as component };
