# Submission-time record — slice 2/2 (work_647d5c582d-s2)

This is the record the entry carries to the moment of submission. It states, in one place, what would be
submitted, what the kit says about it, and which four decisions are Father's alone. It is written at the
implement stage and is deliberately **not** a submission: nothing here has been posted, signed, or linked.

## The precondition, named first, as the item requires

**`No wallet on the account` still fails.**

The kit's `repo_owner` check is a submission-time check: it wants `.makefun/owner.json` naming a Solana
wallet on the account, and `thinking_committed` wants the entry message signed over the bundle. Both need
a keypair only Father can supply. **No entry of ours can be accepted until Father links a wallet.**

This is a Father gate, not a build defect. It is named here at the top so it is not discovered on
13 December, one day before the deadline (2026-12-14T10:00Z).

## What would be submitted

| field | value |
| --- | --- |
| repository | `MikeHibbert/pump-scanner-make-fun` (private today; publishing is gate 1) |
| entry path | `entries/token-radar-01` |
| entrypoint | `main.ts` at the entry root, node22 |
| license | `LICENSE`, `SPDX-License-Identifier: MIT` (OSI-approved) |
| model | `MODEL_VERSION = 'radar-2'` (`lib/model.ts:90`) |
| transcript bundle | `transcripts.tar.gz`, `agent-fun/transcript-bundle/v1` |
| `commit_sha` | **the full 40-character sha of the final commit — not yet fixed** |

### The `commit_sha` is not yet fixed, and why that is stated rather than guessed

`manifest.repo.commit` inside the bundle currently reads `bad3190776541d3af6a434d9ac4a421e768bdedf`, while
the entry's HEAD is `fd065e6e05c1211ccfd368e7ed73ca5920a4eaad`. The bundle is therefore **stale by five
commits**, and the gap slice 1 recorded (`c93a4f4` vs `102b3bb`) is still open.

The bundle cannot be rebuilt at this stage, because rebuilding it changes the tree, which changes the
commit, which changes the sha the bundle must name. The order is fixed and must be respected:

1. land the final commit;
2. rebuild `transcripts.tar.gz` at that commit;
3. commit the rebuilt bundle;
4. submit the sha of **that** commit.

Step 4 is the only sha that can be submitted, and it does not exist until step 3. Writing a sha here now
would be a fabrication. Stage 3 performs steps 1–3; step 4 is gate 4.

## The kit tally, re-read live at `fd065e6`

Command, run 2026-11-26T08:02Z:

```
cd entries/token-radar-01
/opt/nvm/versions/node/v22.23.5/bin/node /data/workspace/makefun/kit/cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
```

Result: **11 pass, 7 skip, 2 FAIL — `not ready: fix thinking_reproduces, thinking_revised, then check again`.**

The full table is in `docs/kit-check-work_647d5c582d-s2.md`. The two failures, in the kit's own words:

- **`thinking_reproduces`** — "the transcripts account for 0 of 337337 counted lines (0.0%: 0 authored,
  0 pasted), under the 30% required; the entrypoint main.ts has no authored line (80 counted: 0 pasted,
  0 read, 80 absent)".
- **`thinking_revised`** — "no file takes its final content from 2 or more messages that write or edit it:
  no line of the snapshot first appears in a message that writes its file".

Both are a property of `sessions/chat-log/session-handover.json` — 21 messages, **0 tool results** — so no
file in the repository appears as the call that wrote it. The requirements forbid rebuilding a session
from memory to fill that gap, and doing so would be a fabrication. The kit's own fix text names the
remedy: *"have the agent write those files again in a session you upload"*, and *"use Superbot
(https://superbot.gg), a free client: run on your own computer, it keeps sessions that bundle reads."*
That is a Father decision, not a build step.

Note also `transcripts_recorded` (skip): a handed-over entry *"is ranked where it scores but takes no paid
place"*. So even with the two failures cleared by a recorded session, the paid place depends on the
session being recorded by its harness.

## The four Father gates — none crossed

| # | gate | state |
| --- | --- | --- |
| 1 | **Public repository** | not created — the repository is private |
| 2 | **Wallet link** | not made — this is the failing precondition above |
| 3 | **Entry signature** | not made — `thinking_committed` skips for want of it |
| 4 | **Submission POST** | not sent |

The item names these four as a hard stop for Father only. This slice crossed none of them, and no later
stage of this item may cross them either.

## What Father must decide

1. **Link a wallet** to the account. Until then no entry of ours can be accepted, whatever else is done.
2. **Publish the repository**, or confirm it stays private and accept that the entry cannot be submitted.
3. **Record a session in a client** (Superbot or equivalent) if the two `thinking_*` failures are to be
   cleared, and to compete for a paid place at all.
4. **Sign and post** the entry, once 1–3 are settled and the bundle names the final sha.

## Declared change

New file, `docs/submission-work_647d5c582d-s2.md`. Reason: the item's remaining measured work is the
submission-time record — the exact sha, the four gates, and the wallet precondition named first. No code
was touched: `lib/model.ts` is already at `radar-2`, the pipeline produces 200 rows, and the working tree
was clean at `fd065e6` when this record was written.
