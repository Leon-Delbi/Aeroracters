import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientScript = readFileSync(path.resolve(__dirname, "..", "client", "src", "script.js"), "utf8");
const clientStyle = readFileSync(path.resolve(__dirname, "..", "client", "src", "style.css"), "utf8");
const bonziData = readFileSync(path.resolve(__dirname, "..", "client", "src", "bonziData.js"), "utf8");
const serverScript = readFileSync(path.resolve(__dirname, "server.js"), "utf8");
const serverIndex = readFileSync(path.resolve(__dirname, "index.js"), "utf8");
const rankIcons = readFileSync(path.resolve(__dirname, "rankIcons.js"), "utf8");
const serverPackage = JSON.parse(readFileSync(path.resolve(__dirname, "package.json"), "utf8"));
const clientIndex = readFileSync(path.resolve(__dirname, "..", "client", "src", "index.html"), "utf8");
const readme = readFileSync(path.resolve(__dirname, "..", "client", "src", "readme.html"), "utf8");
const changelog = readFileSync(path.resolve(__dirname, "..", "client", "src", "changelog.html"), "utf8");
const apiRoutes = readFileSync(path.resolve(__dirname, "..", "..", "artifacts", "api-server", "src", "routes", "index.ts"), "utf8");
const databaseScript = readFileSync(path.resolve(__dirname, "database.js"), "utf8");
const settings = JSON.parse(readFileSync(path.resolve(__dirname, "settings.json"), "utf8"));
const vault = JSON.parse(readFileSync(path.resolve(__dirname, "vault.json"), "utf8"));

test("sheet crosscolors keep animated sprite positioning", () => {
	const imageColorFunction = clientScript.match(/function isImageColor\(color\) \{[\s\S]*?\n\}/)?.[0] || "";
	assert.match(imageColorFunction, /startsWith\("img:"\)/);
	assert.doesNotMatch(imageColorFunction, /startsWith\("sheet:"\)/);
});

