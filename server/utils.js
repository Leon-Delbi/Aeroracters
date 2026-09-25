export function guidGen() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	};

	let id = '';
	for (let i = 0; i < 4; i++)
		id += s4();
	return id;
}

export function randomInt(min, max) {
	return Math.floor(((max - min + 1) * Math.random()) + min);
};

export function sanitizeUnicode(str) {
	if (!str) return str;
	const REPLACEMENT = "\uFFFD";
	let out = "";

	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);
		
		if (code === 0) {
			out += REPLACEMENT;
			continue;
		}

		if (code >= 0xD800 && code <= 0xDBFF) {
			const next = str.charCodeAt(i + 1);
			if (!(next >= 0xDC00 && next <= 0xDFFF)) {
				out += REPLACEMENT;
			} else {
				out += str[i] + str[i + 1];
				i++;
			}
			continue;
		}

		if (code >= 0xDC00 && code <= 0xDFFF) {
			out += REPLACEMENT;
			continue;
		}

		out += str[i];
	}
	
	return out;
}

export function cookieParser(req, res, next) {
	if (!req.headers.cookie) {
		req.cookie = {};
		next();
		return;
	}
	let cookie = req.headers.cookie;
	let cookies = {};
	let keypairs = cookie.split("; ");
	for (let keypair of keypairs) {
		let equalPos = keypair.indexOf("=");
		let key = keypair.slice(0, equalPos);
		let val = decodeURIComponent(keypair.slice(equalPos + 1));
		cookies[key] = val;
	}
	req.cookie = cookies;
	next();
}
