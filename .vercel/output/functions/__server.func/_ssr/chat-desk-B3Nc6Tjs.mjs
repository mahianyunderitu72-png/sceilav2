import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getMyProfile } from "./profile-DT1N3liZ.mjs";
import { t as getTaskArena } from "./orchestrate-D6NuKQza.mjs";
import { s as Plus } from "../_libs/lucide-react.mjs";
import { _ as cn, d as AccessGate, h as Button } from "./router-ZNQP7vuZ.mjs";
import { n as Textarea, t as Input } from "./input-DJwHBY2I.mjs";
import { n as ArenaPending, t as ArenaCard } from "./arena-Bp57Pk4F.mjs";
import { a as sendChat, i as listMyProjects, n as getChat, r as listMyChats, t as createProject } from "./chat-BbomvSKe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-desk-B3Nc6Tjs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatDesk({ activeId }) {
	const navigate = useNavigate();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [chats, setChats] = (0, import_react.useState)([]);
	const [projects, setProjects] = (0, import_react.useState)([]);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [arenas, setArenas] = (0, import_react.useState)({});
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [projectId, setProjectId] = (0, import_react.useState)();
	const [preference, setPreference] = (0, import_react.useState)("quality");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	const [projName, setProjName] = (0, import_react.useState)("");
	const [projInstr, setProjInstr] = (0, import_react.useState)("");
	const [showProj, setShowProj] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getMyProfile().then((p) => {
			setProfile(p);
			setReady(true);
		}).catch(() => setReady(true));
		listMyChats().then(setChats).catch(() => setChats([]));
		listMyProjects().then(setProjects).catch(() => setProjects([]));
	}, []);
	(0, import_react.useEffect)(() => {
		if (!activeId) {
			setMessages([]);
			return;
		}
		getChat({ data: activeId }).then((res) => {
			if (!res) return;
			setMessages(res.messages);
			for (const m of res.messages) if (m.task_id && !arenas[m.task_id]) getTaskArena({ data: m.task_id }).then((a) => {
				if (a) setArenas((prev) => ({
					...prev,
					[a.task.id]: a
				}));
			});
		}).catch(() => void 0);
	}, [activeId]);
	const title = (0, import_react.useMemo)(() => chats.find((c) => c.id === activeId)?.title ?? "New bearing", [chats, activeId]);
	async function onSend(e) {
		e.preventDefault();
		if (!prompt.trim() || busy) return;
		setBusy(true);
		setError(null);
		setStage(0);
		const tick = window.setInterval(() => setStage((s) => Math.min(s + 1, 3)), 900);
		try {
			const res = await sendChat({ data: {
				prompt: prompt.trim(),
				chatId: activeId,
				projectId,
				preference
			} });
			window.clearInterval(tick);
			setPrompt("");
			setMessages(res.messages);
			setArenas((prev) => ({
				...prev,
				[res.arena.task.id]: res.arena
			}));
			setChats((prev) => {
				const rest = prev.filter((c) => c.id !== res.chat.id);
				return [res.chat, ...rest];
			});
			if (!activeId) navigate({
				to: "/chat/$id",
				params: { id: String(res.chat.id) }
			});
		} catch (err) {
			window.clearInterval(tick);
			const msg = err instanceof Error ? err.message : "The arena could not open.";
			setError(msg);
		} finally {
			setBusy(false);
		}
	}
	async function onProject(e) {
		e.preventDefault();
		const p = await createProject({ data: {
			name: projName,
			instructions: projInstr
		} });
		setProjects((prev) => [p, ...prev]);
		setProjectId(p.id);
		setShowProj(false);
		setProjName("");
		setProjInstr("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessGate, {
		profileStatus: profile?.waitlist_status,
		ready,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid min-h-[calc(100dvh-8rem)] max-w-7xl gap-0 md:grid-cols-[240px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden border-r border-border md:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-widest text-muted uppercase",
							children: "Desk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/chat",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "xs",
								variant: "ghost",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New"]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 pb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-1 text-xs text-subtle",
								children: "Projects"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-1 min-h-11 w-full rounded-md px-2 py-2 text-left text-sm text-muted hover:text-fg",
								onClick: () => setShowProj((v) => !v),
								children: "New project"
							}),
							showProj ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: onProject,
								className: "mt-2 grid gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: projName,
										onChange: (e) => setProjName(e.target.value),
										placeholder: "Desk name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "min-h-20",
										value: projInstr,
										onChange: (e) => setProjInstr(e.target.value),
										placeholder: "Standing instructions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "sm",
										children: "Save"
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-1",
								children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setProjectId(p.id),
									className: cn("min-h-11 w-full truncate rounded-md px-2 py-2 text-left text-sm", projectId === p.id ? "text-fg" : "text-muted hover:text-fg"),
									children: p.name
								}) }, p.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-1 text-xs text-subtle",
							children: "History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1",
							children: chats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/chat/$id",
								params: { id: String(c.id) },
								className: cn("block truncate rounded-md px-2 py-3 text-sm", activeId === c.id ? "text-fg" : "text-muted hover:text-fg"),
								children: c.title
							}) }, c.id))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-w-0 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [preference === "quality" ? "Quality route" : "Cost route", projectId ? " · project attached" : ""]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "xs",
								variant: preference === "quality" ? "secondary" : "ghost",
								onClick: () => setPreference("quality"),
								children: "Quality"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "xs",
								variant: preference === "cost" ? "secondary" : "ghost",
								onClick: () => setPreference("cost"),
								children: "Cost"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6",
						children: [
							messages.length === 0 && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mx-auto max-w-lg py-12 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl",
									children: "Take a bearing"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "Ask anything. The orchestrator will classify the task, recruit three agents, seat a referee, and settle a consensus."
								})]
							}) : null,
							messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: m.role === "user" ? "ml-auto max-w-xl" : "max-w-3xl",
								children: m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-border bg-elevated px-4 py-3 text-sm",
									children: m.content
								}) : m.task_id && arenas[m.task_id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaCard, { arena: arenas[m.task_id] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "whitespace-pre-wrap text-sm leading-relaxed",
									children: m.content
								})
							}, m.id)),
							busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArenaPending, { stage }) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onSend,
						className: "border-t border-border p-4 sm:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: prompt,
								onChange: (e) => setPrompt(e.target.value),
								placeholder: "What do you need done?",
								className: "min-h-20 border-0 bg-transparent focus-visible:ring-0",
								disabled: busy
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-2 pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: "One credit per arena"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy || !prompt.trim(),
									children: busy ? "Recruiting" : "Send"
								})]
							})]
						}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-danger",
							children: error
						}) : null]
					})
				]
			})]
		})
	});
}
//#endregion
export { ChatDesk as t };
