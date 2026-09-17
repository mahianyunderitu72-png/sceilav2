import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as cn, d as AccessGate, f as Page, h as Button } from "./router-ZNQP7vuZ.mjs";
import { a as SKILL_LIBRARY, c as TOOLS, n as MODELS, s as TEMPLATES } from "./catalog-D0zACr8W.mjs";
import { t as Badge } from "./badge-EnynLPJx.mjs";
import { n as Textarea, t as Input } from "./input-DJwHBY2I.mjs";
import { t as useProfile } from "./use-profile-DP7G88dM.mjs";
import { t as createBuoy } from "./agents-lhhRqh8W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buoy-B2x5m-9x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toggle(list, id) {
	return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}
function BuoyPage() {
	const { profile, ready } = useProfile();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(0);
	const [template, setTemplate] = (0, import_react.useState)(TEMPLATES[0].id);
	const [tools, setTools] = (0, import_react.useState)(["web"]);
	const [skills, setSkills] = (0, import_react.useState)(["brief"]);
	const [models, setModels] = (0, import_react.useState)(["grok-4.5"]);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [stake, setStake] = (0, import_react.useState)("250");
	const [listForHire, setListForHire] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const tpl = TEMPLATES.find((t) => t.id === template) ?? TEMPLATES[0];
	async function onCreate() {
		setBusy(true);
		setError(null);
		try {
			const agent = await createBuoy({ data: {
				name: name || tpl.title,
				template,
				tools,
				skills,
				models,
				description,
				stake: Number(stake) || 250,
				listForHire
			} });
			navigate({
				to: "/agents/$slug",
				params: { slug: agent.slug }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not mint the buoy.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {
		profileStatus: profile?.waitlist_status,
		ready,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
					children: "Five steps"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl",
					children: "Create a buoy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "A buoy is a personal agent assembled without code. Under step four sits one protocol endpoint — Sceila does not mint a vendor key per buoy. A hundred research buoys share the platform pool, unless you bring your own key."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid grid-cols-5 gap-2",
					children: [
						"Template",
						"Tools",
						"Skills",
						"Models",
						"Identity"
					].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setStep(i),
						className: cn("min-h-11 w-full rounded-full px-1 py-2 text-xs", i === step ? "bg-accent text-accent-fg" : "bg-surface text-muted"),
						children: [i + 1, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden sm:inline",
							children: [". ", label]
						})]
					}) }, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)]",
					children: [
						step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3",
							children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTemplate(t.id),
								className: cn("rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]", template === t.id ? "bg-elevated" : "bg-bg"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl",
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t.name })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: t.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "mt-3 overflow-x-auto rounded-md bg-bg p-3 font-mono text-xs text-subtle",
										children: t.code
									})
								]
							}, t.id))
						}) : null,
						step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: TOOLS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTools((s) => toggle(s, t.id)),
								className: cn("rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]", tools.includes(t.id) ? "bg-elevated" : "bg-bg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-medium",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: t.body
								})]
							}, t.id))
						}) : null,
						step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"Skills are standing orders. Combine library skills with the template's defaults (",
									tpl.skills.join(", "),
									")."
								]
							}), SKILL_LIBRARY.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSkills((v) => toggle(v, s.id)),
								className: cn("rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]", skills.includes(s.id) ? "bg-elevated" : "bg-bg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-medium",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: s.body
								})]
							}, s.id))]
						}) : null,
						step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Pick more than one model so a rate-limit does not sink the run. The buoy calls one unified API; Sceila routes underneath to the selected instruments, with your keys first and the platform pool as fallback."
							}), MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setModels((v) => toggle(v, m.id)),
								className: cn("rounded-[var(--radius-md)] p-4 text-left shadow-[var(--shadow-border)]", models.includes(m.id) ? "bg-elevated" : "bg-bg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-medium",
										children: m.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-subtle",
										children: m.vendor
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: m.note
								})]
							}, m.id))]
						}) : null,
						step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "We already know the template, tools, skills, and models. Name the buoy, set a stake, and we mint an ERC-721 on Base with an ERC-6551 wallet, then connect it to the protocol."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted",
									htmlFor: "buoy-name",
									children: "Agent name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "buoy-name",
									className: "mt-1",
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: tpl.title
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted",
									htmlFor: "buoy-desc",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "buoy-desc",
									className: "mt-1",
									value: description,
									onChange: (e) => setDescription(e.target.value),
									placeholder: "What this buoy is for."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-muted",
									htmlFor: "buoy-stake",
									children: "Stake (USDC)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "buoy-stake",
									className: "mt-1",
									type: "number",
									min: 50,
									value: stake,
									onChange: (e) => setStake(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex min-h-11 items-center gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: listForHire,
										onChange: (e) => setListForHire(e.target.checked),
										className: "accent-[var(--color-accent)]"
									}), "List for hire on the marketplace"]
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-danger",
									children: error
								}) : null
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								disabled: step === 0,
								onClick: () => setStep((s) => Math.max(0, s - 1)),
								children: "Back"
							}), step < 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setStep((s) => s + 1),
								children: "Continue"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => void onCreate(),
								disabled: busy,
								children: busy ? "Minting…" : "Mint and connect"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-subtle",
					children: [
						"Need a hosted agent instead?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "text-muted hover:text-fg",
							children: "Register an endpoint"
						}),
						"."
					]
				})
			]
		})
	});
}
//#endregion
export { BuoyPage as component };
