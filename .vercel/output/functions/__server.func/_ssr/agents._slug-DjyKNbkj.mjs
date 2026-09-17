import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as getAgentBySlug } from "./catalog-fns-CPd_Am5k.mjs";
import { b as n, c as Route$9, f as Page, g as CompassMark, h as Button, n as ADDRESSES, r as CHAIN, v as formatPct, x as shortAddress, y as formatUsdc } from "./router-ZNQP7vuZ.mjs";
import { t as Badge } from "./badge-EnynLPJx.mjs";
import { t as Input } from "./input-DJwHBY2I.mjs";
import { t as useProfile } from "./use-profile-DP7G88dM.mjs";
import { i as restakeAgent } from "./agents-lhhRqh8W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents._slug-DjyKNbkj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AgentPage() {
	const { slug } = Route$9.useParams();
	const { profile } = useProfile();
	const [agent, setAgent] = (0, import_react.useState)(null);
	const [amount, setAmount] = (0, import_react.useState)("100");
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getAgentBySlug({ data: slug }).then(setAgent);
	}, [slug]);
	if (!agent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-[var(--radius-lg)] bg-surface" }) });
	const mine = profile && agent.owner_user_id === profile.user_id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/explore",
				className: "text-sm text-muted hover:text-fg",
				children: "Explore"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompassMark, { className: "size-14" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl",
							children: agent.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: agent.kind }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "ok",
							children: agent.status
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: agent.description
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-8 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: "Reputation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: n(agent.reputation).toFixed(1)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: "Stake"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: formatUsdc(agent.stake_usdc)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: "Accuracy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: formatPct(agent.accuracy)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Token "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: ["#", agent.token_id]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "TBA "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: shortAddress(agent.tba_address)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Identity "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: shortAddress(ADDRESSES.identity)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", CHAIN.name]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Endpoint "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "break-all font-mono text-xs",
						children: agent.endpoint
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Tasks completed "
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: agent.tasks_completed.toLocaleString()
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-1",
				children: agent.skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: s }, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: agent.tools.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "muted",
					children: s
				}, s))
			}),
			mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 flex flex-wrap items-end gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					restakeAgent({ data: {
						agentId: agent.id,
						amount: Number(amount) || 0
					} }).then(() => {
						setNote("Stake recorded.");
						getAgentBySlug({ data: slug }).then(setAgent);
					}).catch((err) => setNote(err instanceof Error ? err.message : "Failed"));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted",
					htmlFor: "restake",
					children: "Restake USDC"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "restake",
					className: "mt-1 w-40",
					type: "number",
					min: 1,
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					children: "Add stake"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-muted",
				children: [
					"Hire from ",
					formatUsdc(agent.hire_price_usdc),
					" USDC per task on the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/marketplace",
						className: "underline-offset-2 hover:underline",
						children: "marketplace"
					}),
					"."
				]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null
		]
	});
}
//#endregion
export { AgentPage as component };
