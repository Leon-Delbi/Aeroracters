// espeak gorilla voice, WITHOUT SharedArrayBuffer.
//
// The old lipsync path (lipspeakWorker.js + lipspeak.wasm) used Emscripten
// pthreads -> SharedArrayBuffer -> forced COOP/COEP isolation, which blocked
// cross-origin iframes (YouTube) in Firefox. The legacy espeak path
// (espeakWorker.js + speak-ng.wasm via runno WASI) is single-threaded and needs
// NO SharedArrayBuffer, so we use it instead. Same real espeak voice.
//
// espeak gives us the audio but not phoneme timings, so we synthesise approximate
// [ms, phoneme] timings spanning the REAL decoded audio duration and hand them to
// the existing lipsync code (PHONEME_TO_MOUTH in script.js) - the mouth still
// flaps in time with the gorilla.

let taskId = 0;
let tasks = new Map();
let currentVoice = "espeak";

let workerBroken = false;
let ttsWorker = null;
try {
    ttsWorker = new Worker(new URL("./espeakWorker.js?v=20260905-2", import.meta.url), { type: "module" });
} catch (error) {
    workerBroken = true;
    console.error("BonziWORLD speech worker could not start:", error);
}

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioCtx = AudioContextClass ? new AudioContextClass() : null;
let gainNode = audioCtx ? new GainNode(audioCtx, { gain: 1 }) : null;
if (gainNode && audioCtx) gainNode.connect(audioCtx.destination);

function unlockAudio() {
    if (!audioCtx || audioCtx.state !== "suspended") return;
    audioCtx.resume().catch((error) => {
        console.warn("BonziWORLD audio is still locked:", error);
    });
}

if (typeof window !== "undefined") {
    for (const eventName of ["pointerdown", "keydown", "touchstart"]) {
        window.addEventListener(eventName, unlockAudio, { passive: true });
    }
}

export function setVoice(name) {
    currentVoice = "espeak";
}

export function setVolume(vol) {
    if (!gainNode) return;
    if (vol === 0) {
        gainNode.gain.value = 0;
    } else {
        gainNode.gain.value = 10 ** ((25 * vol + -25) / 20);
    }
}

// Map a character to an espeak-ish phoneme key PHONEME_TO_MOUTH understands.
const VOWELS = "aeiouy";
const VOWEL_PHO = ["a", "E", "i", "O", "u", "I"];
const CONS_PHO = ["t", "s", "n", "l", "r", "k", "m", "b"];
function phonemeFor(ch) {
    ch = ch.toLowerCase();
    if (ch === " " || ch === "\n" || ch === "\t" || ch === ".") return "_";
    let c = ch.charCodeAt(0);
    if (VOWELS.includes(ch)) return VOWEL_PHO[c % VOWEL_PHO.length];
    if (ch >= "a" && ch <= "z") return CONS_PHO[c % CONS_PHO.length];
    return "_";
}

// Spread the speakable characters of `text` evenly across `durationMs` so the
// mouth animation lines up with the actual audio length.
function buildLip(text, durationMs) {
    let chars = text.replace(/\s+/g, " ").slice(0, 600).split("");
    if (chars.length === 0) return [[0, "_"]];
    let step = durationMs / chars.length;
    let lip = [];
    for (let i = 0; i < chars.length; i++) lip.push([Math.round(i * step), phonemeFor(chars[i])]);
    lip.push([Math.round(durationMs), "_"]);
    return lip;
}

// Find where the actual speech ends (last sample above a silence threshold),
// trimming espeak's trailing silence so lipsync stops with the voice.
function speechDurationMs(buffer) {
    let data = buffer.getChannelData(0);
    const THRESH = 0.01;
    let last = 0;
    // Step through; no need to inspect every sample for a coarse end-point.
    for (let i = 0; i < data.length; i += 64) {
        if (Math.abs(data[i]) > THRESH) last = i;
    }
    let ms = (last / buffer.sampleRate) * 1000;
    return ms > 50 ? ms : buffer.duration * 1000; // fallback if detection fails
}

function play(text, options = {}, onend = () => {}, onstart = () => {}, signal = { aborted: false }) {
    let id = taskId++;
    text = text.replace(/(.{5,}?)\1{5,}/gi, "$1$1$1$1$1"); // anti copy-paste spam
    tasks.set(id, { onstart, onend, signal, text });
    unlockAudio();
    if (workerBroken || !ttsWorker) {
        playBrowserFallback(id, options);
    } else {
        ttsWorker.postMessage({ id, text, options });
    }
}

// playSSML kept for interface compatibility (no SSML in espeak CLI here).
function playSSML(text, options = {}, onend = () => {}, onstart = () => {}, signal = { aborted: false }) {
    play(String(text).replace(/<[^>]+>/g, " "), options, onend, onstart, signal);
}

export let speak = { play, playSSML };

function playBrowserFallback(id, options) {
    let task = tasks.get(id);
    if (!task) return;
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        tasks.delete(id);
        task.onend();
        return;
    }

    let utterance = new SpeechSynthesisUtterance(task.text);
    utterance.pitch = Math.max(0.1, Math.min(2, Number(options.pitch || 50) / 50));
    utterance.rate = Math.max(0.5, Math.min(2, Number(options.speed || 175) / 175));
    let fallbackSource = {
        stop() {
            utterance.onend = null;
            utterance.onerror = null;
            window.speechSynthesis.cancel();
            tasks.delete(id);
            task.onend();
        },
    };
    let finished = false;
    let finish = () => {
        if (finished) return;
        finished = true;
        tasks.delete(id);
        task.onend();
    };
    utterance.onstart = () => {
        task.onstart(fallbackSource, buildLip(task.text, Math.max(500, task.text.length * 55)));
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
}

if (ttsWorker) {
    ttsWorker.addEventListener("error", (error) => {
        workerBroken = true;
        console.error("BonziWORLD speech worker failed:", error.message || error);
        for (const [id] of tasks) playBrowserFallback(id, {});
    });
}

ttsWorker?.addEventListener("message", async (e) => {
    let { id, wav } = e.data;
    let task = tasks.get(id);
    if (!task) return;
    if (e.data.error) {
        workerBroken = true;
        console.error("BonziWORLD eSpeak failed:", e.data.error);
        playBrowserFallback(id, {});
        return;
    }
    if (task.signal.aborted) {
        tasks.delete(id);
        return;
    }
    try {
        if (!audioCtx || !gainNode) throw new Error("Web Audio API is unavailable");
        let wavBuffer = wav instanceof ArrayBuffer ? wav : wav.buffer;
        let buffer = await audioCtx.decodeAudioData(wavBuffer);
        let source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        if (audioCtx.state === "suspended") await audioCtx.resume().catch(() => {});
        source.start();
        // Synthesised lipsync over the SPOKEN duration. espeak pads the WAV with
        // trailing silence, so use the last non-silent sample as the end -
        // otherwise the mouth keeps flapping after the voice stops.
        let lipTimings = buildLip(task.text, speechDurationMs(buffer));
        task.onstart(source, lipTimings);
        source.addEventListener("ended", () => {
            task.onend();
            tasks.delete(id);
        });
    } catch (err) {
        console.error("BonziWORLD speech playback failed:", err);
        workerBroken = true;
        playBrowserFallback(id, {});
    }
});
