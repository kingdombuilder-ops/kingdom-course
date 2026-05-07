// parse-check.mjs — validate every .jsx and .js source file under kingdom-vite/src
// parses cleanly with @babel/parser. This is the "does it compile" gate before
// we attempt any JSDOM render.

import { parse } from '@babel/parser';
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/home/claude/kingdom-vite/src';

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && (full.endsWith('.jsx') || full.endsWith('.js'))) {
      files.push(full);
    }
  }
}
walk(SRC);

let pass = 0;
let fail = 0;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  try {
    parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'importMeta'],
    });
    console.log(`  ✓  ${file.replace(SRC + '/', '')}  (${source.length} bytes)`);
    pass += 1;
  } catch (err) {
    console.log(`  ✗  ${file.replace(SRC + '/', '')}  — ${err.message}`);
    fail += 1;
  }
}

console.log(`\n${pass} passed, ${fail} failed, ${files.length} total\n`);
if (fail > 0) process.exit(1);
