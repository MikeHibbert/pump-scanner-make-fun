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
