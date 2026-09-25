import {
	existsSync,
	readFileSync,
	renameSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import path from "node:path";

export const WORD_FILTER_CATEGORIES = Object.freeze([
	Object.freeze({
		id: "messages",
		key: "filters",
		label: "Messages and commands",
	}),
	Object.freeze({
		id: "usernames",
		key: "namefilters",
		label: "Usernames",
	}),
	Object.freeze({
		id: "godword",
		key: "antigodwordleak",
		label: "Godword leak protection",
	}),
]);

const FILTER_FLAGS = "gv";
const MAX_PATTERN_LENGTH = 1000;
const MAX_REPLACEMENT_LENGTH = 500;

function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function copyRuleMap(value, label) {
	if (!isRecord(value)) {
		throw new Error(`The ${label} word-filter set must be an object.`);
	}

	const copied = Object.create(null);
	for (const [pattern, replacement] of Object.entries(value)) {
		if (typeof replacement !== "string") {
			throw new Error(`The ${label} word-filter replacements must be strings.`);
		}
		copied[pattern] = replacement;
	}
	return copied;
}

function copyAllRuleMaps(source) {
	return Object.fromEntries(
		WORD_FILTER_CATEGORIES.map(({ id, key, label }) => [
			id,
			copyRuleMap(source?.[key], label),
		]),
	);
}

function copyOverrideMaps(source) {
	if (!isRecord(source)) {
		throw new Error("Persisted word-filter overrides must be an object.");
	}
	return Object.fromEntries(
		WORD_FILTER_CATEGORIES.map(({ id, key, label }) => {
			const savedOverrides = source[key] ?? {};
			if (!isRecord(savedOverrides)) {
				throw new Error(`The ${label} word-filter overrides must be an object.`);
			}
			const copied = Object.create(null);
			for (const [pattern, replacement] of Object.entries(savedOverrides)) {
				if (replacement !== null && typeof replacement !== "string") {
					throw new Error(`The ${label} word-filter overrides are invalid.`);
				}
				copied[pattern] = replacement;
			}
			return [id, copied];
		}),
	);
}

function applyOverrides(defaultRules, overrides) {
	const effectiveRules = Object.fromEntries(
		WORD_FILTER_CATEGORIES.map(({ id }) => [
			id,
			Object.assign(Object.create(null), defaultRules[id]),
		]),
	);
	for (const { id } of WORD_FILTER_CATEGORIES) {
		for (const [pattern, replacement] of Object.entries(overrides[id])) {
			if (replacement === null) {
				delete effectiveRules[id][pattern];
			} else {
				effectiveRules[id][pattern] = replacement;
			}
		}
	}
	return effectiveRules;
}

function deriveOverrides(defaultRules, effectiveRules) {
	return Object.fromEntries(
		WORD_FILTER_CATEGORIES.map(({ id }) => {
			const overrides = Object.create(null);
			for (const [pattern, defaultReplacement] of Object.entries(defaultRules[id])) {
				if (!Object.hasOwn(effectiveRules[id], pattern)) {
					overrides[pattern] = null;
				} else if (effectiveRules[id][pattern] !== defaultReplacement) {
					overrides[pattern] = effectiveRules[id][pattern];
				}
			}
			for (const [pattern, replacement] of Object.entries(effectiveRules[id])) {
				if (!Object.hasOwn(defaultRules[id], pattern)) {
					overrides[pattern] = replacement;
				}
			}
			return [id, overrides];
		}),
	);
}

function assertValidPattern(pattern) {
	if (typeof pattern !== "string" || pattern.trim().length === 0) {
		throw new Error("A filter pattern is required.");
	}
	if (pattern.length > MAX_PATTERN_LENGTH) {
		throw new Error(`Filter patterns must be ${MAX_PATTERN_LENGTH} characters or fewer.`);
	}
	try {
		new RegExp(pattern, FILTER_FLAGS);
	} catch {
		throw new Error("That pattern is not a valid regular expression.");
	}
}

function resolveCategory(id) {
	const category = WORD_FILTER_CATEGORIES.find((entry) => entry.id === id);
	if (!category) throw new Error("Choose a valid word-filter category.");
	return category;
}

export function createWordFilterStore({ defaults, filePath, onInvalidPattern = () => {} }) {
	if (typeof filePath !== "string" || !filePath) {
		throw new Error("A word-filter persistence path is required.");
	}

	const defaultRules = copyAllRuleMaps(defaults);
	let rules = defaultRules;

	if (existsSync(filePath)) {
		let saved;
		try {
			saved = JSON.parse(readFileSync(filePath, "utf8"));
		} catch {
			throw new Error(`Could not parse persisted word filters at ${filePath}.`);
		}
		if (saved?.version !== 1) {
			throw new Error(`Persisted word filters at ${filePath} have an unsupported format.`);
		}
		rules = applyOverrides(defaultRules, copyOverrideMaps(saved.overrides));
	}

	function getCategory(id) {
		const category = resolveCategory(id);
		const categoryRules = rules[category.id];
		return {
			category: category.id,
			label: category.label,
			total: Object.keys(categoryRules).length,
			rules: Object.entries(categoryRules).map(([pattern, replacement]) => ({
				pattern,
				replacement,
			})),
		};
	}

	function getCompiled() {
		return Object.fromEntries(
			WORD_FILTER_CATEGORIES.map(({ id, label }) => {
				const compiled = [];
				for (const [pattern, replacement] of Object.entries(rules[id])) {
					try {
						compiled.push({
							regex: new RegExp(pattern, FILTER_FLAGS),
							replacement,
						});
					} catch (error) {
						onInvalidPattern({
							category: id,
							label,
							pattern: String(pattern).slice(0, 40),
							error,
						});
					}
				}
				return [id, compiled];
			}),
		);
	}

	// Save only differences from settings.json, so new built-in filters still
	// flow through when defaults change after a moderator has made edits.
	function persist(nextOverrides) {
		const directory = path.dirname(filePath);
		const temporaryPath = path.join(
			directory,
			`.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
		);
		try {
			writeFileSync(
				temporaryPath,
				JSON.stringify({
					version: 1,
					overrides: Object.fromEntries(
						WORD_FILTER_CATEGORIES.map(({ id, key }) => [key, nextOverrides[id]]),
					),
				}, null, 2),
				{ encoding: "utf8", mode: 0o600 },
			);
			renameSync(temporaryPath, filePath);
		} catch (error) {
			try {
				unlinkSync(temporaryPath);
			} catch {}
			console.error("word-filter persistence failed:", error?.message || error);
			throw new Error("Could not save the word-filter changes.");
		}
	}

	function mutate(request) {
		if (!isRecord(request)) throw new Error("Invalid word-filter request.");
		const category = resolveCategory(request.category);
		const operation = request.operation;
		if (!["add", "update", "delete"].includes(operation)) {
			throw new Error("Choose add, update, or delete.");
		}

		const currentRules = rules[category.id];
		const pattern = request.pattern;
		const originalPattern = request.originalPattern;
		if (operation === "add" || operation === "update") {
			assertValidPattern(pattern);
			if (typeof request.replacement !== "string") {
				throw new Error("A replacement value is required.");
			}
			if (request.replacement.length > MAX_REPLACEMENT_LENGTH) {
				throw new Error(`Replacements must be ${MAX_REPLACEMENT_LENGTH} characters or fewer.`);
			}
		}

		const nextCategoryRules = Object.create(null);
		if (operation === "add") {
			if (Object.hasOwn(currentRules, pattern)) {
				throw new Error("A filter with that pattern already exists.");
			}
			Object.assign(nextCategoryRules, currentRules);
			nextCategoryRules[pattern] = request.replacement;
		} else {
			if (typeof originalPattern !== "string" || !Object.hasOwn(currentRules, originalPattern)) {
				throw new Error("That filter no longer exists. Refresh the manager and try again.");
			}

			if (operation === "update" && pattern !== originalPattern && Object.hasOwn(currentRules, pattern)) {
				throw new Error("A filter with that pattern already exists.");
			}

			for (const [existingPattern, replacement] of Object.entries(currentRules)) {
				if (existingPattern !== originalPattern) {
					nextCategoryRules[existingPattern] = replacement;
				} else if (operation === "update") {
					nextCategoryRules[pattern] = request.replacement;
				}
			}
		}

		const nextRules = { ...rules, [category.id]: nextCategoryRules };
		const nextOverrides = deriveOverrides(defaultRules, nextRules);
		persist(nextOverrides);
		rules = nextRules;

		return {
			category: category.id,
			operation,
			pattern: operation === "delete" ? originalPattern : pattern,
		};
	}

	return {
		getCategory,
		getCompiled,
		mutate,
	};
}