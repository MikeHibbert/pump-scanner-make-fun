# Landing evidence — slice 2/2 (work_647d5c582d-s2)

Read live in the land stage, 2026-11-25, in `entries/token-radar-01`. This file records what was
**observed**, not what was remembered. The verify stage's receipts are cited, not re-run — the 450s land
watchdog has been burned twice by re-verification (pass-5, work_5194d0ef53).

## 1. The change is present in the live working tree

```
$ grep -n "MODEL_VERSION" lib/model.ts
90:export const MODEL_VERSION = 'radar-2';
```

The breadth constants are in `MODEL` (`ModelConstants`), never bare literals:

```
$ grep -n "breadth_" lib/model.ts
64:  breadth_weight: number;
65:  breadth_floor: number;
66:  breadth_cap: number;
68:  breadth_full_chains: number;
83:  breadth_weight: 0.15,
84:  breadth_floor: 0.9,
85:  breadth_cap: 1.1,
86:  breadth_full_chains: 4,
```

The WHY-comment citing this item is in place at line 80:
`// WHY (work_647d5c582d-s2): breadth is a tie-breaker, not a driver.`

## 2. The landing check — behaviour observably changed

The item's landing check is that the radar's ranking behaviour changed. It did, and it is visible in the
produced board:

```
$ MAKEFUN_INPUT_DIR=./input MAKEFUN_OUTPUT_DIR=./out node main.ts
rows 200
$ node -e "…"
rows 200
top steakhouse-financial 597999688 1.1
last vault-street 1043835
distinct breadth multipliers 0.925,1,1.075,1.1
```

**Observed landing evidence:** the board carries a `model.breadth_multiplier` field that did not exist
under `radar-1`, and it takes **four distinct values** across the 200 rows (0.925, 1, 1.075, 1.1) — so
breadth is actually discriminating between rows rather than being a constant. The top row sits at the cap
(1.1) and the board still spans $598M down to $1.04M, so the value ranking still leads and breadth only
reorders near-ties. That is the behaviour the change was made to produce.

## 3. The verify result, citing stage 2's receipts

Stage 2 re-read the kit tally live and recorded it in `docs/kit-check-work_647d5c582d-s2.md` and
`docs/verify-work_647d5c582d-s2.md`:

**11 pass, 7 skip, 2 FAIL.**

The two failures are `thinking_reproduces` (0 of 337,102 counted lines trace to the session) and
`thinking_revised`. Both are a property of the handed-over chat-log session — 21 messages, 0 tool results —
so no file appears as the call that wrote it. They cannot be cleared by any edit in this repository; the
remedy is a recorded client session, which is a Father decision. This stage does not re-run the kit.

## 4. The precondition, named plainly

**`No wallet on the account` still fails.** `repo_owner` wants `.makefun/owner.json` naming a Solana
wallet, and `thinking_committed` wants the entry message signed over the bundle. Both need a keypair only
Father can supply. **No entry of ours can be accepted until Father links a wallet.**

## 5. The Father gates — none crossed

1. Public repository — not created.
2. Wallet link — not made.
3. Entry signature — not made.
4. Submission POST — not sent.

## 6. What remains

- `transcripts.tar.gz` must be rebuilt **after** the final commit so `manifest.repo.commit` equals the
  submitted 40-character `commit_sha`. The gap slice 1 recorded (`c93a4f4` vs `102b3bb`) is still open and
  is a submission-time step, not a build step.
- The two `thinking_*` failures need a recorded client session (Father decision).
- The wallet link (Father gate) blocks acceptance of any entry.

## 7. Stage 3 (land) — live confirmation, 2026-11-26

Read live in this stage, in `entries/token-radar-01`, not from memory:

```
$ grep -n "MODEL_VERSION" lib/model.ts
90:export const MODEL_VERSION = 'radar-2';
$ grep -c "breadth" lib/model.ts
34
$ ls -la transcripts.tar.gz
-rw-r--r-- 1 root root 7806 Nov 25 16:51 transcripts.tar.gz
$ git status --porcelain
 M tools/render-check.mjs
 M tools/render-check.py
```

So the slice-2 model change is present in the live working tree (`radar-2` at line 90, 34 breadth
references), and the only uncommitted files are the two render-witness tools, which are committed in this
stage's checkpoint below.

**Verify result, citing stage 2's receipts (not re-run here).** Stage 2 re-read the kit tally live and
recorded **11 pass, 7 skip, 2 FAIL** in `docs/kit-check-work_647d5c582d-s2.md` and
`docs/verify-work_647d5c582d-s2.md`, at commit `07069b5`. This stage does not re-run the kit: the 450s
land watchdog has been burned twice by re-verification (pass-5, work_5194d0ef53).

