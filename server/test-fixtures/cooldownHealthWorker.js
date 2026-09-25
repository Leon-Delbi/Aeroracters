import {
	clearSharedCooldownCoordinationHealth,
	loadSharedCooldownCoordinationHealth,
	saveSharedCooldownCoordinationHealth,
} from "../database.js";
import { createProcessSharedObjectFile } from "./generationAwareSharedObject.js";

const { file, pendingCount } = createProcessSharedObjectFile();

process.on("message", async message => {
	if (message.type === "storageResult") return;
	if (message.type !== "run") return;

	try {
		let result;
		if (message.operation === "pendingCount") {
			result = pendingCount();
		} else if (message.operation === "save") {
			await saveSharedCooldownCoordinationHealth(message.health, { file });
		} else if (message.operation === "clear") {
			await clearSharedCooldownCoordinationHealth({
				succeededAt: message.succeededAt,
				file,
			});
		} else if (message.operation === "load") {
			result = await loadSharedCooldownCoordinationHealth({
				healthyIntervalMs: message.healthyIntervalMs,
				now: message.now,
				file,
			});
		} else if (message.operation === "directStorageSave") {
			await file.save(message.body, {
				preconditionOpts: { ifGenerationMatch: 0 },
			});
		} else {
			throw new Error(`Unknown worker operation: ${message.operation}`);
		}
		process.send({ type: "result", id: message.id, result });
	} catch (error) {
		process.send({
			type: "result",
			id: message.id,
			error: { message: error.message, code: error.code },
		});
	}
});