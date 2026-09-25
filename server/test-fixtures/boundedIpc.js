const DEFAULT_IPC_REQUEST_TIMEOUT_MS = 5_000;

let nextRequestId = 0;

function requestTimeoutMs(value, fallback = DEFAULT_IPC_REQUEST_TIMEOUT_MS) {
	const timeoutMs = Number(value);
	return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : fallback;
}

export function safeOperationLabel(value) {
	const label = String(value ?? "operation")
		.replace(/[^a-zA-Z0-9-]+/g, " ")
		.trim()
		.toLowerCase()
		.slice(0, 80);
	return label || "operation";
}

function deserializeError(error) {
	return Object.assign(new Error(error.message), { code: error.code });
}

export function runWorkerCommand(worker, operation, command = {}, {
	timeoutMs = 10_000,
} = {}) {
	const label = safeOperationLabel(operation);
	return new Promise((resolve, reject) => {
		const id = ++nextRequestId;
		let settled = false;
		const cleanup = () => {
			clearTimeout(timeout);
			worker.off("error", onError);
			worker.off("exit", onExit);
			worker.off("message", onMessage);
		};
		const settle = (callback, value) => {
			if (settled) return;
			settled = true;
			cleanup();
			callback(value);
		};
		const onError = error => settle(reject, error);
		const onExit = code => settle(
			reject,
			new Error(`${label} worker exited with ${code}`),
		);
		const onMessage = message => {
			if (message.type !== "result" || message.id !== id) return;
			if (message.error) {
				settle(reject, deserializeError(message.error));
			} else {
				settle(resolve, message);
			}
		};
		const timeout = setTimeout(() => {
			settle(reject, new Error(`Timed out waiting for worker operation: ${label}`));
		}, requestTimeoutMs(timeoutMs, 10_000));
		timeout.unref?.();
		worker.on("error", onError);
		worker.on("exit", onExit);
		worker.on("message", onMessage);
		try {
			worker.send({ type: "run", id, ...command });
		} catch (error) {
			settle(reject, error);
		}
	});
}

export function createBoundedIpcRequester({
	channel = process,
	requestType,
	responseType,
	timeoutMs = process.env.TEST_IPC_REQUEST_TIMEOUT_MS,
}) {
	const pending = new Map();
	const deadlineMs = requestTimeoutMs(timeoutMs);

	const onMessage = message => {
		if (message.type !== responseType) return;
		const request = pending.get(message.id);
		if (!request) return;
		pending.delete(message.id);
		clearTimeout(request.timeout);
		if (message.error) {
			request.reject(deserializeError(message.error));
		} else {
			request.resolve(
				Object.hasOwn(message, "value") ? message.value : message.result,
			);
		}
	};
	channel.on("message", onMessage);

	return {
		request(operation, payload = {}) {
			const label = safeOperationLabel(operation);
			return new Promise((resolve, reject) => {
				const id = ++nextRequestId;
				const timeout = setTimeout(() => {
					pending.delete(id);
					reject(new Error(`Timed out waiting for ${label} reply`));
				}, deadlineMs);
				timeout.unref?.();
				pending.set(id, { resolve, reject, timeout });
				try {
					channel.send({ type: requestType, id, ...payload });
				} catch (error) {
					clearTimeout(timeout);
					pending.delete(id);
					reject(error);
				}
			});
		},
		pendingCount() {
			return pending.size;
		},
		close() {
			channel.off("message", onMessage);
			for (const { reject, timeout } of pending.values()) {
				clearTimeout(timeout);
				reject(new Error(`${safeOperationLabel(requestType)} IPC closed before receiving a reply`));
			}
			pending.clear();
		},
	};
}
