#!/usr/bin/env node
// Normalize dist sourcemap paths so the committed bundle is byte-identical
// regardless of which machine (or checkout path) built it.
//
// Root cause this fixes: tsup/esbuild embeds ABSOLUTE build-machine paths in
// every `.map`'s `file` and `sources` fields — e.g.
//   "file": "C:\\Users\\seoul\\OneDrive\\...\\dist\\components\\buttons\\Button.cjs"
// so a rebuild on a different machine rewrites ALL sourcemaps (path-only churn)
// and makes `check:generated` (git diff -- src dist) unstable across machines.
//
// This rewrites `file` and each `sources[]` entry to be RELATIVE to the map
// file's own directory. The relative path between two locations under the same
// repo root is independent of where that root lives, so the output is identical
// on every machine. Idempotent — safe to run on already-normalized maps.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DIST = 'dist';

function collectMaps(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectMaps(full));
    else if (entry.name.endsWith('.map')) out.push(full);
  }
  return out;
}

// Decode any %XX escaping esbuild emitted, normalize separators, and — when the
// path is absolute — re-express it relative to the map file's directory.
function relativize(rawPath, mapDir) {
  if (typeof rawPath !== 'string') return rawPath;
  let decoded = rawPath;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    /* leave malformed escapes as-is */
  }
  decoded = decoded.replace(/\\/g, '/');
  const isAbsolute = /^[a-zA-Z]:\//.test(decoded) || decoded.startsWith('/');
  if (!isAbsolute) return decoded;
  // Resolve both sides to absolute so drive-letter case is compared correctly,
  // then relative() cancels the shared repo-root prefix.
  const rel = path.relative(path.resolve(mapDir), path.resolve(decoded));
  return rel.replace(/\\/g, '/');
}

let changed = 0;
for (const mapFile of collectMaps(DIST)) {
  const mapDir = path.dirname(mapFile);
  const map = JSON.parse(readFileSync(mapFile, 'utf8'));
  let dirty = false;

  if (typeof map.file === 'string') {
    const next = relativize(map.file, mapDir);
    if (next !== map.file) {
      map.file = next;
      dirty = true;
    }
  }
  if (Array.isArray(map.sources)) {
    const next = map.sources.map((source) => relativize(source, mapDir));
    if (JSON.stringify(next) !== JSON.stringify(map.sources)) {
      map.sources = next;
      dirty = true;
    }
  }

  if (dirty) {
    writeFileSync(mapFile, JSON.stringify(map));
    changed += 1;
  }
}

console.log(`Normalized ${changed} sourcemap path(s) under ${DIST}/.`);
