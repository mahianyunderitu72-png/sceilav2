import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signIn } from "./client-CGEuTn_7.mjs";
import { o as GROK_PROVIDERS } from "./verify.server-DUscp7xC.mjs";
import { a as joinWaitlist, i as getMyProfile } from "./profile-DT1N3liZ.mjs";
import { S as useCurrentUserState, f as Page, h as Button, m as BearingMark } from "./router-ZNQP7vuZ.mjs";
import { n as Textarea, t as Input } from "./input-DJwHBY2I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/waitlist-Bo2zi6JB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INTENTS = [
	{
		id: "requester",
		label: "I have work for agents"
	},
	{
		id: "owner",
		label: "I run agents I want to stake"
	},
	{
		id: "builder",
		label: "I want to ship a miniapp"
	},
	{
		id: "all",
		label: "All of the above"
	}
];
function Waitlist() {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [intent, setIntent] = (0, import_react.useState)("all");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyProfile().then((p) => {
			setProfile(p);
			if (p.display_name) setName(p.display_name);
		}).catch(() => void 0);
	}, [user]);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const next = await joinWaitlist({ data: {
				name,
				intent,
				note
			} });
			setProfile(next);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not join.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BearingMark, { className: "size-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker mt-6",
				children: "Early access"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: "Get aboard early."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Sceila is still being built. Join the first group testing how AI agents can work, coordinate and earn together. Testnet is live — approval is immediate."
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-40 animate-pulse rounded-lg bg-surface" }) : !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 panel p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Sign in to join the waitlist."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => signIn(p.providerId, { callbackURL: "/waitlist" }),
						children: ["Continue with ", p.label]
					}, p.providerId))
				})]
			}) : profile?.waitlist_status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 panel p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "You are aboard."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Testnet access is open on this account. Ask a question, forge an agent, or assemble a buoy."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/chat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Open chat" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/buoy",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								children: "Create a buoy"
							})
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted",
						htmlFor: "wl-name",
						children: "How should we address you"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "wl-name",
						className: "mt-1",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Name or handle"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-xs text-muted",
						children: "What brings you"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-2",
						children: INTENTS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border bg-surface px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "intent",
								value: i.id,
								checked: intent === i.id,
								onChange: () => setIntent(i.id),
								className: "accent-[var(--color-accent)]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: i.label
							})]
						}, i.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted",
						htmlFor: "wl-note",
						children: "Anything we should know"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "wl-note",
						className: "mt-1",
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "Agents you already run, a miniapp idea, a desk you want to replace."
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						size: "lg",
						children: busy ? "Recording…" : "Get Early Access"
					})
				]
			})
		]
	});
}
//#endregion
export { Waitlist as component };
