import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import settings from "./settings.json" with { type: "json" };
import { buildGodmodeTrackerPage, getActiveGodmodeSessions } from "./godmodeTracker.js";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));

test("tracker returns active staff names and ranks without exposing Godwords", () => {
	const secretWord = "secret-godword-must-not-appear";
	const sessions = getActiveGodmodeSessions([
		{ public: { name: "Pope User" }, runlevel: 4, runword: secretWord },
		{ public: { name: "Big Owner" }, runlevel: 8, runword: secretWord },
		{ public: { name: "Regular User" }, runlevel: 0, runword: secretWord },
		{ public: { name: "Blessed User" }, runlevel: 1, runword: secretWord },
	]);

	assert.deepEqual(sessions, [
		{ name: "Big Owner", rank: "Big Owner" },
		{ name: "Pope User", rank: "Pope" },
	]);
	assert.equal(JSON.stringify(sessions).includes(secretWord), false);
});

test("tracker paginates ranked sessions and rejects invalid page numbers", () => {
	const users = Array.from({ length: 21 }, (_, index) => ({
		public: { name: `Pope ${String(index + 1).padStart(2, "0")}` },
		runlevel: 4,
	}));

	const firstPage = buildGodmodeTrackerPage(users);
	const secondPage = buildGodmodeTrackerPage(users, "2");
	assert.equal(firstPage.title, "Godmode tracker — 1/2");
	assert.equal(firstPage.lines.filter((line) => line.includes(" — Pope")).length, 20);
	assert.ok(firstPage.lines.includes("Next: /godmodetracker 2"));
	assert.equal(secondPage.title, "Godmode tracker — 2/2");
	assert.deepEqual(secondPage.lines.slice(3, 4), ["Pope 21 — Pope"]);
	assert.ok(secondPage.lines.includes("Previous: /godmodetracker 1"));
	assert.deepEqual(buildGodmodeTrackerPage(users, "0"), {
		error: "Usage: /godmodetracker [page number]",
	});
});

test("godmodetracker is Big Owner-only and discoverable in the Big Owner command list", () => {
	assert.equal(settings.runlevel.godmodetracker, 8);
	const serverSource = readFileSync(path.join(serverDirectory, "server.js"), "utf8");
	const clientSource = readFileSync(
		path.join(serverDirectory, "..", "client", "src", "script.js"),
		"utf8",
	);

	assert.match(serverSource, /"godmodetracker": function \(input\) \{\s*if \(this\.runlevel !== 8\)/);
	assert.match(serverSource, /buildGodmodeTrackerPage\(listUsers\(\), input\)/);
	assert.match(clientSource, /option\.value = "\/godmodetracker"/);
	assert.match(clientSource, /if \(bigowner && !hasGodmodeTracker\)/);
});