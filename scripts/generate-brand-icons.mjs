import { writeFile } from "node:fs/promises";
import sharp from "sharp";

// Preserve the supplied company logo, including its original proportions.
const logo = new URL("../public/assets/logos/irontech.jpg", import.meta.url);
const sizes = [16, 32, 48, 96, 256];
const images = await Promise.all(
  sizes.map((size) =>
    sharp(logo.pathname)
      .resize(size, size, { fit: "contain", background: "#ffffff" })
      .ensureAlpha()
      .png()
      .toBuffer(),
  ),
);

// ICO supports PNG payloads; provide several sizes for browsers and search.
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, index) => {
  const entry = 6 + index * 16;
  header[entry] = size === 256 ? 0 : size;
  header[entry + 1] = size === 256 ? 0 : size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[index].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
});
const favicon = Buffer.concat([header, ...images]);
await writeFile(new URL("../src/app/favicon.ico", import.meta.url), favicon);
await writeFile(new URL("../public/assets/logos/favicon.ico", import.meta.url), favicon);
await writeFile(new URL("../src/app/icon.png", import.meta.url), images[sizes.indexOf(96)]);
await sharp(logo.pathname)
  .resize(180, 180, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile(new URL("../src/app/apple-icon.png", import.meta.url).pathname);
