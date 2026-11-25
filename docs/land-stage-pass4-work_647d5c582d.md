# Land stage, pass 4 — work_647d5c582d (token-radar-01)

Written 2026-11-25, in `entries/token-radar-01`. Every claim below sits beside the
command that produced it, run in this stage. Nothing here is recalled.

## Why this file exists

Declared-work discipline (Father directive 19 Sep 2026, work_fb464e49b9,
`docs/declared-work-discipline.md`): work in the open, declare each change, leave the
why, and never report work as done from memory. This is the land-stage record for
pass 4, and it corrects the pass-3 record on one material point: the grader now
reports **two** failures, not one.

## What I saw, live

### 1. The tree and the branch

```
cd /data/workspace/entries/token-radar-01 && git branch --show-current && git log --oneline -3 && git status --porcelain=v1
```

- branch: `feature/work_647d5c582d-token-radar-01-land-20261125`
- HEAD: `4014e08` — "docs(token-radar-01): commit-stage evidence for work_647d5c582d - land-stage pass 3 record tightened to live observations"
- porcelain: exactly one line, `?? transcripts.tar.gz`

So the build and the evidence docs are committed; the only uncommitted artefact is the
transcript bundle, which the verify stage deliberately left out of the tree (see
`docs/verify-stage-work_647d5c582d.md`). It is an input to the grader, not a change this
task made, and it is a raw private session record.

### 2. The push, attempted again this stage

```
timeout 60 git push -u origin feature/work_647d5c582d-token-radar-01-land-20261125
```

```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'
```

The remote credential is dead. No branch left this container, so **no pull request exists
and none can be opened from here**. This is the same refusal recorded in `13d1e9d`,
`b2e7e51`, `02812c3` and `3399533`; it is a credential Father must supply, not a defect in
the entry.

### 3. The grader, re-measured with the transcript bundle supplied

```
andrew-node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
```

Result line, verbatim:

```
11 passed, 2 failed, 7 skipped, 5 checked at submission
not ready: fix thinking_reproduces, thinking_revised, then check again
```

**This is the landing evidence, and it is a change in behaviour.** In pass 3 the same
command without `--transcripts` read `4 passed, 1 failed, 15 skipped`. Supplying the
bundle moved the transcript checks from *skipped* to *actually evaluated*: eleven now
pass, and two fail on substance rather than on absence.

Passing transcript checks now include `thinking_in_window` (all 20 timestamps lie between
the opening at 2026-11-14T10:00:00.000Z and the receipt at 2026-11-25T15:14:52.094Z),
`thinking_turns` (10 assistant turns, 5 required), `transcripts_run_record` and
`thinking_own_work`.

The two failures, in the kit's own words:

- **`thinking_reproduces`** — "the transcripts account for 0 of 324971 counted lines
  (0.0%: 0 authored, 0 pasted), under the 30% required; the entrypoint main.ts has no
  authored line (80 counted: 0 pasted, 0 read, 80 absent)". The kit's fix: the sessions
  that wrote those files must be bundled, or the agent must write them again in a session
  that is uploaded.
- **`thinking_revised`** — "no file takes its final content from 2 or more messages that
  write or edit it". The kit's fix: continue the same session, run the entry, have the
  agent edit the code, then bundle and submit again.

Both are honest findings about *provenance*, not about the program. The radar itself is
built, deterministic and committed; what the kit cannot see is the session in which it was
written, because the code was authored outside a recorded session.

### 4. The five submission-time checks are Father's gates

`repo_public`, `repo_owner`, `repo_created_after_open`, `commit_in_repo` (naming
`4014e089cc54f3a5b7b417b158cff8051c679e7d`) and `duplicate_snapshot` all read
"at submission". They are not mine to cross.

## The precondition that must be named first

The live check **"No wallet on the account"** fails. The kit's own `repo_owner` line shows
the shape of it: the repository owner is `MikeHibbert`, which is not the account login, so
the entry needs `.makefun/owner.json` naming a wallet — and there is no wallet on the
account to name. The kit's own words: "a wallet on your account; with none, add one first:
`node cli/makefun.mjs wallet add --keypair <file>` … or link one on your profile".

**No entry of ours can be accepted until Father links a wallet.** That is stated here at
the top of the land record, not discovered on 13 December.

## What remains

1. **Father: link a wallet** to the account. Without it `repo_owner` cannot pass and no
   entry is accepted.
2. **Father: make the repository public** (`repo_public`), and confirm it was created at
   or after 2026-11-14T10:00:00Z (`repo_created_after_open`).
3. **A working git credential**, so the branch can be pushed and a pull request opened.
   Until then the land stage cannot produce a PR URL.
4. **`thinking_reproduces` and `thinking_revised`** — these need the radar to be written
   or revised inside a recorded session, then re-bundled. That is real work, not a
   formality, and it is the honest remaining gap in the entry.
5. **Father only:** the entry signature (`entry_message`) and the submission POST. The API
   key cannot sign.

## What I did not do

I did not commit `transcripts.tar.gz`. It is a raw private session record; publishing it to
a public bounty repository is an irreversible disclosure that no instruction in this
sub-verse authorises. It is supplied to the grader from outside the tree, which is what
`--transcripts` is for.
