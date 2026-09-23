import test from "node:test";
import assert from "node:assert/strict";
import settings from "./settings.json" with { type: "json" };
import { normalizeCookieKey } from "./database.js";
import { getPublicRankFlags } from "./rankIcons.js";

test("normalizeCookieKey sanitizes cookies consistently for godword persistence", () => {
	assert.equal(normalizeCookieKey("token-123"), "token-123");
	assert.equal(normalizeCookieKey("bad\u0000cookie"), "bad�cookie");
});

test("getPublicRankFlags exposes the Onantis icon without the gavel for runlevel 4.5", () => {
	const flags = getPublicRankFlags(4.5);
	assert.equal(flags.runlevel, 4.5);
	assert.equal(flags.onantis, true);
	assert.equal(flags.gavel, false);
	assert.equal(flags.crown, false);
});

test("Onantis rank can access the intended moderation commands", () => {
	assert.equal(settings.runlevel.promote, 4.5);
	assert.equal(settings.runlevel.promotehighking, 4.5);
	assert.equal(settings.runlevel.info, 4.5);
	assert.equal(settings.runlevel.forcemessage, 4.5);
});

test("Onantis rank can demote Low Kings and High Kings", () => {
	assert.equal(settings.runlevel.demote, 4.5);
	assert.equal(settings.runlevel.demotehighking, 4.5);
});

test("Restart command is restricted to Onantis+ ranks", () => {
	assert.equal(settings.runlevel.restart, 4.5);
});

test("Admin command is available at runlevel 4", () => {
	assert.equal(settings.runlevel.admin, 4);
});
