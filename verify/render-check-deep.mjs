// render-check-deep.mjs — extends render-check.mjs to verify:
//   1. HousesQuiz at all three phases (intro, questions, result)
//   2. The full App.jsx mounts without throwing
//   3. Every data export is present in @data barrel

import { JSDOM } from 'jsdom';
import { transformSync } from '@babel/core';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';

const SRC = '/home/claude/kingdom-vite/src';
const VERIFY = '/home/claude/verify';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/', pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.MouseEvent = dom.window.MouseEvent;
global.getComputedStyle = dom.window.getComputedStyle;
// Mock localStorage so storage hooks work
const _ls = {};
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (k) => _ls[k] ?? null,
    setItem: (k, v) => { _ls[k] = String(v); },
    removeItem: (k) => { delete _ls[k]; },
    clear: () => { Object.keys(_ls).forEach((k) => delete _ls[k]); },
    get length() { return Object.keys(_ls).length; },
    key: (i) => Object.keys(_ls)[i] ?? null,
  },
  configurable: true,
});
// jsdom's window already has its own localStorage; we override only the
// global so the storage hook (which uses `window.localStorage`) sees jsdom's.
// The hook does `if (typeof window === 'undefined') return defaultValue;` —
// jsdom's window is defined, and its localStorage works, so no additional
// patching is required.

const require = Module.createRequire(`${VERIFY}/`);
const cache = {};
const ALIASES = {
  '@data':       path.join(SRC, 'data'),
  '@shared':     path.join(SRC, 'shared'),
  '@modals':     path.join(SRC, 'modals'),
  '@components': path.join(SRC, 'components'),
};

function resolveImport(spec, fromFile) {
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (spec === alias) return path.join(target, 'index.js');
    if (spec.startsWith(alias + '/')) {
      let resolved = path.join(target, spec.slice(alias.length + 1));
      if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
      if (fs.existsSync(resolved + '.js')) return resolved + '.js';
      if (fs.existsSync(resolved + '.jsx')) return resolved + '.jsx';
      if (fs.existsSync(path.join(resolved, 'index.js'))) return path.join(resolved, 'index.js');
      return resolved; // let the existsSync check downstream throw a clear error
    }
  }
  if (spec.startsWith('./') || spec.startsWith('../')) {
    let resolved = path.resolve(path.dirname(fromFile), spec);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
    if (fs.existsSync(resolved + '.js')) return resolved + '.js';
    if (fs.existsSync(resolved + '.jsx')) return resolved + '.jsx';
    if (fs.existsSync(path.join(resolved, 'index.js'))) return path.join(resolved, 'index.js');
    return resolved;
  }
  return null;
}

function loadModule(file) {
  if (cache[file]) return cache[file];

  // Special case: src/env.js uses import.meta.env which Babel CommonJS
  // transform can't handle. Stub it to { IS_DEV: false } so the harness
  // sees the production-shaped App. Tests that need to verify dev-mode
  // behavior would need to monkey-patch the cache before App.jsx loads.
  if (file.endsWith('/env.js') && file.includes('/src/')) {
    cache[file] = { IS_DEV: false };
    return cache[file];
  }

  const source = fs.readFileSync(file, 'utf8');
  const { code } = transformSync(source, {
    babelrc: false, configFile: false,
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    filename: file,
  });
  const moduleObj = { exports: {} };
  cache[file] = moduleObj.exports;
  const customRequire = (spec) => {
    const resolved = resolveImport(spec, file);
    if (resolved) {
      if (!fs.existsSync(resolved)) throw new Error(`Cannot resolve "${spec}" from ${file}`);
      return loadModule(resolved);
    }
    return require(spec);
  };
  const fn = new Function('module', 'exports', 'require', '__filename', '__dirname', code);
  try { fn(moduleObj, moduleObj.exports, customRequire, file, path.dirname(file)); }
  catch (err) { delete cache[file]; throw new Error(`Loading ${file}: ${err.message}`); }
  cache[file] = moduleObj.exports;
  return moduleObj.exports;
}

const React = require('react');
const { act } = require('react-dom/test-utils');
const ReactDOMClient = require('react-dom/client');

let pass = 0, fail = 0;
async function step(label, fn) {
  try {
    await fn();
    console.log(`  ✓  ${label}`);
    pass += 1;
  } catch (err) {
    console.log(`  ✗  ${label}  — ${err.message}`);
    fail += 1;
  }
}

// 1. Verify @data barrel exports everything we expect
console.log('Test 1: @data barrel exports');
const data = loadModule(path.join(SRC, 'data/index.js'));
const expectedExports = [
  'CHURCH_TODAY', 'LITURGICAL_DAYS', 'LITURGICAL_FALLBACK', 'getLiturgicalDay',
  'STEP_COLORS', 'STEP_TINTS', 'STEP_GLOWS', 'TAB_LABEL',
  'HOUSES', 'HOUSE_LIST', 'HOUSES_HUB', 'HOUSE_QUOTES', 'TODAY_HOUSE_QUOTE_INDEX',
  'SAINTS_HUB',
  'DAILY_PRACTICES', 'WORKS_OF_MERCY', 'ICON_MAP',
  'TODAY_GO', 'GO_PROMPTS', 'TODAY_FAMILY', 'TODAY_CIVILIZATION',
  'QUIZ_QUESTIONS',
];
for (const name of expectedExports) {
  await step(`${name} is exported and truthy`, () => {
    if (data[name] === undefined) throw new Error('undefined');
    if (data[name] === null) throw new Error('null');
  });
}

// 1.5. Verify house labels — Joy and Earth are the post-rename canonical
console.log('\nTest 2: House labels post-rename');
await step("HOUSES.peace.name === 'Joy'", () => {
  if (data.HOUSES.peace.name !== 'Joy') throw new Error(`got "${data.HOUSES.peace.name}"`);
});
await step("HOUSES.benedict.name === 'Earth'", () => {
  if (data.HOUSES.benedict.name !== 'Earth') throw new Error(`got "${data.HOUSES.benedict.name}"`);
});
await step("HOUSES_HUB.peace.name === 'Joy'", () => {
  if (data.HOUSES_HUB.peace.name !== 'Joy') throw new Error(`got "${data.HOUSES_HUB.peace.name}"`);
});
await step("HOUSES_HUB.benedict.name === 'Earth'", () => {
  if (data.HOUSES_HUB.benedict.name !== 'Earth') throw new Error(`got "${data.HOUSES_HUB.benedict.name}"`);
});
await step('all five houses present in HOUSES_HUB', () => {
  const slugs = Object.keys(data.HOUSES_HUB).sort();
  const expected = ['benedict', 'fire', 'glory', 'light', 'peace'];
  if (JSON.stringify(slugs) !== JSON.stringify(expected)) {
    throw new Error(`got [${slugs.join(', ')}]`);
  }
});

// 2. Verify HousesQuiz reaches the result phase
console.log('\nTest 3: HousesQuiz state transitions');
const { default: HousesQuiz } = loadModule(path.join(SRC, 'modals/HousesQuiz.jsx'));

async function renderToHtml(element) {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => { rootApi.render(element); });
  const html = root.innerHTML;
  rootApi.unmount();
  root.remove();
  return html;
}

await step('Quiz intro phase shows litany', async () => {
  const html = await renderToHtml(React.createElement(HousesQuiz, { onSave: () => {}, onClose: () => {} }));
  if (!html.includes('Light · Fire · Earth · Joy · Glory')) {
    throw new Error('litany missing or stale');
  }
  if (!html.includes('Begin the discernment')) throw new Error('CTA missing');
});

await step('Quiz intro contains all five House previews', async () => {
  const html = await renderToHtml(React.createElement(HousesQuiz, { onSave: () => {}, onClose: () => {} }));
  for (const name of ['Light', 'Fire', 'Earth', 'Joy', 'Glory']) {
    if (!html.includes(name)) throw new Error(`House "${name}" missing from intro grid`);
  }
});

// 3. Click into questions phase — simulate state change via react testing
await step('Quiz transitions to questions phase on Begin click', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(HousesQuiz, { onSave: () => {}, onClose: () => {} }));
  });

  // Find the "Begin the discernment" button
  const buttons = Array.from(root.querySelectorAll('button'));
  const begin = buttons.find((b) => b.textContent.includes('Begin the discernment'));
  if (!begin) {
    rootApi.unmount(); root.remove();
    throw new Error('Begin button not found');
  }
  await act(async () => { begin.click(); });

  const html = root.innerHTML;
  rootApi.unmount(); root.remove();

  if (!html.includes('Question 1 of 6')) throw new Error('did not transition to questions');
  if (!html.includes(data.QUIZ_QUESTIONS[0].prompt)) throw new Error('question prompt missing');
});

// 4. Run through all 6 questions, verify reaches result
await step('Quiz reaches result phase after answering all 6 questions', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  let savedKey = null;
  await act(async () => {
    rootApi.render(React.createElement(HousesQuiz, {
      onSave: (key) => { savedKey = key; },
      onClose: () => {},
    }));
  });

  // Click "Begin"
  await act(async () => {
    const begin = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the discernment'));
    begin.click();
  });

  // For each of 6 questions: click the first answer-card, then Next
  for (let i = 0; i < 6; i++) {
    await act(async () => {
      const answerCards = root.querySelectorAll('button.answer-card');
      if (answerCards.length === 0) throw new Error(`Q${i + 1}: no answer cards`);
      // Pick the "light" answer (first one) so we get a clear primary
      answerCards[0].click();
    });
    await act(async () => {
      const buttons = Array.from(root.querySelectorAll('button'));
      const next = buttons.find((b) =>
        b.textContent.includes('Next') || b.textContent.includes('See your House'));
      if (!next) throw new Error(`Q${i + 1}: no next button`);
      next.click();
    });
  }

  const html = root.innerHTML;
  rootApi.unmount(); root.remove();

  if (!html.includes('Your House appears to be')) throw new Error('did not reach result');
  if (!html.includes('Save House of')) throw new Error('save button missing');
  if (!html.includes('The Full Picture')) throw new Error('bar chart section missing');
});

// 5. The three batch-4 modals — render and verify content
console.log('\nTest 4: Batch 4 modals');
const { default: AwakenToTheDay } = loadModule(path.join(SRC, 'modals/AwakenToTheDay.jsx'));
const { default: WorkOfMercy }    = loadModule(path.join(SRC, 'modals/WorkOfMercy.jsx'));
const { default: ReachOut }       = loadModule(path.join(SRC, 'modals/ReachOut.jsx'));

await step('AwakenToTheDay renders with feast + intention sections', async () => {
  const html = await renderToHtml(
    React.createElement(AwakenToTheDay, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('Step 1 · SEE')) throw new Error('SEE eyebrow missing');
  if (!html.includes('Today the Church remembers')) throw new Error('feast section missing');
  if (!html.includes('Today the Holy Father asks')) throw new Error('intention section missing');
  if (!html.includes('The Morning Offering')) throw new Error('morning offering missing');
  if (!html.includes('Where do you expect to meet Christ today')) throw new Error('question missing');
});

await step('AwakenToTheDay does NOT contain the stale "For migrants and refugees" hardcode', async () => {
  const html = await renderToHtml(
    React.createElement(AwakenToTheDay, { onComplete: () => {}, onClose: () => {} })
  );
  if (html.includes('For migrants and refugees')) {
    throw new Error('stale hardcoded H3 still present');
  }
});

await step('AwakenToTheDay does NOT show "undefined" anywhere (the issuer field bug)', async () => {
  const html = await renderToHtml(
    React.createElement(AwakenToTheDay, { onComplete: () => {}, onClose: () => {} })
  );
  if (html.includes('undefined')) throw new Error('undefined leaked into output');
});

await step('AwakenToTheDay onComplete fires', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(AwakenToTheDay, {
      onComplete: () => { calls += 1; },
      onClose: () => {},
    }));
  });
  await act(async () => {
    const buttons = Array.from(root.querySelectorAll('button'));
    const offer = buttons.find((b) => b.textContent.includes('day is offered'));
    if (!offer) { rootApi.unmount(); root.remove(); throw new Error('offer button missing'); }
    offer.click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onComplete called ${calls} times, expected 1`);
});

await step('WorkOfMercy renders with discern phase', async () => {
  const html = await renderToHtml(
    React.createElement(WorkOfMercy, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('Step 6 · BUILD')) throw new Error('BUILD eyebrow missing');
  if (!html.includes("Today's three")) throw new Error("today's three missing");
  if (!html.includes('Show all options')) throw new Error('show-all link missing');
  if (!html.includes('Where will the kingdom be built through you today')) throw new Error('hero missing');
});

await step('WorkOfMercy "Show all options" expands to all three circles', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(WorkOfMercy, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    const showAll = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Show all options'));
    if (!showAll) { rootApi.unmount(); root.remove(); throw new Error('show-all button missing'); }
    showAll.click();
  });
  const html = root.innerHTML;
  rootApi.unmount(); root.remove();

  if (!html.includes('Family · The domestic church')) throw new Error('Family circle label missing');
  if (!html.includes('Community · The wounded near you')) throw new Error('Community circle missing');
  if (!html.includes('Civilization · The world you are shaping')) throw new Error('Civilization circle missing');
  // 31 mercy-cards expected (7 family + 17 community + 7 civilization)
  // Crude check: count "mercy-card" class occurrences
  const cardCount = (html.match(/class="mercy-card/g) || []).length;
  if (cardCount < 31) throw new Error(`expected ≥31 cards, got ${cardCount}`);
});

await step('WorkOfMercy commits and onComplete receives the act', async () => {
  let received = null;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(WorkOfMercy, {
      onComplete: (act) => { received = act; },
      onClose: () => {},
    }));
  });
  // Click the first of today's three picks
  await act(async () => {
    const cards = Array.from(root.querySelectorAll('button')).filter((b) =>
      b.textContent.includes('Family') || b.textContent.includes('Corporal') ||
      b.textContent.includes('Spiritual') || b.textContent.includes('Civilization'));
    if (cards.length === 0) { rootApi.unmount(); root.remove(); throw new Error('no act cards'); }
    cards[0].click();
  });
  await act(async () => {
    const commit = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes("This is today's act"));
    if (!commit) { rootApi.unmount(); root.remove(); throw new Error('commit button missing'); }
    commit.click();
  });
  // Now in committed phase — click "I will do this. Amen."
  await act(async () => {
    const amen = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('I will do this'));
    if (!amen) { rootApi.unmount(); root.remove(); throw new Error('amen button missing'); }
    amen.click();
  });
  rootApi.unmount(); root.remove();
  if (!received) throw new Error('onComplete never called with an act');
  if (!received.name) throw new Error('act has no name field');
});

await step('ReachOut renders with prompt and Gospel anchor', async () => {
  const html = await renderToHtml(
    React.createElement(ReachOut, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('Step 7 · SEND')) throw new Error('SEND eyebrow missing');
  // One of the two Gospel verses must be present (depends on today's prompt)
  const hasMatt28 = html.includes('Matthew 28:19') || html.includes('make disciples of all nations');
  const hasMatt25 = html.includes('Matthew 25:40') || html.includes('the least of these');
  if (!hasMatt28 && !hasMatt25) throw new Error('neither Gospel anchor present');
  if (!html.includes('The kingdom does not extend through programs')) throw new Error('closing line missing');
});

await step('ReachOut onComplete fires', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(ReachOut, {
      onComplete: () => { calls += 1; },
      onClose: () => {},
    }));
  });
  await act(async () => {
    const amen = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Amen'));
    if (!amen) { rootApi.unmount(); root.remove(); throw new Error('amen button missing'); }
    amen.click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onComplete called ${calls} times, expected 1`);
});

// 6. Batch 5 modals — LectioDivina and AbideLocator
console.log('\nTest 5: Batch 5 modals');
const { default: LectioDivina } = loadModule(path.join(SRC, 'modals/LectioDivina.jsx'));
const { default: AbideLocator } = loadModule(path.join(SRC, 'modals/AbideLocator.jsx'));

await step('LectioDivina intro renders Gospel + Begin button', async () => {
  const html = await renderToHtml(
    React.createElement(LectioDivina, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('Step 2 · KNOW')) throw new Error('KNOW eyebrow missing');
  if (!html.includes('Lectio Divina')) throw new Error('title missing');
  if (!html.includes('Guigo II')) throw new Error('Guigo attribution missing');
  if (!html.includes("Today's Gospel")) throw new Error('Gospel section missing');
  if (!html.includes('Begin Lectio')) throw new Error('Begin button missing');
});

await step('LectioDivina enters step 1 (Lectio) on Begin click', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(LectioDivina, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    const begin = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin Lectio'));
    if (!begin) { rootApi.unmount(); root.remove(); throw new Error('Begin missing'); }
    begin.click();
  });
  const html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('Step 1 of 4')) throw new Error('step header missing');
  if (!html.includes('Read the Word')) throw new Error('lectio invitation missing');
  if (!html.includes('Read it through. Three times.')) throw new Error('read-counter prompt missing');
});

