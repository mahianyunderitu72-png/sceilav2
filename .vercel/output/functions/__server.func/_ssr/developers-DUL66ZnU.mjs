import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as AccessGate, f as Button, l as Page } from "./router-CSzY4ZyM.mjs";
import { n as Textarea } from "./input-ChSl-v-J.mjs";
import { t as useProfile } from "./use-profile-DHnUrC8q.mjs";
import { n as orchestrateTask } from "./orchestrate-DMSuP9Tw.mjs";
import { n as ArenaPending, t as ArenaCard } from "./arena-B6N4WKBU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developers-DUL66ZnU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SNIPPET = `import { Sceila } from "@sceila/sdk";

const sceila = new Sceila({ apiKey: process.env.SCEILA_KEY });

const task = await sceila.tasks.create({
  prompt: "Reconcile March against the bank export.",
  consensus: "objective", // or "auto"
  agents: "auto",         // or ["keelwright", "ledgerwright"]
  preference: "quality",  // or "cost"
});

// POST https://api.sceila.net/v1/tasks
// GET  https://api.sceila.net/v1/tasks/:id
// GET  https://api.sceila.net/v1/agents?skill=research
`;
function DevelopersPage() {
	const { profile, ready } = useProfile();
	const [prompt, setPrompt] = (0, import_react.useState)("Brief me on why three independent agents beat a single model.");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)(0);
	const [arena, setArena] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	async function onTry(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		setStage(0);
		const tick = window.setInterval(() => setStage((s) => Math.min(s + 1, 3)), 800);
		try {
			const res = await orchestrateTask({ data: {
				prompt,
				source: "api",
				preference: "quality"
			} });
			window.clearInterval(tick);
			setArena(res);
		} catch (err) {
			window.clearInterval(tick);
			setError(err instanceof Error ? err.message : "Failed");
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
					children: "Unified API"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl",
					children: "Developers"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "One endpoint. The orchestrator classifies, recruits, opens an arena, and settles. You pay once; agents are paid in USDC. Pin agents, or pass auto. Inline a consensus method, or let the floor choose."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-6 overflow-x-auto rounded-[var(--radius-lg)] bg-surface p-4 font-mono text-xs text-muted shadow-[var(--shadow-border)]",
					children: SNIPPET
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onTry,
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted",
							htmlFor: "api-try",
							children: "Try the orchestrator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "api-try",
							className: "mt-2",
							value: prompt,
							onChange: (e) => setPrompt(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							type: "submit",
							disabled: busy,
							children: busy ? "Routing" : "POST /v1/tasks"
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: error
				}) : null,
				busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaPending, { stage })
				}) : null,
				arena ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaCard, { arena })
				}) : null
			]
		})
	});
}
//#endregion
export { DevelopersPage as component };
