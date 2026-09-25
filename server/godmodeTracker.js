const GODMODE_RANKS = new Map([
	[1.05, "Janitor"],
	[1.75, "DJ"],
	[2, "Low King"],
	[3, "High King"],
	[4, "Pope"],
	[5, "Contributor"],
	[6, "Developer"],
	[7, "Owner"],
	[7.5, "Radical"],
	[8, "Big Owner"],
]);

const GODMODE_RANK_ORDER = new Map(
	[...GODMODE_RANKS.entries()].map(([runlevel, rank], index) => [rank, index]),
);
const TRACKER_PAGE_SIZE = 20;

export function getActiveGodmodeSessions(users) {
	if (!Array.isArray(users)) return [];

	return users
		.flatMap((user) => {
			const rank = GODMODE_RANKS.get(Number(user?.runlevel));
			if (!rank) return [];
			return [{
				name: typeof user?.public?.name === "string" ? user.public.name : "Unknown user",
				rank,
			}];
		})
		.sort((a, b) =>
			GODMODE_RANK_ORDER.get(b.rank) - GODMODE_RANK_ORDER.get(a.rank)
			|| a.name.localeCompare(b.name),
		);
}

export function buildGodmodeTrackerPage(users, pageInput = "") {
	const rawPage = String(pageInput ?? "").trim();
	const requestedPage = rawPage ? Number(rawPage) : 1;
	if (!Number.isSafeInteger(requestedPage) || requestedPage < 1) {
		return { error: "Usage: /godmodetracker [page number]" };
	}

	const sessions = getActiveGodmodeSessions(users);
	const totalPages = Math.max(1, Math.ceil(sessions.length / TRACKER_PAGE_SIZE));
	const page = Math.min(requestedPage, totalPages);
	if (sessions.length === 0) {
		return {
			title: "Godmode tracker",
			lines: ["No active staff sessions."],
		};
	}

	const startIndex = (page - 1) * TRACKER_PAGE_SIZE;
	const visibleSessions = sessions.slice(startIndex, startIndex + TRACKER_PAGE_SIZE);
	const lines = [
		`Active staff sessions: ${sessions.length}`,
		`Page ${page}/${totalPages}`,
		"",
		...visibleSessions.map(({ name, rank }) => `${name} — ${rank}`),
	];
	if (page < totalPages) lines.push("", `Next: /godmodetracker ${page + 1}`);
	if (page > 1) lines.push("", `Previous: /godmodetracker ${page - 1}`);

	return {
		title: `Godmode tracker — ${page}/${totalPages}`,
		lines,
	};
}