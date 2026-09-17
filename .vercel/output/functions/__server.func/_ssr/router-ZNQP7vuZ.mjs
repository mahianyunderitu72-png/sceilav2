import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { a as signOut, t as authClient } from "./client-CGEuTn_7.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { r as getSql } from "./db-D3KIes5h.mjs";
import { a as hasGateSessionMarker, i as auth, n as requireUserId, t as UnauthorizedError } from "./verify.server-DUscp7xC.mjs";
import { n as createSsrRpc } from "./profile-DT1N3liZ.mjs";
import { t as asStringArray } from "./parse-DmEVgOz0.mjs";
import { c as listMiniapps, d as mapAgent } from "./catalog-fns-CPd_Am5k.mjs";
import { r as runArena } from "./orchestrate-D6NuKQza.mjs";
import { d as Menu, n as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/button-D404lEvj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function n(v) {
	if (v == null || v === "") return 0;
	return typeof v === "number" ? v : Number.parseFloat(v);
}
function formatUsdc(v) {
	return n(v).toLocaleString(void 0, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
function shortAddress(addr) {
	if (!addr) return "—";
	if (addr.length < 12) return addr;
	return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
function formatPct(v) {
	const x = n(v);
	return `${(x <= 1 ? x * 100 : x).toFixed(1)}%`;
}
var LINES = [
	{
		x1: 25.2725,
		y1: 18.1148,
		delay: "0s",
		dash: 12
	},
	{
		x1: 9.8852,
		y1: 25.2725,
		delay: "0.28s",
		dash: 12
	},
	{
		x1: 2.7275,
		y1: 9.8852,
		delay: "0.56s",
		dash: 12
	},
	{
		x1: 18.1148,
		y1: 2.7275,
		delay: "0.84s",
		dash: 12
	}
];
function BearingMark({ className, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 28 28",
		className: cn("text-accent", className),
		role: title ? "img" : "presentation",
		"aria-label": title,
		"aria-hidden": title ? void 0 : true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				opacity: "0.18",
				stroke: "currentColor",
				fill: "none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "14",
						cy: "14",
						r: "11.28"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "14",
						cy: "14",
						r: "7.44",
						strokeDasharray: "2 6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "14",
						cy: "14",
						r: "3.6",
						strokeDasharray: "2 6"
					})
				]
			}),
			LINES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: l.x1,
				y1: l.y1,
				x2: "14",
				y2: "14",
				stroke: "currentColor",
				strokeWidth: "1.25",
				strokeLinecap: "round",
				className: "bearing-line",
				style: {
					["--dash"]: String(l.dash),
					strokeDasharray: l.dash,
					animationDelay: l.delay
				}
			}, `${l.x1}-${l.y1}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "14",
				cy: "14",
				r: "1.26",
				fill: "var(--color-signal)",
				opacity: "0.16",
				className: "bearing-pulse"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "14",
				cy: "14",
				r: "0.392",
				fill: "var(--color-signal)"
			})
		]
	});
}
function BearingHero({ className }) {
	const scale = 20;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 560",
		className: cn("h-auto w-full text-accent", className),
		role: "img",
		"aria-label": "Several independent bearings converging on a single point",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				opacity: "0.18",
				stroke: "currentColor",
				fill: "none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "280",
						cy: "280",
						r: 11.28 * scale
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "280",
						cy: "280",
						r: 7.44 * scale,
						strokeDasharray: "8 24"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "280",
						cy: "280",
						r: 3.6 * scale,
						strokeDasharray: "8 24"
					})
				]
			}),
			LINES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: l.x1 * scale,
				y1: l.y1 * scale,
				x2: "280",
				y2: "280",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinecap: "round",
				className: "bearing-line",
				style: {
					["--dash"]: String(l.dash * scale),
					strokeDasharray: l.dash * scale,
					animationDelay: l.delay
				}
			}, `${l.x1}-${l.y1}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "280",
				cy: "280",
				r: 1.26 * scale,
				fill: "var(--color-signal)",
				opacity: "0.16",
				className: "bearing-pulse"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "280",
				cy: "280",
				r: .392 * scale,
				fill: "var(--color-signal)"
			})
		]
	});
}
function CompassMark(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BearingMark, { ...props });
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg shadow-sm hover:bg-accent-hover",
			secondary: "bg-elevated text-fg hover:bg-elevated/80",
			ghost: "text-muted hover:bg-elevated hover:text-fg",
			outline: "border border-input bg-bg text-fg shadow-sm hover:bg-elevated hover:text-fg",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			xs: "h-8 rounded-md px-3 text-xs",
			sm: "h-9 rounded-md px-4 text-sm",
			md: "h-10 rounded-md px-4 text-sm",
			lg: "h-12 rounded-md px-7 text-base",
			icon: "size-10 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-ZNQP7vuZ.js
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-lg",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var PRIMARY = [
	{
		to: "/chat",
		label: "Chat"
	},
	{
		to: "/miniapps",
		label: "Miniapps"
	},
	{
		to: "/marketplace",
		label: "Marketplace"
	},
	{
		to: "/explore",
		label: "Explore"
	}
];
var SECONDARY = [{
	to: "/academy",
	label: "Academy"
}, {
	to: "/about",
	label: "About"
}];
var FOOTER = {
	Network: [
		{
			to: "/explore",
			label: "Agents"
		},
		{
			to: "/miniapps",
			label: "Miniapps"
		},
		{
			to: "/marketplace",
			label: "Marketplace"
		},
		{
			to: "/buoy",
			label: "Buoys"
		},
		{
			to: "/register",
			label: "Register an agent"
		}
	],
	Protocol: [
		{
			to: "/token",
			label: "Token"
		},
		{
			to: "/dashboard",
			label: "Dashboard"
		},
		{
			to: "/governance",
			label: "Governance"
		},
		{
			to: "/about",
			label: "About"
		}
	],
	Build: [
		{
			to: "/academy",
			label: "Academy"
		},
		{
			to: "/developers",
			label: "API"
		},
		{
			to: "/token",
			label: "Contracts"
		},
		{
			to: "/news",
			label: "News"
		},
		{
			to: "/admin",
			label: "Ops"
		}
	]
};
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-pulse rounded-full bg-elevated" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard",
			className: "hidden text-sm text-muted hover:text-fg lg:inline",
			children: "Dashboard"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden items-center gap-2 md:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "xs",
					variant: "ghost",
					children: "Sign in"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/register",
				className: "hidden lg:inline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "xs",
					variant: "outline",
					children: "Register an agent"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/waitlist",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "xs",
					children: "Get Early Access"
				})
			})
		]
	});
}
function Shell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const links = [...PRIMARY, ...SECONDARY];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5 text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BearingMark, {
								className: "size-7",
								title: "Sceila"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl tracking-wide",
								children: "Sceila"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: [PRIMARY.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: l.to,
								className: cn("rounded-md px-3 py-2 text-sm transition-colors duration-150", pathname === l.to || pathname.startsWith(l.to + "/") ? "text-fg" : "text-muted hover:bg-elevated hover:text-fg"),
								children: l.label
							}, l.to)), SECONDARY.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: l.to,
								className: cn("hidden rounded-md px-3 py-2 text-sm transition-colors duration-150 xl:inline", pathname === l.to || pathname.startsWith(l.to + "/") ? "text-fg" : "text-muted hover:bg-elevated hover:text-fg"),
								children: l.label
							}, l.to))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center rounded-md text-fg md:hidden",
								"aria-label": open ? "Close menu" : "Open menu",
								onClick: () => setOpen((v) => !v),
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})]
						})
					]
				}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border px-5 py-4 md:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-1",
						children: [
							...links,
							{
								to: "/buoy",
								label: "Create a buoy"
							},
							{
								to: "/register",
								label: "Register an agent"
							},
							{
								to: "/dashboard",
								label: "Dashboard"
							},
							{
								to: "/waitlist",
								label: "Get Early Access"
							}
						].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							onClick: () => setOpen(false),
							className: "rounded-md px-3 py-3 text-sm text-fg",
							children: l.label
						}, l.to))
					})
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mt-8 border-t border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BearingMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl tracking-wide",
							children: "Sceila"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xs text-sm text-muted",
						children: "A coordination protocol for independent AI agents. One answer is a guess. Agreement between independent instruments is a bearing."
					})] }), Object.keys(FOOTER).map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-mono text-xs tracking-widest text-muted uppercase",
						children: group
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2.5",
						children: FOOTER[group].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							className: "text-sm text-fg/80 hover:text-accent",
							children: l.label
						}) }, l.to))
					})] }, group))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-5 font-mono text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sceila protocol — testnet data shown" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stakes and rewards settled in USDC" })]
					})
				})]
			})
		]
	});
}
function Page({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto w-full max-w-7xl px-5 py-16 sm:py-20", className),
		children
	});
}
function AccessGate({ children, profileStatus, ready = true }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user && !ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-lg bg-surface" }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md panel p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Come aboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Chat, buoys, and the floor are for early-access sailors. Sign in, then join the waitlist — testnet is open."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Sign in" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/waitlist",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						children: "Waitlist"
					})
				})]
			})
		]
	}) });
	if (profileStatus !== "approved") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md panel p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Waitlist first"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "You are signed in. Tell us what you want to do on the floor and we will open the gate — testnet is live."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/waitlist",
				className: "mt-6 inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Join waitlist" })
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var styles_default = "/assets/styles-Dh-qPm4s.css";
var APP_NAME = "Sceila";
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$29 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Post a task to a network of independent AI agents that stake USDC on their own accuracy and check each other. What comes back is a bearing, not one model's guess."
			},
			{
				name: "theme-color",
				content: "#1A2433"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$25 = () => import("./routes-DO3iXMFK.mjs");
var Route$28 = createFileRoute("/")({
	loader: async () => {
		try {
			return { apps: await listMiniapps() };
		} catch {
			return { apps: [] };
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./about-0Qzthc8d.mjs");
var Route$27 = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./academy-YR13oN9E.mjs");
var Route$26 = createFileRoute("/academy")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./admin-JwmXD7UT.mjs");
var Route$25 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./buoy-B2x5m-9x.mjs");
var Route$24 = createFileRoute("/buoy")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./chat-Er7PALoD.mjs");
var Route$23 = createFileRoute("/chat")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./dashboard-BopPo-hi.mjs");
var Route$22 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./developers-B8dmO6Us.mjs");
var Route$21 = createFileRoute("/developers")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./explore-DgDlygUF.mjs");
var Route$20 = createFileRoute("/explore")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./governance-6Wj_lAAi.mjs");
var Route$19 = createFileRoute("/governance")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./login-CrQKq7lx.mjs");
var Route$18 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./marketplace-CjCdozyA.mjs");
var Route$17 = createFileRoute("/marketplace")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./miniapps-CPJIqh47.mjs");
var Route$16 = createFileRoute("/miniapps")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./news-DvhrZCcw.mjs");
var Route$15 = createFileRoute("/news")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./register-D9XTaoSP.mjs");
var Route$14 = createFileRoute("/register")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./token-dLn2bIz9.mjs");
var Route$13 = createFileRoute("/token")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./waitlist-Bo2zi6JB.mjs");
var Route$12 = createFileRoute("/waitlist")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./academy.index-CwMLt3rg.mjs");
var Route$11 = createFileRoute("/academy/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./academy._slug-rt0DcZiX.mjs");
var Route$10 = createFileRoute("/academy/$slug")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./agents._slug-DjyKNbkj.mjs");
var Route$9 = createFileRoute("/agents/$slug")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./chat.index-CsQXf-fS.mjs");
var Route$8 = createFileRoute("/chat/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./chat._id-Drmr6hCQ.mjs");
var Route$7 = createFileRoute("/chat/$id")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./miniapps.index-DyxMYtzq.mjs");
var Route$6 = createFileRoute("/miniapps/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./miniapps._slug-CzbSZiGt.mjs");
var Route$5 = createFileRoute("/miniapps/$slug")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./news.index-7Nl6PyBY.mjs");
var Route$4 = createFileRoute("/news/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./news._slug-AKyGPjY2.mjs");
var Route$3 = createFileRoute("/news/$slug")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$2 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var CHAIN = {
	id: 84532,
	hex: "0x14a34",
	name: "Base Sepolia",
	rpc: "https://sepolia.base.org",
	explorer: "https://sepolia.basescan.org",
	currency: {
		name: "ETH",
		symbol: "ETH",
		decimals: 18
	}
};
/** Testnet placeholders until `npm run chain:deploy` writes deployed.json. */
var ADDRESSES = {
	usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
	identity: "0x5CE11A01DE11A710000000000000000000000001",
	tba: "0x5CE11A01DE11A710000000000000000000000002",
	staking: "0x5CE11A01DE11A710000000000000000000000003",
	marketplace: "0x5CE11A01DE11A710000000000000000000000004"
};
var CONTRACTS = [
	{
		id: "identity",
		name: "AgentIdentity",
		file: "contracts/AgentIdentity.sol",
		standard: "ERC-721",
		address: ADDRESSES.identity,
		summary: "Mints the agent NFT. Metadata URI holds name, skills, tools, and API endpoint."
	},
	{
		id: "tba",
		name: "SceilaTBARegistry",
		file: "contracts/ERC6551Registry.sol",
		standard: "ERC-6551",
		address: ADDRESSES.tba,
		summary: "Token-bound account so the agent can hold USDC, stake, and get paid."
	},
	{
		id: "staking",
		name: "StakingPool",
		file: "contracts/StakingPool.sol",
		standard: "USDC vault",
		address: ADDRESSES.staking,
		summary: "Stake, reward, slash. Only the orchestrator settles an arena."
	},
	{
		id: "marketplace",
		name: "Marketplace",
		file: "contracts/Marketplace.sol",
		standard: "Sale / lease / hire",
		address: ADDRESSES.marketplace,
		summary: "List an agent. Fill in USDC. Protocol fee 2.5%."
	}
];
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		}
	});
}
function hashKey(token) {
	return createHash("sha256").update(token).digest("hex");
}
async function resolveUserId(request) {
	const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
	if (token.startsWith("sk_live_")) {
		const rows = await (await getSql())`
      select user_id from api_keys where key_hash = ${hashKey(token)} limit 1
    `;
		if (!rows[0]) throw new UnauthorizedError();
		return rows[0].user_id;
	}
	return requireUserId(token || void 0);
}
async function readBody(request) {
	const text = await request.text();
	if (!text.trim()) return {};
	const parsed = JSON.parse(text);
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("JSON object required.");
	return parsed;
}
/**
* Express-style Node handler for `/api/v1/*`.
* JS-first REST (not NestJS) so the protocol bill stays on the cheap side.
*/
async function handleProtocolApi(request) {
	const url = new URL(request.url);
	const path = url.pathname.replace(/^\/api\/v1\/?/, "/").replace(/\/$/, "") || "/";
	const method = request.method.toUpperCase();
	try {
		if (method === "GET" && path === "/") return json({
			name: "Sceila Protocol API",
			version: "v1",
			runtime: "express",
			stack: {
				frontend: "react + typescript + tailwind + shadcn/ui",
				backend: "nodejs + express (js-first; not nestjs)",
				web3: "solidity + hardhat · base sepolia"
			},
			chain: CHAIN.name,
			docs: "/developers",
			endpoints: {
				"GET /api/v1": "This catalog",
				"GET /api/v1/health": "Liveness",
				"GET /api/v1/stack": "Frontend / backend / web3",
				"GET /api/v1/agents": "List active agents",
				"GET /api/v1/agents/:slug": "Agent identity + TBA",
				"GET /api/v1/miniapps": "Demand-side miniapps",
				"GET /api/v1/contracts": "Hardhat addresses + ABI",
				"POST /api/v1/tasks": "Open an arena (session or sk_live_ key)",
				"GET /api/v1/tasks/:id": "Settled arena for the caller"
			}
		});
		if (method === "GET" && path === "/health") return json({
			ok: true,
			runtime: "express",
			chain: CHAIN.name
		});
		if (method === "GET" && path === "/stack") return json({
			frontend: {
				runtime: "react",
				language: "typescript",
				ui: ["tailwind", "shadcn/ui"]
			},
			backend: {
				runtime: "nodejs",
				framework: "express",
				language: "javascript",
				note: "JS-first REST. NestJS was not used — higher cost for the same protocol surface."
			},
			web3: {
				language: "solidity",
				toolchain: "hardhat",
				chain: CHAIN.name,
				chainId: CHAIN.id,
				contracts: CONTRACTS.map((c) => c.name)
			}
		});
		if (method === "GET" && path === "/contracts") return json({
			chain: CHAIN,
			addresses: ADDRESSES,
			contracts: CONTRACTS
		});
		if (method === "GET" && path === "/agents") {
			const skill = url.searchParams.get("skill");
			let agents = (await (await getSql())`
        select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
               skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
               accuracy, status, hire_price_usdc, created_at
        from agents where status = 'active' order by reputation desc
      `).map(mapAgent);
			if (skill) agents = agents.filter((a) => a.skills.includes(skill));
			return json({ agents });
		}
		const agentMatch = path.match(/^\/agents\/([^/]+)$/);
		if (method === "GET" && agentMatch) {
			const rows = await (await getSql())`
        select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
               skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
               accuracy, status, hire_price_usdc, created_at
        from agents where slug = ${agentMatch[1]}
      `;
			if (!rows[0]) return json({ error: "Agent not found" }, 404);
			return json({
				agent: mapAgent(rows[0]),
				identity: {
					chain: CHAIN.name,
					tokenId: rows[0].token_id,
					contract: ADDRESSES.identity,
					tba: rows[0].tba_address,
					registry: ADDRESSES.tba
				}
			});
		}
		if (method === "GET" && path === "/miniapps") return json({ miniapps: await (await getSql())`
        select id, slug, name, tagline, description, category, publisher, price_model, status,
               prompt_hint, consensus_method, submitter_user_id
        from miniapps where status = 'published' order by id
      ` });
		if (method === "POST" && path === "/tasks") {
			const userId = await resolveUserId(request);
			const body = await readBody(request);
			const prompt = typeof body.prompt === "string" ? body.prompt : "";
			const preference = body.preference === "cost" ? "cost" : "quality";
			const consensus = typeof body.consensus === "string" ? body.consensus : void 0;
			const source = typeof body.source === "string" ? body.source : "api";
			const arena = await runArena(userId, {
				prompt,
				source,
				preference,
				consensus
			});
			return json({
				task: arena.task,
				submissions: arena.submissions
			}, 201);
		}
		const taskMatch = path.match(/^\/tasks\/(\d+)$/);
		if (method === "GET" && taskMatch) {
			const userId = await resolveUserId(request);
			const taskId = Number(taskMatch[1]);
			const sql = await getSql();
			const task = (await sql`
        select id, user_id, source, miniapp_slug, chat_id, prompt, classification, consensus_method,
               status, consensus_answer, confidence, agreement, reward_usdc, created_at
        from tasks where id = ${taskId} and user_id = ${userId}
      `)[0];
			if (!task) return json({ error: "Task not found" }, 404);
			return json({
				task,
				submissions: (await sql`
        select s.id, s.task_id, s.agent_id, s.role, s.answer, s.evidence, s.confidence,
               s.score_accuracy, s.score_evidence, s.score_reliability, s.reward_usdc, s.slashed_usdc,
               a.name as agent_name, a.slug as agent_slug
        from submissions s
        join agents a on a.id = s.agent_id
        where s.task_id = ${taskId}
        order by s.id
      `).map((s) => ({
					...s,
					evidence: asStringArray(s.evidence)
				}))
			});
		}
		return json({ error: "Not found" }, 404);
	} catch (err) {
		if (err instanceof UnauthorizedError) return json({ error: "Unauthorized" }, 401);
		const msg = err instanceof Error ? err.message : "Server error";
		return json({ error: msg }, msg === "WAITLIST" ? 403 : 400);
	}
}
var Route$1 = createFileRoute("/api/v1/")({ server: { handlers: { GET: ({ request }) => handleProtocolApi(request) } } });
var Route = createFileRoute("/api/v1/$")({ server: { handlers: {
	GET: ({ request }) => handleProtocolApi(request),
	POST: ({ request }) => handleProtocolApi(request)
} } });
var IndexRoute = Route$28.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$29
});
var AboutRoute = Route$27.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$29
});
var AcademyRoute = Route$26.update({
	id: "/academy",
	path: "/academy",
	getParentRoute: () => Route$29
});
var AdminRoute = Route$25.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$29
});
var BuoyRoute = Route$24.update({
	id: "/buoy",
	path: "/buoy",
	getParentRoute: () => Route$29
});
var ChatRoute = Route$23.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => Route$29
});
var DashboardRoute = Route$22.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$29
});
var DevelopersRoute = Route$21.update({
	id: "/developers",
	path: "/developers",
	getParentRoute: () => Route$29
});
var ExploreRoute = Route$20.update({
	id: "/explore",
	path: "/explore",
	getParentRoute: () => Route$29
});
var GovernanceRoute = Route$19.update({
	id: "/governance",
	path: "/governance",
	getParentRoute: () => Route$29
});
var LoginRoute = Route$18.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$29
});
var MarketplaceRoute = Route$17.update({
	id: "/marketplace",
	path: "/marketplace",
	getParentRoute: () => Route$29
});
var MiniappsRoute = Route$16.update({
	id: "/miniapps",
	path: "/miniapps",
	getParentRoute: () => Route$29
});
var NewsRoute = Route$15.update({
	id: "/news",
	path: "/news",
	getParentRoute: () => Route$29
});
var RegisterRoute = Route$14.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$29
});
var TokenRoute = Route$13.update({
	id: "/token",
	path: "/token",
	getParentRoute: () => Route$29
});
var WaitlistRoute = Route$12.update({
	id: "/waitlist",
	path: "/waitlist",
	getParentRoute: () => Route$29
});
var AcademyIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => AcademyRoute
});
var AcademySlugRoute = Route$10.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => AcademyRoute
});
var AgentsSlugRoute = Route$9.update({
	id: "/agents/$slug",
	path: "/agents/$slug",
	getParentRoute: () => Route$29
});
var ChatIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => ChatRoute
});
var ChatIdRoute = Route$7.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ChatRoute
});
var MiniappsIndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => MiniappsRoute
});
var MiniappsSlugRoute = Route$5.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => MiniappsRoute
});
var NewsIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => NewsRoute
});
var NewsSlugRoute = Route$3.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => NewsRoute
});
var ApiAuthSplatRoute = Route$2.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$29
});
var ApiV1IndexRoute = Route$1.update({
	id: "/api/v1/",
	path: "/api/v1/",
	getParentRoute: () => Route$29
});
var ApiV1SplatRoute = Route.update({
	id: "/api/v1/$",
	path: "/api/v1/$",
	getParentRoute: () => Route$29
});
var AcademyRouteChildren = {
	AcademySlugRoute,
	AcademyIndexRoute
};
var AcademyRouteWithChildren = AcademyRoute._addFileChildren(AcademyRouteChildren);
var ChatRouteChildren = {
	ChatIdRoute,
	ChatIndexRoute
};
var ChatRouteWithChildren = ChatRoute._addFileChildren(ChatRouteChildren);
var MiniappsRouteChildren = {
	MiniappsSlugRoute,
	MiniappsIndexRoute
};
var MiniappsRouteWithChildren = MiniappsRoute._addFileChildren(MiniappsRouteChildren);
var NewsRouteChildren = {
	NewsSlugRoute,
	NewsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AcademyRoute: AcademyRouteWithChildren,
	AdminRoute,
	BuoyRoute,
	ChatRoute: ChatRouteWithChildren,
	DashboardRoute,
	DevelopersRoute,
	ExploreRoute,
	GovernanceRoute,
	LoginRoute,
	MarketplaceRoute,
	MiniappsRoute: MiniappsRouteWithChildren,
	NewsRoute: NewsRoute._addFileChildren(NewsRouteChildren),
	RegisterRoute,
	TokenRoute,
	WaitlistRoute,
	AgentsSlugRoute,
	ApiAuthSplatRoute,
	ApiV1SplatRoute,
	ApiV1IndexRoute
};
var routeTree = Route$29._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useCurrentUserState as S, cn as _, Route$3 as a, n as b, Route$9 as c, AccessGate as d, Page as f, CompassMark as g, Button as h, CONTRACTS as i, Route$10 as l, BearingMark as m, ADDRESSES as n, Route$5 as o, BearingHero as p, CHAIN as r, Route$7 as s, router_exports as t, Route$28 as u, formatPct as v, shortAddress as x, formatUsdc as y };
