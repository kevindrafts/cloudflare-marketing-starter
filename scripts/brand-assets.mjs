import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// The base palette is the source of truth for standalone brand assets.
const root = new URL("../", import.meta.url);
const css = await readFile(new URL("src/styles/global.css", root), "utf8");
const block = css.match(/@theme\s*\{([^}]*)\}/)?.[1];
if (!block) throw new Error("Base color palette not found.");
const colors = Object.fromEntries(
  [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
    name,
    value.trim(),
  ]),
);
for (const name of ["favicon", "social"]) {
  const template = await readFile(
    new URL(`scripts/assets/${name}.svg`, root),
    "utf8",
  );
  const svg = template.replace(/\{\{([\w-]+)\}\}/g, (_, token) => {
    const color = colors[token];
    if (!color || !/^#[\da-f]{3,8}$/i.test(color)) {
      throw new Error(`Brand token --${token} must be a literal hex color.`);
    }
    return color;
  });
  await writeFile(new URL(`public/${name}.svg`, root), svg);
  if (name === "social") {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(new URL("public/social.png", root).pathname);
  }
}
