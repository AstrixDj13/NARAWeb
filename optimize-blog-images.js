import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = ['blog1', 'blog2', 'blog3'];
const publicDir = path.join(process.cwd(), 'public');

(async () => {
    for (const dir of dirs) {
        const fullDir = path.join(publicDir, dir);
        if (!fs.existsSync(fullDir)) {
            console.log(`Directory ${fullDir} doesn't exist.`);
            continue;
        }

        const files = fs.readdirSync(fullDir);
        for (const file of files) {
            if (file.match(/\.(jpe?g|png)$/i)) {
                const filePath = path.join(fullDir, file);
                const name = path.parse(file).name;

                // Full size optimized WebP (max width 1200)
                await sharp(filePath)
                    .resize({ width: 1200, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(path.join(fullDir, `${name}.webp`));

                // Thumbnail 400px WebP
                await sharp(filePath)
                    .resize({ width: 400, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(path.join(fullDir, `${name}-400.webp`));

                console.log(`Processed ${file}`);
            }
        }
    }
})();
