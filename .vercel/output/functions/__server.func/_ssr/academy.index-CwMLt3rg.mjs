import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as listLessons } from "./catalog-fns-CPd_Am5k.mjs";
import { f as Page } from "./router-ZNQP7vuZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy.index-CwMLt3rg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AcademyIndex() {
	const [lessons, setLessons] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listLessons().then(setLessons);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
			children: "Chart school"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl",
			children: "Academy"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-sm text-muted",
			children: "Short lessons on identity, arenas, buoys, stake, and the API. Protocol ops can add more from the admin desk."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-3 md:grid-cols-2",
			children: lessons.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/academy/$slug",
				params: { slug: l.slug },
				className: "rounded-[var(--radius-xl)] bg-surface p-5 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-accent",
						children: String(i + 1).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl",
						children: l.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: l.summary
					})
				]
			}, l.slug))
		})
	] });
}
//#endregion
export { AcademyIndex as component };
