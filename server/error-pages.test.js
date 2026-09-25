import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.resolve(__dirname, "..", "client", "src");
const serverEntry = readFileSync(path.join(__dirname, "index.js"), "utf8");
const statusCodes = [400, 403, 404, 500, 502, 503];

test("every supported HTTP error has a standalone styled page", () => {
	for (const statusCode of statusCodes) {
		const page = readFileSync(path.join(clientDirectory, `${statusCode}.html`), "utf8");
		assert.match(page, new RegExp(`<title>${statusCode} `));
		assert.match(page, /<main class="error-shell">/);
		assert.match(page, /href="\.\/error\.css"/);
		assert.match(page, new RegExp(`class="error-code">${statusCode}<`));
	}
});

test("error routes cover extensionless and .html URLs", () => {
	assert.match(serverEntry, /const errorPageCodes = \[400, 403, 404, 500, 502, 503\]/);
	assert.match(serverEntry, /app\.get\(\[`\/\$\{statusCode\}`, `\/\$\{statusCode\}\.html`\]/);
	assert.match(serverEntry, /req\.accepts\("html"\)/);
	assert.match(serverEntry, /sendErrorPage\(res, 404\)/);
});