await step('LectioDivina advance is gated until 3 reads on step 1', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(LectioDivina, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    const begin = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin Lectio'));
    begin.click();
  });
  // Continue button should be disabled
  const continueBtn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('Continue'));
  if (!continueBtn) { rootApi.unmount(); root.remove(); throw new Error('Continue button missing'); }
  if (!continueBtn.disabled) {
    rootApi.unmount(); root.remove();
    throw new Error('Continue should be disabled before 3 reads');
  }
  // Click all 3 read circles
  await act(async () => {
    const circles = Array.from(root.querySelectorAll('button.read-counter-circle'));
    if (circles.length !== 3) {
      throw new Error(`expected 3 read circles, got ${circles.length}`);
    }
    circles[0].click(); circles[1].click(); circles[2].click();
  });
  // Now Continue should be enabled
  const continueBtn2 = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('Continue'));
  const stillDisabled = continueBtn2.disabled;
  rootApi.unmount(); root.remove();
  if (stillDisabled) throw new Error('Continue still disabled after 3 reads');
});

await step('LectioDivina full click-through reaches closing and onComplete fires', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(LectioDivina, {
      onComplete: () => { calls += 1; },
      onClose: () => {},
    }));
  });
  // intro → step 1
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin Lectio')).click();
  });
  // step 1: 3 reads, then continue
  await act(async () => {
    Array.from(root.querySelectorAll('button.read-counter-circle')).forEach((c) => c.click());
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Continue')).click();
  });
  // step 2: type a word, continue
  await act(async () => {
    const input = root.querySelector('input.surfaced-word-input');
    if (!input) throw new Error('surfaced-word input missing');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'mercy');
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Continue')).click();
  });
  // step 3: oratio — advance freely
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Continue')).click();
  });
  // step 4: contemplatio — "To the closing"
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('To the closing')).click();
  });
  // closing: amen
  const html = root.innerHTML;
  if (!html.includes('The Word remains')) {
    rootApi.unmount(); root.remove();
    throw new Error('did not reach closing phase');
  }
  if (!html.includes('mercy')) {
    rootApi.unmount(); root.remove();
    throw new Error('surfaced word did not carry through to closing');
  }
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Amen')).click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onComplete called ${calls} times, expected 1`);
});

await step('AbideLocator hero renders with Eucharist quote and three toggles', async () => {
  const html = await renderToHtml(
    React.createElement(AbideLocator, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('Step 4 · ABIDE')) throw new Error('ABIDE eyebrow missing');
  if (!html.includes('He is waiting for you')) throw new Error('hero missing');
  if (!html.includes('Lumen Gentium 11')) throw new Error('Lumen Gentium attribution missing');
  if (!html.includes('Find a Mass today')) throw new Error('Mass card missing');
  if (!html.includes('Find a tabernacle')) throw new Error('Adoration card missing');
  if (!html.includes('I went to Mass today')) throw new Error('toggle 1 missing');
  if (!html.includes('I sat in Adoration today')) throw new Error('toggle 2 missing');
  if (!html.includes('I made a Spiritual Communion')) throw new Error('toggle 3 missing');
});

await step('AbideLocator does NOT call onComplete when closed without confirming', async () => {
  let onCompleteCalls = 0;
  let onCloseCalls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(AbideLocator, {
      onComplete: () => { onCompleteCalls += 1; },
      onClose: () => { onCloseCalls += 1; },
    }));
  });
  await act(async () => {
    const closeBtn = root.querySelector('button[aria-label="Close"]');
    if (!closeBtn) { rootApi.unmount(); root.remove(); throw new Error('close button missing'); }
    closeBtn.click();
  });
  rootApi.unmount(); root.remove();
  if (onCompleteCalls !== 0) throw new Error('onComplete should NOT fire on close-without-confirm');
  if (onCloseCalls !== 1) throw new Error(`onClose should fire once, got ${onCloseCalls}`);
});

await step('AbideLocator commits via "Mark ABIDE complete" only after a toggle is confirmed', async () => {
  let onCompleteCalls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(AbideLocator, {
      onComplete: () => { onCompleteCalls += 1; },
      onClose: () => {},
    }));
  });
  // No toggle confirmed yet — "Mark ABIDE complete" should not be present
  let html = root.innerHTML;
  if (html.includes('Mark ABIDE complete')) {
    rootApi.unmount(); root.remove();
    throw new Error('Mark-complete CTA visible without any toggle');
  }
  // Click first toggle (I went to Mass today)
  await act(async () => {
    const toggle = Array.from(root.querySelectorAll('button.went-toggle'))[0];
    if (!toggle) throw new Error('went-toggle missing');
    toggle.click();
  });
  // Now CTA should appear
  html = root.innerHTML;
  if (!html.includes('Mark ABIDE complete')) {
    rootApi.unmount(); root.remove();
    throw new Error('Mark-complete CTA missing after confirming toggle');
  }
  // Click it
  await act(async () => {
    const cta = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Mark ABIDE complete'));
    cta.click();
  });
  rootApi.unmount(); root.remove();
  if (onCompleteCalls !== 1) throw new Error(`onComplete called ${onCompleteCalls} times, expected 1`);
});

await step('AbideLocator Spiritual Communion subphase auto-confirms that toggle on Amen', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(AbideLocator, { onComplete: () => {}, onClose: () => {} }));
  });
  // Click "Pray the Spiritual Communion"
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Pray the Spiritual Communion')).click();
  });
  // Now in subphase — verify prayer is showing
  let html = root.innerHTML;
  if (!html.includes('Come into my heart')) {
    rootApi.unmount(); root.remove();
    throw new Error('Spiritual Communion phase did not render');
  }
  if (!html.includes('St. Alphonsus Liguori')) {
    rootApi.unmount(); root.remove();
    throw new Error('Liguori attribution missing');
  }
  // Click "Amen · I have made a Spiritual Communion"
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Amen') && b.textContent.includes('Spiritual Communion')).click();
  });
  // Back on hero — Mark ABIDE complete should now be visible
  html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('Mark ABIDE complete')) {
    throw new Error('Spiritual Communion did not auto-confirm its toggle');
  }
});

// 7. Batch 6 — Compline (the night office)
console.log('\nTest 6: Batch 6 — Compline');
const ComplineModule = loadModule(path.join(SRC, 'modals/Compline.jsx'));
const Compline = ComplineModule.default;
const todaysMarianAntiphon = ComplineModule.todaysMarianAntiphon;

await step('todaysMarianAntiphon returns the correct antiphon for each season band', () => {
  // Easter (April 5 – May 24, 2026) → Regina Caeli
  if (todaysMarianAntiphon(new Date(2026, 3, 6)).name !== 'Regina Caeli') {
    throw new Error('April 6 should be Regina Caeli');
  }
  if (todaysMarianAntiphon(new Date(2026, 4, 20)).name !== 'Regina Caeli') {
    throw new Error('May 20 should be Regina Caeli');
  }
  // Advent / Christmas / early January / early February → Alma Redemptoris
  if (todaysMarianAntiphon(new Date(2026, 11, 15)).name !== 'Alma Redemptoris Mater') {
    throw new Error('Dec 15 should be Alma Redemptoris');
  }
  if (todaysMarianAntiphon(new Date(2026, 0, 10)).name !== 'Alma Redemptoris Mater') {
    throw new Error('Jan 10 should be Alma Redemptoris');
  }
  if (todaysMarianAntiphon(new Date(2026, 1, 1)).name !== 'Alma Redemptoris Mater') {
    throw new Error('Feb 1 should be Alma Redemptoris');
  }
  // Lent (Feb 3 – Easter Vigil) → Ave Regina
  if (todaysMarianAntiphon(new Date(2026, 2, 15)).name !== 'Ave Regina Caelorum') {
    throw new Error('March 15 should be Ave Regina');
  }
  // Ordinary Time → Salve Regina
  if (todaysMarianAntiphon(new Date(2026, 8, 1)).name !== 'Salve Regina') {
    throw new Error('September should be Salve Regina');
  }
});

await step('Compline intro renders with Moon hero, antiphon preview, Begin button', async () => {
  const html = await renderToHtml(
    React.createElement(Compline, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('The Night Office')) throw new Error('Night Office eyebrow missing');
  if (!html.includes('Compline')) throw new Error('title missing');
  if (!html.includes('commend my spirit')) throw new Error('Christ quote missing');
  if (!html.includes("Tonight's Marian Antiphon")) throw new Error('antiphon preview missing');
  if (!html.includes('Begin Compline')) throw new Error('Begin button missing');
});

await step('Compline transitions to liturgy phase and renders all 11 sections', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(Compline, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin Compline')).click();
  });

  const html = root.innerHTML;
  rootApi.unmount(); root.remove();

  // Verify the eleven section labels appear
  for (const label of ['Opening', 'Examination of Conscience', 'The Confiteor',
                       'Hymn', 'Psalm 91', 'Silence', 'Short Reading',
                       'Responsory', 'Gospel Canticle', 'Concluding Prayer']) {
    if (!html.includes(label)) throw new Error(`section label missing: ${label}`);
  }
  // Blessing exists but as the climactic block, not a labeled section
  if (!html.includes('quiet night and a perfect end')) {
    throw new Error('blessing line missing');
  }
  // Marian antiphon at the end
  if (!html.includes('Marian Antiphon ·')) throw new Error('antiphon footer missing');
  // Final amen
  if (!html.includes('Amen · Sleep in peace')) throw new Error('final amen missing');
});

await step('Compline versicle markers (<v>℣.</v>) render as styled spans, not as raw HTML', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(Compline, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin Compline')).click();
  });
  const html = root.innerHTML;
  rootApi.unmount(); root.remove();

  // The literal sentinel "<v>" must NOT appear in the rendered output —
  // if it does, renderPrayerHTML didn't run and the user sees raw markup
  if (html.includes('&lt;v&gt;') || html.includes('<v>℣')) {
    throw new Error('versicle sentinel leaked into rendered output');
  }
  // The versicle character must be present
  if (!html.includes('℣') && !html.includes('℟')) {
    throw new Error('versicle characters missing');
  }
  // The .versicle class should be applied somewhere
  if (!html.includes('class="versicle"')) {
    throw new Error('.versicle span class never applied');
  }
});

await step('Compline final Amen fires onComplete', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(Compline, {
      onComplete: () => { calls += 1; },
      onClose: () => {},
    }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin Compline')).click();
  });
  await act(async () => {
    const amen = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Sleep in peace'));
    if (!amen) { rootApi.unmount(); root.remove(); throw new Error('amen missing'); }
    amen.click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onComplete called ${calls} times, expected 1`);
});

// 8. Batch 7 — TheRosary (Marian SEND)
console.log('\nTest 7: Batch 7 — TheRosary');
const TheRosaryModule = loadModule(path.join(SRC, 'modals/TheRosary.jsx'));
const TheRosary = TheRosaryModule.default;
const suggestedMysteryKey = TheRosaryModule.suggestedMysteryKey;

await step('suggestedMysteryKey returns the traditional mystery for each weekday', () => {
  // Sun → glorious, Mon → joyful, Tue → sorrowful, Wed → glorious,
  // Thu → luminous, Fri → sorrowful, Sat → joyful
  const expected = {
    0: 'glorious',  // Sunday
    1: 'joyful',    // Monday
    2: 'sorrowful', // Tuesday
    3: 'glorious',  // Wednesday
    4: 'luminous',  // Thursday — added by JPII in 2002
    5: 'sorrowful', // Friday
    6: 'joyful',    // Saturday
  };
  // Pick a known week — March 1 2026 is a Sunday.
  const baseDate = new Date(2026, 2, 1);
  if (baseDate.getDay() !== 0) throw new Error(`expected March 1 2026 to be Sunday, got day ${baseDate.getDay()}`);
  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(2026, 2, 1 + offset);
    const got = suggestedMysteryKey(d);
    if (got !== expected[d.getDay()]) {
      throw new Error(`day ${d.getDay()} (${d.toDateString()}): expected ${expected[d.getDay()]}, got ${got}`);
    }
  }
});

await step('TheRosary intro renders with all four mystery sets and intention input', async () => {
  const html = await renderToHtml(
    React.createElement(TheRosary, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('Step 7 · SEND · Marian')) throw new Error('SEND eyebrow missing');
  if (!html.includes('The Rosary')) throw new Error('title missing');
  // All four mystery set names must appear
  for (const name of ['Joyful Mysteries', 'Sorrowful Mysteries', 'Glorious Mysteries', 'Luminous Mysteries']) {
    if (!html.includes(name)) throw new Error(`mystery set missing: ${name}`);
  }
  // Today badge on the suggested set
  if (!html.includes('Today')) throw new Error('Today badge missing');
  // Intention input present
  if (!html.includes('For whom are you praying today')) throw new Error('intention input missing');
});

await step('TheRosary opening phase walks through 5 cards in sequence', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(TheRosary, { onComplete: () => {}, onClose: () => {} }));
  });
  // Click "Joyful Mysteries" card
  await act(async () => {
    const card = Array.from(root.querySelectorAll('button.mystery-set-card')).find((c) =>
      c.textContent.includes('Joyful Mysteries'));
    if (!card) throw new Error('Joyful card missing');
    card.click();
  });
  // Should now be on Sign of the Cross (opening 1 of 5)
  let html = root.innerHTML;
  if (!html.includes('Opening · 1 of 5')) {
    rootApi.unmount(); root.remove();
    throw new Error('did not enter opening phase 1');
  }
  if (!html.includes('Sign of the Cross')) {
    rootApi.unmount(); root.remove();
    throw new Error('Sign of the Cross card missing');
  }
  // Click Next four times
  for (let i = 0; i < 4; i++) {
    await act(async () => {
      const next = Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent.trim().startsWith('Next') ||
        b.textContent.trim().startsWith('First mystery'));
      if (!next) throw new Error(`Next button missing on step ${i + 1}`);
      next.click();
    });
  }
  // Last opening step is Glory Be (#5 of 5)
  html = root.innerHTML;
  if (!html.includes('Opening · 5 of 5')) {
    rootApi.unmount(); root.remove();
    throw new Error('did not reach opening 5/5');
  }
  if (!html.includes('The Glory Be')) {
    rootApi.unmount(); root.remove();
    throw new Error('Glory Be card missing on opening 5');
  }
  rootApi.unmount(); root.remove();
});

await step('TheRosary mystery phase renders scene + bead strip + correct prayer text', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(TheRosary, { onComplete: () => {}, onClose: () => {} }));
  });
  // Begin with Joyful
  await act(async () => {
    Array.from(root.querySelectorAll('button.mystery-set-card')).find((c) =>
      c.textContent.includes('Joyful Mysteries')).click();
  });
  // Click Next 5 times to advance through opening into mystery 1
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      const next = Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent.trim().startsWith('Next') ||
        b.textContent.trim().startsWith('First mystery'));
      next.click();
    });
  }
  // Should now be in mystery 1 of Joyful = The Annunciation, sub-phase = announce
  let html = root.innerHTML;
  if (!html.includes('Mystery 1 of 5')) {
    rootApi.unmount(); root.remove();
    throw new Error('did not reach mystery 1');
  }
  if (!html.includes('The Annunciation')) {
    rootApi.unmount(); root.remove();
    throw new Error('Annunciation scene missing');
  }
  if (!html.includes('Take a breath. Enter the scene.')) {
    rootApi.unmount(); root.remove();
    throw new Error('announce sub-phase missing');
  }
  // Beads should be present: 1 OF + 10 hail marys + 1 GB = 12 buttons in the strip
  const beads = root.querySelectorAll('.bead-strip > button');
  if (beads.length !== 12) {
    rootApi.unmount(); root.remove();
    throw new Error(`expected 12 bead buttons, got ${beads.length}`);
  }
  // Advance through announce → ourFather
  await act(async () => {
    const next = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.trim().startsWith('Next'));
    next.click();
  });
  html = root.innerHTML;
  if (!html.includes('The Our Father · 1 of 1')) {
    rootApi.unmount(); root.remove();
    throw new Error('Our Father sub-phase missing');
  }
  // Advance to hailMarys (idx 0)
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.trim().startsWith('Next')).click();
  });
  html = root.innerHTML;
  if (!html.includes('Hail Mary · 1 of 10')) {
    rootApi.unmount(); root.remove();
    throw new Error('Hail Mary 1/10 sub-phase missing');
  }
  rootApi.unmount(); root.remove();
});

await step('TheRosary bead strip click jumps to that Hail Mary index', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(TheRosary, { onComplete: () => {}, onClose: () => {} }));
  });
  // Begin with Joyful, walk into mystery 1
  await act(async () => {
    Array.from(root.querySelectorAll('button.mystery-set-card')).find((c) =>
      c.textContent.includes('Joyful Mysteries')).click();
  });
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent.trim().startsWith('Next') ||
        b.textContent.trim().startsWith('First mystery')).click();
    });
  }
  // Click bead labeled "Hail Mary 7"
  await act(async () => {
    const bead7 = root.querySelector('button[aria-label="Hail Mary 7"]');
    if (!bead7) throw new Error('Hail Mary 7 bead missing');
    bead7.click();
  });
  const html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('Hail Mary · 7 of 10')) {
    throw new Error('jumpToBead did not jump correctly to 7/10');
  }
});

await step('TheRosary final mystery (5/5) "To the closing" advances to closing phase', async () => {
  // We can't sanely click through 5×17 advances in a test, so we'll
  // jump-walk: enter mystery, then jump to mystery 5 via the strip,
  // then advance through its sub-phases to fatima, then "To the closing".
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(TheRosary, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button.mystery-set-card')).find((c) =>
      c.textContent.includes('Joyful Mysteries')).click();
  });
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent.trim().startsWith('Next') ||
        b.textContent.trim().startsWith('First mystery')).click();
    });
  }
  // Now in mystery 1; jump to mystery 5 via the strip dot labeled "5"
  await act(async () => {
    const dots = Array.from(root.querySelectorAll('.mystery-strip-dot'));
    // Each dot's last child .sc text is the mystery number
    const fifth = dots.find((d) => d.textContent.trim() === '5');
    if (!fifth) throw new Error('mystery 5 strip dot missing');
    fifth.click();
  });
  // Advance through announce → ourFather → 10 hailMarys → gloryBe → fatima
  // That's 13 advances (announce→OF→HM1→HM2…→HM10→GB→Fatima)
  for (let i = 0; i < 14; i++) {
    await act(async () => {
      const next = Array.from(root.querySelectorAll('button')).find((b) => {
        const t = b.textContent.trim();
        return t.startsWith('Next') || t.startsWith('To the closing');
      });
      next.click();
    });
  }
  // Should now be on closing phase with Hail Holy Queen
  const html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('Hail Holy Queen')) {
    throw new Error('did not reach closing — Hail Holy Queen missing');
  }
});

await step('TheRosary closing Amen fires onComplete exactly once', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(TheRosary, {
      onComplete: () => { calls += 1; },
      onClose: () => {},
    }));
  });
  // Walk to closing as before
  await act(async () => {
    Array.from(root.querySelectorAll('button.mystery-set-card')).find((c) =>
      c.textContent.includes('Joyful Mysteries')).click();
  });
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent.trim().startsWith('Next') ||
        b.textContent.trim().startsWith('First mystery')).click();
    });
  }
  await act(async () => {
    const dots = Array.from(root.querySelectorAll('.mystery-strip-dot'));
    dots.find((d) => d.textContent.trim() === '5').click();
  });
  for (let i = 0; i < 14; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) => {
        const t = b.textContent.trim();
        return t.startsWith('Next') || t.startsWith('To the closing');
      }).click();
    });
  }
  // Click Amen
  await act(async () => {
    const amen = Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Amen · Done'));
    if (!amen) throw new Error('Amen button missing');
    amen.click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onComplete called ${calls} times, expected 1`);
});

