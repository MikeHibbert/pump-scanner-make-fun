// tests/render-gate.test.mjs - the regression test for the `renders` row of the artifact gate.
//
// WHY (work_7dfd321917, Lesson 16, docs/kindling-training-lessons.md; token-radar-01 release,
// 25 Nov 2026): the artifact gate passed 7/7 while the dashboard painted nothing. reviewHours was a
// const called by farmSteps inside the rows.map - a temporal-dead-zone throw before first paint - and
// the only witness was a screenshot collapsing 347,462 -> 105,432 bytes. tools/render-check.mjs is
// the row that would have caught it. This file is the test that keeps that row honest, because a
// witness nobody tests is a witness that quietly rots.
//
// The property under test is NON-CIRCULARITY. Two earlier versions of the row were measured failing:
//   (a) no expectation at all - "at least one row painted" - which a blank dashboard satisfies;
//   (b) the expectation read back out of out/board.json - which only proves the JSON parses, and
//       which cannot fail in the direction that matters when the page and the JSON disagree.
// The corrected oracle is the board the program wrote (out/board.json), compared for EQUALITY against
// the tbody row count the page actually painted, plus a --board injection path that proves the row
// can fail when the board is empty.
//
// Run with the node built-in runner (node22; this entry has no package.json and no node_modules):
//   node --test tests/render-gate.test.mjs
//
// The browser cases need python3 + Playwright/Chromium. When the browser cannot launch the helper
// exits 2 and the case is reported as SKIPPED with a named reason - never as a silent pass, and
// never as a green tick over an unproven assertion.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENTRY = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RENDER_CHECK = join(ENTRY, 'tools', 'render-check.mjs');
const RENDER_HELPER = join(ENTRY, 'tools', 'render-check.py');
const OUT = join(ENTRY, 'out');

/** Run tools/render-check.mjs against an out directory and return { status, verdict, stderr }. */
function runRenderCheck(outDir, extraArgs = []) {
  const run = spawnSync('node', [RENDER_CHECK, '--out', outDir, ...extraArgs], {
    encoding: 'utf8',
    timeout: 90_000,
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || '/root/.cache/ms-playwright',
    },
  });
  let verdict = null;
  const lastLine = (run.stdout || '').trim().split('\n').pop();
  try {
    verdict = JSON.parse(lastLine);
  } catch {
    verdict = null;
  }
  return { status: run.status, verdict, stderr: (run.stderr || '').trim() };
}

/** True when the render helper could not launch a browser at all, i.e. the case is unprovable here. */
function browserUnavailable(result) {
  if (!result.verdict) return true;
  return (result.verdict.failures || []).some((f) => f.code === 'render-unavailable');
}

/** A throwaway copy of out/ so a case can mutate the page or the board without touching the build. */
function scratchOut() {
  const dir = mkdtempSync(join(tmpdir(), 'render-gate-'));
  cpSync(OUT, dir, { recursive: true });
  return dir;
}

const HAVE_OUT = existsSync(join(OUT, 'dashboard', 'index.html')) && existsSync(join(OUT, 'board.json'));

// ---------------------------------------------------------------------------------------------
// Case 1 - the healthy build PASSES, and the expectation is the board the program wrote.
// ---------------------------------------------------------------------------------------------
test('healthy out/ passes the renders row with rows_painted equal to rows_expected', (t) => {
  if (!HAVE_OUT) return t.skip('no out/ build in this checkout - run the build first');
  const result = runRenderCheck(OUT);
  if (browserUnavailable(result)) {
    return t.skip(`browser unavailable: ${result.stderr || 'render helper could not launch'}`);
  }
  assert.equal(result.status, 0, `renders row failed on a healthy build: ${JSON.stringify(result.verdict?.failures)}`);
  assert.equal(result.verdict.ok, true);
  assert.ok(result.verdict.rows_expected > 0, 'the healthy board should have rows');
  assert.equal(
    result.verdict.rows_painted,
    result.verdict.rows_expected,
    'painted rows must equal the expected rows exactly, not merely be non-zero',
  );
});

