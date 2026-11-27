# Kit check — slice 2/2 (work_647d5c582d-s2)

Read live on 2026-11-25 at 21:55 UTC, against the entry as it stands after the radar-2 model change.

## The precondition, named first

**`No wallet on the account` still fails.** The kit's `repo_owner` check is a submission-time check: it
wants `.makefun/owner.json` naming a Solana wallet on the account, and `thinking_committed` wants the
entry message signed over the bundle. Both need a keypair only Father can supply. **No entry of ours can
be accepted until Father links a wallet.** That is a Father gate, not a build defect, and this slice does
not cross it.

## The command

```
cd entries/token-radar-01
/opt/nvm/versions/node/v22.23.5/bin/node /data/workspace/makefun/kit/cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
```

The kit CLI is **not** inside the entry: `cli/makefun.mjs` is present but `node cli/makefun.mjs` fails
`MODULE_NOT_FOUND`. The working invocation is the absolute kit path above.

## The tally, as read

**11 pass, 7 skip, 2 FAIL.**

| check | result | what it says |
| --- | --- | --- |
| competition_open | pass | now is between the opening (2026-11-14T10:00Z) and the deadline (2026-12-14T10:00Z) |
| snapshot | pass | 50 files, 22,889,033 bytes at `b8e91f2…`: within the intake's caps |
| license_osi | pass | `LICENSE` declares `SPDX-License-Identifier: MIT`, OSI-approved |
| entrypoint | pass | `main.ts` at the root selects node22, which token-radar-01 accepts |
| strategy_note | skip | token-radar-01 does not ask for a strategy note |
| committed_secret | skip | no `--dotenv` given, so no secret value to look for here |
| transcripts_present | pass | 1 agent session parsed (1 chat-log) |
| transcripts_recorded | skip | the session was handed over, not recorded by its harness — a note, not a rejection; a handed-over entry is ranked where it scores but takes no paid place |
| thinking_wellformed | pass | 1 session, 21 messages, every timestamp present and in order |
| thinking_in_window | pass | all 20 timestamps lie between the opening and the receipt |
| thinking_committed | skip | the entry is not signed: no entry message commits its transcripts |
| **thinking_reproduces** | **FAIL** | the transcripts account for **0 of 337,102 counted lines (0.0%)**, under the 30% required; `main.ts` has no authored line (80 counted: 0 pasted, 0 read, 80 absent) |
| **thinking_revised** | **FAIL** | no file takes its first content from a later session message |

## Why the two failures stand, and why this slice does not paper over them

Both failures are a property of the **handed-over chat-log session**, not of the code. The session carries
21 messages and **0 tool results**, so no file in the repository appears as the call that wrote it. The
kit's own fix text says the same thing: *"code written outside a session cannot be accounted for"*, and
*"have the agent write those files again in a session you upload"*.

