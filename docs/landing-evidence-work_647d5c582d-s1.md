# Landing evidence — work_647d5c582d-s1 (token-radar-01, stage 3 of 3)

Recorded 2026-11-25, in `entries/token-radar-01`, at HEAD `dcc5035`.
One landing record per run (Open Mother guidance, 2026-11-25T15:31:51Z, item 5).

## What was built

`tools/session-log.mjs` (119 lines, commit `dcc5035`) — a recorder that projects Andrew's
own `/data/sessions` log into a make.fun session file, so the entry can hand over the
session that actually built it instead of a session rebuilt from memory.

## Landing check — behaviour observably changed

The kit's own grader, run with the transcript bundle supplied, moved from
**4 passed / 1 failed / 15 skipped** (no `--transcripts`) to
**11 passed / 2 failed / 7 skipped** (with `--transcripts transcripts.tar.gz`).

Command (Node 22.23.5, called by path because the `andrew-node` wrapper has a CRLF shebang):

```
/opt/nvm/versions/node/v22.23.5/bin/node cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
```

Observed tally, verbatim from the run:

```
11 passed, 2 failed, 7 skipped, 5 checked at submission
```

Checks that now pass and did not before: `transcripts_present` (1 agent session parsed,
1 chat-log), `thinking_wellformed` (21 messages, every timestamp present and in order),
`thinking_in_window` (all 20 timestamps between the opening and the receipt),
`thinking_turns` (10 assistant turns, 5 required), `thinking_priced`,
`transcripts_run_record`, `thinking_own_work`.

## What remains — two failures, both transcript authorship

- `thinking_reproduces` — the transcripts account for 0 of 325,492 counted lines
  (0.0%, under the 30% required); `main.ts` has no authored line (80 counted, 80 absent).
- `thinking_revised` — no file takes its final content from 2 or more messages that write
  or edit it.

Both are the same root cause: the handed-over session is a projection of the run, not the
harness's own record of the writes, so the kit cannot trace a line of the deliverable back
to a message that wrote it. Fixing them needs a harness whose sessions `bundle` reads
directly (Superbot, Claude Code, Codex), not a further edit to this entry.

## Father gates — not mine to pass

1. `account_wallet` — the account needs a Solana wallet; the escrowed prize is paid on
   chain to the signing wallet.
2. `entry_signature` — the entry message must be signed over exactly the transcripts
   uploaded (`submit --keypair`), max age 600 s, max skew 60 s.

## Disclosure decision, unchanged

`transcripts.tar.gz` stays gitignored. It contains a verbatim household conversation;
publishing it to a public bounty repository is an irreversible disclosure no instruction
in this item authorises. It is supplied to the grader from outside the tree via
`check --transcripts`, which is how the 11/2 figure above was measured. Father's word is
required before it is ever committed. (declared-work discipline, work_fb464e49b9)
