import { claimPromotionAlertCooldown } from "../database.js";
import { createPermanentPromotionFailureReporter } from "../ownerSafety.js";
import { createProcessSharedObjectFile } from "./generationAwareSharedObject.js";

const { file } = createProcessSharedObjectFile();

process.on("message", async message => {
	if (message.type === "storageResult") return;
	if (message.type !== "run") return;

	try {
		let alerted = false;
		const reportFailure = createPermanentPromotionFailureReporter({
			threshold: 1,
			cooldownMs: 5_000,
			now: () => 1_000,
			claimCooldown: state => claimPromotionAlertCooldown(state, { file }),
			reportAlert: () => { alerted = true; },
		});
		await reportFailure();
		process.send({ type: "result", id: message.id, alerted });
	} catch (error) {
		process.send({
			type: "result",
			id: message.id,
			error: { message: error.message, code: error.code },
		});
	}
});