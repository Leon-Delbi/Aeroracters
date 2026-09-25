import { CoordinatedFloodGuard } from "../antiFlood.js";
import { createBoundedIpcRequester } from "./boundedIpc.js";

const coordinateRequests = createBoundedIpcRequester({
	requestType: "coordinate",
	responseType: "coordinated",
});
const options = {
	windowMs: 100,
	maxScore: 3,
	strikeWindowMs: 1_000,
	blockDurationsMs: [50],
	banAfterStrikes: 3,
	banMs: 500,
};
let now = 0;
function requestCoordinate(events) {
	return coordinateRequests.request("coordinate flood", { events });
}
const guard = new CoordinatedFloodGuard({
	guardOptions: options,
	now: () => now,
	setTimeoutImpl: () => ({ unref() {} }),
	coordinate(_key, events) {
		return requestCoordinate(events);
	},
});

process.on("message", async message => {
	if (message.type === "coordinated") return;
	if (message.type !== "run") return;
	try {
		if (message.operation === "dropCommandReply") {
			process.send({ type: "replyDropped", id: message.id });
			return;
		}
		if (message.operation === "pendingCount") {
			process.send({
				type: "result",
				id: message.id,
				result: coordinateRequests.pendingCount(),
			});
			return;
		}
		if (message.operation === "directCoordinate") {
			await requestCoordinate(message.events);
			process.send({ type: "result", id: message.id });
			return;
		}
		now = message.startAt;
		const immediate = [
			guard.check("ip", 1, now++).action,
			guard.check("ip", 1, now++).action,
		];
		const shared = await guard.flush("ip");
		process.send({
			type: "result",
			id: message.id,
			immediate,
			sharedAction: shared?.action,
			afterFlush: guard.check("ip", 1, now).action,
		});
	} catch (error) {
		process.send({
			type: "result",
			id: message.id,
			error: { message: error.message, code: error.code },
		});
	}
});
