const fs = require('fs');
const path = require('path');

// Try importing wawoff2
let compress;
try {
    const wawoff2 = require('wawoff2');
    compress = wawoff2.compress;
} catch (e) {
    console.error("wawoff2 failed to load:", e);
    process.exit(1);
}

const fontsDir = path.join(process.cwd(), 'src', 'fonts', 'antikor_mono');
const outfitDir = path.join(process.cwd(), 'src', 'fonts', 'Outfit');

const keepAntikor = [
    'Taner Ardali  Antikor Mono Regular.ttf',
    'Taner Ardali  Antikor Mono Medium.ttf',
    'Taner Ardali  Antikor Mono Bold.ttf'
];

const keepOutfit = [
    'outfit_variable.ttf'
];

async function processDir(dir, keepFiles) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file.endsWith('.ttf')) {
            if (keepFiles.includes(file)) {
                console.log(`Converting ${file} to WOFF2...`);
                const inputPath = path.join(dir, file);
                const woff2Path = inputPath.replace('.ttf', '.woff2');
                try {
                    const input = fs.readFileSync(inputPath);
                    const output = await compress(input);
                    fs.writeFileSync(woff2Path, output);
                    console.log(`Success: ${woff2Path}`);
                } catch (e) {
                    console.error(`Failed to convert ${file}:`, e.message);
                }
            } else {
                console.log(`Deleting unused font: ${file}`);
                fs.unlinkSync(path.join(dir, file));
            }
        }
    }

    keepFiles.forEach(file => {
        const p = path.join(dir, file);
        if (fs.existsSync(p)) {
            console.log(`Deleting original TTF: ${file}`);
            fs.unlinkSync(p);
        }
    });
}

(async () => {
    await processDir(fontsDir, keepAntikor);
    await processDir(outfitDir, keepOutfit);
    console.log('Conversion process complete.');
})();
