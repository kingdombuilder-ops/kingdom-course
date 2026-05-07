// render-check.mjs — actually mount each migrated modal in jsdom and verify it
// renders meaningful DOM (not empty, not throwing). This is the verification
// gate the user memory rule requires before presenting work.

import { JSDOM } from 'jsdom';
import { transformSync } from '@babel/core';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';

const SRC = '/home/claude/kingdom-vite/src';
const VERIFY = '/home/claude/verify';

// ---- Set up jsdom as the global window ------------------------------------
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.getComputedStyle = dom.window.getComputedStyle;

// ---- Build an ESM-friendly require with alias resolution -------------------
const require = Module.createRequire(`${VERIFY}/`);
const cache = {};

const ALIASES = {
  '@data':       path.join(SRC, 'data'),
  '@shared':     path.join(SRC, 'shared'),
  '@modals':     path.join(SRC, 'modals'),
  '@components': path.join(SRC, 'components'),
};

function resolveImport(spec, fromFile) {
  // Aliases first
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (spec === alias) return path.join(target, 'index.js');
    if (spec.startsWith(alias + '/')) return path.join(target, spec.slice(alias.length + 1));
  }
  // Relative imports
  if (spec.startsWith('./') || spec.startsWith('../')) {
    let resolved = path.resolve(path.dirname(fromFile), spec);
    if (fs.existsSync(resolved)) return resolved;
    if (fs.existsSync(resolved + '.js')) return resolved + '.js';
    if (fs.existsSync(resolved + '.jsx')) return resolved + '.jsx';
    if (fs.existsSync(path.join(resolved, 'index.js'))) return path.join(resolved, 'index.js');
    return resolved;
  }
  // Bare specifier — node_modules
  return null; // signal: use real require
}

function loadModule(file) {
  if (cache[file]) return cache[file];

  const source = fs.readFileSync(file, 'utf8');

  // Transform JSX + ESM → CommonJS
  const { code } = transformSync(source, {
    babelrc: false,
    configFile: false,
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    filename: file,
  });

  // Build a custom require that handles aliases + relative imports
  const moduleObj = { exports: {} };
  cache[file] = moduleObj.exports;

  const customRequire = (spec) => {
    const resolved = resolveImport(spec, file);
    if (resolved) {
      // Check this resolved path is actually a file
      if (!fs.existsSync(resolved)) {
        throw new Error(`Cannot resolve "${spec}" from ${file} → ${resolved}`);
      }
      return loadModule(resolved);
    }
    // Bare specifier — let real Node require handle it
    return require(spec);
  };

  // Run the transformed CJS module
  const fn = new Function('module', 'exports', 'require', '__filename', '__dirname', code);
  try {
    fn(moduleObj, moduleObj.exports, customRequire, file, path.dirname(file));
  } catch (err) {
    delete cache[file];
    throw new Error(`Loading ${file}: ${err.message}`);
  }

  cache[file] = moduleObj.exports;
  return moduleObj.exports;
}

// ---- Render each modal and assert non-empty DOM ---------------------------
const React = require('react');
const ReactDOMClient = require('react-dom/client');

async function renderAndCheck(label, element, predicate) {
  // Fresh root each test
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);

  let error = null;
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Capture but suppress — we'll inspect at the end
    if (!error) error = args.map(String).join(' ');
  };

  try {
    rootApi.render(element);
    // Let React flush
    await new Promise((r) => setTimeout(r, 50));

    const html = root.innerHTML;
    const len = html.length;
    const ok = predicate ? predicate(html, root) : len > 100;

    if (error) {
      console.log(`  ⚠  ${label}  rendered (${len} bytes) — but emitted: ${error.slice(0, 200)}`);
      return false;
    }
    if (ok) {
      console.log(`  ✓  ${label}  rendered cleanly (${len} bytes)`);
      return true;
    } else {
      console.log(`  ✗  ${label}  predicate failed. HTML: ${html.slice(0, 300)}`);
      return false;
    }
  } catch (err) {
    console.log(`  ✗  ${label}  threw: ${err.message}`);
    return false;
  } finally {
    rootApi.unmount();
    root.remove();
    console.error = originalConsoleError;
  }
}

// ---- Run the suite --------------------------------------------------------
console.log('Loading modal modules...');
let AddIntentionModal, CloudOfWitnesses, HousesQuiz;
try {
  ({ default: AddIntentionModal } = loadModule(path.join(SRC, 'modals/AddIntentionModal.jsx')));
  ({ default: CloudOfWitnesses }  = loadModule(path.join(SRC, 'modals/CloudOfWitnesses.jsx')));
  ({ default: HousesQuiz }        = loadModule(path.join(SRC, 'modals/HousesQuiz.jsx')));
  console.log('  ✓  All three modules loaded\n');
} catch (err) {
  console.error('FAIL during module load:', err.message);
  process.exit(1);
}

console.log('Rendering each modal...');
let allPassed = true;

allPassed = (await renderAndCheck(
  'AddIntentionModal      ',
  React.createElement(AddIntentionModal, { onAdd: () => {}, onClose: () => {} }),
  (html) => html.includes('Whose name will you carry') && html.includes('Add to my intentions'),
)) && allPassed;

allPassed = (await renderAndCheck(
  'CloudOfWitnesses       ',
  React.createElement(CloudOfWitnesses),
  (html) => html.includes('You are not walking alone') && html.includes('Thomas Aquinas'),
)) && allPassed;

allPassed = (await renderAndCheck(
  'HousesQuiz (intro)     ',
  React.createElement(HousesQuiz, { onSave: () => {}, onClose: () => {} }),
  (html) => html.includes('Discover your House') && html.includes('Light · Fire · Earth · Joy · Glory'),
)) && allPassed;

console.log();
if (allPassed) {
  console.log('All renders passed.\n');
  process.exit(0);
} else {
  console.log('At least one render failed.\n');
  process.exit(1);
}
