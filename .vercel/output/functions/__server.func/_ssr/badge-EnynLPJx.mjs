import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as cn } from "./router-ZNQP7vuZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-EnynLPJx.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs", {
			muted: "border-border bg-surface text-muted",
			accent: "border-accent/40 bg-accent/10 text-accent",
			ok: "border-signal/40 bg-signal/10 text-signal",
			warn: "border-warn/40 bg-warn/10 text-warn",
			danger: "border-danger/40 bg-danger/10 text-danger"
		}[tone], className),
		...props
	});
}
//#endregion
export { Badge as t };
