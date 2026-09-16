import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Route$5 } from "./router-CSzY4ZyM.mjs";
import { t as ChatDesk } from "./chat-desk-D8yPm9R8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._id-Bljx2svI.js
var import_jsx_runtime = require_jsx_runtime();
function ChatIdPage() {
	const { id } = Route$5.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatDesk, { activeId: Number(id) });
}
//#endregion
export { ChatIdPage as component };
