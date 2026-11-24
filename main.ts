// Real-Life Patch Notes: The Comedy Changelog
// Writes one one-line patch note (max 160 chars) to /output/entry.txt.
// Node 22, no dependencies, no network.

import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "v2.4.2: fixed a bug where yawning in a meeting auto-subscribed nearby colleagues to the same yawn.";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");
const MAX_CHARS = 160;

function validate(text: string): void {
  // Count code points, not UTF-16 units, so the gate's character count matches.
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(ENTRY);
  mkdirSync(OUT_DIR, { recursive: true });
  const tmp = join(OUT_DIR, `.entry.txt.tmp-${process.pid}`);
  try {
    writeFileSync(tmp, ENTRY, "utf8");
    renameSync(tmp, OUT_FILE);
  } catch (err) {
    rmSync(tmp, { force: true });
    throw err;
  }
  // Read back byte-for-byte to prove the write landed exactly.
  const back = readFileSync(OUT_FILE, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt does not match the entry");
  }
  console.log(`wrote ${[...ENTRY].length} chars to ${OUT_FILE}`);
}

main();