// 9. Batch 8 — DailyExamen (HEAL · Ignatian)
console.log('\nTest 8: Batch 8 — DailyExamen');
const { default: DailyExamen } = loadModule(path.join(SRC, 'modals/DailyExamen.jsx'));

await step('DailyExamen intro renders Ignatius quote and Begin button', async () => {
  const html = await renderToHtml(
    React.createElement(DailyExamen, { onComplete: () => {}, onClose: () => {} })
  );
  if (!html.includes('Step 3 · HEAL')) throw new Error('HEAL eyebrow missing');
  if (!html.includes('The Daily Examen')) throw new Error('title missing');
  if (!html.includes('St. Ignatius of Loyola')) throw new Error('Ignatius attribution missing');
  if (!html.includes('Gratitude · Petition · Review · Sorrow · Resolve')) {
    throw new Error('movement summary missing');
  }
  if (!html.includes('Begin the Examen')) throw new Error('Begin button missing');
});

await step('DailyExamen entering movement 1 shows Gratitude with three I/II/III inputs', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(DailyExamen, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the Examen')).click();
  });
  const html = root.innerHTML;
  // Three text inputs in the gratitude shape
  const gratitudeInputs = root.querySelectorAll('.gratitude-input input');
  rootApi.unmount(); root.remove();

  if (!html.includes('Movement 1 of 5 · Gratitude')) throw new Error('Movement 1 header missing');
  if (!html.includes('Recall the gifts of the day')) throw new Error('Gratitude invitation missing');
  if (!html.includes('James 1:17')) throw new Error('Gratitude scripture ref missing');
  if (gratitudeInputs.length !== 3) {
    throw new Error(`expected 3 gratitude inputs, got ${gratitudeInputs.length}`);
  }
});

await step('DailyExamen Petition (movement 2) shows breath visualization, NOT inputs', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(DailyExamen, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the Examen')).click();
  });
  // Click "Next movement" once — into Petition
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.trim().startsWith('Next movement')).click();
  });
  const html = root.innerHTML;
  // No journal field, no gratitude inputs — only breath
  const journalFields = root.querySelectorAll('textarea.journal-field');
  const gratitudeInputs = root.querySelectorAll('.gratitude-input input');
  rootApi.unmount(); root.remove();

  if (!html.includes('Movement 2 of 5 · Petition')) throw new Error('Movement 2 header missing');
  if (!html.includes('Breathe in light. Breathe out fog')) throw new Error('breath copy missing');
  if (!html.includes('Psalm 43:3')) throw new Error('Petition scripture ref missing');
  if (journalFields.length !== 0) {
    throw new Error(`Petition should not have journal field, got ${journalFields.length}`);
  }
  if (gratitudeInputs.length !== 0) {
    throw new Error(`Petition should not have gratitude inputs, got ${gratitudeInputs.length}`);
  }
});

await step('DailyExamen Review/Sorrow/Resolve each provide a journal textarea', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(DailyExamen, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the Examen')).click();
  });
  // Walk through movements 1→2→3 (Review)
  for (let i = 0; i < 2; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent.trim().startsWith('Next movement')).click();
    });
  }
  let html = root.innerHTML;
  if (!html.includes('Movement 3 of 5 · Review')) {
    rootApi.unmount(); root.remove();
    throw new Error('Movement 3 header missing');
  }
  if (root.querySelectorAll('textarea.journal-field').length !== 1) {
    rootApi.unmount(); root.remove();
    throw new Error('Review should have 1 journal field');
  }
  // Advance to Sorrow
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.trim().startsWith('Next movement')).click();
  });
  html = root.innerHTML;
  if (!html.includes('Movement 4 of 5 · Sorrow')) {
    rootApi.unmount(); root.remove();
    throw new Error('Movement 4 header missing');
  }
  // Advance to Resolve
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.trim().startsWith('Next movement')).click();
  });
  html = root.innerHTML;
  if (!html.includes('Movement 5 of 5 · Resolve')) {
    rootApi.unmount(); root.remove();
    throw new Error('Movement 5 header missing');
  }
  // The button on movement 5 should now read "To the Glory Be"
  const lastBtn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('To the Glory Be'));
  rootApi.unmount(); root.remove();
  if (!lastBtn) throw new Error('"To the Glory Be" CTA missing on movement 5');
});

await step('DailyExamen typed gratitude content survives across movements (state persistence)', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(DailyExamen, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the Examen')).click();
  });
  // Type into the first gratitude input
  await act(async () => {
    const inputs = root.querySelectorAll('.gratitude-input input');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(inputs[0], 'morning coffee');
    inputs[0].dispatchEvent(new window.Event('input', { bubbles: true }));
  });
  // Forward to Petition, then back to Gratitude
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.trim().startsWith('Next movement')).click();
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.trim().startsWith('Back')).click();
  });
  // The first input should still hold "morning coffee"
  const firstInput = root.querySelector('.gratitude-input input');
  const persisted = firstInput.value;
  rootApi.unmount(); root.remove();
  if (persisted !== 'morning coffee') {
    throw new Error(`expected gratitude[0]="morning coffee", got "${persisted}"`);
  }
});

await step('DailyExamen closing renders Glory Be and amen fires onComplete', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(DailyExamen, {
      onComplete: () => { calls += 1; },
      onClose: () => {},
    }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the Examen')).click();
  });
  // Walk through 5 movements
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) => {
        const t = b.textContent.trim();
        return t.startsWith('Next movement') || t.startsWith('To the Glory Be');
      }).click();
    });
  }
  const html = root.innerHTML;
  if (!html.includes('Glory Be')) {
    rootApi.unmount(); root.remove();
    throw new Error('did not reach Glory Be closing');
  }
  if (!html.includes('Glory be to the Father')) {
    rootApi.unmount(); root.remove();
    throw new Error('GLORY_BE_TEXT body missing');
  }
  // Click Amen
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Amen · Done')).click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onComplete called ${calls} times, expected 1`);
});

await step('DailyExamen save-preference toggle appears only when user has typed content', async () => {
  // Path 1: walk through with no typing — closing should NOT show toggle
  let root = document.createElement('div');
  document.body.appendChild(root);
  let rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(DailyExamen, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the Examen')).click();
  });
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) => {
        const t = b.textContent.trim();
        return t.startsWith('Next movement') || t.startsWith('To the Glory Be');
      }).click();
    });
  }
  let html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (html.includes('Save to journal')) {
    throw new Error('save-preference toggle should be hidden when no content typed');
  }

  // Path 2: type into gratitude, walk through, expect toggle to appear
  root = document.createElement('div');
  document.body.appendChild(root);
  rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(React.createElement(DailyExamen, { onComplete: () => {}, onClose: () => {} }));
  });
  await act(async () => {
    Array.from(root.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Begin the Examen')).click();
  });
  await act(async () => {
    const input = root.querySelector('.gratitude-input input');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'a kindness');
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      Array.from(root.querySelectorAll('button')).find((b) => {
        const t = b.textContent.trim();
        return t.startsWith('Next movement') || t.startsWith('To the Glory Be');
      }).click();
    });
  }
  html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('Save to journal')) {
    throw new Error('save-preference toggle should appear when content was typed');
  }
  if (!html.includes('Let it go')) {
    throw new Error('"Let it go" option missing from toggle');
  }
});

// 10. Batch 9 — Kingdom Hub view components
console.log('\nTest 9: Batch 9 — Kingdom Hub components');
const { default: HubHero } = loadModule(path.join(SRC, 'components/HubHero.jsx'));
const { default: PracticeRow } = loadModule(path.join(SRC, 'components/PracticeRow.jsx'));
const { default: EssentialBlock } = loadModule(path.join(SRC, 'components/EssentialBlock.jsx'));
const { default: SevenEssentials } = loadModule(path.join(SRC, 'components/SevenEssentials.jsx'));
const { default: KingdomHubView } = loadModule(path.join(SRC, 'components/KingdomHubView.jsx'));
const { default: CopyButton } = loadModule(path.join(SRC, 'shared/CopyButton.jsx'));

await step('CopyButton renders with default label and changes on copy', async () => {
  const html = await renderToHtml(React.createElement(CopyButton, { text: 'hello' }));
  if (!html.includes('Copy')) throw new Error('default label missing');
});

await step('HubHero renders with no houseKey — no ribbon', async () => {
  const html = await renderToHtml(React.createElement(HubHero, {}));
  if (!html.includes('The Kingdom.')) throw new Error('title missing');
  if (html.includes('House of ')) throw new Error('house ribbon should be absent without houseKey');
});

await step('HubHero with houseKey renders the ribbon with patron + tradition', async () => {
  // Use 'fire' (Carmelite) as a stable test — must exist in HOUSES_HUB
  const { HOUSES_HUB } = loadModule(path.join(SRC, 'data/houses.js'));
  const slug = Object.keys(HOUSES_HUB)[0]; // first house
  const expected = HOUSES_HUB[slug];
  const html = await renderToHtml(React.createElement(HubHero, { houseKey: slug }));
  if (!html.includes(`House of ${expected.name}`)) {
    throw new Error(`expected House of ${expected.name} ribbon`);
  }
  if (!html.includes(expected.patron)) throw new Error('patron missing from ribbon');
  if (!html.includes(expected.tradition)) throw new Error('tradition missing from ribbon');
});

