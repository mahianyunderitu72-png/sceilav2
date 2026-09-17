import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Clapperboard, a as Ship, c as PenLine, g as CodeXml, h as Compass, l as Palette, m as GraduationCap, o as Scale, p as Headset, r as TrendingUp, u as Newspaper, v as BookOpen } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/miniapp-icon-_iJVDqZQ.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	ledger: BookOpen,
	keel: CodeXml,
	chartroom: Compass,
	helm: Ship,
	quill: PenLine,
	atlas: GraduationCap,
	draft: Palette,
	loom: Clapperboard,
	harbor: Scale,
	beacon: Headset,
	masthead: Newspaper,
	ticker: TrendingUp
};
function MiniappIcon({ slug, className }) {
	const Icon = ICONS[slug] ?? Compass;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className,
		strokeWidth: 1.5,
		"aria-hidden": true
	});
}
//#endregion
export { MiniappIcon as t };
