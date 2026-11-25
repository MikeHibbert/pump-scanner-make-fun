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
