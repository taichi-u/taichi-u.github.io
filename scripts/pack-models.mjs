// Run after exporting the original Blender models: node scripts/pack-models.mjs
// Keep conventional GLBs intact for editing and browsers without native gzip decoding.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { gzipSync, gunzipSync } from "node:zlib";

let totalRaw = 0;
let totalPacked = 0;

for (const name of ["satellite", "planet", "robot"]) {
  const source = new URL(`../assets/models/${name}.glb`, import.meta.url);
  const destination = new URL(`${source.href}.gz`);
  const raw = await readFile(source);
  assert(raw.length >= 12, `${name}: GLB header is missing`);
  assert.equal(raw.toString("ascii", 0, 4), "glTF", `${name}: invalid GLB magic`);
  assert.equal(raw.readUInt32LE(4), 2, `${name}: expected glTF 2.0`);
  assert.equal(raw.readUInt32LE(8), raw.length, `${name}: invalid GLB length`);

  const packed = gzipSync(raw, { level: 9 });
  // No build timestamp or operating-system marker: repeat runs produce identical headers.
  packed.writeUInt32LE(0, 4);
  packed[9] = 255;
  assert(gunzipSync(packed).equals(raw), `${name}: gzip round-trip changed model bytes`);

  let previous;
  try {
    previous = await readFile(destination);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const changed = !previous?.equals(packed);
  if (changed) await writeFile(destination, packed);

  totalRaw += raw.length;
  totalPacked += packed.length;
  const saving = ((1 - packed.length / raw.length) * 100).toFixed(1);
  console.log(`${name}: ${raw.length} → ${packed.length} bytes (${saving}% smaller; ${changed ? "written" : "unchanged"}; round-trip verified)`);
}

console.log(`Total: ${totalRaw} → ${totalPacked} bytes (${((1 - totalPacked / totalRaw) * 100).toFixed(1)}% smaller)`);
