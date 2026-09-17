import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as getMyProfile } from "./profile-DT1N3liZ.mjs";
import { S as useCurrentUserState } from "./router-ZNQP7vuZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-profile-DP7G88dM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useProfile() {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user) {
			setProfile(null);
			setReady(true);
			return;
		}
		setReady(false);
		getMyProfile().then((p) => {
			setProfile(p);
			setReady(true);
		}).catch(() => {
			setProfile(null);
			setReady(true);
		});
	}, [user, isPending]);
	return {
		profile,
		setProfile,
		ready,
		user,
		isPending
	};
}
//#endregion
export { useProfile as t };
