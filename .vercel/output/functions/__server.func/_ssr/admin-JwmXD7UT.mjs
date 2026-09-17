import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
import { n as createSsrRpc } from "./profile-DT1N3liZ.mjs";
import { d as AccessGate, f as Page, h as Button } from "./router-ZNQP7vuZ.mjs";
import { t as Badge } from "./badge-EnynLPJx.mjs";
import { n as Textarea, t as Input } from "./input-DJwHBY2I.mjs";
import { t as useProfile } from "./use-profile-DP7G88dM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-JwmXD7UT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var adminSnapshot = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("da460eb32c23131fc6753793b3375fc436f9b8760e89e5cb28f766951dcc4683"));
var setWaitlistStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3421c860c4204c87e83c75803da0e24306e5673b3e72770fa2774cf5ba6a0562"));
var submitMiniapp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b834bcfe62c229c66b76b09c8a8853fab30efb645539318e94dd2d21251da565"));
var publishMiniapp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a94ba99fd2e8eecea596c37f3a6395ed5844da65b17b794f6f6b026c6950be8b"));
var addLesson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("12fe6cedad94fd129f5bd564416915fd9ca5c7f56dc16aab86bf5b29391bbdbe"));
function AdminPage() {
	const { profile, ready } = useProfile();
	const [waitlist, setWaitlist] = (0, import_react.useState)([]);
	const [pending, setPending] = (0, import_react.useState)([]);
	const [counts, setCounts] = (0, import_react.useState)(null);
	const [app, setApp] = (0, import_react.useState)({
		name: "",
		slug: "",
		tagline: "",
		description: "",
		category: "General",
		consensus: "evidence",
		hint: ""
	});
	const [lesson, setLesson] = (0, import_react.useState)({
		title: "",
		summary: "",
		body: ""
	});
	const [note, setNote] = (0, import_react.useState)(null);
	function refresh() {
		adminSnapshot().then((s) => {
			setWaitlist(s.waitlist);
			setPending(s.pendingApps);
			setCounts(s.counts);
		});
	}
	(0, import_react.useEffect)(() => {
		if (profile?.waitlist_status === "approved") refresh();
	}, [profile]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {
		profileStatus: profile?.waitlist_status,
		ready,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Ops"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Protocol ops"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Waitlist, miniapp intake, and academy lessons. Testnet lets every approved sailor see the desk."
			}),
			counts ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-8 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: "Agents"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-display text-2xl tabular-nums",
							children: counts.agents
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: "Tasks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-display text-2xl tabular-nums",
							children: counts.tasks
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: "Chats"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-display text-2xl tabular-nums",
							children: counts.chats
						})]
					})
				]
			}) : null,
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Waitlist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Intent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: " "
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: waitlist.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4",
								children: w.display_name ?? w.user_id.slice(0, 8)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4 text-muted",
								children: w.waitlist_intent ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 pr-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: w.waitlist_status === "approved" ? "ok" : "warn",
									children: w.waitlist_status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => {
										const next = w.waitlist_status === "approved" ? "pending" : "approved";
										setWaitlistStatus({ data: {
											userId: w.user_id,
											status: next
										} }).then(refresh);
									},
									children: "Toggle"
								})
							})
						]
					}, w.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Pending miniapps"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-3",
				children: pending.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No pending submissions."
				}) : pending.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-[var(--radius-md)] bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: m.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: m.tagline
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => void publishMiniapp({ data: { id: m.id } }).then(refresh),
						children: "Publish"
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "Submit a miniapp"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 grid max-w-lg gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					submitMiniapp({ data: app }).then(() => {
						setNote("Submitted for review.");
						refresh();
					}).catch((err) => setNote(err instanceof Error ? err.message : "Failed"));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Name",
						value: app.name,
						onChange: (e) => setApp({
							...app,
							name: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "slug",
						value: app.slug,
						onChange: (e) => setApp({
							...app,
							slug: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Tagline",
						value: app.tagline,
						onChange: (e) => setApp({
							...app,
							tagline: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						placeholder: "Description",
						value: app.description,
						onChange: (e) => setApp({
							...app,
							description: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						children: "Submit"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-2xl",
				children: "New academy lesson"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 grid max-w-lg gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					addLesson({ data: lesson }).then(() => setNote("Lesson published."));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Title",
						value: lesson.title,
						onChange: (e) => setLesson({
							...lesson,
							title: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Summary",
						value: lesson.summary,
						onChange: (e) => setLesson({
							...lesson,
							summary: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						placeholder: "Body",
						value: lesson.body,
						onChange: (e) => setLesson({
							...lesson,
							body: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						variant: "secondary",
						children: "Publish lesson"
					})
				]
			})
		] })
	});
}
//#endregion
export { AdminPage as component };
