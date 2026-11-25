# Kit check receipt — work_647d5c582d-s1 (token-radar-01, slice 1/2)

Declared-work discipline (`work_fb464e49b9`, `docs/declared-work-discipline.md`): every number
below was read off a command run in this stage, not remembered. The command is quoted so it can be
re-run and the same tally read.

## The command

```
cd entries/token-radar-01
/opt/nvm/versions/node/v22.23.5/bin/node \
  /data/workspace/makefun/kit/cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
```

Two traps, both proven by running them:

- The CLI has **no copy inside the entry**. `node cli/makefun.mjs` from inside
  `entries/token-radar-01` fails `MODULE_NOT_FOUND`; the absolute kit path above is the only
  working invocation.
- `--transcripts transcripts.tar.gz` is **required** for the transcript checks to see the bundle.
  Without it the same command reports `FAIL transcripts_present — no transcripts were uploaded`,
  even though the archive is committed in the tree. The bundle is an upload, not a tree file the
  grader discovers on its own.

## The tally, read off the run at `d718d329b4df3720dd882a616558940385bb1c3c`

**11 pass**

| check | what it said |
| --- | --- |
| `competition_open` | now is between 2026-11-14T10:00Z and the deadline 2026-12-14T10:00Z |
| `snapshot` | 15 files, 845,964 bytes, within every cap |
| `license_osi` | `LICENSE` declares SPDX MIT |
| `entrypoint` | `main.ts` at the root selects node22 |
| `transcripts_present` | 1 agent session parsed (1 chat-log) |
| `thinking_wellformed` | 1 session, 21 messages, timestamps present and in order |
| `thinking_in_window` | all 20 timestamps lie between opening and receipt |
| `thinking_turns` | 10 assistant turns with text or thinking, 5 required |
| `thinking_priced` | no usage record to price |
| `transcripts_run_record` | the run record matches the upload |
| `thinking_own_work` | 0 of 12,738 counted lines are the agent's own writing — under the bar |

**7 skip** — `prerequisites`, `strategy_note`, `committed_secret`, `transcripts_recorded`,
`thinking_committed`, `thinking_on_task`, `thinking_fresh`.

**2 FAIL** — `thinking_reproduces` (0 of 12,738 counted lines accounted for, 30% required) and
`thinking_revised` (no file takes its final content from 2 or more messages that write it).

**5 at submission** — `repo_public`, `repo_owner`, `repo_created_after_open`, `commit_in_repo`,
`duplicate_snapshot`.

## What the two failures actually mean

Both are the same root cause, and it is not a code defect: the handed-over session is a chat-log
projection. It carries no tool calls, so no file the agent wrote appears as the call that wrote it,
and no file is revised across messages. The kit's own fix text says the remedy is to run in a
client whose sessions are recorded, or to hand over a session that carries the writes. Rebuilding a
session from memory to fill the gap is forbidden by the requirements and has not been done.

`transcripts_recorded` is a skip for the same reason: the session is labelled *handed over*, so the
entry is ranked where it scores but takes no paid place.

## What stands at the Father gates

1. **The account's Solana wallet** — `repo_owner` wants `.makefun/owner.json` naming a wallet on the
   account, and `thinking_committed` wants the entry message signed over the bundle. Both need a
   keypair only Father can supply.
2. **Signing the entry message** — `entry_signature` has a 600 s freshness window, so it must be
   produced at submission time, not now.

The push credential is **not** a gate: the push in the land stage succeeded and the remote
`MikeHibbert/pump-scanner-make-fun` now carries the branch.
