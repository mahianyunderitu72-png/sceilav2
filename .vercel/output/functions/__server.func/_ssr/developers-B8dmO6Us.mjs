import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { r as getBearerToken } from "./client-CGEuTn_7.mjs";
import { _ as cn, d as AccessGate, f as Page, h as Button } from "./router-ZNQP7vuZ.mjs";
import { n as Textarea } from "./input-DJwHBY2I.mjs";
import { t as useProfile } from "./use-profile-DP7G88dM.mjs";
import { n as ArenaPending, t as ArenaCard } from "./arena-Bp57Pk4F.mjs";
import { a as CardTitle, i as CardHeader, r as CardDescription, t as Card } from "./card-BPrsMXaD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developers-B8dmO6Us.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs text-muted", className),
		...props
	});
}
async function protocolFetch(path, init) {
	const headers = new Headers(init?.headers);
	if (!headers.has("content-type")) headers.set("content-type", "application/json");
	const bearer = getBearerToken();
	if (bearer && !headers.has("authorization")) headers.set("authorization", `Bearer ${bearer}`);
	const res = await fetch(`/api/v1${path}`, {
		...init,
		headers,
		credentials: "include"
	});
	const body = await res.json();
	if (!res.ok) throw new Error(body.error || `API ${res.status}`);
	return body;
}
var SNIPPET = `// Node.js + Express client — the protocol API is JS-first (not NestJS)
const res = await fetch("/api/v1/tasks", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: "Bearer " + process.env.SCEILA_KEY, // sk_live_…
  },
  body: JSON.stringify({
    prompt: "Reconcile March against the bank export.",
    consensus: "objective",
    preference: "quality",
  }),
});

const arena = await res.json();
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
			const res = await protocolFetch("/tasks", {
				method: "POST",
				body: JSON.stringify({
					prompt,
					source: "api",
					preference: "quality"
				})
			});
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
					className: "kicker",
					children: "Unified API"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl",
					children: "Developers"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "One protocol surface. React on the desk, Express on the wire, Solidity on Base. NestJS was skipped — same REST, lower bill."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Frontend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "React · TypeScript · Tailwind · shadcn/ui" })] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Backend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Node.js · Express · JS-first REST" })] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Web3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Solidity · Hardhat · Base Sepolia" })] }) })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "panel mt-8 overflow-x-auto p-4 font-mono text-xs text-muted",
					children: SNIPPET
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-mono text-xs text-subtle",
					children: "GET /api/v1 · /health · /stack · /agents · /miniapps · /contracts · POST /tasks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted",
					children: [
						"Issue a key from the",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "text-fg underline",
							children: "dashboard"
						}),
						". Contract addresses live on",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/token",
							className: "text-fg underline",
							children: "Token"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onTry,
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "api-try",
							children: "Try POST /api/v1/tasks"
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
							children: busy ? "Routing" : "POST /api/v1/tasks"
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
