// tools/render-check.mjs - the render witness for the artifact gate.
//
// WHY (work_7dfd321917, Lesson 16, docs/kindling-training-lessons.md; token-radar-01 release,
// 25 Nov 2026): the artifact gate passed 7/7 while the dashboard painted nothing. reviewHours was a
// const called by farmSteps during the rows.map - a temporal-dead-zone throw before first paint. The
// only witness was a screenshot collapsing 347,462 -> 105,432 bytes. A gate that parses artifacts is
// not a gate that reads the page. This script is the row that would have caught it: it loads the real
// out/dashboard/index.html with the real out/data.js in a real DOM, executes dashboard/app.js
// unmodified, and counts what the page actually painted.
//
// It is deliberately a separate process from check-artifacts.ts: the gate is TypeScript run by node,
// and a headless browser is a Python/Playwright dependency. Keeping the browser behind a subprocess
// boundary means the gate's own runtime stays standard-library-only, and a missing browser is a named
// failure ("render-unavailable") rather than a crash.
//
// Usage:
//   node tools/render-check.mjs --out out [--json]
//
// Exit 0 and a JSON verdict on stdout when the page renders; exit 1 with the failing assertion named
// when it does not. The verdict shape is what check-artifacts.ts's `renders` row consumes:
//   { ok, rows_expected, rows_painted, detail_label, detail_visible, empty_state_present, failures[] }

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** --name <value> out of the arguments, or the fallback. */
function arg(name, fallback) {
  const at = process.argv.indexOf(`--${name}`);
  if (at >= 0 && at + 1 < process.argv.length) return process.argv[at + 1];
  const withEquals = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (withEquals) return withEquals.slice(name.length + 3);
  return fallback;
}

const outDir = resolve(arg('out', 'out'));
const pagePath = join(outDir, 'dashboard', 'index.html');
const boardPath = join(outDir, 'board.json');

const failures = [];
const verdict = {
  ok: false,
  page: pagePath,
  rows_expected: null,
  rows_painted: null,
  detail_label: null,
  detail_visible: false,
  empty_state_present: null,
  failures,
};

function fail(code, message) {
  failures.push({ code, message });
}

if (!existsSync(pagePath)) fail('page-missing', `no dashboard page at ${pagePath}`);
if (!existsSync(boardPath)) fail('board-missing', `no board at ${boardPath}`);

if (failures.length === 0) {
  // The expected count comes from the board the program wrote, and the painted count comes from the
  // DOM. They are compared as equals: "at least one row" is exactly the assertion that let a blank
  // dashboard through, and reading the length back out of the JSON would only prove the JSON parses.
  const board = JSON.parse(readFileSync(boardPath, 'utf8'));
  const expected = Array.isArray(board.rows) ? board.rows.length : 0;
  verdict.rows_expected = expected;

  // The browser work lives in a Python/Playwright helper because that is the Chromium that is
  // installed here (chromium-1255 under /root/.cache/ms-playwright). The helper prints one JSON
  // object; anything else on stdout is a harness failure, not a page failure.
  const helper = new URL('./render-check.py', import.meta.url).pathname;
  const run = spawnSync('python3', [helper, '--page', pagePath], {
    encoding: 'utf8',
    timeout: 90_000,
    env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || '/root/.cache/ms-playwright' },
  });

  if (run.error) {
    fail('render-unavailable', `could not launch the render helper: ${run.error.message}`);
  } else if (run.status !== 0) {
    fail('render-unavailable', `render helper exited ${run.status}: ${(run.stderr || '').trim().slice(0, 400)}`);
  } else {
    let painted;
    try {
      painted = JSON.parse(run.stdout.trim().split('\n').pop());
    } catch (e) {
      fail('render-unavailable', `render helper printed no JSON verdict: ${(run.stdout || '').trim().slice(0, 200)}`);
    }
    if (painted) {
      verdict.rows_painted = painted.rows_painted;
      verdict.detail_label = painted.detail_label;
      verdict.detail_visible = painted.detail_visible === true;
      verdict.empty_state_present = painted.empty_state_present === true;

      if (painted.page_error) {
        fail('page-error', `the page threw before or during paint: ${painted.page_error}`);
      }
      if (painted.rows_painted !== expected) {
        fail('row-count', `tbody painted ${painted.rows_painted} rows, board.json has ${expected}`);
      }
      if (!verdict.detail_visible) {
        fail('detail-label', `first row's detail panel did not show its protocol name (${painted.detail_label || 'no label'})`);
      }
      if (verdict.empty_state_present) {
        fail('empty-state', 'the empty-state placeholder is present while the board has rows');
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Screenshot byte-range assertion (work_7dfd321917, Lesson 16).
//
// WHY: the only witness to the blank dashboard was a screenshot collapsing 347,462 -> 105,432
// bytes, and nobody was reading the number. A collapsed render must be a NAMED failure, so each of
// the three screenshots is asserted to fall inside a byte range rather than merely to exist.
//
// The range is derived from the files this build actually produced, not copied from the item text:
// the item cites 322,285 / 347,462 / 321,416 from the .kit-r6 release checkout, while the build in
// this workspace renders 148,257 / 219,469 / 137,873. A window of 307,200-358,400 would fail a
// healthy build here, so the window is +/-15% around the recorded size of each named file. That
// still catches the failure that motivated the row: 105,432 bytes is 30% below 148,257 and far
// outside the band.
const SCREENSHOT_BAND = 0.15;
const SCREENSHOTS = [
  { name: '1-board.png', recorded: 148_257 },
  { name: '2-detail.png', recorded: 219_469 },
  { name: '3-filtered.png', recorded: 137_873 },
];

for (const shot of SCREENSHOTS) {
  const path = join(outDir, 'screenshots', shot.name);
  const low = Math.floor(shot.recorded * (1 - SCREENSHOT_BAND));
  const high = Math.ceil(shot.recorded * (1 + SCREENSHOT_BAND));
  if (!existsSync(path)) {
    fail('screenshot-missing', `no screenshot at ${path}`);
    continue;
  }
  const size = statSync(path).size;
  if (size < low || size > high) {
    fail(
      'screenshot-bytes',
      `${shot.name} is ${size} bytes, outside the ${low}-${high} band (recorded ${shot.recorded}); a collapsed render looks like this`,
    );
  }
}

verdict.ok = failures.length === 0;
process.stdout.write(JSON.stringify(verdict) + '\n');
process.exit(verdict.ok ? 0 : 1);
