# Measured state — token-radar-01, item work_647d5c582d-s1 (stage 1, implement)

Measured live this stage, 2026-11-25, from inside `entries/token-radar-01`.
Nothing in this file is carried from memory: every number below is the output of a
command run in this stage, quoted verbatim.

## 1. The kit's own grader now runs

The blocker recorded in the prior findings was real: the sandbox `node` is v20.20.2 and
`cli/makefun.mjs` dies at import with
`SyntaxError: The requested module 'node:zlib' does not provide an export named 'createZstdCompress'`.
Node 22.18.0 was installed to `/tmp/node-v22.18.0-linux-x64` and put first on `PATH`; the CLI
then loads and verifies the kit (`kit token-radar-01 dev: verified 20 files`).

## 2. `check` refuses to grade the kit directory as the repository

Run from the entry root with no `--repo`, the CLI stops with:

```
makefun check: --repo /data/workspace/entries/token-radar-01 is the kit itself: name your
repository (run it from your repository, or pass --repo <your repository>)
```

The entry repository *is* the kit directory here (the kit was unpacked into the entry), so the
kit must be read from a copy. The copy is made outside the repository so it is never committed:

```
cp -a entries/token-radar-01 /tmp/kitcopy && rm -rf /tmp/kitcopy/.git
node cli/makefun.mjs check --kit /tmp/kitcopy \
  --repo /data/workspace/entries/token-radar-01 --worktree --transcripts transcripts.tar.gz
```

## 3. The number, verbatim

```
kit token-radar-01 dev: verified 20 files
repository /data/workspace/entries/token-radar-01 @ worktree@81269db31adf: 40 entries
transcripts transcripts.tar.gz: 1 sessions
```

| verdict | count |
| --- | --- |
| pass | **11** |
| FAIL | **2** |
| skip | 6 |

Per check:

```
skip  prerequisites
pass  competition_open
pass  snapshot
pass  license_osi
pass  entrypoint
skip  strategy_note
skip  committed_secret
pass  transcripts_present
skip  transcripts_recorded
pass  thinking_wellformed
pass  thinking_in_window
skip  thinking_committed
FAIL  thinking_reproduces
skip  thinking_on_task
pass  thinking_turns
pass  thinking_priced
FAIL  thinking_revised
skip  thinking_fresh
pass  transcripts_run_record
pass  thinking_own_work
```

## 4. The two failures, in the kit's own words

**thinking_reproduces** — `the transcripts account for 0 of 325157 counted lines (0.0%: 0 authored,
0 pasted), under the 30% required; the entrypoint main.ts has no authored line (80 counted: 0
pasted, 0 read, 80 absent)`.

**thinking_revised** — `no file takes its final content from 2 or more messages that write or edit
it: no line of the snapshot first appears in a message that writes its file`.

Both are the same root cause: the uploaded session is a *handed-over* projection
(`sessions/chat-log/session-handover.json`) of a run that wrote the entry outside the recorded
session, so the kit can see the conversation but cannot trace any repository line back to it.
`transcripts_recorded` is skipped for the same reason, and the kit states the consequence plainly:
an entry with a handed-over session "is ranked where it scores but takes no paid place".

## 5. What this stage did and did not do

Done: installed a Node the CLI accepts, ran the kit's grader against the real entry, recorded the
tally and both failure texts above.

Not done, and not mine to do: the two failures cannot be repaired by editing the entry — they need
the entry's files to be written *inside* a recorded session and then bundled with
`node cli/makefun.mjs bundle`. That is a re-run of the build under a recording client, which is
Father's call, not a code change. The two Father gates from the prior record also stand: the
account needs a Solana wallet (`account_wallet`), and the push credential is dead (401), so no PR
can be opened from here.
