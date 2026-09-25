export function parseRedirectUrl(input) {
	const value = String(input || "").trim();
	if (!value || value.length > 2048) return null;
	try {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;
		return url.href;
	} catch {
		return null;
	}
}