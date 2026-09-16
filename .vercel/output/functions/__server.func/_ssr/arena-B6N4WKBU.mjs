import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as n, d as BearingMark, g as formatUsdc, h as formatPct } from "./router-CSzY4ZyM.mjs";
import { t as Badge } from "./badge-BD4MTrCc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arena-B6N4WKBU.js
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"Classifying",
	"Recruiting",
	"Commit",
	"Review",
	"Settled"
];
function ArenaPending({ stage }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BearingMark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "Arena underway"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: STAGES[Math.min(stage, STAGES.length - 1)]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 grid grid-cols-5 gap-1",
			children: STAGES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: i <= stage ? "h-1 rounded-full bg-accent" : "h-1 rounded-full bg-elevated" }, s))
		})]
	});
}
function ArenaCard({ arena }) {
	const workers = arena.submissions.filter((s) => s.role === "worker");
	const referee = arena.submissions.find((s) => s.role === "referee");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "accent",
						children: arena.task.consensus_method
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: arena.task.classification }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-muted tabular-nums",
						children: [
							formatPct(arena.task.confidence),
							" confidence · ",
							formatPct(arena.task.agreement),
							" agreement"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 whitespace-pre-wrap text-sm leading-relaxed text-fg",
				children: arena.task.consensus_answer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 md:grid-cols-3",
				children: workers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-md border border-border bg-bg p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/agents/$slug",
								params: { slug: s.agent_slug ?? "" },
								className: "text-sm font-medium hover:text-accent",
								children: s.agent_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted tabular-nums",
								children: formatPct(s.score_accuracy)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 line-clamp-5 text-xs leading-relaxed text-muted",
							children: s.answer
						}),
						s.evidence?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1",
							children: s.evidence.slice(0, 3).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-xs text-subtle",
								children: e
							}, e))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-mono text-xs text-subtle tabular-nums",
							children: [
								"+",
								formatUsdc(s.reward_usdc),
								" · slash ",
								formatUsdc(s.slashed_usdc)
							]
						})
					]
				}, s.id))
			}),
			referee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs text-muted",
				children: [
					"Referee ",
					referee.agent_name,
					": ",
					referee.answer,
					n(referee.reward_usdc) ? ` · paid ${formatUsdc(referee.reward_usdc)} USDC` : ""
				]
			}) : null
		]
	});
}
//#endregion
export { ArenaPending as n, ArenaCard as t };
