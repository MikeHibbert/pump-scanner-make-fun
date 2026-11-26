# Land stage record — slice 2/2 (work_647d5c582d-s2)

Written in the land stage (stage 3 of 3), 2026-11-26, in `entries/token-radar-01`. This file records what
was **observed live in this stage**, and cites the verify stage's receipts rather than re-running them —
the 450s land watchdog has been burned twice by re-verification (pass-5, work_5194d0ef53).

## The precondition, named first as the item demands

**`No wallet on the account` still fails.** The kit's `repo_owner` check is a submission-time check: it
wants `.makefun/owner.json` naming a Solana wallet on the account, and `thinking_committed` wants the
entry message signed over the bundle. Both need a keypair only Father can supply. **No entry of ours can
be accepted until Father links a wallet.** That is a Father gate, not a build defect, and this stage did
not cross it.

## 1. The change is present in the live working tree — observed, not remembered

```
$ cd entries/token-radar-01 && grep -n "MODEL_VERSION" lib/model.ts
90:export const MODEL_VERSION = 'radar-2';
455:    model_version: MODEL_VERSION,
$ grep -n "breadth_cap\|breadth_floor" lib/model.ts
65:  breadth_floor: number;
66:  breadth_cap: number;
84:  breadth_floor: 0.9,
85:  breadth_cap: 1.1,
216:  return Math.min(model.breadth_cap, Math.max(model.breadth_floor, raw));
$ ls -la transcripts.tar.gz
-rw-r--r-- 1 root root 7806 Nov 25 16:51 transcripts.tar.gz
$ git rev-parse HEAD
ec3f10ca34e19c4902328524d7a1ccceb7358fa0
```

So the radar-2 model is live in the tree, the breadth multiplier is clamped through `MODEL` constants
(never bare literals), and the bundle is present.

## 2. The landing check — behaviour observably changed

The item's landing check is that the radar's ranking behaviour changed. It did, and the evidence is
recorded in `docs/landing-evidence-work_647d5c582d-s2.md` §2, read from the produced board:

- the board carries a `model.breadth_multiplier` field that did not exist under `radar-1`;
- it takes **four distinct values** across the 200 rows (0.925, 1, 1.075, 1.1), so breadth discriminates
  between rows rather than being a constant;
- the top row sits at the cap (1.1) and the board still spans $598M down to $1.04M, so the value ranking
  still leads and breadth only reorders near-ties.

**Observed landing evidence:** a field that did not exist before now varies across the board and reorders
near-ties — the behaviour the change was made to produce.

## 3. The verify result — citing stage 2's receipts

Stage 2 re-read the kit tally live, three times, and recorded each read in
`docs/kit-check-work_647d5c582d-s2.md`. The final read, against HEAD `07069b5`, was:

**11 passed, 2 failed, 7 skipped, 5 checked at submission.**

The two failures are unchanged and are a property of the handed-over session, not of the code:

- `thinking_reproduces` — the transcripts account for **0 of 337,566 counted lines (0.0%)**, under the 30%
  required; `main.ts` has no authored line (80 counted: 0 pasted, 0 read, 80 absent).
- `thinking_revised` — no file takes its final content from 2 or more messages that write or edit it.

The session carries 21 messages and **0 tool results**, so no file appears as the call that wrote it. The
requirements forbid rebuilding a session from memory to fill that gap, and doing so would be fabrication.
The remedy is a recorded client (the kit names Superbot), which is a Father decision, not a build step.

This stage does **not** re-run the kit. The receipts above are stage 2's, cited.

## 4. The Father gates — none crossed

1. **Public repository** — not created.
2. **Wallet link** — not made. This is the live failing precondition named at the top.
3. **Entry signature** — not made. `thinking_committed` skips for want of it.
4. **Submission POST** — not sent.

## 5. What remains

- `transcripts.tar.gz` must be rebuilt **after** the final commit so `manifest.repo.commit` equals the
  submitted 40-character `commit_sha`. The gap slice 1 recorded (`c93a4f4` vs `102b3bb`) is still open and
  is a submission-time step, not a build step.
- The two `thinking_*` failures need a recorded client session — Father's decision.
- The wallet link (Father gate) blocks acceptance of any entry of ours.
