//#region node_modules/.nitro/vite/services/ssr/assets/parse-DmEVgOz0.js
function asStringArray(value) {
	if (Array.isArray(value)) return value.map(String);
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		if (Array.isArray(parsed)) return parsed.map(String);
	} catch {
		return value ? [value] : [];
	}
	return [];
}
//#endregion
export { asStringArray as t };
