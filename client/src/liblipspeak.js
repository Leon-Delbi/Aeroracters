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

let ttsWorker = new Worker(new URL("./espeakWorker.js", import.meta.url), { type: "module" });
let audioCtx = new AudioContext();
let gainNode = new GainNode(audioCtx, { gain: 1 });
gainNode.connect(audioCtx.destination);

export function setVoice(name) {
    currentVoice = "espeak";
}

export function setVolume(vol) {
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
    ttsWorker.postMessage({ id, text, options });
}

// playSSML kept for interface compatibility (no SSML in espeak CLI here).
function playSSML(text, options = {}, onend = () => {}, onstart = () => {}, signal = { aborted: false }) {
    play(String(text).replace(/<[^>]+>/g, " "), options, onend, onstart, signal);
}

export let speak = { play, playSSML };

ttsWorker.addEventListener("message", async (e) => {
    let { id, wav } = e.data;
    let task = tasks.get(id);
    if (!task) return;
    if (task.signal.aborted) {
        tasks.delete(id);
        return;
    }
    try {
        let buffer = await audioCtx.decodeAudioData(wav.buffer);
        let source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        if (audioCtx.state === "suspended") audioCtx.resume();
        source.start();
        // Synthesised lipsync over the SPOKEN duration. espeak pads the WAV with
        // trailing silence, so use the last non-silent sample as the end -
        // otherwise the mouth keeps flapping after the voice stops.
        let lipTimings = buildLip(task.text, speechDurationMs(buffer));
        task.onstart(source, lipTimings);
        source.addEventListener("ended", () => {
            task.onend();
        });
    } catch (err) {
        task.onend();
    }
});