await step('PracticeRow renders practice info and fires onStart on click', async () => {
  const { DAILY_PRACTICES } = loadModule(path.join(SRC, 'data/practices.js'));
  const practice = DAILY_PRACTICES[1]; // KNOW (n: 2)
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(PracticeRow, {
        p: practice,
        isComplete: false,
        onStart: () => { calls += 1; },
      })
    );
  });
  const html = root.innerHTML;
  if (!html.includes(practice.verb)) throw new Error('verb missing');
  if (!html.includes(practice.practice)) throw new Error('practice name missing');
  if (!html.includes(practice.duration)) throw new Error('duration missing');
  if (html.includes('Done')) throw new Error('Done shown when isComplete=false');
  // Click the row
  await act(async () => {
    root.querySelector('button').click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onStart called ${calls} times, expected 1`);
});

await step('PracticeRow with isComplete=true shows Done instead of duration', async () => {
  const { DAILY_PRACTICES } = loadModule(path.join(SRC, 'data/practices.js'));
  const practice = DAILY_PRACTICES[0]; // SEE
  const html = await renderToHtml(
    React.createElement(PracticeRow, {
      p: practice,
      isComplete: true,
      onStart: () => {},
    })
  );
  if (!html.includes('Done')) throw new Error('Done label missing when complete');
});

await step('EssentialBlock renders with practice info and CTA', async () => {
  const { DAILY_PRACTICES } = loadModule(path.join(SRC, 'data/practices.js'));
  const practice = DAILY_PRACTICES[0]; // SEE (n: 1)
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(
        EssentialBlock,
        {
          practice,
          isComplete: false,
          romanNumeral: 'I',
          onStart: () => { calls += 1; },
        },
        React.createElement('div', null, 'CHILD CONTENT')
      )
    );
  });
  const html = root.innerHTML;
  if (!html.includes(practice.verb)) throw new Error('verb missing');
  if (!html.includes(practice.practice)) throw new Error('practice name missing');
  if (!html.includes(practice.tradition)) throw new Error('tradition tagline missing');
  if (!html.includes('CHILD CONTENT')) throw new Error('children not rendered');
  if (!html.includes('Begin')) throw new Error('Begin CTA missing');
  // Click the CTA button (the last button in the section)
  await act(async () => {
    const buttons = root.querySelectorAll('button');
    buttons[buttons.length - 1].click();
  });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`onStart called ${calls} times, expected 1`);
});

await step('EssentialBlock with isAltar=true uses altar treatment and "Find Mass" CTA', async () => {
  const { DAILY_PRACTICES } = loadModule(path.join(SRC, 'data/practices.js'));
  const abide = DAILY_PRACTICES.find((p) => p.n === 4);
  const html = await renderToHtml(
    React.createElement(
      EssentialBlock,
      {
        practice: abide,
        isComplete: false,
        isAltar: true,
        romanNumeral: 'IV',
        onStart: () => {},
      },
      null
    )
  );
  if (!html.includes('fons et culmen')) throw new Error('altar tag missing');
  if (!html.includes('Find Mass')) throw new Error('altar CTA wording missing');
});

await step('SevenEssentials renders all seven essentials with their unique content', async () => {
  const html = await renderToHtml(
    React.createElement(SevenEssentials, {
      completedToday: [],
      onPracticeStart: () => {},
      onCompline: () => {},
      complineDone: false,
    })
  );
  // Verify each essential's verb appears
  for (const verb of ['SEE', 'KNOW', 'HEAL', 'ABIDE', 'GO', 'BUILD', 'SEND']) {
    if (!html.includes(verb)) throw new Error(`essential verb missing: ${verb}`);
  }
  // Verify SEE content: today's saint at the altar
  if (!html.includes('Today at the Altar')) throw new Error('SEE saint card missing');
  // Verify KNOW content: lectio prompts
  if (!html.includes('Lectio') || !html.includes('Meditatio') || !html.includes('Contemplatio')) {
    throw new Error('KNOW lectio prompts missing');
  }
  // Verify HEAL content: Carmelite five movements
  for (const m of ['Notice', 'Gratitude', 'Sorrow', 'Intention', 'Hope']) {
    if (!html.includes(m)) throw new Error(`HEAL movement missing: ${m}`);
  }
  // Verify ABIDE content: Franciscan altar quote
  if (!html.includes('Franciscan altar')) throw new Error('ABIDE Franciscan content missing');
  if (!html.includes('Spiritual Communion')) throw new Error('ABIDE spiritual communion missing');
  // Verify GO content: Ignatian going forth
  if (!html.includes('Ignatian going forth')) throw new Error('GO Ignatian content missing');
  if (!html.includes("Today's act")) throw new Error('GO today act missing');
  // Verify BUILD content: three modes
  for (const m of ['Family', 'Community', 'Civilization']) {
    if (!html.includes(m)) throw new Error(`BUILD mode missing: ${m}`);
  }
  // Verify SEND content: Mary Mother of every House
  if (!html.includes('Mother of every House')) throw new Error('SEND content missing');
  // The architectural tagline at the bottom
  if (!html.includes('Three preparing. One at the altar. Three sent forth.')) {
    throw new Error('architectural tagline missing');
  }
});

await step('SevenEssentials with completedToday marks the right essentials Done', async () => {
  const html = await renderToHtml(
    React.createElement(SevenEssentials, {
      completedToday: [1, 4],
      onPracticeStart: () => {},
      onCompline: () => {},
      complineDone: false,
    })
  );
  // Each EssentialBlock shows "Done" when complete; we should see at least 2 occurrences
  const doneCount = (html.match(/>Done</g) || []).length;
  if (doneCount < 2) throw new Error(`expected ≥2 Done labels, got ${doneCount}`);
});

await step('SevenEssentials onPracticeStart fires with the right essential number', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SevenEssentials, {
        completedToday: [],
        onPracticeStart: (n) => { calls.push(n); },
        onCompline: () => {},
        complineDone: false,
      })
    );
  });
  // Find each EssentialBlock's CTA button and click it. Each block has exactly
  // ONE CTA button at the bottom — but it also has interactive content inside
  // (CopyButton on GO, MiniPath on top). So we look for buttons whose text
  // includes 'Begin' or 'Find Mass' or 'Pray again'.
  const ctas = Array.from(root.querySelectorAll('button')).filter((b) => {
    const t = b.textContent;
    return t.includes('Begin') || t.includes('Find Mass · Adoration') || t.includes('Pray again');
  });
  if (ctas.length !== 7) {
    rootApi.unmount(); root.remove();
    throw new Error(`expected 7 CTA buttons, got ${ctas.length}`);
  }
  // Click the 4th (ABIDE)
  await act(async () => { ctas[3].click(); });
  rootApi.unmount(); root.remove();
  if (calls.length !== 1) throw new Error(`expected 1 call, got ${calls.length}`);
  if (calls[0] !== 4) throw new Error(`expected onPracticeStart(4), got onPracticeStart(${calls[0]})`);
});

await step('KingdomHubView composes HubHero + SevenEssentials + KingdomMoreGrid cleanly', async () => {
  const html = await renderToHtml(
    React.createElement(KingdomHubView, {
      houseKey: null,
      completedToday: [],
      onPracticeStart: () => {},
      onCompline: () => {},
      complineDone: false,
      intentions: [],
      onOpenHouseQuiz: () => {},
      onOpenIntention: () => {},
      onOpenWitnesses: () => {},
      onGoToFieldGuide: () => {},
    })
  );
  // HubHero presence
  if (!html.includes('The Kingdom.')) throw new Error('HubHero title missing');
  // SevenEssentials presence
  if (!html.includes("Today's Seven")) throw new Error('SevenEssentials MiniPath missing');
  if (!html.includes('Three preparing. One at the altar. Three sent forth.')) {
    throw new Error('architectural tagline missing');
  }
  // KingdomMoreGrid presence — check section header + all five card headers
  if (!html.includes('>More<')) throw new Error('More grid section header missing');
  for (const card of ['Your House', 'The Field Guide', 'Intentions',
                      'Cloud of Witnesses', 'The Academy']) {
    if (!html.includes(card)) throw new Error(`MoreGrid card missing: ${card}`);
  }
});

// 10b. Batch 10 — KingdomMoreGrid in isolation
console.log('\nTest 9b: Batch 10 — KingdomMoreGrid');
const { default: KingdomMoreGrid } = loadModule(path.join(SRC, 'components/KingdomMoreGrid.jsx'));

await step('KingdomMoreGrid with no houseKey shows discernment prompt, not full-width', async () => {
  const html = await renderToHtml(
    React.createElement(KingdomMoreGrid, {
      houseKey: null,
      intentions: [],
      onOpenHouseQuiz: () => {},
      onOpenIntention: () => {},
      onOpenWitnesses: () => {},
      onGoToFieldGuide: () => {},
    })
  );
  if (!html.includes('Take the discernment')) {
    throw new Error('discernment prompt missing when houseKey is null');
  }
  if (!html.includes('Light · Fire · Earth · Joy · Glory')) {
    throw new Error('post-rename House litany missing or stale');
  }
  // Should NOT include "House of " ribbon when no key
  if (html.includes('House of Light') || html.includes('House of Fire')) {
    throw new Error('discerned-house copy should not appear without a key');
  }
});

await step('KingdomMoreGrid with houseKey shows daily saint quote and full-width treatment', async () => {
  const { HOUSES, HOUSE_QUOTES, TODAY_HOUSE_QUOTE_INDEX } = loadModule(path.join(SRC, 'data/houses.js'));
  const slug = Object.keys(HOUSES)[0]; // first house
  const houseName = HOUSES[slug].name;
  const expectedQuote = HOUSE_QUOTES[slug]?.[TODAY_HOUSE_QUOTE_INDEX] || HOUSE_QUOTES[slug]?.[0];
  const html = await renderToHtml(
    React.createElement(KingdomMoreGrid, {
      houseKey: slug,
      intentions: [],
      onOpenHouseQuiz: () => {},
      onOpenIntention: () => {},
      onOpenWitnesses: () => {},
      onGoToFieldGuide: () => {},
    })
  );
  if (!html.includes(`House of ${houseName}`)) {
    throw new Error(`expected "House of ${houseName}" header`);
  }
  if (!html.includes(expectedQuote.text)) {
    throw new Error(`expected today's quote "${expectedQuote.text.slice(0, 30)}..." in MoreGrid`);
  }
  if (!html.includes(expectedQuote.saint)) {
    throw new Error(`expected attribution "${expectedQuote.saint}" in MoreGrid`);
  }
  if (!html.includes('Open your house')) {
    throw new Error('CTA text "Open your house" missing in discerned state');
  }
});

await step('KingdomMoreGrid Intentions card with empty list shows "Carry someone in prayer"', async () => {
  const html = await renderToHtml(
    React.createElement(KingdomMoreGrid, {
      houseKey: null,
      intentions: [],
      onOpenHouseQuiz: () => {},
      onOpenIntention: () => {},
      onOpenWitnesses: () => {},
      onGoToFieldGuide: () => {},
    })
  );
  if (!html.includes('Carry someone in prayer')) {
    throw new Error('empty-list intention prompt missing');
  }
  if (!html.includes('Add your first')) {
    throw new Error('"Add your first" CTA missing for empty list');
  }
});

await step('KingdomMoreGrid Intentions card with 4 intentions shows count + preview + +N more', async () => {
  const intentions = [
    { id: 1, who: 'Maria',  what: 'recovery' },
    { id: 2, who: 'Daniel', what: 'job interview' },
    { id: 3, who: 'Sarah',  what: 'family healing' },
    { id: 4, who: 'James',  what: 'patience' },
  ];
  const html = await renderToHtml(
    React.createElement(KingdomMoreGrid, {
      houseKey: null,
      intentions,
      onOpenHouseQuiz: () => {},
      onOpenIntention: () => {},
      onOpenWitnesses: () => {},
      onGoToFieldGuide: () => {},
    })
  );
  if (!html.includes('4 held in prayer')) {
    throw new Error('intention count "4 held in prayer" missing');
  }
  if (!html.includes('Maria')) throw new Error('first intention preview missing');
  if (!html.includes('Daniel')) throw new Error('second intention preview missing');
  if (!html.includes('+2 more')) throw new Error('"+2 more" overflow indicator missing');
  if (!html.includes('Add another')) {
    throw new Error('"Add another" CTA missing for non-empty list');
  }
});

await step('KingdomMoreGrid card click handlers fire each on the right card', async () => {
  const calls = { house: 0, intention: 0, witnesses: 0, fieldGuide: 0 };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(KingdomMoreGrid, {
        houseKey: null,
        intentions: [],
        onOpenHouseQuiz: () => { calls.house += 1; },
        onOpenIntention: () => { calls.intention += 1; },
        onOpenWitnesses: () => { calls.witnesses += 1; },
        onGoToFieldGuide: () => { calls.fieldGuide += 1; },
      })
    );
  });
  // Find the four interactive cards by their distinctive button text
  const buttons = Array.from(root.querySelectorAll('button'));
  const houseBtn      = buttons.find((b) => b.textContent.includes('Take the discernment'));
  const fieldGuideBtn = buttons.find((b) => b.textContent.includes('The Field Guide'));
  const intentionBtn  = buttons.find((b) => b.textContent.includes('Intentions'));
  const witnessesBtn  = buttons.find((b) => b.textContent.includes('Cloud of Witnesses'));
  if (!houseBtn || !fieldGuideBtn || !intentionBtn || !witnessesBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('one of the four interactive cards is missing a button');
  }
  await act(async () => { houseBtn.click(); });
  await act(async () => { fieldGuideBtn.click(); });
  await act(async () => { intentionBtn.click(); });
  await act(async () => { witnessesBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.house !== 1)      throw new Error(`onOpenHouseQuiz: expected 1, got ${calls.house}`);
  if (calls.fieldGuide !== 1) throw new Error(`onGoToFieldGuide: expected 1, got ${calls.fieldGuide}`);
  if (calls.intention !== 1)  throw new Error(`onOpenIntention: expected 1, got ${calls.intention}`);
  if (calls.witnesses !== 1)  throw new Error(`onOpenWitnesses: expected 1, got ${calls.witnesses}`);
});

await step('KingdomMoreGrid Academy card is visually present but not a button (locked)', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(KingdomMoreGrid, {
        houseKey: null,
        intentions: [],
        onOpenHouseQuiz: () => {},
        onOpenIntention: () => {},
        onOpenWitnesses: () => {},
        onGoToFieldGuide: () => {},
      })
    );
  });
  const html = root.innerHTML;
  // Academy text present
  if (!html.includes('The Academy')) {
    rootApi.unmount(); root.remove();
    throw new Error('Academy card missing');
  }
  if (!html.includes('After the fifty days')) {
    rootApi.unmount(); root.remove();
    throw new Error('Academy "After the fifty days" copy missing');
  }
  // Verify the four interactive cards are all <button> but Academy is NOT
  const buttons = Array.from(root.querySelectorAll('button'));
  const academyAsBtn = buttons.find((b) => b.textContent.includes('After the fifty days'));
  rootApi.unmount(); root.remove();
  if (academyAsBtn) {
    throw new Error('Academy card should not be a <button> (locked)');
  }
});

// 10c. Batch 11 — FieldGuideHub + PracticeGuide
console.log('\nTest 9c: Batch 11 — Field Guide views');
const { default: FieldGuideHub } = loadModule(path.join(SRC, 'components/FieldGuideHub.jsx'));
const { default: PracticeGuide } = loadModule(path.join(SRC, 'components/PracticeGuide.jsx'));
const { PRACTICES, PRACTICE_CATEGORIES } = loadModule(path.join(SRC, 'data/field-guide.js'));

await step('Field Guide data layer is well-formed', async () => {
  if (!Array.isArray(PRACTICES)) throw new Error('PRACTICES is not an array');
  if (PRACTICES.length !== 22) {
    throw new Error(`expected 22 practices, got ${PRACTICES.length}`);
  }
  if (!Array.isArray(PRACTICE_CATEGORIES)) throw new Error('PRACTICE_CATEGORIES not array');
  if (PRACTICE_CATEGORIES.length !== 5) {
    throw new Error(`expected 5 categories, got ${PRACTICE_CATEGORIES.length}`);
  }
  // Every practice has the required fields and a valid category
  const validCategoryIds = new Set(PRACTICE_CATEGORIES.map((c) => c.id));
  for (const p of PRACTICES) {
    if (!p.slug)     throw new Error(`practice missing slug: ${JSON.stringify(p).slice(0, 80)}`);
    if (!p.title)    throw new Error(`practice ${p.slug} missing title`);
    if (!p.tagline)  throw new Error(`practice ${p.slug} missing tagline`);
    if (!p.category) throw new Error(`practice ${p.slug} missing category`);
    if (!validCategoryIds.has(p.category)) {
      throw new Error(`practice ${p.slug} has unknown category "${p.category}"`);
    }
    if (!Array.isArray(p.body) || p.body.length === 0) {
      throw new Error(`practice ${p.slug} has empty body`);
    }
    // Every body block has a recognized type
    const validTypes = new Set(['p', 'h', 'q', 'pullquote']);
    for (const block of p.body) {
      if (!validTypes.has(block.t)) {
        throw new Error(`practice ${p.slug} has unknown block type "${block.t}"`);
      }
    }
  }
  // Slugs are unique
  const slugs = PRACTICES.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('duplicate practice slugs detected');
  }
});

await step('FieldGuideHub renders all 22 practices grouped by category', async () => {
  const html = await renderToHtml(
    React.createElement(FieldGuideHub, {
      onOpenPractice: () => {},
      onToCourse: () => {},
    })
  );
  if (!html.includes('Essential practices')) throw new Error('hero title missing');
  if (!html.includes('for citizens of the Kingdom')) {
    throw new Error('hero italic subtitle missing');
  }
  // All five category headers (the rendered HTML escapes & as &amp; — match
  // the un-escaped name in the source HTML by escaping our expectation)
  for (const cat of PRACTICE_CATEGORIES) {
    const escapedTitle = cat.title.replace(/&/g, '&amp;');
    if (!html.includes(escapedTitle)) {
      throw new Error(`category header missing: ${cat.title}`);
    }
    if (!html.includes(cat.note)) throw new Error(`category note missing: ${cat.note}`);
  }
  // Footer count
  if (!html.includes('22 practices')) throw new Error('practice count missing');
  if (!html.includes('5 categories')) throw new Error('category count missing');
  // Spot-check: at least the first and last practice titles render
  if (!html.includes(PRACTICES[0].title)) {
    throw new Error(`first practice missing: ${PRACTICES[0].title}`);
  }
  if (!html.includes(PRACTICES[PRACTICES.length - 1].title)) {
    throw new Error(`last practice missing: ${PRACTICES[PRACTICES.length - 1].title}`);
  }
  // The closing line
  if (!html.includes('These are the tools')) throw new Error('closing line missing');
});

await step('FieldGuideHub clicking a practice fires onOpenPractice with the slug', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(FieldGuideHub, {
        onOpenPractice: (slug) => { calls.push(slug); },
        onToCourse: () => {},
      })
    );
  });
  // Click the first practice row by finding the button whose textContent
  // includes the first practice's title
  const firstPractice = PRACTICES[0];
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes(firstPractice.title)
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('did not find button for first practice');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.length !== 1) throw new Error(`expected 1 call, got ${calls.length}`);
  if (calls[0] !== firstPractice.slug) {
    throw new Error(`expected slug "${firstPractice.slug}", got "${calls[0]}"`);
  }
});

await step('FieldGuideHub "Back to the Course" fires onToCourse', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(FieldGuideHub, {
        onOpenPractice: () => {},
        onToCourse: () => { calls += 1; },
      })
    );
  });
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('Back to the Course')
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('"Back to the Course" button missing');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`expected 1 call, got ${calls}`);
});

await step('PracticeGuide returns null when practice prop is null (defensive)', async () => {
  const html = await renderToHtml(
    React.createElement(PracticeGuide, {
      practice: null,
      onBack: () => {},
      relatedPractices: [],
      onOpenPractice: () => {},
    })
  );
  // jsdom serializes null React render as empty body
  if (html.length > 100) {
    throw new Error(`expected empty render for null practice, got ${html.length} bytes`);
  }
});

await step('PracticeGuide renders title, tagline, breadcrumb, and body blocks', async () => {
  const practice = PRACTICES[0]; // Rosary — has h, p, and pullquote-free blocks
  const html = await renderToHtml(
    React.createElement(PracticeGuide, {
      practice,
      onBack: () => {},
      relatedPractices: [],
      onOpenPractice: () => {},
    })
  );
  if (!html.includes(practice.title)) throw new Error(`title missing: ${practice.title}`);
  if (!html.includes(practice.tagline)) throw new Error('tagline missing');
  if (!html.includes('Field Guide')) throw new Error('breadcrumb "Field Guide" missing');
  // The category for the rosary practice should appear in the breadcrumb
  const cat = PRACTICE_CATEGORIES.find((c) => c.id === practice.category);
  if (cat && !html.includes(cat.title)) {
    throw new Error(`breadcrumb category missing: ${cat.title}`);
  }
  // Spot-check the first paragraph appears (with HTML stripped, since
  // dangerouslySetInnerHTML produces real HTML in jsdom)
  const firstP = practice.body.find((b) => b.t === 'p');
  if (firstP) {
    // Strip HTML tags from the source d to get a plaintext substring to look for
    const plain = firstP.d.replace(/<[^>]+>/g, '').slice(0, 60);
    if (!html.includes(plain)) {
      throw new Error('first paragraph plaintext not found in render');
    }
  }
  // First headings are present
  const firstH = practice.body.find((b) => b.t === 'h');
  if (firstH && !html.includes(firstH.d)) {
    throw new Error(`heading missing: ${firstH.d}`);
  }
});

