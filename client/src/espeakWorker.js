
let createWav;
let initializationError = null;
const workerBaseUrl = new URL("./", import.meta.url);

function timestamps() {
    return {
        timestamps: {
            access: new Date(),
            change: new Date(),
            modification: new Date(),
        },
    };
}

{
    async function main() {
        let [
            phontab,
            phondata,
            phonindex,
            intonations,
            en_dict,
            en_US,
        ] = await Promise.all(espeakFetch([
            "phontab",
            "phondata",
            "phonindex",
            "intonations",
            "en_dict",
            "lang/gmw/en-us",
        ]));
        let speakNgBuffer = await fetchAsset("speak-ng.wasm", "arrayBuffer");
        let { WASI } = await import(new URL("./lib/runno.js", import.meta.url).href);
        async function play(text, options = {}) {
            let wasi = new WASI({
                args: [
                    "speak-ng",
                    "-w", "wav.wav",
                    "-v", "en-us",
                    "-p", String(options.pitch || 50),
                    "-s", String(options.speed || 175),
                    "--path=/espeak",
                    "--",
                    text,
                ],
                stdout: console.log,
                stderr: console.error,
                fs: {
                    "/espeak/phontab": {
                        path: "/espeak/phontab",
                        ...timestamps(),
                        mode: "binary",
                        content: phontab,
                    },
                    "/espeak/phondata": {
                        path: "/espeak/phondata",
                        ...timestamps(),
                        mode: "binary",
                        content: phondata,
                    },
                    "/espeak/phonindex": {
                        path: "/espeak/phonindex",
                        ...timestamps(),
                        mode: "binary",
                        content: phonindex,
                    },
                    "/espeak/intonations": {
                        path: "/espeak/intonations",
                        ...timestamps(),
                        mode: "binary",
                        content: intonations,
                    },
                    "/espeak/en_dict": {
                        path: "/espeak/en_dict",
                        ...timestamps(),
                        mode: "binary",
                        content: en_dict,
                    },
                    "/espeak/lang/gmw/en-us": {
                        path: "/espeak/lang/gmw/en-us",
                        ...timestamps(),
                        mode: "binary",
                        content: en_US,
                    },
                },
            });
            let wasm = await WebAssembly.instantiate(speakNgBuffer, {
                ...wasi.getImportObject(),
            });
            await wasi.start(wasm);
            return wasi.drive.fs["/wav.wav"].content;
        }
        createWav = play;
    }
    var ready = main().catch((error) => {
        initializationError = error;
        throw error;
    });
}

function espeakFetch(arr) {
    return arr.map((url) => {
        return fetchAsset(`espeak-ng-data/${url}`, "arrayBuffer")
            .then(data => new Uint8Array(data));
    });
}

onmessage = async (e) => {
    let { id, text, options } = e.data;
    try {
        await ready;
        if (!createWav) throw initializationError || new Error("Speech engine did not initialize");
        let wav = await createWav(text, options);
        postMessage({ id, wav }, [wav.buffer]);
    } catch (error) {
        postMessage({
            id,
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

async function fetchAsset(relativePath, responseType) {
    const response = await fetch(new URL(relativePath, workerBaseUrl));
    if (!response.ok) {
        throw new Error(`Speech asset failed to load (${response.status}): ${relativePath}`);
    }
    return response[responseType]();
}
