import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import settings from "./settings.json" with { type: "json" };
import { createWordFilterStore } from "./wordFilters.js";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixtureDefaults = {
	filters: { hello: "hi" },
	namefilters: { guest: "visitor" },
	antigodwordleak: { "leak\\s?word": "protected" },
};

function createTemporaryStore(t, fileName = "managed-word-filters.json") {
	const directory = mkdtempSync(path.join(os.tmpdir(), "bonzi-word-filters-"));
	t.after(() => rmSync(directory, { recursive: true, force: true }));
	const filePath = path.join(directory, fileName);
	return {
		filePath,
		create: (defaults = fixtureDefaults) => createWordFilterStore({ defaults, filePath }),
	};
}

test("word-filter manager adds, edits, deletes, validates, and persists every category", (t) => {
	const { create } = createTemporaryStore(t);
	const store = create();

	assert.equal(store.getCategory("messages").total, 1);
	assert.equal(store.getCategory("usernames").total, 1);
	assert.equal(store.getCategory("godword").total, 1);

	store.mutate({
		operation: "add",
		category: "messages",
		pattern: "world",
		replacement: "Earth",
	});
	store.mutate({
		operation: "update",
		category: "usernames",
		originalPattern: "guest",
		pattern: "new\\s?guest",
		replacement: "member",
	});
	store.mutate({
		operation: "delete",
		category: "godword",
		originalPattern: "leak\\s?word",
	});

	assert.throws(
		() => store.mutate({
			operation: "add",
			category: "messages",
			pattern: "[",
			replacement: "invalid",
		}),
		/valid regular expression/,
	);
	assert.equal(store.getCategory("messages").total, 2);

	const restartedStore = create();
	assert.ok(restartedStore.getCategory("messages").rules.some((rule) => rule.pattern === "world"));
	assert.ok(restartedStore.getCategory("usernames").rules.some((rule) => rule.pattern === "new\\s?guest"));
	assert.equal(restartedStore.getCategory("godword").total, 0);

	const compiledMessageFilters = restartedStore.getCompiled().messages;
	const worldFilter = compiledMessageFilters.find((filter) => filter.replacement === "Earth");
	assert.equal("hello world".replace(worldFilter.regex, worldFilter.replacement), "hello Earth");

	const updatedDefaults = {
		filters: { hello: "greetings", shipped: "new" },
		namefilters: { guest: "new default" },
		antigodwordleak: {
			"leak\\s?word": "refined",
			"another leak": "protected",
		},
	};
	const upgradedStore = create(updatedDefaults);
	assert.ok(upgradedStore.getCategory("messages").rules.some((rule) => rule.pattern === "shipped"));
	assert.ok(upgradedStore.getCategory("messages").rules.some((rule) => rule.pattern === "hello" && rule.replacement === "greetings"));
	assert.ok(upgradedStore.getCategory("godword").rules.some((rule) => rule.pattern === "another leak"));
	assert.equal(upgradedStore.getCategory("godword").rules.some((rule) => rule.pattern === "leak\\s?word"), false);

	restartedStore.mutate({
		operation: "update",
		category: "messages",
		originalPattern: "world",
		pattern: "planet",
		replacement: "Earth",
	});
	assert.ok(restartedStore.getCategory("messages").rules.some((rule) => rule.pattern === "planet"));
	assert.ok(!restartedStore.getCategory("messages").rules.some((rule) => rule.pattern === "world"));
});

test("word-filter manager rejects stale edits, duplicates, and invalid categories", (t) => {
	const store = createTemporaryStore(t).create();

	assert.throws(
		() => store.mutate({
			operation: "update",
			category: "messages",
			originalPattern: "missing",
			pattern: "new",
			replacement: "value",
		}),
		/no longer exists/,
	);
	assert.throws(
		() => store.mutate({
			operation: "add",
			category: "messages",
			pattern: "hello",
			replacement: "duplicate",
		}),
		/already exists/,
	);
	assert.throws(
		() => store.getCategory("not-a-category"),
		/valid word-filter category/,
	);
});

test("word-filter manager is strictly Big Owner gated and hides sensitive payloads from command logs", () => {
	const serverSource = readFileSync(path.join(serverDirectory, "server.js"), "utf8");
	const clientSource = readFileSync(path.join(serverDirectory, "..", "client", "src", "script.js"), "utf8");

	assert.equal(settings.runlevel.managewordfilters, 8);
	assert.match(serverSource, /"managewordfilters": function \(input\) \{\s*if \(this\.runlevel !== 8\)/);
	assert.match(serverSource, /sensitiveCommand \|\| wordFilterManagerCommand \? rawArgs\.trim\(\) : censor\(rawArgs\)/);
	assert.match(serverSource, /wordFilterManagerCommand \? "\[word-filter manager request\]" : args/);
	assert.match(clientSource, /if \(bigowner && !hasWordFilterManager\)/);
	assert.match(clientSource, /Dialog\.wordFilterManager\(data\.wordFilters\)/);
});