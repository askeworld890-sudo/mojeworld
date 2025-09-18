const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const srcDir = "public/showcase-src";
const outDir = "public/showcase";
const sizes = [600, 900, 1200];

fs.mkdirSync(outDir, { recursive: true });

fs.readdirSync(srcDir)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .forEach((f) => {
    sizes.forEach((w) => {
      const outName = f.replace(/\.(jpe?g|png)$/i, "") + `-${w}.webp`;
      sharp(path.join(srcDir, f))
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(outDir, outName))
        .then(() => console.log("✅ created", outName))
        .catch((e) => console.error("❌ error", e.message));
    });
  });
