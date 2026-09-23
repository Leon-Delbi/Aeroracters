import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadServerEnv } from "./env.js";

test("loadServerEnv ignores missing .env files", () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bonzi-env-"));
	assert.doesNotThrow(() => loadServerEnv(dir));
});

test("loadServerEnv loads values from the target directory", () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bonzi-env-"));
	fs.writeFileSync(path.join(dir, ".env"), "PORT=1234\nTEST_VALUE=hello\n");

	const previous = process.env.TEST_VALUE;
	try {
		loadServerEnv(dir);
		assert.equal(process.env.TEST_VALUE, "hello");
	} finally {
		if (previous === undefined) {
			delete process.env.TEST_VALUE;
		} else {
			process.env.TEST_VALUE = previous;
		}
	}
});
