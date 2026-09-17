import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as Route$7 } from "./router-ZNQP7vuZ.mjs";
import { t as ChatDesk } from "./chat-desk-B3Nc6Tjs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._id-Drmr6hCQ.js
var import_jsx_runtime = require_jsx_runtime();
function ChatIdPage() {
	const { id } = Route$7.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatDesk, { activeId: Number(id) });
}
//#endregion
export { ChatIdPage as component };
