const { execFileSync } = require("child_process");
const fs = require("fs");

const colors = [];
// const imgs = ["gray"];

function range(start, end) {
    const out = [];
    for (let i = start; i <= end; i++) {
        out.push(`tmp${i}.png`);
    }
    return out;
}

for (const color of colors) {
    execFileSync(
        "magick",
        [
            `${color}.png`,
            "-crop",
            "200x160",
            "+repage",
            "tmp%d.png",
        ],
        { stdio: "inherit" }
    );

    const files = [
        "tmp0.png",
        ...range(277, 302),
        ...range(16, 39),
        ...range(40, 86),
        ...range(108, 125),
        ...range(159, 163),
        ...range(182, 189),
        ...range(331, 343),
    ];

    execFileSync(
        "magick",
        [
            "montage",
            "-tile",
            "12x",
            ...files,
            "-geometry",
            "+0+0",
            "-background",
            "none",
            "-define",
            "webp:lossless=true",
            `${color}.webp`,
        ],
        { stdio: "inherit" }
    );
}

for (const file of fs.readdirSync(".")) {
    if (file.startsWith("tmp") && file.endsWith(".png")) {
        fs.unlinkSync(file);
    }
}

/*
const imgs = ["gray"];

for (const img of imgs) {
    execFileSync(
        "magick",
        [
            `${img}.webp`,
            "-coalesce",
            "-repage",
            "0x0",
            "-crop",
            "50x50+76+39",
            "+repage",
            "-define",
            "webp:lossless=true",
            `../pfp/${img}.webp`,
        ],
        { stdio: "inherit" }
    );
}
*/