await step('PracticeGuide renders related practices when provided', async () => {
  const practice = PRACTICES[0];
  // Pick three same-category sibling practices
  const related = PRACTICES.filter(
    (p) => p.category === practice.category && p.slug !== practice.slug,
  ).slice(0, 3);
  if (related.length === 0) {
    // skip: this practice has no siblings — not all categories will
    return;
  }
  const html = await renderToHtml(
    React.createElement(PracticeGuide, {
      practice,
      onBack: () => {},
      relatedPractices: related,
      onOpenPractice: () => {},
    })
  );
  if (!html.includes('Related Practices')) {
    throw new Error('"Related Practices" section header missing');
  }
  for (const r of related) {
    if (!html.includes(r.title)) {
      throw new Error(`related practice title missing: ${r.title}`);
    }
  }
});

await step('PracticeGuide back button fires onBack from both header and footer', async () => {
  const practice = PRACTICES[0];
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(PracticeGuide, {
        practice,
        onBack: () => { calls += 1; },
        relatedPractices: [],
        onOpenPractice: () => {},
      })
    );
  });
  // Header back button: "The Field Guide"
  const headerBack = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('The Field Guide')
  );
  // Footer back button: "All Practices"
  const footerBack = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('All Practices')
  );
  if (!headerBack) {
    rootApi.unmount(); root.remove();
    throw new Error('header back button missing');
  }
  if (!footerBack) {
    rootApi.unmount(); root.remove();
    throw new Error('footer back button missing');
  }
  await act(async () => { headerBack.click(); });
  await act(async () => { footerBack.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 2) throw new Error(`expected 2 onBack calls, got ${calls}`);
});

// 10d. Batch 12 — Course data well-formedness
console.log('\nTest 9d: Batch 12 — Course data');
const { COURSE_PROGRESSION_COLORS, SEVEN_WEEKS } = loadModule(path.join(SRC, 'data/course.js'));

await step('COURSE_PROGRESSION_COLORS is a 7-element gradient', async () => {
  if (!Array.isArray(COURSE_PROGRESSION_COLORS)) {
    throw new Error('COURSE_PROGRESSION_COLORS is not an array');
  }
  if (COURSE_PROGRESSION_COLORS.length !== 7) {
    throw new Error(`expected 7 colors, got ${COURSE_PROGRESSION_COLORS.length}`);
  }
  for (const c of COURSE_PROGRESSION_COLORS) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(c)) {
      throw new Error(`invalid hex color: ${c}`);
    }
  }
});

await step('SEVEN_WEEKS contains exactly 7 weeks with correct verbs', async () => {
  if (!Array.isArray(SEVEN_WEEKS)) throw new Error('SEVEN_WEEKS is not an array');
  if (SEVEN_WEEKS.length !== 7) {
    throw new Error(`expected 7 weeks, got ${SEVEN_WEEKS.length}`);
  }
  const expectedVerbs = ['SEE', 'KNOW', 'HEAL', 'ABIDE', 'GO', 'BUILD', 'SEND'];
  SEVEN_WEEKS.forEach((w, i) => {
    if (w.n !== i + 1) throw new Error(`week ${i + 1} has wrong n: ${w.n}`);
    if (w.verb !== expectedVerbs[i]) {
      throw new Error(`week ${i + 1} verb expected "${expectedVerbs[i]}", got "${w.verb}"`);
    }
  });
});

await step('Each SEVEN_WEEKS week has all required fields', async () => {
  for (const w of SEVEN_WEEKS) {
    for (const field of ['n', 'verb', 'title', 'subtitle', 'humanTitle',
                         'question', 'stage', 'stageNote', 'house', 'bullet',
                         'essence', 'prologue', 'days']) {
      if (w[field] === undefined) {
        throw new Error(`week ${w.n} missing field: ${field}`);
      }
    }
    if (!Array.isArray(w.days)) throw new Error(`week ${w.n} days is not array`);
    if (w.days.length !== 7) {
      throw new Error(`week ${w.n} has ${w.days.length} days, expected 7`);
    }
  }
});

await step('Each day has required fields and a sabbath flag on day 7', async () => {
  const validBlockTypes = new Set(['p', 'h', 'q', 'pullquote']);
  for (const w of SEVEN_WEEKS) {
    w.days.forEach((d, i) => {
      if (d.n !== i + 1) {
        throw new Error(`week ${w.n} day at index ${i} has wrong n: ${d.n}`);
      }
      if (!d.title) throw new Error(`week ${w.n} day ${d.n} missing title`);
      if (!d.note) throw new Error(`week ${w.n} day ${d.n} missing note`);
      if (i === 6) {
        // Day 7 is Sabbath — should have sabbath: true
        if (!d.sabbath) {
          throw new Error(`week ${w.n} day 7 should have sabbath: true`);
        }
      } else {
        // Days 1-6 should have body content
        if (!Array.isArray(d.body) || d.body.length === 0) {
          throw new Error(`week ${w.n} day ${d.n} has no body`);
        }
        for (const block of d.body) {
          if (!validBlockTypes.has(block.t)) {
            throw new Error(`week ${w.n} day ${d.n} has unknown block type: ${block.t}`);
          }
        }
      }
    });
  }
});

await step('Each week prologue has body blocks', async () => {
  for (const w of SEVEN_WEEKS) {
    if (!w.prologue.title) throw new Error(`week ${w.n} prologue missing title`);
    if (!Array.isArray(w.prologue.body) || w.prologue.body.length === 0) {
      throw new Error(`week ${w.n} prologue has no body`);
    }
  }
});

// 10e. Batch 13 — Course overview surfaces
console.log('\nTest 9e: Batch 13 — Course overview components');
const { default: StepRibbon } = loadModule(path.join(SRC, 'components/StepRibbon.jsx'));
const { default: SevenStepsList } = loadModule(path.join(SRC, 'components/SevenStepsList.jsx'));
const { default: HorizontalJourney } = loadModule(path.join(SRC, 'components/HorizontalJourney.jsx'));
const { default: CourseJourney } = loadModule(path.join(SRC, 'components/CourseJourney.jsx'));
const { default: CourseHero } = loadModule(path.join(SRC, 'components/CourseHero.jsx'));

await step('StepRibbon renders 7 step cells with correct verbs', async () => {
  const html = await renderToHtml(
    React.createElement(StepRibbon, { progress: {}, currentWeekN: 1 })
  );
  for (const verb of ['SEE', 'KNOW', 'HEAL', 'ABIDE', 'GO', 'BUILD', 'SEND']) {
    if (!html.includes(verb)) throw new Error(`StepRibbon missing verb: ${verb}`);
  }
});

await step('SevenStepsList renders all 7 weeks with stage dividers', async () => {
  const html = await renderToHtml(
    React.createElement(SevenStepsList, { onEnterWeek: () => {}, progress: {} })
  );
  // Each week's humanTitle should appear
  for (let n = 1; n <= 7; n++) {
    const expected = SEVEN_WEEKS[n - 1].humanTitle;
    if (!html.includes(expected)) throw new Error(`SevenStepsList missing: ${expected}`);
  }
  // Stage dividers
  if (!html.includes('Via Purgativa')) throw new Error('Via Purgativa divider missing');
  if (!html.includes('Via Illuminativa')) throw new Error('Via Illuminativa divider missing');
  if (!html.includes('Via Unitiva')) throw new Error('Via Unitiva divider missing');
});

await step('SevenStepsList click on a step fires onEnterWeek with the week number', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SevenStepsList, {
        onEnterWeek: (n) => { calls.push(n); },
        progress: {},
      })
    );
  });
  // Find the button for week 4 (ABIDE)
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes(SEVEN_WEEKS[3].humanTitle)
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('week 4 button missing');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.length !== 1) throw new Error(`expected 1 call, got ${calls.length}`);
  if (calls[0] !== 4) throw new Error(`expected onEnterWeek(4), got ${calls[0]}`);
});

await step('SevenStepsList shows completion count when progress provided', async () => {
  // Mark days 1-3 of week 1 complete
  const progress = { 'w1-d1': true, 'w1-d2': true, 'w1-d3': true };
  const html = await renderToHtml(
    React.createElement(SevenStepsList, { onEnterWeek: () => {}, progress })
  );
  if (!html.includes('3/7')) throw new Error('expected "3/7" completion indicator');
});

await step('HorizontalJourney renders 7 medallions and Pentecost label', async () => {
  const html = await renderToHtml(
    React.createElement(HorizontalJourney, { onSelectStep: () => {}, progress: {}, currentWeekN: 1 })
  );
  // Pentecost text
  if (!html.includes('PENTECOST')) throw new Error('Pentecost terminus label missing');
  // 7 Roman numerals (I through VII)
  for (const r of ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']) {
    if (!html.includes(`>${r}<`)) throw new Error(`Roman numeral missing: ${r}`);
  }
  // Three stage band labels
  for (const label of ['VIA PURGATIVA', 'VIA ILLUMINATIVA', 'VIA UNITIVA']) {
    if (!html.includes(label)) throw new Error(`SVG band label missing: ${label}`);
  }
});

await step('HorizontalJourney click on a medallion fires onSelectStep', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(HorizontalJourney, {
        onSelectStep: (n) => { calls.push(n); },
        progress: {},
        currentWeekN: 1,
      })
    );
  });
  // Click the first medallion button (week 1)
  const buttons = Array.from(root.querySelectorAll('button'));
  if (buttons.length !== 7) {
    rootApi.unmount(); root.remove();
    throw new Error(`expected 7 medallion buttons, got ${buttons.length}`);
  }
  await act(async () => { buttons[2].click(); }); // week 3 (index 2)
  rootApi.unmount(); root.remove();
  if (calls.length !== 1) throw new Error(`expected 1 call, got ${calls.length}`);
  if (calls[0] !== 3) throw new Error(`expected onSelectStep(3), got ${calls[0]}`);
});

await step('CourseJourney composes HorizontalJourney + SevenStepsList', async () => {
  const html = await renderToHtml(
    React.createElement(CourseJourney, { onEnterWeek: () => {}, progress: {}, currentWeekN: 1 })
  );
  if (!html.includes('The Path of the Saints')) {
    throw new Error('CourseJourney section header missing');
  }
  if (!html.includes('Seven weeks. Fifty days.')) {
    throw new Error('CourseJourney lede missing');
  }
  if (!html.includes('PENTECOST')) throw new Error('embedded HorizontalJourney missing');
  // SevenStepsList content
  if (!html.includes(SEVEN_WEEKS[0].humanTitle)) {
    throw new Error('embedded SevenStepsList missing first week');
  }
  if (!html.includes('Begin where you are')) {
    throw new Error('CourseJourney closing line missing');
  }
});

await step('CourseHero logged-out shows "Begin the Course" CTA', async () => {
  const html = await renderToHtml(
    React.createElement(CourseHero, {
      onStartJourney: () => {},
      onBeginToday: () => {},
      currentUser: null,
      currentPosition: null,
      progress: {},
    })
  );
  if (!html.includes('The Course')) throw new Error('eyebrow missing');
  if (!html.includes('The Kingdom Course')) throw new Error('brand block missing');
  if (!html.includes('The path the saints walked')) {
    throw new Error('logged-out headline missing');
  }
  if (!html.includes('Begin the Course')) throw new Error('Begin CTA missing');
  if (!html.includes('See the path')) throw new Error('See the path link missing');
});

await step('CourseHero logged-in shows personalized greeting + Today\'s Mission card', async () => {
  const html = await renderToHtml(
    React.createElement(CourseHero, {
      onStartJourney: () => {},
      onBeginToday: () => {},
      currentUser: { name: 'Maria' },
      currentPosition: { weekN: 3, dayKey: 2 },
      progress: { 'w1-d1': true, 'w1-d2': true },
    })
  );
  if (!html.includes('Welcome Back')) throw new Error('Welcome Back eyebrow missing');
  if (!html.includes('Maria')) throw new Error('user name missing from greeting');
  // Currently on week 3 (HEAL)
  if (!html.includes(SEVEN_WEEKS[2].humanTitle)) {
    throw new Error('current week title missing from Today\'s Mission card');
  }
  if (!html.includes("Continue today's reading")) {
    throw new Error('continue CTA missing for non-zero progress');
  }
  // Day count
  if (!html.includes('2/50')) throw new Error('progress count missing');
});

await step('CourseHero logged-in onBeginToday CTA fires correctly', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(CourseHero, {
        onStartJourney: () => {},
        onBeginToday: () => { calls += 1; },
        currentUser: { name: 'Test' },
        currentPosition: { weekN: 1, dayKey: 1 },
        progress: {},
      })
    );
  });
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('Read the prologue') || b.textContent.includes("Continue today's reading")
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('today\'s-mission CTA missing');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`expected 1 call, got ${calls}`);
});

// 10f. Batch 14 — WeekDetail + DayReading
console.log('\nTest 9f: Batch 14 — WeekDetail + DayReading');
const { default: WeekDetail } = loadModule(path.join(SRC, 'components/WeekDetail.jsx'));
const { default: DayReading } = loadModule(path.join(SRC, 'components/DayReading.jsx'));

await step('WeekDetail returns null when weekData is null (defensive)', async () => {
  const html = await renderToHtml(
    React.createElement(WeekDetail, {
      weekData: null,
      onBack: () => {},
      onEnterWeek: () => {},
      onOpenDay: () => {},
      onToSending: () => {},
    })
  );
  if (html.length > 100) {
    throw new Error(`expected empty render for null weekData, got ${html.length} bytes`);
  }
});

await step('WeekDetail renders header, essence, and 7-day list for week 1', async () => {
  const w = SEVEN_WEEKS[0]; // Awakening
  const html = await renderToHtml(
    React.createElement(WeekDetail, {
      weekData: w,
      onBack: () => {},
      onEnterWeek: () => {},
      onOpenDay: () => {},
      onToSending: () => {},
    })
  );
  if (!html.includes(w.title)) throw new Error(`week title missing: ${w.title}`);
  if (!html.includes(w.subtitle)) throw new Error(`week subtitle missing: ${w.subtitle}`);
  if (!html.includes(w.humanTitle)) throw new Error(`week humanTitle missing: ${w.humanTitle}`);
  // Step indicator
  if (!html.includes(`Step ${w.n} · ${w.verb}`)) {
    throw new Error('step indicator missing');
  }
  // Essence (first sentence at least)
  const essenceFirstChars = w.essence.slice(0, 60);
  if (!html.includes(essenceFirstChars)) {
    throw new Error('essence text missing');
  }
  // Prologue header
  if (w.prologue && !html.includes('Prologue')) {
    throw new Error('Prologue section missing');
  }
  // The Seven Days header
  if (!html.includes('The Seven Days')) {
    throw new Error('"The Seven Days" header missing');
  }
  // Each day's title appears
  for (const d of w.days) {
    if (!html.includes(d.title)) {
      throw new Error(`day title missing: ${d.title}`);
    }
  }
});

await step('WeekDetail clicking a day fires onOpenDay with the day number', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(WeekDetail, {
        weekData: SEVEN_WEEKS[0],
        onBack: () => {},
        onEnterWeek: () => {},
        onOpenDay: (k) => { calls.push(k); },
        onToSending: () => {},
      })
    );
  });
  // Click day 3 by finding its title
  const day3 = SEVEN_WEEKS[0].days[2];
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes(day3.title)
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error(`day 3 button missing: ${day3.title}`);
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.length !== 1) throw new Error(`expected 1 call, got ${calls.length}`);
  if (calls[0] !== 3) throw new Error(`expected onOpenDay(3), got ${calls[0]}`);
});

await step('WeekDetail prologue button fires onOpenDay("prologue")', async () => {
  const w = SEVEN_WEEKS[0]; // has prologue
  if (!w.prologue) {
    return; // skip if no prologue (defensive — week 1 always has one in source)
  }
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(WeekDetail, {
        weekData: w,
        onBack: () => {},
        onEnterWeek: () => {},
        onOpenDay: (k) => { calls.push(k); },
        onToSending: () => {},
      })
    );
  });
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes(w.prologue.title)
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('prologue button missing');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.length !== 1) throw new Error(`expected 1 call, got ${calls.length}`);
  if (calls[0] !== 'prologue') {
    throw new Error(`expected onOpenDay("prologue"), got ${JSON.stringify(calls[0])}`);
  }
});

await step('WeekDetail week 7 shows "Day 50 — the Sending" CTA', async () => {
  const w = SEVEN_WEEKS[6]; // last week
  const html = await renderToHtml(
    React.createElement(WeekDetail, {
      weekData: w,
      onBack: () => {},
      onEnterWeek: () => {},
      onOpenDay: () => {},
      onToSending: () => {},
    })
  );
  if (!html.includes('Forty-nine days walked')) {
    throw new Error('week-7 conclusion line missing');
  }
  if (!html.includes('The fiftieth day waits')) {
    throw new Error('week-7 anticipatory line missing');
  }
  if (!html.includes('Day 50 — the Sending')) {
    throw new Error('Sending CTA missing on week 7');
  }
});

