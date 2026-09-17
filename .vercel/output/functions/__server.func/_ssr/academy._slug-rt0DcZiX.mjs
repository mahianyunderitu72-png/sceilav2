import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getLesson } from "./catalog-fns-CPd_Am5k.mjs";
import { f as Page, l as Route$10 } from "./router-ZNQP7vuZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy._slug-rt0DcZiX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LessonPage() {
	const { slug } = Route$10.useParams();
	const [lesson, setLesson] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getLesson({ data: slug }).then(setLesson);
	}, [slug]);
	if (!lesson) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-[var(--radius-lg)] bg-surface" }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/academy",
				className: "text-sm text-muted hover:text-fg",
				children: "Academy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl",
				children: lesson.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: lesson.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-4 text-sm leading-relaxed text-fg",
				children: lesson.body.split("\n\n").map((para) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-muted",
					children: para
				}, para.slice(0, 24)))
			})
		]
	});
}
//#endregion
export { LessonPage as component };
