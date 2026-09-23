import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import express from "express";
import sharp from "sharp";
import { cookieParser, signPass } from "./utils.js";
import { beat } from "./server.js";
import "./discordbot.js"; // Discord bot (beta) — self-starts if DISCORD_BOT_TOKEN is set
import { app, io, server } from "./app.js";
import settings from "./settings.json" with { type: "json" };
import { isCloudflare, isLocal } from "./iputil.js";

export { app, io };

// Only trust forwarding headers from Cloudflare / a local reverse proxy, so a
// direct client cannot spoof X-Forwarded-For to forge req.ip.
app.set("trust proxy", (addr) => isCloudflare(addr) || isLocal(addr));

app.use(cookieParser);

app.use("/*.rss", (_req, res, next) => {
	res.setHeader("Content-Type", "application/xml; charset=UTF-8");
	next();
});

app.use((req, res, next) => {
	const randomToken = req.cookie.token ?? crypto.randomUUID();
	const cookieOpts = {
		maxAge: 31488000000,
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
	};
	res.cookie("token", randomToken, cookieOpts);
	// Signed proof that this client actually loaded the page over HTTP. The
	// socket handshake guard (floodGuard) requires it, so off-site flood scripts
	// that connect straight to the socket — without ever fetching the page —
	// never receive it and are refused, even if they spoof the Origin header.
	res.cookie("pass", signPass(randomToken), cookieOpts);
	next();
});

app.use(express.static('../build/www'));

app.get("/discord_pfp/:layers", async (req, res) => {
	try {
		let names = req.params.layers.slice(0, -4).split("+");

		if (names.length > 10) {
			return res.status(404).send("too much");
		}

		// Reject anything that isn't a plain layer name to prevent path traversal.
		if (names.some(n => !/^[A-Za-z0-9_-]+$/.test(n))) {
			return res.status(404).send("invalid layer");
		}

		let imagePaths = names.map(n => path.join(__dirname, "../client/src/img/pfp", `${n}.webp`));

		for (let p of imagePaths) {
			if (!fs.existsSync(p)) {
				return res.status(404).send(`Layer not found: ${path.basename(p)}`);
			} 
		}

		let base = sharp(imagePaths[0]);

		let overlays = imagePaths.slice(1).map(p => ({ input: p }));

		let result = await base
			.composite(overlays)
			.png()
			.toBuffer();

		res.set("Content-Type", "image/png");
		res.send(result);

	} catch (err) {
		console.error(err);
		res.status(500).send("Error generating image");
	}
});

export let port = Number(process.env.PORT || settings.port);

app.use((_req, res, next) => {
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
	next();
});

app.use(express.static("../client/src"));

await beat();

server.listen(port, "0.0.0.0", () => console.log("bonziworld.kr started"));