The competition's requirements forbid rebuilding a session from memory to fill that gap, and doing so
would be a fabrication — the very thing the declared-work discipline forbids. So slice 2 states the gap
plainly and stops at the gate. The remedy is a recorded client (the kit names Superbot, free and run on
one's own computer), which is a Father decision, not a build step.

## What slice 2 did change, and what it measured

`lib/model.ts` moved from `radar-1` to `radar-2`: a second, independent signal — breadth, the number of
chains a protocol runs on — applied as a bounded multiplier in `[0.9, 1.1]`. Every exported signature is
unchanged, so `main.ts` and `dashboard/app.js` needed no edit. The pipeline was re-run live on node22:

```
rows 200
top  steakhouse-financial 597999688 breadth 1.1
last vault-street 1043835
```

200 rows, the breadth multiplier applied and visible at the cap, and the board still spanning a real
value range from $598M to $1.04M — so the ranking discriminates rather than collapsing to one value.

## The gap slice 1 recorded, still open

`manifest.repo.commit` must equal the submitted 40-character `commit_sha`. The bundle has to be rebuilt
**after** the final commit, which is stage 3's work, not this stage's.

## Verify-stage re-read (stage 2 of 3), live

Re-run at the verify stage against the committed tree at `88d276a`, so the tally above is confirmed
rather than remembered. Declared change: this section only — no code touched, because the verify pass
found nothing to correct.

```
cd entries/token-radar-01
/opt/nvm/versions/node/v22.23.5/bin/node --version          # v22.23.5
MAKEFUN_INPUT_DIR=./input MAKEFUN_OUTPUT_DIR=./out \
  /opt/nvm/versions/node/v22.23.5/bin/node main.ts          # exit 0
node -e "require('./out/board.json').rows.length"           # 200
/opt/nvm/versions/node/v22.23.5/bin/node /data/workspace/makefun/kit/cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz   # exit 2
```

The kit's exit code is 2 because two checks FAIL; that is the expected, already-recorded state, not a
regression. The re-read tally is **11 pass, 7 skip, 2 FAIL**, with the same two failures:

- `thinking_reproduces` — 0 of 337,237 counted lines (0.0%, under the 30% required); `main.ts` has no
  authored line (80 counted: 0 pasted, 0 read, 80 absent).
- `thinking_revised` — no file takes its first content from a later session message.

The counted-line total moved from 337,102 to 337,237 because the snapshot now includes the slice-2
records; the ratio is unchanged at 0.0%, which is the honest reading.

One environment note worth recording: the default `node` on this box is **v20.20.2**, which refuses
`main.ts` with `ERR_UNKNOWN_FILE_EXTENSION`. The entry must be run with node22
(`/opt/nvm/versions/node/v22.23.5/bin/node`), which is what the grader selects via the entrypoint check.

## Verify-stage re-read (stage 2 of 3, second pass), live

Re-run once more at the verify stage, this time against the tree as it actually stands at HEAD
`2ed535694237b39ca736c63b102c066784787d3c` (the commit the kit's `snapshot` check names), with a clean
working tree (`git status --porcelain` printed nothing). Declared change: this section only — no code
touched, because the verify pass again found nothing to correct.

```
cd entries/token-radar-01
/opt/nvm/versions/node/v22.23.5/bin/node --version          # v22.23.5
MAKEFUN_INPUT_DIR=./input MAKEFUN_OUTPUT_DIR=./out \
  /opt/nvm/versions/node/v22.23.5/bin/node main.ts          # exit 0
node -e "require('./out/board.json').rows.length"           # 200
/opt/nvm/versions/node/v22.23.5/bin/node /data/workspace/makefun/kit/cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz   # exit 2
```

Tally re-read live: **11 pass, 7 skip, 2 FAIL** — unchanged, and the same two failures:

- `thinking_reproduces` — 0 of 337,258 counted lines (0.0%, under the 30% required); `main.ts` has no
  authored line (80 counted: 0 pasted, 0 read, 80 absent).
- `thinking_revised` — no file takes its final content from 2 or more session messages.

The counted-line total moved again (337,237 → 337,258) because the snapshot now includes the previous
verify record; the ratio is unchanged at 0.0%, which is the honest reading. The `snapshot` check now
reports 52 files, 22,901,218 bytes at `2ed5356…`, confirming the kit is reading the current commit.

The precondition stands and is named first, as the item requires: **`No wallet on the account` still
fails.** No entry of ours can be accepted until Father links a wallet, and the four Father gates (public
repository, wallet link, entry signature, submission POST) remain uncrossed.

## Verify-stage re-read (stage 2 of 3, third pass), live

Re-run at the verify stage against the tree as it actually stands at HEAD
`07069b54ea028b7d230487046fd93e408dbea465` — the commit stage 1 left behind, and the commit the kit's
own `snapshot` and `commit_in_repo` lines name. `git status --short` printed nothing, so the tree is
clean and nothing was left half-written by stage 1.

Declared change: **this section only.** No code was touched, because the verify pass found nothing to
correct — the entrypoint, the model, the dashboard and the bundle all behave as the earlier passes
recorded.

```
cd entries/token-radar-01
/opt/nvm/versions/node/v22.23.5/bin/node --version          # v22.23.5
test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK   # ENTRY_SHAPE_OK
MAKEFUN_INPUT_DIR=./input MAKEFUN_OUTPUT_DIR=./out \
  /opt/nvm/versions/node/v22.23.5/bin/node main.ts          # exit 0
node -e "require('./out/board.json').rows.length"           # rows 200
/opt/nvm/versions/node/v22.23.5/bin/node /data/workspace/makefun/kit/cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz   # exit 2
```

Tally re-read live: **11 passed, 2 failed, 7 skipped, 5 checked at submission** — unchanged, and the
same two failures:

- `thinking_reproduces` — the transcripts account for **0 of 337,566 counted lines (0.0%: 0 authored,
  0 pasted)**, under the 30% required; `main.ts` has no authored line (80 counted: 0 pasted, 0 read,
  80 absent).
- `thinking_revised` — no file takes its final content from 2 or more messages that write or edit it.

The counted-line total moved once more (337,258 → 337,566) because the snapshot now includes the
submission-time record and the render witness; the ratio is unchanged at 0.0%, which is the honest
reading. The `snapshot` check now reports **56 files, 22,921,460 bytes at `07069b5…`**, confirming the
kit is reading the current commit rather than a stale one.

The pipeline was re-run live on node22 and produced **200 rows**, top row `steakhouse-financial` — the
same board the earlier passes measured, so the radar-2 breadth signal is still discriminating.

The precondition stands and is named first, as the item requires: **`No wallet on the account` still
fails.** The kit's `repo_owner` line asks for `.makefun/owner.json` naming a wallet on the account, and
`thinking_committed` asks for the entry message to be signed over the bundle — both need a keypair only
Father can supply. **No entry of ours can be accepted until Father links a wallet.** The four Father
gates (public repository, wallet link, entry signature, submission POST) remain uncrossed, and this
stage did not cross them.

One further note the kit printed, recorded here because it bears on the two failures: this kit copy is
**level 46** while make.fun is at **level 53**, and the kit itself warns that a kit below level 7 cannot
see the hold on a handed-over entry. The two failures are therefore stated as the handed-over-session
limit, and the remedy — running in a recorded client, which the kit names as Superbot — is Father's
decision, not a build step.
