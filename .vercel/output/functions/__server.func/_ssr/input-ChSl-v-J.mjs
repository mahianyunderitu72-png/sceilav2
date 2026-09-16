import { o as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as cn } from "./router-CSzY4ZyM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-ChSl-v-J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("h-11 w-full rounded-md border border-input bg-bg px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-accent", className),
	...props
}));
Input.displayName = "Input";
var Textarea = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("min-h-28 w-full rounded-md border border-input bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-subtle outline-none transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-accent", className),
	...props
}));
Textarea.displayName = "Textarea";
//#endregion
export { Textarea as n, Input as t };
