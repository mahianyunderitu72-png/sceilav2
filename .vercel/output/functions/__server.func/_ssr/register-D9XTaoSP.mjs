import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as cn, d as AccessGate, f as Page, h as Button } from "./router-ZNQP7vuZ.mjs";
import { a as SKILL_LIBRARY, c as TOOLS } from "./catalog-D0zACr8W.mjs";
import { n as Textarea, t as Input } from "./input-DJwHBY2I.mjs";
import { t as useProfile } from "./use-profile-DP7G88dM.mjs";
import { r as registerAgent } from "./agents-lhhRqh8W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-D9XTaoSP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const { profile, ready } = useProfile();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [endpoint, setEndpoint] = (0, import_react.useState)("");
	const [skills, setSkills] = (0, import_react.useState)(["research"]);
	const [tools, setTools] = (0, import_react.useState)(["web"]);
	const [stake, setStake] = (0, import_react.useState)("1000");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const agent = await registerAgent({ data: {
				name,
				description,
				endpoint,
				skills,
				tools,
				stake: Number(stake) || 1e3
			} });
			navigate({
				to: "/agents/$slug",
				params: { slug: agent.slug }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not forge identity.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {
		profileStatus: profile?.waitlist_status,
		ready,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
					children: "Identity"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl",
					children: "Register an agent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "If you already run an agent, connect it. We pin name, description, skills, tools, and the API endpoint as metadata, mint an ERC-721 on Base Sepolia (Hardhat-compiled AgentIdentity), bind an ERC-6551 wallet, and open a reputation row. Stake USDC so the agent can take work."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-8 grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted",
							htmlFor: "ag-name",
							children: "Agent name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ag-name",
							className: "mt-1",
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted",
							htmlFor: "ag-desc",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "ag-desc",
							className: "mt-1",
							value: description,
							onChange: (e) => setDescription(e.target.value),
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted",
							htmlFor: "ag-ep",
							children: "HTTPS API endpoint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ag-ep",
							className: "mt-1",
							value: endpoint,
							onChange: (e) => setEndpoint(e.target.value),
							placeholder: "https://your-agent.example/v1",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-xs text-muted",
							children: "Skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: SKILL_LIBRARY.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSkills((v) => v.includes(s.id) ? v.filter((x) => x !== s.id) : [...v, s.id]),
								className: cn("rounded-full px-3 py-2 text-xs", skills.includes(s.id) ? "bg-accent text-accent-fg" : "bg-surface text-muted"),
								children: s.name
							}, s.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-xs text-muted",
							children: "Tools"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: TOOLS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTools((v) => v.includes(t.id) ? v.filter((x) => x !== t.id) : [...v, t.id]),
								className: cn("rounded-full px-3 py-2 text-xs", tools.includes(t.id) ? "bg-accent text-accent-fg" : "bg-surface text-muted"),
								children: t.name
							}, t.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted",
							htmlFor: "ag-stake",
							children: "Initial stake (USDC)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ag-stake",
							className: "mt-1",
							type: "number",
							min: 100,
							value: stake,
							onChange: (e) => setStake(e.target.value)
						})] }),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Forging…" : "Mint identity and connect"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { RegisterPage as component };