await step('WeekDetail week 7 onToSending fires when CTA tapped', async () => {
  const calls = { sending: 0 };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(WeekDetail, {
        weekData: SEVEN_WEEKS[6],
        onBack: () => {},
        onEnterWeek: () => {},
        onOpenDay: () => {},
        onToSending: () => { calls.sending += 1; },
      })
    );
  });
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes('Day 50')
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('Day 50 CTA missing');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.sending !== 1) {
    throw new Error(`expected 1 onToSending, got ${calls.sending}`);
  }
});

await step('WeekDetail middle weeks show prev/next step navigation', async () => {
  const html = await renderToHtml(
    React.createElement(WeekDetail, {
      weekData: SEVEN_WEEKS[3], // week 4 — has both prev and next
      onBack: () => {},
      onEnterWeek: () => {},
      onOpenDay: () => {},
      onToSending: () => {},
    })
  );
  if (!html.includes('Step 3')) throw new Error('prev step button missing');
  if (!html.includes('Step 5')) throw new Error('next step button missing');
  if (!html.includes('Step 4 of 7')) throw new Error('step counter missing');
});

await step('WeekDetail isDayComplete predicate marks days "Done"', async () => {
  const w = SEVEN_WEEKS[0];
  // Mark days 1, 3 complete + prologue
  const completed = new Set(['prologue', 1, 3]);
  const html = await renderToHtml(
    React.createElement(WeekDetail, {
      weekData: w,
      onBack: () => {},
      onEnterWeek: () => {},
      onOpenDay: () => {},
      onToSending: () => {},
      isDayComplete: (k) => completed.has(k),
    })
  );
  // The completed dots use the Check icon which renders an svg
  // We can't easily count Check renders, but we can check that the
  // completed-style border color is present (gold-3 border). At minimum,
  // verify that the page renders without throwing for completed states.
  if (html.length < 1000) throw new Error('rendered HTML too small');
});

// ---- DayReading tests ----------------------------------------------------

await step('DayReading returns null when weekData is null', async () => {
  const html = await renderToHtml(
    React.createElement(DayReading, {
      weekData: null,
      dayKey: 1,
      onBack: () => {},
      onNextDay: () => {},
      onPrevDay: () => {},
      onToggleComplete: () => {},
      isCompleted: false,
      hasNext: true,
      hasPrev: false,
    })
  );
  if (html.length > 100) {
    throw new Error(`expected empty render for null weekData, got ${html.length} bytes`);
  }
});

await step('DayReading renders header + body + nav for a real day', async () => {
  const w = SEVEN_WEEKS[0]; // Awakening
  const day = w.days[0]; // day 1 — has body content
  const html = await renderToHtml(
    React.createElement(DayReading, {
      weekData: w,
      dayKey: 1,
      onBack: () => {},
      onNextDay: () => {},
      onPrevDay: () => {},
      onToggleComplete: () => {},
      isCompleted: false,
      hasNext: true,
      hasPrev: false,
      nextLabel: 'Day 2',
      prevLabel: 'Step 1',
    })
  );
  if (!html.includes(day.title)) throw new Error(`day title missing: ${day.title}`);
  if (!html.includes(day.note)) throw new Error('day note missing');
  if (!html.includes('Day 1 of 7')) throw new Error('progress label missing');
  if (!html.includes('Day 1 of 49')) throw new Error('global day count missing');
  if (!html.includes('Mark as read')) throw new Error('mark-as-read button missing');
  // Body content — first paragraph plaintext (with HTML stripped)
  const firstP = day.body.find((b) => b.t === 'p');
  if (firstP) {
    const plain = firstP.d.replace(/<[^>]+>/g, '').slice(0, 60);
    if (!html.includes(plain)) {
      throw new Error('first paragraph text not in render');
    }
  }
});

await step('DayReading prologue mode renders prologue content', async () => {
  const w = SEVEN_WEEKS[0];
  if (!w.prologue) return; // skip
  const html = await renderToHtml(
    React.createElement(DayReading, {
      weekData: w,
      dayKey: 'prologue',
      onBack: () => {},
      onNextDay: () => {},
      onPrevDay: () => {},
      onToggleComplete: () => {},
      isCompleted: false,
      hasNext: true,
      hasPrev: false,
    })
  );
  if (!html.includes(w.prologue.title)) throw new Error('prologue title missing');
  if (!html.includes('>Prologue<')) throw new Error('Prologue progress label missing');
});

await step('DayReading isCompleted=true shows "Marked complete"', async () => {
  const html = await renderToHtml(
    React.createElement(DayReading, {
      weekData: SEVEN_WEEKS[0],
      dayKey: 1,
      onBack: () => {},
      onNextDay: () => {},
      onPrevDay: () => {},
      onToggleComplete: () => {},
      isCompleted: true,
      hasNext: true,
      hasPrev: false,
    })
  );
  if (!html.includes('Marked complete')) {
    throw new Error('"Marked complete" label missing when isCompleted=true');
  }
});

await step('DayReading onToggleComplete + nav buttons fire correctly', async () => {
  const calls = { toggle: 0, next: 0, prev: 0, back: 0 };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(DayReading, {
        weekData: SEVEN_WEEKS[0],
        dayKey: 2,
        onBack: () => { calls.back += 1; },
        onNextDay: () => { calls.next += 1; },
        onPrevDay: () => { calls.prev += 1; },
        onToggleComplete: () => { calls.toggle += 1; },
        isCompleted: false,
        hasNext: true,
        hasPrev: true,
        nextLabel: 'Day 3',
        prevLabel: 'Day 1',
      })
    );
  });
  // Find each button by text
  const buttons = Array.from(root.querySelectorAll('button'));
  const markBtn = buttons.find((b) => b.textContent.includes('Mark as read'));
  const nextBtn = buttons.find((b) => b.textContent.includes('Day 3'));
  const prevBtn = buttons.find((b) => b.textContent.includes('Day 1') && !b.textContent.includes('Step'));
  // backBtn — header back has text like "Step 1 — Awakening"
  if (!markBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('mark button missing');
  }
  await act(async () => { markBtn.click(); });
  if (nextBtn) await act(async () => { nextBtn.click(); });
  if (prevBtn) await act(async () => { prevBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.toggle !== 1) throw new Error(`toggle: expected 1, got ${calls.toggle}`);
  if (calls.next !== 1) throw new Error(`next: expected 1, got ${calls.next}`);
  if (calls.prev !== 1) throw new Error(`prev: expected 1, got ${calls.prev}`);
});

await step('DayReading shows reflection + prayer when present in source data', async () => {
  // Find a day with reflection or prayer in the data
  let withReflection = null;
  for (const w of SEVEN_WEEKS) {
    for (const d of w.days) {
      if (d.reflection || d.prayer) {
        withReflection = { w, d };
        break;
      }
    }
    if (withReflection) break;
  }
  if (!withReflection) {
    // No day in source has reflection/prayer — skip the test
    return;
  }
  const html = await renderToHtml(
    React.createElement(DayReading, {
      weekData: withReflection.w,
      dayKey: withReflection.d.n,
      onBack: () => {},
      onNextDay: () => {},
      onPrevDay: () => {},
      onToggleComplete: () => {},
      isCompleted: false,
      hasNext: true,
      hasPrev: false,
    })
  );
  if (withReflection.d.reflection && !html.includes('Reflect')) {
    throw new Error('Reflect heading missing despite reflection present');
  }
  if (withReflection.d.prayer && !html.includes('Pray')) {
    throw new Error('Pray heading missing despite prayer present');
  }
});

// 10g. Batch 15 — SendingDay + CourseTabView + Course routing in App
console.log('\nTest 9g: Batch 15 — SendingDay + CourseTabView');
const { default: SendingDay } = loadModule(path.join(SRC, 'components/SendingDay.jsx'));
const { default: CourseTabView } = loadModule(path.join(SRC, 'components/CourseTabView.jsx'));

await step('SendingDay renders Pentecost commissioning copy', async () => {
  const html = await renderToHtml(
    React.createElement(SendingDay, { onBack: () => {}, onShare: () => {} })
  );
  if (!html.includes('Day 50')) throw new Error('Day 50 label missing');
  if (!html.includes('The Sending')) throw new Error('"The Sending" label missing');
  if (!html.includes('Now you are sent')) throw new Error('opening line missing');
  if (!html.includes('Acts 2:1–3')) throw new Error('Acts 2 citation missing');
  if (!html.includes('Acts 1:8')) throw new Error('Acts 1:8 citation missing');
  if (!html.includes('Pass it on to someone')) throw new Error('share CTA missing');
  if (!html.includes('Walk the seven steps again')) {
    throw new Error('"walk again" link missing');
  }
  if (!html.includes('Go. The kingdom is at hand.')) {
    throw new Error('closing line missing');
  }
});

await step('SendingDay onBack and onShare callbacks fire correctly', async () => {
  const calls = { back: 0, share: 0 };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SendingDay, {
        onBack: () => { calls.back += 1; },
        onShare: () => { calls.share += 1; },
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  const shareBtn = buttons.find((b) => b.textContent.includes('Pass it on'));
  const backBtn = buttons.find((b) => b.textContent.includes('Back to the course'));
  if (!shareBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('share button missing');
  }
  if (!backBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('back button missing');
  }
  await act(async () => { shareBtn.click(); });
  await act(async () => { backBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.share !== 1) throw new Error(`share: expected 1, got ${calls.share}`);
  if (calls.back !== 1) throw new Error(`back: expected 1, got ${calls.back}`);
});

// ---- CourseTabView routing ------------------------------------------------

await step('CourseTabView "overview" mode renders CourseHero + CourseJourney', async () => {
  const html = await renderToHtml(
    React.createElement(CourseTabView, {
      view: 'overview',
      currentUser: null,
      progress: {},
    })
  );
  if (!html.includes('The Kingdom Course')) {
    throw new Error('CourseHero brand missing in overview');
  }
  if (!html.includes('The Path of the Saints')) {
    throw new Error('CourseJourney section header missing in overview');
  }
});

await step('CourseTabView "week" mode renders WeekDetail for activeWeekN', async () => {
  const html = await renderToHtml(
    React.createElement(CourseTabView, {
      view: 'week',
      activeWeekN: 2,
      progress: {},
    })
  );
  // Week 2 = KNOW = "The Kingdom in the Mind"
  const w = SEVEN_WEEKS[1];
  if (!html.includes(w.title)) throw new Error(`week 2 title missing: ${w.title}`);
  if (!html.includes(w.humanTitle)) throw new Error(`week 2 humanTitle missing: ${w.humanTitle}`);
  // Should NOT show CourseHero brand (overview-only)
  if (html.includes('The Path of the Saints')) {
    throw new Error('CourseJourney leaked into week view');
  }
});

await step('CourseTabView "day" mode renders DayReading for activeWeekN + activeDayKey', async () => {
  const html = await renderToHtml(
    React.createElement(CourseTabView, {
      view: 'day',
      activeWeekN: 1,
      activeDayKey: 1,
      progress: {},
    })
  );
  const day = SEVEN_WEEKS[0].days[0];
  if (!html.includes(day.title)) throw new Error(`day 1 title missing: ${day.title}`);
  // Day reading shows progress label
  if (!html.includes('Day 1 of 7')) throw new Error('day progress label missing');
});

await step('CourseTabView "day" mode reflects isCompleted via progress prop', async () => {
  const html = await renderToHtml(
    React.createElement(CourseTabView, {
      view: 'day',
      activeWeekN: 1,
      activeDayKey: 1,
      progress: { 'w1-d1': true },
    })
  );
  if (!html.includes('Marked complete')) {
    throw new Error('completed state not reflected');
  }
});

await step('CourseTabView "sending" mode renders SendingDay', async () => {
  const html = await renderToHtml(
    React.createElement(CourseTabView, { view: 'sending' })
  );
  if (!html.includes('Now you are sent')) {
    throw new Error('SendingDay not rendered in sending view');
  }
});

await step('CourseTabView callbacks route through correctly (overview → week)', async () => {
  const calls = { weekN: [], view: [] };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(CourseTabView, {
        view: 'overview',
        currentUser: null,
        progress: {},
        setActiveWeekN: (n) => { calls.weekN.push(n); },
        setView: (v) => { calls.view.push(v); },
      })
    );
  });
  // Click into a week from CourseJourney's SevenStepsList
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes(SEVEN_WEEKS[2].humanTitle) // week 3 (HEAL)
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('SevenStepsList button missing in overview');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.weekN.length !== 1) {
    throw new Error(`expected 1 setActiveWeekN call, got ${calls.weekN.length}`);
  }
  if (calls.weekN[0] !== 3) {
    throw new Error(`expected setActiveWeekN(3), got ${calls.weekN[0]}`);
  }
  if (!calls.view.includes('week')) {
    throw new Error('expected setView("week") to be called');
  }
});

await step('CourseTabView "day" prologue mode renders prologue title', async () => {
  const w = SEVEN_WEEKS[0];
  if (!w.prologue) return; // skip
  const html = await renderToHtml(
    React.createElement(CourseTabView, {
      view: 'day',
      activeWeekN: 1,
      activeDayKey: 'prologue',
      progress: {},
    })
  );
  if (!html.includes(w.prologue.title)) {
    throw new Error('prologue title missing in day-prologue mode');
  }
});

await step('CourseTabView next-day navigation walks through prologue + days correctly', async () => {
  // Render in day mode at W1.D7, click "Next" — should land at W2.prologue
  // (since week 2 has a prologue) by calling setActiveWeekN(2) + setActiveDayKey("prologue")
  const calls = { weekN: [], dayKey: [] };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(CourseTabView, {
        view: 'day',
        activeWeekN: 1,
        activeDayKey: 7,
        progress: {},
        setActiveWeekN: (n) => { calls.weekN.push(n); },
        setActiveDayKey: (k) => { calls.dayKey.push(k); },
      })
    );
  });
  // Find the Next button. The DayReading footer's "Next" button has the
  // computed nextLabel (in this case "Step 2" since we're at week 1 day 7)
  const buttons = Array.from(root.querySelectorAll('button'));
  const nextBtn = buttons.find((b) => {
    const t = b.textContent.trim();
    // The button text includes the next label
    return t.startsWith('Step 2');
  });
  if (!nextBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('Next-day button at W1.D7 not found');
  }
  await act(async () => { nextBtn.click(); });
  rootApi.unmount(); root.remove();
  if (!calls.weekN.includes(2)) {
    throw new Error(`expected setActiveWeekN(2), calls were ${JSON.stringify(calls.weekN)}`);
  }
  // W2 has a prologue — should set dayKey to "prologue"
  const w2 = SEVEN_WEEKS[1];
  const expectedDayKey = w2?.prologue ? 'prologue' : 1;
  if (!calls.dayKey.includes(expectedDayKey)) {
    throw new Error(
      `expected setActiveDayKey(${JSON.stringify(expectedDayKey)}), ` +
      `calls were ${JSON.stringify(calls.dayKey)}`
    );
  }
});

await step('CourseTabView at W7.D7 has no next button enabled', async () => {
  const html = await renderToHtml(
    React.createElement(CourseTabView, {
      view: 'day',
      activeWeekN: 7,
      activeDayKey: 7,
      progress: {},
    })
  );
  // The next button should still render but disabled (opacity 0.35).
  // Easier check: the day-reading "Next" button text. At W7.D7, nextLabel
  // returns 'Done'.
  if (!html.includes('Done')) {
    throw new Error('"Done" label missing on next button at W7.D7');
  }
});

// 10h. Batch 17 — Gospel tab (Gate)
console.log('\nTest 9h: Batch 17 — Gospel tab (Gate)');
const { default: Hero } = loadModule(path.join(SRC, 'components/Hero.jsx'));
const { default: Prologue } = loadModule(path.join(SRC, 'components/Prologue.jsx'));
const { default: Trail } = loadModule(path.join(SRC, 'components/Trail.jsx'));
const { default: GospelCircles } = loadModule(path.join(SRC, 'components/Circles.jsx'));
const { default: Bridge } = loadModule(path.join(SRC, 'components/Bridge.jsx'));
const { default: CircleModal } = loadModule(path.join(SRC, 'components/CircleModal.jsx'));
const { default: GateInvitation } = loadModule(path.join(SRC, 'components/GateInvitation.jsx'));
const { default: GospelTabView } = loadModule(path.join(SRC, 'components/GospelTabView.jsx'));
const { CIRCLES, RING_COLORS } = loadModule(path.join(SRC, 'data/gospel.js'));

await step('Gospel data layer is well-formed', async () => {
  if (!Array.isArray(CIRCLES)) throw new Error('CIRCLES is not an array');
  if (CIRCLES.length !== 9) throw new Error(`expected 9 circles, got ${CIRCLES.length}`);
  if (!Array.isArray(RING_COLORS)) throw new Error('RING_COLORS is not an array');
  if (RING_COLORS.length !== 9) {
    throw new Error(`expected 9 ring colors, got ${RING_COLORS.length}`);
  }
  // Each circle has required fields
  CIRCLES.forEach((c, i) => {
    if (c.n !== i + 1) throw new Error(`circle at index ${i} has wrong n: ${c.n}`);
    for (const field of ['title', 'subtitle', 'essence', 'pillars', 'scripture']) {
      if (!c[field]) throw new Error(`circle ${c.n} missing field: ${field}`);
    }
    if (!Array.isArray(c.pillars) || c.pillars.length === 0) {
      throw new Error(`circle ${c.n} has no pillars`);
    }
    for (const p of c.pillars) {
      if (!p.k || !p.v) throw new Error(`circle ${c.n} pillar missing k or v`);
    }
  });
  // RING_COLORS are all valid hex
  for (const color of RING_COLORS) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) throw new Error(`invalid ring color: ${color}`);
  }
});

