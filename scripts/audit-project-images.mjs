import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Read metadata only. The source photographs are never rewritten.
const images = {};
async function inspect(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await inspect(filename);
    else if (/\.(jpe?g|png|webp|avif)$/i.test(entry.name)) {
      const metadata = await sharp(filename).metadata();
      const rotated = [5, 6, 7, 8].includes(metadata.orientation);
      images[`/${filename.replaceAll(path.sep, "/").replace(/^public\//, "")}`] = {
        width: rotated ? metadata.height : metadata.width,
        height: rotated ? metadata.width : metadata.height,
      };
    }
  }
}
await inspect("public/assets/images");
const content = `${JSON.stringify(Object.fromEntries(Object.entries(images).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`;
const destination = "src/data/image-metadata.json";
if (process.argv.includes("--check")) {
  if ((await fs.readFile(destination, "utf8")) !== content)
    throw new Error("Image dimensions changed. Run npm run images:audit.");
  console.log(`Verified ${Object.keys(images).length} images; source files untouched.`);
} else {
  await fs.writeFile(destination, content);
  console.log(
    `Recorded dimensions for ${Object.keys(images).length} images; source files untouched.`,
  );
}
