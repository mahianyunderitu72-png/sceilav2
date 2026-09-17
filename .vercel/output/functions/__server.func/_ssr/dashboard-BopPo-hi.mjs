import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as generateWallet, t as attachWallet } from "./profile-DT1N3liZ.mjs";
import { _ as cn, b as n, d as AccessGate, f as Page, h as Button, r as CHAIN, x as shortAddress, y as formatUsdc } from "./router-ZNQP7vuZ.mjs";
import { i as PLANS } from "./catalog-D0zACr8W.mjs";
import { t as Badge } from "./badge-EnynLPJx.mjs";
import { t as Input } from "./input-DJwHBY2I.mjs";
import { t as useProfile } from "./use-profile-DP7G88dM.mjs";
import { n as listMyAgents } from "./agents-lhhRqh8W.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BPrsMXaD.mjs";
import { a as listMyTasks, i as listMyLedger, n as issueApiKey, r as listApiKeys, t as changePlan } from "./market-CTPSfoAY.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BopPo-hi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function injected() {
	if (typeof window === "undefined") return null;
	return window.ethereum ?? null;
}
function useWallet() {
	const [address, setAddress] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const available = Boolean(injected());
	(0, import_react.useEffect)(() => {
		const eth = injected();
		if (!eth) return;
		eth.request({ method: "eth_accounts" }).then((accounts) => {
			const list = accounts;
			if (list[0]) setAddress(list[0]);
		});
		const onAccounts = (...args) => {
			const list = args[0];
			setAddress(list?.[0] ?? null);
		};
		eth.on?.("accountsChanged", onAccounts);
		return () => eth.removeListener?.("accountsChanged", onAccounts);
	}, []);
	return {
		address,
		available,
		busy,
		error,
		connect: (0, import_react.useCallback)(async () => {
			const eth = injected();
			if (!eth) {
				setError("No injected wallet in this browser. Generate a testnet wallet instead.");
				return null;
			}
			setBusy(true);
			setError(null);
			try {
				const next = (await eth.request({ method: "eth_requestAccounts" }))[0];
				if (!next) throw new Error("Wallet returned no account.");
				try {
					await eth.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: CHAIN.hex }]
					});
				} catch {
					await eth.request({
						method: "wallet_addEthereumChain",
						params: [{
							chainId: CHAIN.hex,
							chainName: CHAIN.name,
							rpcUrls: [CHAIN.rpc],
							nativeCurrency: CHAIN.currency,
							blockExplorerUrls: [CHAIN.explorer]
						}]
					});
				}
				setAddress(next);
				return next;
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Could not connect wallet.";
				setError(msg);
				return null;
			} finally {
				setBusy(false);
			}
		}, [])
	};
}
function WalletConnect({ profile, onProfile }) {
	const wallet = useWallet();
	const [manual, setManual] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)(null);
	async function persist(address) {
		onProfile(await attachWallet({ data: { address } }));
		setNote("Wallet attached on Base Sepolia.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Wallet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-sm",
				children: shortAddress(profile?.wallet_address ?? wallet.address)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "Agents mint to this address. Stake and settlement are USDC on Base Sepolia."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [wallet.available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					disabled: wallet.busy,
					onClick: () => {
						wallet.connect().then((addr) => {
							if (addr) persist(addr);
						});
					},
					children: wallet.busy ? "Connecting…" : "Connect wallet"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: wallet.available ? "outline" : "primary",
					onClick: () => {
						generateWallet().then((p) => {
							onProfile(p);
							setNote("Simulated Base wallet generated for testnet.");
						});
					},
					children: "Generate testnet wallet"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex flex-wrap gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					persist(manual).catch((err) => setNote(err instanceof Error ? err.message : "Could not attach."));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: manual,
					onChange: (e) => setManual(e.target.value),
					placeholder: "0x…",
					className: "max-w-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					variant: "secondary",
					children: "Attach"
				})]
			}),
			wallet.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: wallet.error
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: note
			}) : null
		]
	});
}
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 flex-wrap items-center gap-1 rounded-md bg-elevated p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex min-h-9 items-center rounded-sm px-3 text-sm text-muted transition-colors duration-150", "hover:text-fg data-[state=active]:bg-surface data-[state=active]:text-fg", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-6 outline-none", className),
		...props
	});
}
function DashboardPage() {
	const { profile, setProfile, ready } = useProfile();
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [ledger, setLedger] = (0, import_react.useState)([]);
	const [keys, setKeys] = (0, import_react.useState)([]);
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
				className: "kicker",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletConnect, {
					profile,
					onProfile: setProfile
				})
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "agents",
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "agents",
							children: "Agents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "tasks",
							children: "Tasks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "money",
							children: "Money"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "keys",
							children: "Keys"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "agents",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
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
							className: "mt-4 text-sm text-muted",
							children: "No agents on this account yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-3",
							children: agents.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/agents/$slug",
								params: { slug: a.slug },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "flex items-center justify-between",
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
								}) })
							}, a.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "tasks",
						children: tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No tasks yet. Ask from chat or a miniapp."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: t.prompt.slice(0, 140)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-xs text-subtle",
								children: [
									t.classification,
									" · ",
									t.consensus_method,
									" · ",
									t.status
								]
							})] }) }, String(t.id)))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "money",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Plans"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid gap-3",
								children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted",
										children: p.price
									})]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-1 text-sm text-muted",
									children: p.perks.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
								})] })] }, p.id))
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
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "keys",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "max-w-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Express API keys" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Keys call POST /api/v1/tasks on the Node.js Express backend. Header: Authorization: Bearer sk_live_… The secret is shown once." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
							] })]
						})
					})
				]
			})
		] })
	});
}
//#endregion
export { DashboardPage as component };
