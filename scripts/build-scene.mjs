// This optional asset build is separate from dependency-free content generation.
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const result = await build({
  absWorkingDir: root,
  entryPoints: ["scene.js"],
  outfile: "scene.min.js",
  format: "esm",
  platform: "browser",
  target: "es2020",
  bundle: true,
  minify: true,
  treeShaking: true,
  legalComments: "eof",
  metafile: true,
  banner: { js: "/*! Portfolio 3D background. Includes Three.js r180 (MIT); see assets/vendor/three/LICENSE. */" },
});
const sources = {};
for (const path of Object.keys(result.metafile.inputs).sort()) {
  sources[path] = createHash("sha256").update(await readFile(new URL(`../${path}`, import.meta.url))).digest("hex");
}
const bundle = await readFile(new URL("../scene.min.js", import.meta.url));
await writeFile(new URL("../assets/scene-build.json", import.meta.url), JSON.stringify({
  tool: "esbuild 0.25.10", sources,
  output: { path: "scene.min.js", bytes: bundle.length, sha256: createHash("sha256").update(bundle).digest("hex") },
}, null, 2) + "\n");
console.log(`3D bundle: ${bundle.length.toLocaleString("en-US")} bytes; ${Object.keys(sources).length} source modules.`);
await import("./pack-models.mjs");
