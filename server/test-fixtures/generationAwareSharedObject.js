import { createBoundedIpcRequester } from "./boundedIpc.js";

function storageError(message, code) {
	return Object.assign(new Error(message), { code });
}

const IPC_REQUEST_TIMEOUT_MS = Number(process.env.TEST_IPC_REQUEST_TIMEOUT_MS) || 5_000;

export function createGenerationAwareSharedObject(initialBody = null) {
	let body = initialBody;
	let generation = initialBody === null ? 0 : 1;

	function requireExisting() {
		if (body === null) throw storageError("object not found", 404);
	}

	function requireGeneration(expectedGeneration) {
		if (Number(expectedGeneration) !== generation) {
			throw storageError("object generation changed", 412);
		}
	}

	const file = {
		async download({ preconditionOpts } = {}) {
			requireExisting();
			if (preconditionOpts.ifGenerationMatch !== undefined) {
				requireGeneration(preconditionOpts.ifGenerationMatch);
			}
			return [Buffer.from(body)];
		},
		async getMetadata() {
			requireExisting();
			return [{ generation: String(generation) }];
		},
		async save(nextBody, { preconditionOpts = {} } = {}) {
			const expectedGeneration = preconditionOpts.ifGenerationMatch;
			if (body === null) {
				if (Number(expectedGeneration) !== 0) {
					throw storageError("object generation changed", 412);
				}
			} else {
				requireGeneration(expectedGeneration);
			}
			body = String(nextBody);
			generation += 1;
		},
		async delete({ preconditionOpts = {} } = {}) {
			requireExisting();
			requireGeneration(preconditionOpts.ifGenerationMatch);
			body = null;
			generation += 1;
		},
	};

	return {
		file,
		read() {
			return body === null ? null : JSON.parse(body);
		},
		async handle(operation, options = {}) {
			if (operation === "download") {
				const [value] = await file.download({
					preconditionOpts: {
						ifGenerationMatch: options.ifGenerationMatch,
					},
				});
				return value.toString();
			}
			if (operation === "getMetadata") {
				const [metadata] = await file.getMetadata();
				return metadata.generation;
			}
			if (operation === "save") {
				return file.save(options.body, {
					preconditionOpts: {
						ifGenerationMatch: options.ifGenerationMatch,
					},
				});
			}
			if (operation === "delete") {
				return file.delete({
					preconditionOpts: {
						ifGenerationMatch: options.ifGenerationMatch,
					},
				});
			}
			throw new Error(`Unknown shared-object operation: ${operation}`);
		},
	};
}

export function attachSharedObjectStorage(worker, sharedObject) {
	const onMessage = async message => {
		if (message.type !== "storage") return;
		try {
			const value = await sharedObject.handle(message.operation, message.options);
			worker.send({
				type: "storageResult",
				id: message.id,
				value,
			});
		} catch (error) {
			worker.send({
				type: "storageResult",
				id: message.id,
				error: { message: error.message, code: error.code },
			});
		}
	};
	worker.on("message", onMessage);
	return () => worker.off("message", onMessage);
}

export function createProcessSharedObjectFile() {
const requests = createBoundedIpcRequester({
requestType: "storage",
responseType: "storageResult",
timeoutMs: IPC_REQUEST_TIMEOUT_MS,
});

function requestStorage(operation, options = {}) {
return requests.request(`shared-object ${operation}`, { operation, options });
}

	return {
		file: {
			async download({ preconditionOpts } = {}) {
				const value = await requestStorage("download", {
					ifGenerationMatch: preconditionOpts?.ifGenerationMatch,
				});
				return [Buffer.from(value)];
			},
			async getMetadata() {
				const generation = await requestStorage("getMetadata");
				return [{ generation: String(generation) }];
			},
			async save(body, { preconditionOpts }) {
				await requestStorage("save", {
					body,
					ifGenerationMatch: preconditionOpts.ifGenerationMatch,
				});
			},
			async delete({ preconditionOpts }) {
				await requestStorage("delete", {
					ifGenerationMatch: preconditionOpts.ifGenerationMatch,
				});
			},
		},
		pendingCount() {
return requests.pendingCount();
		},
		close() {
requests.close();
		},
	};
}
