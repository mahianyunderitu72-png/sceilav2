import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getNews } from "./catalog-fns-CPd_Am5k.mjs";
import { a as Route$3, f as Page } from "./router-ZNQP7vuZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news._slug-AKyGPjY2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewsPostPage() {
	const { slug } = Route$3.useParams();
	const [post, setPost] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getNews({ data: slug }).then(setPost);
	}, [slug]);
	if (!post) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[var(--radius-lg)] bg-surface" }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/news",
				className: "text-sm text-muted hover:text-fg",
				children: "News"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker mt-4",
				children: post.kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: post.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm leading-relaxed text-muted",
				children: post.body
			})
		]
	});
}
//#endregion
export { NewsPostPage as component };
