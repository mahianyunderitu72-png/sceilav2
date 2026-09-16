import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-CXf_aOIY.mjs";
import { d as BearingMark, f as Button, l as Page } from "./router-CSzY4ZyM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D-SvXKfk.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {
		className: "grid min-h-[70dvh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md panel p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BearingMark, { className: "size-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-3xl",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Early access uses your Grok account. After sign-in, join the waitlist — testnet is open and approval is immediate."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full",
						onClick: () => signIn(p.providerId, { callbackURL: "/waitlist" }),
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-xs text-subtle",
					children: [
						"By continuing you agree to stake fairly and not game arenas.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "text-muted underline-offset-2 hover:underline",
							children: "About the protocol"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Login as component };
