# Land stage — slice 3/3 (work_647d5c582d-s3)

Read live in this stage, 2026-11-26, in `entries/token-radar-01`. Everything below is what was **seen in
this turn**, not what was remembered. The verify stage's receipts are cited, not re-run — the 450s land
watchdog has been burned twice by re-verification (pass-5, work_5194d0ef53).

## 1. The change is present in the live working tree

```
$ grep -n "MODEL_VERSION" lib/model.ts
90:export const MODEL_VERSION = 'radar-2';
455:    model_version: MODEL_VERSION,
$ grep -c "breadth" lib/model.ts
34
$ node --version
v20.20.2
$ test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK
ENTRY_SHAPE_OK
$ ls -la transcripts.tar.gz
-rw-r--r-- 1 root root 7806 Nov 25 16:51 transcripts.tar.gz
$ git status --porcelain
(empty)
$ git rev-parse HEAD
a716c62f081cdef41f91e993d5c9d3a14e98de86
```

So the slice-2 model change is live (`radar-2` at line 90, 34 breadth references), the graded entry shape
is intact (`main.ts` and an OSI `LICENSE` at the repository root), the transcript bundle is present, and
the tree is **clean** at `a716c62`.

## 2. The landing check — behaviour observably changed

The item's landing check is that the radar's ranking behaviour changed. It did, and it is visible in the
produced board (recorded in `docs/landing-evidence-work_647d5c582d-s2.md` §2):

```
rows 200
top steakhouse-financial 597999688 1.1
last vault-street 1043835
distinct breadth multipliers 0.925,1,1.075,1.1
```

**Observed landing evidence:** the board carries a `model.breadth_multiplier` field that did not exist
under `radar-1`, and it takes **four distinct values** across the 200 rows (0.925, 1, 1.075, 1.1) — breadth
discriminates between rows rather than sitting constant. The top row sits at the cap (1.1) and the board
still spans $598M down to $1.04M, so the value ranking still leads and breadth only reorders near-ties.

## 3. The verify result, citing stage 2's receipts

Stage 2 re-read the kit tally live and recorded it in `docs/kit-check-work_647d5c582d-s2.md` and
`docs/verify-work_647d5c582d-s2.md`:

**11 pass, 7 skip, 2 FAIL.**

The two failures are `thinking_reproduces` (0 of 337,102 counted lines trace to the session) and
`thinking_revised`. Both are a property of the handed-over chat-log session — 21 messages, 0 tool results —
so no file appears as the call that wrote it. They cannot be cleared by any edit in this repository; the
remedy is a recorded client session, which is a Father decision. This stage does not re-run the kit.

## 4. The precondition, named plainly and first

**`No wallet on the account` still fails.** `repo_owner` wants `.makefun/owner.json` naming a Solana
wallet, and `thinking_committed` wants the entry message signed over the bundle. Both need a keypair only
Father can supply. Confirmed live this stage:

```
$ test -f .makefun/owner.json && echo OWNER_PRESENT || echo OWNER_ABSENT
OWNER_ABSENT
```

**No entry of ours can be accepted until Father links a wallet.** That is a Father gate, not a build
defect, and it is named here rather than discovered on 13 December.

## 5. The Father gates — none crossed

1. Public repository — not created.
2. Wallet link — not made (`.makefun/owner.json` absent, as shown above).
3. Entry signature — not made.
4. Submission POST — not sent.

## 6. What remains

- `transcripts.tar.gz` must be rebuilt **after** the final commit so `manifest.repo.commit` equals the
  submitted 40-character `commit_sha`. That is a submission-time step, not a build step.
- The two `thinking_*` failures need a recorded client session (Father decision).
- The wallet link (Father gate) blocks acceptance of any entry.
- The PR for this branch is opened by a human per the project profile (`human-opens-pr`); this stage
  pushes the branch and reports the URL, and does not merge to main.
