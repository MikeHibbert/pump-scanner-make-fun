# Landing record — work_647d5c582d-s1 (token-radar-01, slice 1/2)

Declared-work discipline (work_fb464e49b9, docs/declared-work-discipline.md): every claim below is
something I ran in this stage and read off the output, not something I remember.

## What was built

The token launch radar entry at `entries/token-radar-01`, committed across four commits:

| commit | what |
| --- | --- |
| `36a599f` | `feat(token-radar-01)`: entrypoint `main.ts`, dashboard, dossier |
| `2638599` | `fix(token-radar-01)`: call `buildDossier(dir, caps)` and honour `MAKEFUN_INPUT_DIR` |
| `e740f08` | `wip(work_647d5c582d)`: verify fix — board row contract aliases (tvl, impliedValue, farmPlan) |
| `08d952a` | `chore(token-radar-01)`: add board snapshot input and transcripts archive |

## Landing evidence — the behaviour observably changed

The landing check is the kit's own grader, run against the committed tree **with the transcript
bundle passed in** (`--transcripts transcripts.tar.gz`). Before this work the same command reported
`transcripts_present` at **FAIL — "no transcripts were uploaded"**. It now reports:

```
pass           transcripts_present      1 agent session parsed (1 chat-log)
```

That is the observable change: the bundle is in the tree and the grader reads it.

Full tally, read off the run at `08d952a275ed303e29bd43bd6e20a69f2ce71d1f`:

- **11 pass** — `competition_open`, `snapshot` (13 files, 837,410 bytes, within every cap),
  `license_osi` (SPDX MIT), `entrypoint` (`main.ts` at root selects node22),
  `transcripts_present`, `thinking_wellformed` (1 session, 21 messages, timestamps in order),
  `thinking_in_window`, `thinking_turns` (10 assistant turns, 5 required), `thinking_priced`,
  `transcripts_run_record`, `thinking_own_work`
- **7 skip** — `prerequisites`, `strategy_note`, `committed_secret`, `transcripts_recorded`,
  `thinking_committed`, `thinking_on_task`, `thinking_fresh`
- **2 FAIL** — `thinking_reproduces` (0 of 12,624 counted lines accounted for, 30% required) and
  `thinking_revised` (no file takes its final content from 2+ messages that write or edit it)

## What remains — stated plainly

1. **`thinking_reproduces` and `thinking_revised` still fail.** The handed-over session is a
   chat-log projection, not a harness log: it carries no tool calls, so no file the agent wrote
   appears as the call that wrote it, and no file is revised across messages. The kit's own fix
   text says the remedy is to run in a client whose sessions are recorded (or hand over a session
   that carries the writes). Rebuilding a session from memory to fill the gap is forbidden by the
   requirements and I have not done it.
2. **`transcripts_recorded` is a skip, not a pass** — the session is labelled *handed over*, so the
   entry is ranked where it scores but takes no paid place.
3. **Two Father gates stand:** the account's Solana wallet for the escrowed prize, and signing the
   entry message over the bundle (`thinking_committed` skips for want of the signature). The push
   credential is *not* a gate — the push in this stage succeeded.
4. The 57 checks beyond the 18 the dev kit reports remain unread; the output is truncated.

## Node note

The `andrew-node` wrapper is broken (CRLF shebang: `#!/usr/bin/env bash\r`). Every command above
calls `/opt/nvm/versions/node/v22.23.5/bin/node` directly, and the kit CLI by its absolute path
`/data/workspace/makefun/kit/cli/makefun.mjs` — there is no `cli/` inside the entry.
