import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getMiniapp } from "./catalog-fns-CPd_Am5k.mjs";
import { n as orchestrateTask } from "./orchestrate-D6NuKQza.mjs";
import { d as AccessGate, f as Page, h as Button, o as Route$5 } from "./router-ZNQP7vuZ.mjs";
import { t as Badge } from "./badge-EnynLPJx.mjs";
import { n as Textarea } from "./input-DJwHBY2I.mjs";
import { t as useProfile } from "./use-profile-DP7G88dM.mjs";
import { n as ArenaPending, t as ArenaCard } from "./arena-Bp57Pk4F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/miniapps._slug-CzbSZiGt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MiniappPage() {
	const { slug } = Route$5.useParams();
	const navigate = useNavigate();
	const { profile, ready } = useProfile();
	const [app, setApp] = (0, import_react.useState)(null);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)(0);
	const [arena, setArena] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getMiniapp({ data: slug }).then(setApp);
	}, [slug]);
	async function onRun(e) {
		e.preventDefault();
		if (!app || !prompt.trim()) return;
		setBusy(true);
		setError(null);
		setStage(0);
		const tick = window.setInterval(() => setStage((s) => Math.min(s + 1, 3)), 800);
		try {
			const res = await orchestrateTask({ data: {
				prompt: prompt.trim(),
				source: "miniapp",
				miniappSlug: app.slug,
				consensus: app.consensus_method
			} });
			window.clearInterval(tick);
			setArena(res);
		} catch (err) {
			window.clearInterval(tick);
			const msg = err instanceof Error ? err.message : "Failed.";
			if (msg === "WAITLIST") navigate({ to: "/waitlist" });
			else if (msg === "Unauthorized") navigate({ to: "/login" });
			else setError(msg);
		} finally {
			setBusy(false);
		}
	}
	if (!app) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-[var(--radius-lg)] bg-surface" }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {
		profileStatus: profile?.waitlist_status,
		ready,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/miniapps",
					className: "text-sm text-muted hover:text-fg",
					children: "Miniapps"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: app.category }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "accent",
							children: app.consensus_method
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: app.publisher
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl",
					children: app.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-lg text-fg",
					children: app.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: app.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onRun,
					className: "mt-8 rounded-[var(--radius-xl)] bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "mini-prompt",
							className: "text-xs text-muted",
							children: "Task"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "mini-prompt",
							className: "mt-2",
							value: prompt,
							onChange: (e) => setPrompt(e.target.value),
							placeholder: app.prompt_hint,
							disabled: busy
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: "Billed once. Agents are paid in USDC."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy || !prompt.trim(),
								children: busy ? "Running" : "Submit to orchestrator"
							})]
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: error
				}) : null,
				busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaPending, { stage })
				}) : null,
				arena ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaCard, { arena })
				}) : null
			]
		})
	});
}
//#endregion
export { MiniappPage as component };