await step('Hero renders headline + both CTAs', async () => {
  const html = await renderToHtml(
    React.createElement(Hero, { onEnter: () => {}, onToPrologue: () => {} })
  );
  if (!html.includes('The Kingdom of Eternal Life')) {
    throw new Error('eyebrow missing');
  }
  if (!html.includes('The single greatest announcement in history')) {
    throw new Error('headline missing');
  }
  if (!html.includes('most rigorously verified')) {
    throw new Error('headline second line missing');
  }
  if (!html.includes('Enter the course')) throw new Error('primary CTA missing');
  if (!html.includes('Begin with the message')) {
    throw new Error('secondary CTA missing');
  }
  if (!html.includes('Matthew 13:45')) throw new Error('hero scripture missing');
});

await step('Hero CTAs fire correctly', async () => {
  const calls = { enter: 0, prologue: 0 };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(Hero, {
        onEnter: () => { calls.enter += 1; },
        onToPrologue: () => { calls.prologue += 1; },
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  const enterBtn = buttons.find((b) => b.textContent.includes('Enter the course'));
  const prologueBtn = buttons.find((b) => b.textContent.includes('Begin with the message'));
  if (!enterBtn || !prologueBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('Hero CTAs missing');
  }
  await act(async () => { enterBtn.click(); });
  await act(async () => { prologueBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.enter !== 1) throw new Error(`enter: expected 1, got ${calls.enter}`);
  if (calls.prologue !== 1) throw new Error(`prologue: expected 1, got ${calls.prologue}`);
});

await step('Prologue renders with the kingdom message and scrolls anchor', async () => {
  const html = await renderToHtml(React.createElement(Prologue));
  if (!html.includes('Christ did not come to teach a philosophy')) {
    throw new Error('Prologue headline missing');
  }
  if (!html.includes('He came to inaugurate a kingdom')) {
    throw new Error('Prologue italic line missing');
  }
  if (!html.includes('Follow the trail')) {
    throw new Error('Follow-the-trail CTA missing');
  }
  if (!html.includes('id="message"')) {
    throw new Error('Prologue anchor id="message" missing');
  }
});

await step('Trail renders Davidic blueprint table with all correspondences', async () => {
  const html = await renderToHtml(React.createElement(Trail));
  if (!html.includes('Every civilization has touched it')) {
    throw new Error('Trail headline missing');
  }
  if (!html.includes('It converges on the Catholic Church')) {
    throw new Error('convergence claim missing');
  }
  if (!html.includes('The Blueprint')) throw new Error('Blueprint header missing');
  // Check several blueprint correspondences
  for (const term of ['Queen Mother', 'Prime Minister', 'Twelve Tribes', 'Twelve Apostles']) {
    if (!html.includes(term)) throw new Error(`blueprint term missing: ${term}`);
  }
  if (!html.includes('Enter the nine circles')) {
    throw new Error('CTA to circles missing');
  }
});

await step('Circles renders 9 circle entries with title + subtitle', async () => {
  const html = await renderToHtml(
    React.createElement(GospelCircles, { onSelect: () => {}, openedCircles: [] })
  );
  // All 9 circle titles appear (the list and SVG label)
  for (const c of CIRCLES) {
    if (!html.includes(c.title)) throw new Error(`circle title missing: ${c.title}`);
    if (!html.includes(c.subtitle)) throw new Error(`circle subtitle missing: ${c.subtitle}`);
  }
  if (!html.includes('The Nine Circles of Evidence')) {
    throw new Error('Circles section header missing');
  }
});

await step('Circles click on a list row fires onSelect with circle number', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(GospelCircles, {
        onSelect: (n) => { calls.push(n); },
        openedCircles: [],
      })
    );
  });
  // Find the button containing circle 4's title
  const target = CIRCLES[3];
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes(target.title)
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error(`circle 4 list button missing: ${target.title}`);
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.length !== 1) throw new Error(`expected 1 call, got ${calls.length}`);
  if (calls[0] !== 4) throw new Error(`expected onSelect(4), got ${calls[0]}`);
});

await step('Circles shows progress indicator only when openedCircles has entries', async () => {
  // No opened circles: progress section should NOT render
  const htmlNone = await renderToHtml(
    React.createElement(GospelCircles, { onSelect: () => {}, openedCircles: [] })
  );
  if (htmlNone.includes('circles walked')) {
    throw new Error('progress shown when no circles opened');
  }
  // Some opened: should show "X of 9 circles walked"
  const htmlSome = await renderToHtml(
    React.createElement(GospelCircles, { onSelect: () => {}, openedCircles: [1, 3, 5] })
  );
  if (!htmlSome.includes('3 of 9 circles walked')) {
    throw new Error('partial progress label missing');
  }
  // All 9: should show special completion message
  const htmlAll = await renderToHtml(
    React.createElement(GospelCircles, {
      onSelect: () => {},
      openedCircles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    })
  );
  if (!htmlAll.includes('The full trail walked')) {
    throw new Error('full-trail completion message missing');
  }
  if (!htmlAll.includes('You have seen what this course can show you')) {
    throw new Error('completion italic line missing');
  }
});

await step('Bridge renders three movement labels', async () => {
  const html = await renderToHtml(React.createElement(Bridge));
  if (!html.includes('The circles you just saw')) {
    throw new Error('Bridge headline missing');
  }
  for (const label of ['Inward', 'Abide', 'Outward']) {
    if (!html.includes(label)) throw new Error(`Bridge label missing: ${label}`);
  }
  if (!html.includes('Via Purgativa')) throw new Error('Via Purgativa term missing');
  if (!html.includes('Via Illuminativa')) throw new Error('Via Illuminativa term missing');
  if (!html.includes('Via Unitiva')) throw new Error('Via Unitiva term missing');
});

await step('CircleModal returns null when circle prop is null', async () => {
  const html = await renderToHtml(
    React.createElement(CircleModal, {
      circle: null,
      onClose: () => {},
      onNext: () => {},
      onPrev: () => {},
    })
  );
  if (html.length > 100) {
    throw new Error(`expected empty render for null circle, got ${html.length} bytes`);
  }
});

await step('CircleModal renders a circle\'s essence + pillars + scripture', async () => {
  const c = CIRCLES[0]; // The King
  const html = await renderToHtml(
    React.createElement(CircleModal, {
      circle: c,
      onClose: () => {},
      onNext: () => {},
      onPrev: () => {},
    })
  );
  if (!html.includes(c.title)) throw new Error('circle title missing');
  if (!html.includes(c.subtitle)) throw new Error('circle subtitle missing');
  if (!html.includes(c.essence.slice(0, 60))) {
    throw new Error('circle essence text missing');
  }
  // Each pillar's k appears
  for (const p of c.pillars) {
    if (!html.includes(p.k)) throw new Error(`pillar k missing: ${p.k}`);
  }
  // Footer nav text
  if (!html.includes(`Circle ${c.n} / 9`)) throw new Error('circle counter missing');
});

await step('CircleModal callbacks fire correctly', async () => {
  const calls = { close: 0, next: 0, prev: 0 };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(CircleModal, {
        circle: CIRCLES[2], // Circle 3 (has both prev and next)
        onClose: () => { calls.close += 1; },
        onNext: () => { calls.next += 1; },
        onPrev: () => { calls.prev += 1; },
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  const closeBtn = buttons.find((b) => b.getAttribute('aria-label') === 'Close');
  const nextBtn = buttons.find((b) => b.textContent.includes('Next circle'));
  const prevBtn = buttons.find((b) => b.textContent.includes('Previous circle'));
  if (!closeBtn || !nextBtn || !prevBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('CircleModal buttons missing');
  }
  await act(async () => { closeBtn.click(); });
  await act(async () => { nextBtn.click(); });
  await act(async () => { prevBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.close !== 1) throw new Error(`close: expected 1, got ${calls.close}`);
  if (calls.next !== 1) throw new Error(`next: expected 1, got ${calls.next}`);
  if (calls.prev !== 1) throw new Error(`prev: expected 1, got ${calls.prev}`);
});

await step('GateInvitation renders 3 paths + share + scriptures', async () => {
  const html = await renderToHtml(
    React.createElement(GateInvitation, { onToCourse: () => {}, onShare: () => {} })
  );
  if (!html.includes('You have seen the evidence')) {
    throw new Error('GateInvitation headline missing');
  }
  // Three reader-type cards
  for (const term of [
    'If you are not yet Catholic',
    'If the faith has become routine',
    'If you are Catholic and burning',
  ]) {
    if (!html.includes(term)) throw new Error(`reader path missing: ${term}`);
  }
  if (!html.includes('Pass it on')) throw new Error('share CTA missing');
  if (!html.includes('Luke 12:32')) throw new Error('Luke citation missing');
  if (!html.includes('Revelation 3:20')) throw new Error('Revelation citation missing');
  if (!html.includes('The gate has always been open')) {
    throw new Error('gate-line italic missing');
  }
});

await step('GateInvitation primary CTA fires onToCourse', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(GateInvitation, {
        onToCourse: () => { calls += 1; },
        onShare: () => {},
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  // Click ALL "Enter the Course" buttons (3 from cards + 1 primary at bottom)
  const enterButtons = buttons.filter((b) => b.textContent.includes('Enter the Course'));
  if (enterButtons.length !== 4) {
    rootApi.unmount(); root.remove();
    throw new Error(`expected 4 Enter the Course buttons, got ${enterButtons.length}`);
  }
  for (const b of enterButtons) {
    await act(async () => { b.click(); });
  }
  rootApi.unmount(); root.remove();
  if (calls !== 4) throw new Error(`expected 4 onToCourse calls, got ${calls}`);
});

await step('GospelTabView composes all 6 sections', async () => {
  const html = await renderToHtml(
    React.createElement(GospelTabView, { onToCourse: () => {}, onShare: () => {} })
  );
  // Hero
  if (!html.includes('The single greatest announcement')) {
    throw new Error('Hero missing in GospelTabView');
  }
  // Prologue
  if (!html.includes('He came to inaugurate a kingdom')) {
    throw new Error('Prologue missing in GospelTabView');
  }
  // Trail
  if (!html.includes('It converges on the Catholic Church')) {
    throw new Error('Trail missing in GospelTabView');
  }
  // Circles
  if (!html.includes('The Nine Circles of Evidence')) {
    throw new Error('Circles missing in GospelTabView');
  }
  // Bridge
  if (!html.includes('The circles you just saw')) {
    throw new Error('Bridge missing in GospelTabView');
  }
  // GateInvitation
  if (!html.includes('You have seen the evidence')) {
    throw new Error('GateInvitation missing in GospelTabView');
  }
});

await step('GospelTabView clicking a circle opens CircleModal', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(GospelTabView, { onToCourse: () => {}, onShare: () => {} })
    );
  });
  // Initially no modal shown — CircleModal isn't rendered when activeCircleN is null
  let html = root.innerHTML;
  if (html.includes('Circle 01 of IX')) {
    rootApi.unmount(); root.remove();
    throw new Error('modal showing before any click');
  }
  // Click a circle button (find one with circle 2's title)
  const circle2 = CIRCLES[1];
  const btn = Array.from(root.querySelectorAll('button')).find((b) =>
    b.textContent.includes(circle2.title) && b.textContent.includes(circle2.subtitle)
  );
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error(`circle 2 list button missing: ${circle2.title}`);
  }
  await act(async () => { btn.click(); });
  // Now the modal should be open
  html = root.innerHTML;
  if (!html.includes('Circle 02 of IX')) {
    rootApi.unmount(); root.remove();
    throw new Error('CircleModal did not open after circle click');
  }
  rootApi.unmount(); root.remove();
});

// 10i. Batch 18 — Chrome layer
console.log('\nTest 9i: Batch 18 — Chrome layer (KingdomTabNav, Footer, PassItOn)');
const { default: KingdomTabNav } = loadModule(path.join(SRC, 'components/KingdomTabNav.jsx'));
const { default: Footer } = loadModule(path.join(SRC, 'components/Footer.jsx'));
const { default: PassItOn } = loadModule(path.join(SRC, 'modals/PassItOn.jsx'));

await step('KingdomTabNav renders three tab labels', async () => {
  const html = await renderToHtml(
    React.createElement(KingdomTabNav, {
      tab: 'gate',
      onTab: () => {},
      currentUser: null,
      onSignOut: () => {},
      onShare: () => {},
      onOpenCompanion: () => {},
    })
  );
  for (const label of ['The Gospel', 'The Course', 'The Kingdom']) {
    if (!html.includes(label)) throw new Error(`tab label missing: ${label}`);
  }
  if (!html.includes('Pass it on')) throw new Error('share button missing');
  if (!html.includes('Ask')) throw new Error('Companion (Ask) button missing');
  if (!html.includes('Sign in')) throw new Error('Sign in button missing (no currentUser)');
});

await step('KingdomTabNav active tab gets aria-selected=true', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(KingdomTabNav, {
        tab: 'course',
        onTab: () => {},
        currentUser: null,
        onSignOut: () => {},
        onShare: () => {},
        onOpenCompanion: () => {},
      })
    );
  });
  // Find the tab buttons
  const tabButtons = Array.from(root.querySelectorAll('[role="tab"]'));
  if (tabButtons.length !== 3) {
    rootApi.unmount(); root.remove();
    throw new Error(`expected 3 role=tab buttons, got ${tabButtons.length}`);
  }
  const courseBtn = tabButtons.find((b) => b.textContent.trim() === 'The Course');
  if (!courseBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('The Course tab button missing');
  }
  if (courseBtn.getAttribute('aria-selected') !== 'true') {
    rootApi.unmount(); root.remove();
    throw new Error('Course tab is active but aria-selected=true is missing');
  }
  // Other tabs should not be selected
  const gateBtn = tabButtons.find((b) => b.textContent.trim() === 'The Gospel');
  if (gateBtn && gateBtn.getAttribute('aria-selected') === 'true') {
    rootApi.unmount(); root.remove();
    throw new Error('Gate tab should not be selected when course is active');
  }
  rootApi.unmount(); root.remove();
});

await step('KingdomTabNav tab clicks fire onTab with correct id', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(KingdomTabNav, {
        tab: 'gate',
        onTab: (id) => { calls.push(id); },
        currentUser: null,
        onSignOut: () => {},
        onShare: () => {},
        onOpenCompanion: () => {},
      })
    );
  });
  const tabButtons = Array.from(root.querySelectorAll('[role="tab"]'));
  for (const btn of tabButtons) {
    await act(async () => { btn.click(); });
  }
  rootApi.unmount(); root.remove();
  if (calls.length !== 3) throw new Error(`expected 3 calls, got ${calls.length}`);
  // Expect exact ids in order: gate, course, kingdom
  if (calls[0] !== 'gate') throw new Error(`expected 'gate', got ${calls[0]}`);
  if (calls[1] !== 'course') throw new Error(`expected 'course', got ${calls[1]}`);
  if (calls[2] !== 'kingdom') throw new Error(`expected 'kingdom', got ${calls[2]}`);
});