test("new glow and horror markups use the requested tokens and hex colors", () => {
	assert.match(clientScript, /"\^b\^": "gay-blueglow"/);
	assert.match(clientScript, /"\^r\^": "gay-redglow"/);
	assert.match(clientScript, /"-b-": "horror-blue"/);
	assert.match(clientScript, /"-g-": "horror-green"/);
	assert.match(clientStyle, /gay-blueglow[\s\S]*#0000ff/);
	assert.match(clientStyle, /gay-redglow[\s\S]*#ff0000/);
	assert.match(clientStyle, /horror-flicker-blue[\s\S]*#0000ff/);
	assert.match(clientStyle, /horror-flicker-green[\s\S]*#00ff00/);
});

test("rainbow glow and rainbow horror markups are registered and styled", () => {
	assert.match(clientScript, /"\$u\$": "gay-rainbowglow"/);
	assert.match(clientScript, /"\*u\*": "horror-rainbow"/);
	assert.match(clientStyle, /gay-rainbowglow[\s\S]*#ff00ff/);
	assert.match(clientStyle, /horror-flicker-rainbow[\s\S]*#00ffff/);
	assert.match(readme, /<gay-code>\$u\$<\/gay-code>[\s\S]*Rainbow glow/);
	assert.match(readme, /<gay-code>\*u\*<\/gay-code>[\s\S]*Rainbow horror/);
});

test("speech cleanup strips spin, glow, and colored horror markup tokens", () => {
	const speechFunction = clientScript.match(/function markdownToSpeech\(say, french\) \{[\s\S]*?\n\}/)?.[0] || "";
	for (const token of ["\\$i\\$", "\\^b\\^", "\\^r\\^", "\\$u\\$", "-b-", "-g-", "\\*u\\*"]) {
		assert.ok(speechFunction.includes(token), `${token} should not be spoken`);
	}
});

test("README documents every active markup token", () => {
	const rulesBlock = clientScript.match(/let rules = \{([\s\S]*?)\n\}/)?.[1] || "";
	const markupTokens = [...rulesBlock.matchAll(/^\s*"([^"]+)":/gm)].map(([, token]) => token);
	for (const token of markupTokens) {
		assert.ok(readme.includes(`<gay-code>${token}</gay-code>`), `${token} should be documented`);
	}
	assert.match(readme, /<gay-code>%%<\/gay-code>[\s\S]*currently disabled/);
});

test("source downloads refresh when included source files change", () => {
	assert.match(serverIndex, /function getSourceArchiveManifest\(\)/);
	assert.match(serverIndex, /stat\.size/);
	assert.match(serverIndex, /stat\.mtimeMs/);
	assert.match(serverIndex, /sourceArchive\?\.signature === signature/);
	assert.match(serverIndex, /Cache-Control", "no-store"/);
});

test("crosshat preserves existing custom hats with a bounded layer count", () => {
	const handler = serverScript.match(/"crosshat": async function\(img\) \{[\s\S]*?\n\t\},/)?.[0] || "";
	assert.match(handler, /const \[baseColor, \.\.\.currentHats\]/);
	assert.match(handler, /currentHats, crosshat/);
	assert.match(handler, /length >= 10/);
	assert.doesNotMatch(handler, /filter\(hat => !hat\.startsWith\("hatimg:"\)\)/);
});

test("crosshats remain separate from the crosscolor background URL", () => {
	const renderer = clientScript.match(/function toBgImg\(name, color\) \{[\s\S]*?\n\}/)?.[0] || "";
	assert.match(renderer, /const \[baseColor\] = String\(color \|\| ""\)\.split\(" "\)/);
	assert.match(renderer, /resolveBonziAssetUrl\(baseColor\)/);
	assert.doesNotMatch(renderer, /resolveBonziAssetUrl\(color\)/);
});

test("animated sheet frames cannot hide custom crosshats", () => {
	const setSprite = clientScript.match(/setSprite\(sprite\) \{[\s\S]*?\n    \}/)?.[0] || "";
	assert.match(setSprite, /this\.hatLayer\.hidden = !hasImageHat\(this\.color\) && !\(sprite === 0 \|\| sprite >= 142\)/);
});

test("auto join applies crosscolors after normal colors and supports multiple crosshats", () => {
	const handler = serverScript.match(/async function applyAutoJoin\(user, auto\) \{[\s\S]*?\n\}/)?.[0] || "";
	assert.ok(handler.indexOf("auto.color") < handler.indexOf("auto.crosscolor"));
	assert.ok(handler.indexOf("auto.hats") < handler.indexOf("auto.crosshats"));
	assert.match(handler, /await run\("crosscolor", crosscolor\)/);
	assert.match(handler, /for \(const crosshat of crosshats\.slice\(0, 10\)\)/);
	assert.match(clientScript, /autoCrosscolor/);
	assert.match(clientScript, /autoCrosshats/);
});

test("BWIWORLD teal, indigo, and violet colors are registered with assets", () => {
	for (const color of ["teal", "indigo", "violet"]) {
		assert.ok(settings.bonziColors.includes(color));
		assert.match(bonziData, new RegExp(`"${color}"`));
		for (const folder of ["bonzi", "pfp"]) {
			const asset = readFileSync(path.resolve(__dirname, "..", "client", "src", "img", folder, `${color}.webp`));
			assert.ok(asset.length > 100);
		}
	}
});

test("brainrotted is a public color and command", () => {
	assert.ok(settings.bonziColors.includes("brainrotted"));
	assert.equal(settings.runlevel.brainrotted, 0);
	assert.match(bonziData, /"brainrotted"/);
	assert.match(clientScript, /"brainrotted"/);
	const start = serverScript.indexOf('"brainrotted": function () {');
	const end = serverScript.indexOf('"colour": "color"', start);
	const handler = serverScript.slice(start, end);
	assert.ok(start >= 0 && end > start);
	assert.match(handler, /this\.public\.color = "brainrotted"/);
	assert.match(handler, /this\.room\.updateUser\(this\)/);
	assert.match(changelog, /public <code>brainrotted<\/code> color/);
	for (const folder of ["bonzi", "pfp"]) {
		assert.ok(readFileSync(path.resolve(__dirname, "..", "client", "src", "img", folder, "brainrotted.webp")).length > 100);
	}
});

test("sticky restores the verified 1.7.6a spritesheet at runlevel 7.5", () => {
	assert.equal(settings.runlevel.sticky, 7.5);
	assert.doesNotMatch(settings.bonziColors.join(" "), /sticky|stick/);
	const start = serverScript.indexOf('"sticky": function () {');
	const end = serverScript.indexOf('"brainrotted": function () {', start);
	const handler = serverScript.slice(start, end);
	assert.ok(start >= 0 && end > start);
	assert.match(handler, /this\.public\.color = "stick"/);
	assert.match(handler, /this\.public\.tag = "The BELOVED Stickman himself"/);
	assert.match(handler, /this\.room\.updateUser\(this\)/);

	const sheet = readFileSync(path.resolve(__dirname, "..", "client", "src", "img", "bonzi", "stick.png"));
	assert.equal(sheet.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
	assert.equal(sheet.readUInt32BE(16), 2400);
	assert.equal(sheet.readUInt32BE(20), 2080);
	assert.ok(readFileSync(path.resolve(__dirname, "..", "client", "src", "img", "bonzi", "stick.webp")).length > 100000);
});

test("Low Kings and above can make a lower-ranked user brainrotted", () => {
	assert.equal(settings.runlevel.makebrainrotted, 2);
	assert.match(serverScript, /"makebrainrotted": function\(args\) \{/);
	assert.match(serverScript, /staffTargetWarning\(this, user, "makebrainrotted"\)/);
	assert.match(serverScript, /user\.public\.name = "MANGO 67"/);
	assert.match(serverScript, /user\.public\.color = "brainrotted"/);
	assert.match(serverScript, /user\.public\.tag = "Brainrotted"/);
	assert.match(serverScript, /67 MANGO MANGO MANGO MUSTARD! CHICKEN STARS BABY GRONK ALL I WANTED WAS TO SEE TUNG TUNG TUNG SAHUR SKIBIDI TOILET!/);
	assert.match(serverScript, /"makebrainrotted"\s*\)/);
	assert.match(clientScript, /name: "Make him brainrotted"/);
	assert.match(clientScript, /cmd\(`makebrainrotted \$\{this\.id\}`\)/);
	assert.match(clientScript, /visible: \(\) => king \|\| admin \|\| pope \|\| owner \|\| radical/);
});

test("Bombify applies the requested name, tag, and forced message", () => {
	assert.equal(settings.runlevel.bombify, 2);
	const start = serverScript.indexOf('"bombify": function (id) {');
	const end = serverScript.indexOf('"banimg": async function (text) {', start);
	const handler = serverScript.slice(start, end);
	assert.ok(start >= 0 && end > start);
	assert.match(handler, /staffTargetWarning\(this, user, "bombify"\)/);
	assert.match(handler, /user\.public\.color = "brown"/);
	assert.match(handler, /user\.public\.name = "NUKED"/);
	assert.match(handler, /user\.public\.tag = "BIG BOOM"/);
	assert.match(handler, /I JUST DID A BOOM BOOM/);
	assert.doesNotMatch(handler, /I LOVE BAD PEOPLE|BAD PERSON|I AM A BAD PERSON/);
	assert.match(clientScript, /name: "Bombify"/);
	assert.match(changelog, /NUKED.*BIG BOOM.*I JUST DID A BOOM BOOM/);
});

test("Low Kings and above can Kirovify a user with an allowed color", () => {
	assert.equal(settings.runlevel.kirovify, 2);
	const start = serverScript.indexOf('"kirovify": function(args) {');
	const end = serverScript.indexOf('"forceannounce": function(args) {', start);
	const handler = serverScript.slice(start, end);
	assert.ok(start >= 0 && end > start);
	assert.match(serverScript, /staffTargetWarning\(this, user, "kirovify"\)/);
	for (const color of ["maroon", "red", "orange", "yellow", "green", "teal", "cyan", "blue", "indigo", "violet", "purple", "pink", "magenta", "white", "gray", "black"]) {
		assert.match(handler, new RegExp(`"${color}"`));
	}
	assert.match(handler, /Math\.floor\(Math\.random\(\) \* colors\.length\)/);
	assert.match(handler, /user\.public\.name = "OfficerKirov247"/);
	assert.match(handler, /KLASKY CSUPO SKIBIDI GYATT IN 5\. 4\. 3\. 2\. 1! GYATT! 0! HAPPY NEW YEAR 2017!/);
	assert.match(clientScript, /name: "Kirovify"/);
	assert.match(clientScript, /cmd\(`kirovify \$\{this\.id\}`\)/);
	assert.match(clientScript, /visible: \(\) => king \|\| admin \|\| pope \|\| owner \|\| radical/);
	assert.match(changelog, /OfficerKirov247.*HAPPY NEW YEAR/i);
});

test("Low Kings and above can TKOBify a user with the requested appearance and message", () => {
assert.equal(settings.runlevel.tkobify, 2);
const start = serverScript.indexOf('"tkobify": function(args) {');
const end = serverScript.indexOf('"forceannounce": function(args) {', start);
const handler = serverScript.slice(start, end);
assert.ok(start >= 0 && end > start);
assert.match(handler, /staffTargetWarning\(this, user, "tkobify"\)/);
assert.match(handler, /user\.public\.color = "blue bfdi"/);
assert.match(handler, /user\.public\.name = "The King of Blue"/);
assert.match(handler, /WHAT YOU'VE DONE, WAS ABSOLUTELY TERRIBLE/);
assert.match(handler, /BLUE​COINY, SHUT YOUR FUCKING MOUTH/);
assert.match(handler, /\*\*LEAVE THE DAMN INTERNET!!\*\*/);
assert.match(handler, /\*\*\^\^LEAVE THE DAMN INTERNET!\^\^\*\*/);
assert.match(clientScript, /name: "TKOBify"/);
assert.match(clientScript, /cmd\(`tkobify \$\{this\.id\}`\)/);
assert.match(clientScript, /visible: \(\) => king \|\| admin \|\| pope \|\| owner \|\| radical/);
assert.match(changelog, /TKOBify.*The King of Blue/);
});

test("Low Kings and above can hackerify a user with the requested appearance and message", () => {
	assert.equal(settings.runlevel.hackerify, 2);
	const start = serverScript.indexOf('"hackerify": function(args) {');
	const end = serverScript.indexOf('"forceannounce": function(args) {', start);
	const handler = serverScript.slice(start, end);
	assert.ok(start >= 0 && end > start);
	assert.match(serverScript, /staffTargetWarning\(this, user, "hackerify"\)/);
	assert.match(handler, /user\.public\.color = "jungle hacker"/);
	assert.match(handler, /user\.public\.name = "STUPID HACKER"/);
	assert.match(handler, /user\.public\.tag = "I LOVE HACKING"/);
	assert.match(handler, /HAHAHAHAHAHAHAHAHA! I LOVE HACKING AND LEAKING THE GODMODE IN BONZIWORLD HAHAHAHAHAHAHAHAHA!/);
	assert.match(handler, /user\.room\.updateUser\(user\)/);
	assert.match(handler, /user\.room\.emit\("talk"/);

	const funMenu = clientScript.slice(clientScript.indexOf('"fun": {'), clientScript.indexOf('"mod": {'));
	const customifyMenu = funMenu.slice(funMenu.indexOf('"customify": {'));
	assert.match(customifyMenu, /"hackerify": \{[\s\S]*?name: "Hackerify"[\s\S]*?cmd\(`hackerify \$\{this\.id\}`\)[\s\S]*?visible: \(\) => king \|\| admin \|\| pope \|\| owner \|\| radical \|\| bigowner/);
	assert.match(funMenu, /visible: \(\) => janitor \|\| admin \|\| king \|\| pope \|\| owner \|\| radical \|\| bigowner/);
});

test("audit center sends structured records for the redesigned client console", () => {
	assert.match(serverScript, /audit:\s*\{\s*events,\s*total: events\.length,\s*\}/);
	assert.match(clientScript, /if \(data\?\.audit\) \{\s*Dialog\.auditCenter\(data\);/);
	assert.match(clientScript, /static auditCenter\(data\)/);
	assert.match(clientScript, /data-audit-search/);
	assert.match(clientScript, /data-audit-filter/);
	assert.match(clientScript, /No matching events/);
});

test("promoted staff roles persist and restore their labels", () => {
	assert.match(serverScript, /function persistedRankTag\(storedHash\)/);
	assert.match(serverScript, /const restoredTag = persistedRankTag\(storedHash\)/);

	for (const [rankWord, tag] of [
		["lowerKings", "Low King"],
		["higherKings", "High King"],
		["popewords", "Pope"],
		["contributors", "Contributor"],
		["developers", "Developer"],
	]) {
		assert.match(
			serverScript,
			new RegExp(`storedHash === ${rankWord}.*return "${tag}"`, "s"),
			`${tag} should restore its persistent label`,
		);
		assert.match(
			serverScript,
			new RegExp(`user\\.runword = ${rankWord};\\s*await persistRankWord\\(user, ${rankWord}\\);`),
			`${tag} promotion should persist its rank marker`,
		);
	}
});

test("/wtf is a public self-embarrassment command", () => {
	assert.equal(settings.runlevel.wtf, 0);
	assert.match(serverScript, /const wtfQuotes = \[/);
	assert.match(serverScript, /"wtf": function \(\) \{/);
assert.match(serverScript, /const text = censor\(quote\)/);
assert.match(serverScript, /this\.room\.emit\("talk", \{\s*guid: this\.guid,\s*text,\s*\}\)/);
assert.match(serverScript, /this\.room\.emit\("wtf", \{\s*guid: this\.guid,\s*text,\s*\}\)/);
assert.match(clientIndex, /<option value="\/wtf" label="EDUCATIONAL PURPOSES ONLY">/);
});

test("/bwr exposes validated public Revived sound effects", () => {
assert.equal(settings.runlevel.bwr, 0);
assert.match(serverScript, /const bwrSounds = Object\.freeze\(\{/);
for (const sound of ["bye", "clap", "confused", "laugh", "surprised", "write"]) {
assert.match(serverScript, new RegExp(`\\b${sound}: "/sfx/revived/`));
assert.match(clientIndex, new RegExp(`sfx/revived/${sound}\\.`));
}
assert.match(serverScript, /"bwr": function \(soundName\)/);
assert.match(serverScript, /Choose a BWR sound/);
assert.match(serverScript, /this\.room\.emit\("sound", \{\s*guid: this\.guid,\s*url: bwrSounds\[sound\]/);
assert.match(clientScript, /audio\.volume = 0\.35/);
assert.match(clientIndex, /<option value="\/bwr" label="Play a BWR sound/);
});

test("Radical sits above Owner with a green cat icon and Big Owner-only controls", () => {
	assert.match(rankIcons, /owner: runlevel === 7/);
	assert.match(rankIcons, /radical: runlevel === 7\.5/);
	assert.match(clientScript, /const OWNER_ICON = `<i class="fa-classic fa-solid fa-sith" style="color:#ff0000/);
	assert.match(clientScript, /fa-classic fa-solid fa-cat" style="color:#00ff00/);
	assert.match(serverScript, /const radicalRankWord = sha256\("bonziworld:persisted-radical:v1"\)/);
	assert.match(serverScript, /if \(hashed === radicalRankWord\) return 7\.5/);
	assert.match(serverScript, /"promoteradical": async function \(id\)/);
	assert.match(serverScript, /"demoteradical": async function \(id\)/);
	assert.match(serverScript, /if \(this\.runlevel < 8\) return this\.notify\("Only Big Owner can promote Radicals\."\)/);
	assert.match(serverScript, /if \(this\.runlevel < 8\) return this\.notify\("Only Big Owner can demote Radicals\."\)/);
	assert.equal(settings.runlevel.promoteowner, 7.5);
	assert.equal(settings.runlevel.demoteowner, 7.5);
	assert.equal(settings.runlevel.promoteradical, 8);
	assert.equal(settings.runlevel.demoteradical, 8);
	assert.match(clientScript, /cmd\(`promoteradical \$\{this\.id\}`\)/);
	assert.match(clientScript, /cmd\(`demoteradical \$\{this\.id\}`\)/);
	assert.match(clientScript, /socket\.on\("owner"/);
});

test("community hats are public and moderator hats stay restricted", () => {
for (const hat of ["spongebob", "patrick", "cone", "shirt", "windows", "camel", "doge"]) {
		assert.ok(settings.hats.includes(hat), `${hat} should be public`);
		assert.match(bonziData, new RegExp(`"${hat}"`));
		assert.ok(readFileSync(path.resolve(__dirname, "..", "client", "src", "img", "bonzi", `${hat}.webp`)).length > 100);
	}
for (const hat of ["greenbowtie", "yellowbowtie", "purplebowtie"]) {
assert.ok(settings.hats.includes(hat), `${hat} should be public`);
assert.match(bonziData, new RegExp(`"${hat}"`));
assert.match(clientScript, new RegExp(`${hat}: "https://file\\.garden/anHLAB_gHWMmQpdA/${hat}\\.png"`));
}
const modHats = [
	"greendiamondchain", "yellowdiamondchain", "purplediamondchain",
	"scarf3", "scarf4", "scarf5", "yellowpupils", "purplepupils",
	"bluecrown", "greencrown", "yellowcrown", "purplecrown", "headphones4",
];
assert.equal(modHats.length, 13);
for (const hat of modHats) {
assert.doesNotMatch(JSON.stringify(settings.hats), new RegExp(`"${hat}"`));
assert.match(bonziData, new RegExp(`"${hat}"`));
assert.match(serverScript, new RegExp(`"${hat}"`));
}
	assert.ok(settings.blessedHats.includes("rainbowglitch"));
	assert.ok(settings.blessedHats.includes("reddiamondchain"));
	assert.ok(settings.blessedHats.includes("abysshat"));
	assert.match(bonziData, /"abysshat"/);
	assert.match(clientScript, /abysshat: "https:\/\/file\.garden\/anHLAB_gHWMmQpdA\/abysshat\.png"/);
const imageHatFunction = clientScript.match(/function hasImageHat\(color\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.match(imageHatFunction, /"abysshat"/);
	assert.doesNotMatch(JSON.stringify(settings.hats), /rainbowglitch/);
	assert.doesNotMatch(JSON.stringify(settings.hats), /reddiamondchain/);
	assert.match(clientScript, /rainbowglitch: "https:\/\/file\.garden\/anHLAB_gHWMmQpdA\/rainbowglitch\.png"/);
	assert.match(clientScript, /camel: "https:\/\/file\.garden\/aqxyJFip7GH0uUtz\/camelforubserver\.webp"/);
	assert.match(clientScript, /cone: "https:\/\/bonziworld\.kr\/img\/bonzi\/cone\.webp"/);
	assert.match(clientScript, /reddiamondchain: "https:\/\/file\.garden\/anHLAB_gHWMmQpdA\/reddiamondchain\.png"/);
for (const hat of [
	"greenbowtie", "yellowbowtie", "purplebowtie",
	"greendiamondchain", "yellowdiamondchain", "purplediamondchain",
	"scarf3", "scarf4", "scarf5", "yellowpupils", "purplepupils",
	"bluecrown", "greencrown", "yellowcrown", "purplecrown", "headphones4",
]) {
assert.match(clientScript, new RegExp(`${hat}: "https://file\\.garden/anHLAB_gHWMmQpdA/${hat}\\.png"`));
}
assert.match(clientScript, /"greenbowtie", "yellowbowtie", "purplebowtie"/);
assert.match(clientScript, /"bluecrown", "greencrown", "yellowcrown", "purplecrown", "headphones4"/);
});

test("greenpope is Developer-level and clears the Owner tag", () => {
	assert.equal(settings.runlevel.greenpope, 6);
	const start = serverScript.indexOf('"greenpope": function () {');
	const end = serverScript.indexOf('"rad": function () {', start);
	const handler = serverScript.slice(start, end);
	assert.match(handler, /this\.public\.color = "greenpope"/);
	assert.match(handler, /this\.public\.tag = ""/);
	assert.doesNotMatch(handler, /this\.public\.tag = "Owner"/);
});

test("glitchyhat is vault-unlocked and renders from its supplied image", () => {
	assert.ok(settings.vaultHats.includes("glitchyhat"));
	assert.match(bonziData, /"glitchyhat"/);
	assert.match(clientScript, /glitchyhat: "https:\/\/file\.garden\/aqRpX8SZQwKevEmG\/glitchyhat\.webp"/);
const imageHatFunction = clientScript.match(/function hasImageHat\(color\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.match(imageHatFunction, /"glitchyhat"/);
	assert.deepEqual(
		vault.codes.slice(0, 3).map(({ tag, matches, unlocks, response }) => ({
			tag: tag ?? null,
			matches,
			unlocks: unlocks ?? null,
			responseTag: typeof response === "object" ? response.tag ?? null : null,
		})),
		[
			{ tag: null, matches: "^wrong\\.?$", unlocks: null, responseTag: "g1" },
			{ tag: "g1", matches: "^too\\s+shortest\\.?$", unlocks: null, responseTag: "g2" },
			{ tag: "g2", matches: "^again\\s+tomorrow\\.?$", unlocks: "glitchyhat", responseTag: null },
		],
	);
});

test("selected appearance and force actions may target higher ranks", () => {
	for (const command of ["forceannounce", "bforcemessage", "forcecommand", "injecttouser", "coloredit", "hatedit"]) {
		const start = serverScript.indexOf(`"${command}": function(args) {`);
		const end = serverScript.indexOf(`recordRankAction(this, "${command}"`, start);
		const handler = start >= 0 && end > start ? serverScript.slice(start, end) : "";
		assert.ok(handler, `${command} handler should exist`);
		assert.doesNotMatch(handler, /staffTargetWarning/);
	}
});

test("advanced injection is Developer-only and supports one client or the current room", () => {
	assert.equal(settings.runlevel.advinject, 6);
	assert.equal(settings.runlevel.massadvinject, 6);

	const singleStart = serverScript.indexOf('"advinject": function (args) {');
	const massStart = serverScript.indexOf('"massadvinject": function (args) {');
	const handlers = serverScript.slice(singleStart, serverScript.indexOf('"destroyallsockets"', massStart));
	assert.ok(singleStart >= 0 && massStart > singleStart);
	assert.match(handlers, /user\.socket\.emit\("advancedcodeinject"/);
	assert.match(handlers, /for \(let user of this\.room\.users\)/);
	assert.match(handlers, /code\.slice\(0, 100000\)/);
	assert.doesNotMatch(handlers, /staffTargetWarning/);

	assert.match(clientScript, /socket\.on\("advancedcodeinject", async \(data\) =>/);
	assert.match(clientScript, /await eval\("\(async \(\) => \{\\n"/);
	assert.match(clientIndex, /value="\/massadvinject"/);
});

test("anti-bot connection and action gates are fully disabled", () => {
	assert.doesNotMatch(clientScript, /solvePowChallenge|connectWithPow|\/api\/challenge|\/api\/verify/);
	assert.doesNotMatch(serverScript, /\bio\.use\(floodGuard\)|socket\.use\(\(packet|isProxy\(ip\)|isEvilIsp\(ip\)/);
	assert.doesNotMatch(serverIndex, /signPass|res\.cookie\("pass"/);
	assert.doesNotMatch(apiRoutes, /powRouter|\.\/pow/);
	assert.doesNotMatch(databaseScript, /^startAntiFloodCleanupScheduler\(\);$/m);
});

test("release and downloadable source metadata are aligned to version 1.8.10", () => {
	assert.equal(serverPackage.version, "1.8.10");
	assert.match(serverIndex, /bonziworld-1\.8\.10-source\.zip/);
	assert.match(clientIndex, /download="bonziworld-1\.8\.10-source\.zip"/);
	assert.match(clientIndex, /Version 1\.8\.10/);
	assert.match(changelog, /1\.8\.6c - Final Update/);
	assert.match(changelog, /1\.8\.6ea - Community Hat Asset Fix/);
	assert.match(changelog, /1\.8\.6e - Rainbowglitch Fix/);
	assert.match(changelog, /nohackingthis/);
});