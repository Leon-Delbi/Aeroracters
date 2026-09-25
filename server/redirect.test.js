import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import settings from "./settings.json" with { type: "json" };
import { parseRedirectUrl } from "./redirect.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientScript = readFileSync(
	path.resolve(__dirname, "..", "client", "src", "script.js"),
	"utf8",
);

test("redirect commands use the requested rank gates", () => {
	assert.equal(settings.runlevel.redirect, 4);
	assert.equal(settings.runlevel.massredirect, 6);
});

test("redirect URLs accept only bounded HTTP and HTTPS destinations", () => {
	assert.equal(parseRedirectUrl("https://example.com/path"), "https://example.com/path");
	assert.equal(parseRedirectUrl("http://example.com"), "http://example.com/");
	assert.equal(parseRedirectUrl("javascript:alert(1)"), null);
	assert.equal(parseRedirectUrl("data:text/html,test"), null);
	assert.equal(parseRedirectUrl("not a url"), null);
	assert.equal(parseRedirectUrl(`https://example.com/${"x".repeat(2048)}`), null);
});

test("client supports disabling crosscolors and validates redirect events", () => {
	assert.match(clientScript, /disableCrosscolors/);
	assert.match(clientScript, /socket\.on\("redirect"/);
	assert.match(clientScript, /url\.protocol === "http:" \|\| url\.protocol === "https:"/);
});

test("godmode context menu offers redirect only to Popes for another user", () => {
	assert.match(
		clientScript,
		/"redirectuser": \{\s*name: "Redirect User",\s*callback: \(\) => \{\s*const destination = prompt\(`Redirect \$\{this\.userPublic\.name\} to an HTTP\(S\) URL:`\);\s*if \(destination === null \|\| !destination\.trim\(\)\) return;\s*cmd\(`redirect \$\{this\.id\} \$\{destination\.trim\(\)\}`\);\s*\},\s*visible: \(\) => pope && this\.id !== me,/,
	);
	assert.equal(settings.runlevel.redirect, 4);
});