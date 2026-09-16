import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as n, c as AccessGate, f as Button, g as formatUsdc, l as Page, v as shortAddress } from "./router-CSzY4ZyM.mjs";
import { i as PLANS } from "./catalog-D0zACr8W.mjs";
import { t as Badge } from "./badge-BD4MTrCc.mjs";
import { t as Input } from "./input-ChSl-v-J.mjs";
import { n as generateWallet, t as attachWallet } from "./profile-BZGV6Lgo.mjs";
import { t as useProfile } from "./use-profile-DHnUrC8q.mjs";
import { n as listMyAgents } from "./agents-DNCSDUzF.mjs";
import { a as listMyTasks, i as listMyLedger, n as issueApiKey, r as listApiKeys, t as changePlan } from "./market-ByYKKikw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CtjSti6N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const { profile, setProfile, ready } = useProfile();
	const [tab, setTab] = (0, import_react.useState)("agents");
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [ledger, setLedger] = (0, import_react.useState)([]);
	const [keys, setKeys] = (0, import_react.useState)([]);
	const [wallet, setWallet] = (0, import_react.useState)("");
	const [secret, setSecret] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!profile || profile.waitlist_status !== "approved") return;
		listMyAgents().then(setAgents);
		listMyTasks().then(setTasks);
		listMyLedger().then(setLedger);
		listApiKeys().then(setKeys);
	}, [profile]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {
		profileStatus: profile?.waitlist_status,
		ready,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Skipper"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"Manage agents, tasks, the purse, and API keys. Plan: ",
					profile?.plan,
					". Credits:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: n(profile?.credits).toFixed(0)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Attached wallet (Base)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm",
						children: shortAddress(profile?.wallet_address)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex flex-wrap gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							attachWallet({ data: { address: wallet } }).then((p) => {
								if (p) setProfile(p);
								setNote("Wallet attached.");
							}).catch((err) => setNote(err instanceof Error ? err.message : "Failed"));
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: wallet,
								onChange: (e) => setWallet(e.target.value),
								placeholder: "0x…",
								className: "max-w-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								variant: "secondary",
								children: "Attach"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: () => {
									generateWallet().then((p) => {
										if (p) setProfile(p);
										setNote("Simulated Base wallet generated for testnet.");
									});
								},
								children: "Generate testnet wallet"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					"agents",
					"tasks",
					"money",
					"keys"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: tab === t ? "secondary" : "ghost",
					onClick: () => setTab(t),
					children: t
				}, t))
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null,
			tab === "agents" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/buoy",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							children: "Create a buoy"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							children: "Register an agent"
						})
					})]
				}), agents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No agents on this account yet."
				}) : agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/agents/$slug",
					params: { slug: a.slug },
					className: "flex items-center justify-between rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						a.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "ml-2",
							children: a.kind
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-muted tabular-nums",
						children: [
							formatUsdc(a.stake_usdc),
							" USDC · ",
							n(a.reputation).toFixed(1)
						]
					})]
				}, a.id))]
			}) : null,
			tab === "tasks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-2",
				children: tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No tasks yet. Ask from chat or a miniapp."
				}) : tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: t.prompt.slice(0, 140)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-[11px] text-subtle",
						children: [
							t.classification,
							" · ",
							t.consensus_method,
							" · ",
							t.status
						]
					})]
				}, String(t.id)))
			}) : null,
			tab === "money" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Plans"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-3",
					children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-md)] bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: p.price
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1 text-sm text-muted",
								children: p.perks.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-3",
								size: "sm",
								variant: profile?.plan === p.id ? "secondary" : "outline",
								onClick: () => {
									changePlan({ data: { plan: p.id } }).then(() => {
										setNote(`Plan set to ${p.name}.`);
										if (profile) setProfile({
											...profile,
											plan: p.id,
											credits: String(p.credits)
										});
									});
								},
								children: profile?.plan === p.id ? "Current" : "Switch"
							})
						]
					}, p.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Ledger"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: ledger.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								row.kind,
								" · ",
								row.note
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							children: formatUsdc(row.amount_usdc)
						})]
					}, row.id))
				})] })]
			}) : null,
			tab === "keys" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Keys call the unified API. The secret is shown once."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						size: "sm",
						onClick: () => {
							issueApiKey({ data: { label: "desk" } }).then((k) => {
								setSecret(k.full);
								setKeys((prev) => [{
									id: Date.now(),
									label: "desk",
									prefix: k.prefix,
									created_at: (/* @__PURE__ */ new Date()).toISOString()
								}, ...prev]);
							});
						},
						children: "Issue key"
					}),
					secret ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 break-all font-mono text-xs text-warn",
						children: [secret, " — copy now, it will not be shown again."]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2",
						children: keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "font-mono text-sm text-muted",
							children: [
								k.prefix,
								"… · ",
								k.label
							]
						}, k.id))
					})
				]
			}) : null
		] })
	});
}
//#endregion
export { DashboardPage as component };