**Landing evidence, stated explicitly.** The behaviour observably changed: the produced board carries
`model.breadth_multiplier`, which did not exist under `radar-1`, and it takes four distinct values across
the 200 rows (0.925, 1, 1.075, 1.1) — breadth discriminates rather than sitting constant, the top row sits
at the cap (1.1), and the board still spans $598M down to $1.04M.

**The precondition, named first as the item demands.** `No wallet on the account` still fails. No entry of
ours can be accepted until Father links a wallet. That is a Father gate, not a build defect.

**What remains.** `transcripts.tar.gz` must be rebuilt after the final commit so `manifest.repo.commit`
equals the submitted 40-character `commit_sha`; the two `thinking_*` failures need a recorded client
session (Father decision); the wallet link blocks acceptance. None of the four Father gates was crossed.

## 8. Stage 3 (land) — work_7dfd321917 render row, live confirmation, 2026-11-26

Read live in this stage, in `entries/token-radar-01`, not from memory.

**What was built.** `tools/render-check.mjs` (the artifact gate's render witness) now carries the row the
item asked for, and `tools/render-check.py` is the headless-Chromium helper that executes
`out/dashboard/app.js` unmodified:

1. loads `out/dashboard/index.html` in a real DOM (Playwright Chromium 1255, `/root/.cache/ms-playwright`);
2. asserts the painted `tbody` row count **equals** `board.rows.length` (not `>= 1`, not a number read back
   out of the JSON just written);
3. opens the first row's detail panel and asserts that row's protocol name is a visible label;
4. asserts the empty-state placeholder is **absent** when rows exist;
5. the screenshots row is a **range** assertion, not a byte window nobody reads.

**The proof obligation, both directions — observed in this stage:**

```
$ node tools/render-check.mjs --page out/dashboard/index.html
{"ok":true,"rows_expected":200,"rows_painted":200,"detail_label":"Steakhouse Financial",
 "detail_visible":true,"empty_state_present":false,"failures":[]}
PASS_EXIT=0

$ node tools/render-check.mjs --page out/dashboard/index.html --board <rows: [] board>
{"ok":false,"rows_expected":200,"rows_painted":0,"detail_label":null,"detail_visible":false,
 "empty_state_present":false,"failures":[
   {"code":"page-error","message":"the page threw before or during paint: Cannot read properties of undefined (reading 'base_multiple')"},
   {"code":"row-count","message":"tbody painted 0 rows, board.json has 200"},
   {"code":"detail-label","message":"first row's detail panel did not show its protocol name (no label)"}]}
BLANK_EXIT=1
```

**Observed landing evidence:** the row passes on the real `out/` (200 painted of 200 expected, detail label
`Steakhouse Financial` visible, empty-state absent) and **fails** on a blank board with its row-count
message — `tbody painted 0 rows, board.json has 200` — which is exactly the failure the 25 Nov release
needed and did not have. The `page-error` line is the temporal-dead-zone class of throw the item was filed
for, caught before first paint.

**One correction made in this stage, declared:** the first attempt injected the proof board through a
Playwright init script, which `data.js` overwrote before `app.js` read it — a `rows: []` board still painted
200 rows, so the row could not fail. The fix routes the `data.js` request instead, the one seam the page's
own scripts cannot undo. Committed as `169da24`.

**Verify result, citing stage 2's receipts (not re-run here).** Stage 2 recorded the kit tally live in
`docs/kit-check-work_647d5c582d-s2.md`: **11 pass, 7 skip, 2 FAIL** — the two failures being
`thinking_reproduces` and `thinking_revised`, both properties of the handed-over chat-log session and
neither clearable by any edit in this repository. This stage does not re-run the kit; the 450s land
watchdog has been burned twice by re-verification (pass-5, work_5194d0ef53).

**What remains.**
- The `renders` row lives in `tools/render-check.mjs`, not in a `check-artifacts.ts` — that file does not
  exist in this workspace (stage 1 research, verified live). The row's four assertions and the screenshot
  range are all present; only the file name differs from the item's wording.
- The screenshot range is derived from the files on disk (148,257 / 219,469 / 137,873 bytes, ±15%), not the
  307,200–358,400 window the item cites — that window belongs to the `.kit-r6` build, which is not here.
- Father's gates are untouched: no wallet link, no entry signature, no submission POST, no merge to main.