// ---------------------------------------------------------------------------------------------
// Case 2 - the blank-board direction: a rows: [] board must FAIL the row.
//
// This is the case that kills version (a) ("at least one row"). The page's own app.js runs
// unmodified against an injected empty board; it must paint zero rows and show its empty state, and
// the row must then fail on the row-count assertion because the expectation is the real board.
// ---------------------------------------------------------------------------------------------
test('a blank board injected into the page makes the renders row FAIL (not pass on "at least one row")', (t) => {
  if (!HAVE_OUT) return t.skip('no out/ build in this checkout - run the build first');
  const dir = scratchOut();
  try {
    const blankBoard = join(dir, 'blank-board.json');
    writeFileSync(blankBoard, JSON.stringify({ rows: [] }), 'utf8');
    const result = runRenderCheck(dir, ['--board', blankBoard]);
    if (browserUnavailable(result)) {
      return t.skip(`browser unavailable: ${result.stderr || 'render helper could not launch'}`);
    }
    assert.equal(result.status, 1, 'a blank board must not pass the renders row');
    assert.equal(result.verdict.ok, false);
    assert.equal(result.verdict.rows_painted, 0, 'the page must paint no rows for an empty board');
    assert.equal(result.verdict.empty_state_present, true, 'the page must show its empty state for an empty board');
    const codes = (result.verdict.failures || []).map((f) => f.code);
    assert.ok(
      codes.includes('row-count'),
      `expected a named row-count failure, got ${JSON.stringify(codes)}`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------------------------
// Case 3 - the TDZ shape: a page that throws before first paint must FAIL with a named reason.
//
// The original incident was a temporal-dead-zone throw inside the rows.map. A byte count cannot see
// that; a page_error can. The scratch copy's app.js is replaced with a script that throws before it
// paints anything, which is the exact shape of the failure that shipped.
// ---------------------------------------------------------------------------------------------
test('a dashboard that throws before first paint FAILS with a named page-error, not a byte count', (t) => {
  if (!HAVE_OUT) return t.skip('no out/ build in this checkout - run the build first');
  const dir = scratchOut();
  try {
    const appPath = join(dir, 'dashboard', 'app.js');
    writeFileSync(
      appPath,
      '// TDZ shape (work_7dfd321917): read a const before its declaration, then never paint.\n' +
        'const rows = farmSteps();\n' +
        'function farmSteps() { return reviewHours; }\n' +
        'const reviewHours = 1;\n' +
        'document.querySelector("main#board table tbody").innerHTML = rows.map(() => "").join("");\n',
      'utf8',
    );
    const result = runRenderCheck(dir);
    if (browserUnavailable(result)) {
      return t.skip(`browser unavailable: ${result.stderr || 'render helper could not launch'}`);
    }
    assert.equal(result.status, 1, 'a page that throws before paint must not pass the renders row');
    assert.equal(result.verdict.ok, false);
    const codes = (result.verdict.failures || []).map((f) => f.code);
    assert.ok(codes.includes('page-error'), `expected a named page-error failure, got ${JSON.stringify(codes)}`);
    assert.ok(
      codes.includes('row-count'),
      `a page that painted nothing must also fail row-count, got ${JSON.stringify(codes)}`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------------------------
// Case 4 - the static guard: the row must keep its equality oracle and its blank-board path.
//
// Version (a) was "at least one row"; version (b) was "the JSON parses". Both are cheap to
// reintroduce by accident, so the source is asserted to keep the two properties that make the row
// able to fail: an equality comparison against the expected count, and the --board injection path.
// ---------------------------------------------------------------------------------------------
test('the renders row keeps an equality oracle and the --board injection path', () => {
  const source = readFileSync(RENDER_CHECK, 'utf8');
  assert.ok(
    /rows_painted\s*!==\s*expected/.test(source),
    'the row must compare painted rows to the expected count for EQUALITY, not "at least one"',
  );
  assert.ok(
    /--board/.test(source),
    'the helper must still accept --board so the blank-board direction is provable',
  );
  assert.ok(
    /'page-error'/.test(source),
    'the row must still name a page-error failure, so a throw before paint cannot pass on a byte count',
  );
  assert.ok(
    /'render-unavailable'/.test(source),
    'the row must still fail closed with render-unavailable when the browser cannot launch',
  );
  assert.ok(
    existsSync(RENDER_HELPER),
    'the browser helper must travel with the gate (tools/render-check.py), not live under out/',
  );
});

// ---------------------------------------------------------------------------------------------
// Case 5 - the helper's exit contract, read from its own source.
//
// The gate distinguishes "the page threw" from "the browser would not start" by exit code alone:
// exit 2 means the browser could not launch, exit 0 means a verdict was produced (even a failing
// one). If that contract drifts, a broken browser would be reported as a broken page and the
// render-unavailable skip path in cases 1-3 would silently stop working.
// ---------------------------------------------------------------------------------------------
test('the helper reserves exit 2 for a browser that cannot launch and exits 0 for a page that throws', () => {
  const source = readFileSync(RENDER_HELPER, 'utf8');
  assert.ok(
    /return 2/.test(source),
    'the helper must return 2 when the browser cannot launch',
  );
  assert.ok(
    /return 0/.test(source),
    'the helper must return 0 after printing a verdict, even when the page threw',
  );
  assert.ok(
    /page_error/.test(source),
    'the helper must report page_error so a throw before paint is a named result',
  );
});
