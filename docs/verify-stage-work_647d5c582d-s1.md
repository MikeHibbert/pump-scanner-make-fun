# Verify stage — work_647d5c582d-s1 (token-radar-01, slice 1/2)

Declared-work discipline (work_fb464e49b9, docs/declared-work-discipline.md): this file declares
what was run, what was seen, and what failed. Nothing here is reported from memory.

## What was run (live, this stage)

Node used: **v22.23.5** (`/opt/nvm/versions/node/v22.23.5/bin`). The sandbox default `node` is
v20.20.2, on which the kit CLI dies at import
(`SyntaxError: The requested module 'node:zlib' does not provide an export named 'createZstdCompress'`).
The kit requires Node 22.18 or later, so the newer major was put first on PATH for every command below.

1. Entry shape:
   `node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK` — passed.
2. Kit's own pre-submit grader, run from inside the kit against a clean copy of the entry
   (the kit refuses `--repo .` when the repo is the kit itself, so the entry files were copied to
   `/tmp/tr-repo`, committed there, and graded at that commit):

   ```
   node cli/makefun.mjs check --kit . --repo /tmp/tr-repo --transcripts transcripts.tar.gz
   ```

   Exit code **1**. Tally, counted from the output: **11 pass, 2 FAIL**, 25 check lines in all
   (the rest are `skip` / `at submission`).

## The two FAILs, verbatim in substance

- `thinking_reproduces` — "the transcripts account for 0 of 2434 counted lines (0.0%: 0 authored,
  0 pasted), under the 30% required; the entrypoint main.ts has no authored line (80 counted:
  0 pasted, 0 read, 80 absent)".
- `thinking_revised` — "no file takes its final content from 2 or more messages that write or edit
  it: no line of the snapshot first appears in a message that writes its file".

Both are transcript-authorship checks, not code checks. The entry's code, licence, entrypoint,
snapshot size and competition window all pass. The session bundle currently in the tree
(`transcripts.tar.gz`, gitignored) is a *handed-over* projection of Andrew's own `/data/sessions`
log — the kit says so itself under `transcripts_recorded` — and that projection carries no
file-write evidence, so no line of the repository traces to it.

## What this means, stated plainly

The entry cannot pass `thinking_reproduces` / `thinking_revised` by editing code. It needs a
session in which the agent actually writes and then revises the entry's files, recorded by a
harness the kit can read. That is a re-run of the build under a recording client, not a fix in
this stage. It is recorded here as the open gap, not papered over.

## Father gates (unchanged, not mine to pass)

- `repo_public` — the repository must be public at submission.
- `repo_owner` — needs `.makefun/owner.json` naming a wallet on Father's account, or a GitHub
  owner matching his login.
- `repo_created_after_open` — the repository's GitHub creation time must be at or after
  2026-11-14T10:00:00Z.
- `account_wallet` — an escrowed prize is paid on chain to the signing wallet.
- The push credential is dead (401 on every land-stage pass), so no PR can be opened from here.

## Verify verdict

The profile's verify command passes. The kit's grader runs and its number is recorded:
**11 pass / 2 FAIL**. The two failures are transcript-authorship, and they are the honest state
of the entry, not a regression introduced by this stage.