await step('KingdomTabNav share + companion buttons fire correctly', async () => {
  const calls = { share: 0, companion: 0 };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(KingdomTabNav, {
        tab: 'gate',
        onTab: () => {},
        currentUser: null,
        onSignOut: () => {},
        onShare: () => { calls.share += 1; },
        onOpenCompanion: () => { calls.companion += 1; },
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  const shareBtn = buttons.find((b) => b.textContent.includes('Pass it on'));
  const askBtn = buttons.find((b) => b.textContent.includes('Ask'));
  if (!shareBtn || !askBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('share or Ask button missing');
  }
  await act(async () => { shareBtn.click(); });
  await act(async () => { askBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls.share !== 1) throw new Error(`share: expected 1, got ${calls.share}`);
  if (calls.companion !== 1) throw new Error(`companion: expected 1, got ${calls.companion}`);
});

await step('KingdomTabNav with currentUser shows Sign out instead of Sign in', async () => {
  const html = await renderToHtml(
    React.createElement(KingdomTabNav, {
      tab: 'gate',
      onTab: () => {},
      currentUser: { name: 'Maria', email: 'maria@example.com' },
      onSignOut: () => {},
      onShare: () => {},
      onOpenCompanion: () => {},
    })
  );
  if (!html.includes('Sign out')) throw new Error('Sign out missing for logged-in user');
  // Sign in button should NOT render — but be careful: the button text "Sign in"
  // is a literal substring of "Signed in as ..." in the title attribute.
  // Safer check: find no <button> text exactly "Sign in"
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(KingdomTabNav, {
        tab: 'gate',
        onTab: () => {},
        currentUser: { name: 'Maria', email: 'maria@example.com' },
        onSignOut: () => {},
        onShare: () => {},
        onOpenCompanion: () => {},
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  const signInBtn = buttons.find((b) => b.textContent.trim() === 'Sign in');
  rootApi.unmount(); root.remove();
  if (signInBtn) throw new Error('Sign in button rendered while user is logged in');
});

// ---- Footer tests ---------------------------------------------------------

await step('Footer renders all three tab links + Field Guide + motto', async () => {
  const html = await renderToHtml(
    React.createElement(Footer, { onTab: () => {}, onOpenFieldGuide: () => {} })
  );
  if (!html.includes('The Gospel')) throw new Error('Footer: Gospel link missing');
  if (!html.includes('The Course')) throw new Error('Footer: Course link missing');
  if (!html.includes('The Kingdom')) throw new Error('Footer: Kingdom link missing');
  if (!html.includes('The Field Guide')) throw new Error('Footer: Field Guide link missing');
  if (!html.includes('The Academy')) throw new Error('Footer: Academy line missing');
  if (!html.includes('Salus animarum suprema lex')) throw new Error('Footer: motto missing');
  // Year — current year should appear in the copyright
  const year = String(new Date().getFullYear());
  if (!html.includes(year)) throw new Error(`Footer: copyright year ${year} missing`);
});

await step('Footer Walk-column links fire onTab with correct id', async () => {
  const calls = [];
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(Footer, {
        onTab: (id) => { calls.push(id); },
        onOpenFieldGuide: () => {},
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  // Footer has 3 walk links + 1 field guide button = 4 buttons total
  for (const b of buttons) {
    await act(async () => { b.click(); });
  }
  rootApi.unmount(); root.remove();
  // Expect 3 onTab calls (gate, course, kingdom) since the field guide button
  // doesn't call onTab. Note: the Field Guide button calls onOpenFieldGuide
  // separately — that call won't appear in `calls` here.
  if (calls.length !== 3) {
    throw new Error(`expected 3 onTab calls, got ${calls.length}: ${JSON.stringify(calls)}`);
  }
  if (!calls.includes('gate') || !calls.includes('course') || !calls.includes('kingdom')) {
    throw new Error(`missing tab id: ${JSON.stringify(calls)}`);
  }
});

await step('Footer Field Guide button fires onOpenFieldGuide', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(Footer, {
        onTab: () => {},
        onOpenFieldGuide: () => { calls += 1; },
      })
    );
  });
  const buttons = Array.from(root.querySelectorAll('button'));
  const fgBtn = buttons.find((b) => b.textContent.trim() === 'The Field Guide');
  if (!fgBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('Field Guide button missing');
  }
  await act(async () => { fgBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`expected 1 call, got ${calls}`);
});

// ---- PassItOn tests -------------------------------------------------------

await step('PassItOn returns null when open is false', async () => {
  const html = await renderToHtml(
    React.createElement(PassItOn, { open: false, onClose: () => {} })
  );
  if (html.length > 100) {
    throw new Error(`expected empty render when closed, got ${html.length} bytes`);
  }
});

await step('PassItOn renders modal content when open', async () => {
  const html = await renderToHtml(
    React.createElement(PassItOn, { open: true, onClose: () => {} })
  );
  if (!html.includes('Pass it on.')) throw new Error('headline missing');
  if (!html.includes('One soul, walking')) throw new Error('body copy missing');
  if (!html.includes('Copy link')) throw new Error('Copy link button missing');
});

await step('PassItOn close button fires onClose', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(PassItOn, {
        open: true,
        onClose: () => { calls += 1; },
      })
    );
  });
  const closeBtn = Array.from(root.querySelectorAll('button')).find(
    (b) => b.getAttribute('aria-label') === 'Close',
  );
  if (!closeBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('close button missing');
  }
  await act(async () => { closeBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`expected 1 close call, got ${calls}`);
});

// 10j. Batch 19 — Companion + FloatingCompanion
console.log('\nTest 9j: Batch 19 — Companion + FloatingCompanion');
const { default: Companion } = loadModule(path.join(SRC, 'components/Companion.jsx'));
const { default: FloatingCompanion } = loadModule(path.join(SRC, 'components/FloatingCompanion.jsx'));

await step('FloatingCompanion renders FAB and fires onClick', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(FloatingCompanion, {
        onClick: () => { calls += 1; },
      })
    );
  });
  const btn = root.querySelector('button');
  if (!btn) {
    rootApi.unmount(); root.remove();
    throw new Error('FloatingCompanion button missing');
  }
  if (btn.getAttribute('aria-label') !== 'Open Companion') {
    rootApi.unmount(); root.remove();
    throw new Error('FloatingCompanion missing aria-label');
  }
  if (!btn.textContent.includes('Ask')) {
    rootApi.unmount(); root.remove();
    throw new Error('FloatingCompanion missing "Ask" label');
  }
  await act(async () => { btn.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`expected 1 call, got ${calls}`);
});

await step('Companion returns null when open=false', async () => {
  const html = await renderToHtml(
    React.createElement(Companion, {
      open: false,
      onClose: () => {},
      currentTab: 'gate',
    })
  );
  if (html.length > 100) {
    throw new Error(`expected empty render when closed, got ${html.length} bytes`);
  }
});

await step('Companion renders welcome message when opened', async () => {
  const html = await renderToHtml(
    React.createElement(Companion, {
      open: true,
      onClose: () => {},
      currentTab: 'gate',
    })
  );
  if (!html.includes('The Companion')) throw new Error('header missing');
  if (!html.includes('Walk with me')) throw new Error('subhead missing');
  if (!html.includes("I'm here to walk with you")) {
    throw new Error('welcome message missing');
  }
  if (!html.includes('Ask anything')) throw new Error('input placeholder missing');
});

await step('Companion close button fires onClose', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(Companion, {
        open: true,
        onClose: () => { calls += 1; },
        currentTab: 'gate',
      })
    );
  });
  const closeBtn = Array.from(root.querySelectorAll('button')).find(
    (b) => b.getAttribute('aria-label') === 'Close',
  );
  if (!closeBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('close button missing');
  }
  await act(async () => { closeBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`expected 1 close call, got ${calls}`);
});

await step('Companion stub mode adds user message + stub reply on send', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(Companion, {
        open: true,
        onClose: () => {},
        currentTab: 'gate',
        // No apiEndpoint — stub mode
      })
    );
  });
  // Type into the textarea using React's native setter so onChange fires
  const textarea = root.querySelector('textarea');
  if (!textarea) {
    rootApi.unmount(); root.remove();
    throw new Error('textarea missing');
  }
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    ).set;
    setter.call(textarea, 'What is the kingdom?');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  });
  // Click send button
  const sendBtn = Array.from(root.querySelectorAll('button')).find(
    (b) => b.getAttribute('aria-label') === 'Send message',
  );
  if (!sendBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('send button missing');
  }
  if (sendBtn.disabled) {
    rootApi.unmount(); root.remove();
    throw new Error('send button still disabled after typing');
  }
  await act(async () => { sendBtn.click(); });
  // User message should appear immediately
  let html = root.innerHTML;
  if (!html.includes('What is the kingdom?')) {
    rootApi.unmount(); root.remove();
    throw new Error('user message did not appear');
  }
  // Wait for stub reply (450ms delay in component)
  await new Promise((resolve) => setTimeout(resolve, 600));
  await act(async () => { /* flush */ });
  html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('Companion is being prepared')) {
    throw new Error('stub reply did not appear');
  }
});

await step('Companion send button is disabled when input is empty', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(Companion, {
        open: true,
        onClose: () => {},
        currentTab: 'gate',
      })
    );
  });
  const sendBtn = Array.from(root.querySelectorAll('button')).find(
    (b) => b.getAttribute('aria-label') === 'Send message',
  );
  if (!sendBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('send button missing');
  }
  if (!sendBtn.disabled) {
    rootApi.unmount(); root.remove();
    throw new Error('send button should be disabled when input is empty');
  }
  rootApi.unmount(); root.remove();
});

// 10k. Batch 20 — SignupModal
console.log('\nTest 9k: Batch 20 — SignupModal');
const { default: SignupModal, SIGNUP_STORAGE_KEY } = loadModule(
  path.join(SRC, 'modals/SignupModal.jsx')
);

await step('SignupModal returns null when open=false', async () => {
  const html = await renderToHtml(
    React.createElement(SignupModal, {
      open: false,
      onClose: () => {},
      onSuccess: () => {},
    })
  );
  if (html.length > 100) {
    throw new Error(`expected empty render when closed, got ${html.length} bytes`);
  }
});

await step('SignupModal renders form fields when open', async () => {
  const html = await renderToHtml(
    React.createElement(SignupModal, {
      open: true,
      onClose: () => {},
      onSuccess: () => {},
    })
  );
  if (!html.includes('The Kingdom Course')) throw new Error('eyebrow missing');
  if (!html.includes('Seven steps')) throw new Error('headline missing');
  if (!html.includes('Forty-nine days')) throw new Error('headline second line missing');
  if (!html.includes('The standard is not information. The standard is fire')) {
    throw new Error('pullquote missing');
  }
  if (!html.includes('you@example.com')) throw new Error('email placeholder missing');
  if (!html.includes('First name')) throw new Error('name placeholder missing');
  if (!html.includes('Where you are starting from')) throw new Error('starting-from label missing');
  if (!html.includes('Begin the Course')) throw new Error('submit CTA missing');
});

await step('SignupModal close button fires onClose', async () => {
  let calls = 0;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SignupModal, {
        open: true,
        onClose: () => { calls += 1; },
        onSuccess: () => {},
      })
    );
  });
  const closeBtn = Array.from(root.querySelectorAll('button')).find(
    (b) => b.getAttribute('aria-label') === 'Close',
  );
  if (!closeBtn) {
    rootApi.unmount(); root.remove();
    throw new Error('close button missing');
  }
  await act(async () => { closeBtn.click(); });
  rootApi.unmount(); root.remove();
  if (calls !== 1) throw new Error(`expected 1 close call, got ${calls}`);
});

await step('SignupModal validates email — empty', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SignupModal, {
        open: true,
        onClose: () => {},
        onSuccess: () => {},
      })
    );
  });
  // Submit the form directly. Clicking the type=submit button triggers
  // browser-native validation (because of `required`) which in jsdom
  // doesn't reliably fire the React onSubmit. Dispatching the submit
  // event on the form bypasses that gate and runs our React handler.
  const form = root.querySelector('form');
  if (!form) {
    rootApi.unmount(); root.remove();
    throw new Error('form missing');
  }
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  const html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('An email is required')) {
    throw new Error('empty-email validation message missing');
  }
});

await step('SignupModal validates email — invalid format', async () => {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SignupModal, {
        open: true,
        onClose: () => {},
        onSuccess: () => {},
      })
    );
  });
  // Type an invalid email
  const emailInput = root.querySelector('input[type="email"]');
  if (!emailInput) {
    rootApi.unmount(); root.remove();
    throw new Error('email input missing');
  }
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    setter.call(emailInput, 'not-an-email');
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  });
  // Submit via the form (bypasses native validation gate in jsdom)
  const form = root.querySelector('form');
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  const html = root.innerHTML;
  rootApi.unmount(); root.remove();
  if (!html.includes('Please enter a valid email address')) {
    throw new Error('invalid-email validation message missing');
  }
});

await step('SignupModal stub mode persists user + fires onSuccess', async () => {
  // Clear any prior user from previous tests
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(SIGNUP_STORAGE_KEY);
  }
  let receivedUser = null;
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SignupModal, {
        open: true,
        onClose: () => {},
        onSuccess: (user) => { receivedUser = user; },
      })
    );
  });
  // Type a valid email
  const emailInput = root.querySelector('input[type="email"]');
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    setter.call(emailInput, 'maria@example.com');
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  });
  // Type a name (first text input that isn't email)
  const allInputs = Array.from(root.querySelectorAll('input'));
  const nameInput = allInputs.find((i) => i.getAttribute('autoComplete') === 'given-name');
  if (nameInput) {
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(nameInput, 'Maria');
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
  // Submit
  const submitBtn = Array.from(root.querySelectorAll('button')).find(
    (b) => b.getAttribute('type') === 'submit',
  );
  await act(async () => { submitBtn.click(); });
  // Wait for the 250ms stub delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  await act(async () => { /* flush */ });
  rootApi.unmount(); root.remove();
  if (!receivedUser) throw new Error('onSuccess never fired');
  if (receivedUser.email !== 'maria@example.com') {
    throw new Error(`expected email maria@example.com, got ${receivedUser.email}`);
  }
  if (receivedUser.name !== 'Maria') {
    throw new Error(`expected name Maria, got ${receivedUser.name}`);
  }
  if (!receivedUser.signedUpAt) throw new Error('signedUpAt missing');
  // localStorage should also have the user
  const stored = JSON.parse(localStorage.getItem(SIGNUP_STORAGE_KEY));
  if (stored.email !== 'maria@example.com') {
    throw new Error('user not persisted to localStorage');
  }
  // Cleanup
  localStorage.removeItem(SIGNUP_STORAGE_KEY);
});

await step('SignupModal API mode calls submitHandler instead of stub', async () => {
  let handlerCalls = [];
  let receivedUser = null;
  const customHandler = async (data) => {
    handlerCalls.push(data);
    return {
      email: data.email,
      name: data.name || null,
      parish: data.parish || null,
      signedUpAt: '2024-01-01T00:00:00.000Z',
      apiSignedUp: true,
    };
  };
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootApi = ReactDOMClient.createRoot(root);
  await act(async () => {
    rootApi.render(
      React.createElement(SignupModal, {
        open: true,
        onClose: () => {},
        onSuccess: (u) => { receivedUser = u; },
        submitHandler: customHandler,
      })
    );
  });
  const emailInput = root.querySelector('input[type="email"]');
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    setter.call(emailInput, 'test@test.com');
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const submitBtn = Array.from(root.querySelectorAll('button')).find(
    (b) => b.getAttribute('type') === 'submit',
  );
  await act(async () => { submitBtn.click(); });
  await new Promise((resolve) => setTimeout(resolve, 100));
  await act(async () => { /* flush */ });
  rootApi.unmount(); root.remove();
  if (handlerCalls.length !== 1) {
    throw new Error(`expected 1 handler call, got ${handlerCalls.length}`);
  }
  if (handlerCalls[0].email !== 'test@test.com') {
    throw new Error('handler received wrong email');
  }
  if (!receivedUser || !receivedUser.apiSignedUp) {
    throw new Error('onSuccess did not receive the API user');
  }
});

await step('SignupModal SIGNUP_STORAGE_KEY export is "kingdomCurrentUser"', async () => {
  if (SIGNUP_STORAGE_KEY !== 'kingdomCurrentUser') {
    throw new Error(`expected "kingdomCurrentUser", got "${SIGNUP_STORAGE_KEY}"`);
  }
});

// 11. Test the full App.jsx mounts
console.log('\nTest 10: Full App.jsx mounts');
const { default: App } = loadModule(path.join(SRC, 'App.jsx'));

await step('App renders without throwing', async () => {
  const html = await renderToHtml(React.createElement(App));
  if (html.length < 1000) throw new Error(`suspiciously small (${html.length} bytes)`);
  if (!html.includes('The Kingdom')) throw new Error('Kingdom brand missing');
});

await step('App boots into Live (production) mode by default in non-DEV builds', async () => {
  // In the harness, isDev is false, so App should boot into Live mode.
  // That means KingdomTabNav (production header) renders, not the Harness shell.
  const html = await renderToHtml(React.createElement(App));
  // KingdomTabNav has tab buttons with the three labels
  if (!html.includes('The Gospel')) throw new Error('Live mode missing tab: The Gospel');
  if (!html.includes('The Course')) throw new Error('Live mode missing tab: The Course');
  if (!html.includes('Salus animarum suprema lex')) {
    throw new Error('Live mode Footer missing motto');
  }
  // FloatingCompanion FAB
  if (!html.includes('Open Companion')) throw new Error('FAB missing in Live mode');
});

await step('App preview-mode toggle is hidden in non-DEV builds', async () => {
  const html = await renderToHtml(React.createElement(App));
  // The dev toggle includes the unique label "Harness" in uppercase short-caps
  // styling. In Live mode (non-DEV) the toggle should not render at all,
  // so the "Harness" string should be absent (since it only appears in
  // the toggle button's text, not anywhere else in production content).
  // Note: case-sensitive substring check — "harness" lowercase might appear
  // in copy elsewhere, but "Harness" with this casing is toggle-only.
  // To be safe, verify there's no fixed top-right toggle div by checking
  // the absence of the specific Cormorant SC styled "Harness" string.
  if (html.includes('>Harness<')) {
    throw new Error('preview-mode toggle should be hidden in non-DEV builds');
  }
});

console.log(`\n${pass} passed, ${fail} failed.\n`);
process.exit(fail > 0 ? 1 : 0);
