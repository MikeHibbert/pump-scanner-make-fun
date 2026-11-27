# Land stage, pass 5 — work_647d5c582d (token-radar-01)

Written 2026-11-25. Every claim below sits beside the command that produced it, run in
`/data/workspace/entries/token-radar-01` during this stage. Nothing here is recalled.

## 1. The precondition that must be named first

The live check **"No wallet on the account"** fails. The kit's own `repo_owner` line shows
the shape of it: the repository owner is `MikeHibbert`, which is not the account login, so
the entry needs `.makefun/owner.json` naming a wallet — and there is no wallet on the
account to name. The kit's own words: "a wallet on your account; with none, add one first:
`node cli/makefun.mjs wallet add --keypair <file>` … or link one on your profile".

**No entry of ours can be accepted until Father links a wallet.** Stated here at the top of
the land record, not discovered on 13 December.

## 2. What was built (stages 1–2, unchanged this pass)

The token launch radar, in `entries/token-radar-01`:

- `main.ts` — the graded entrypoint, node22, honours `MAKEFUN_INPUT_DIR`/`--input` and
  `MAKEFUN_OUTPUT_DIR`/`--output`.
- `lib/model.ts` — `Snapshot`, `MODEL_VERSION='radar-1'`, `EARLY_ROWS=160`, `LIVE_ROWS=24`,
  `buildBoard`, `impliedValue`, `isPreToken`, `isRankable`, `buildRadar`, `parseSnapshot`.
- `vendor/makefun-board.ts` — `buildDossier`, `canonicalJson`, `makefun/dossier/v1`.
- `dashboard/{index.html,app.js,app.css}` — static, no network.
- `screenshots/{1-board,2-detail,3-filtered}.png` — three captures.
- `tools/project-session.mjs` — the session projector; never invents a turn, a timestamp
  or a usage figure.
- `LICENSE` (MIT, `Copyright (c) 2026 Andrew Hibbert`), `README.md`, `kit.json`,
  `RULES.txt`, `competition.yaml`.

Board contract met in code and in output: 200 rows, keys `rank,slug,name,category,chains,
tvl_usd,change_7d,mcap_usd,listed_at,gecko_id,symbol,token_status,age_days,
implied_value_usd,model,farm_steps` plus the aliases `tvl,impliedValue,farmPlan`.
Determinism proven by two runs and an empty `diff -r`.

## 3. The verify result, citing stage 2's receipts

Stage 2 ran the kit's own grader with the transcript bundle supplied and observed, verbatim:

```
11 passed, 2 failed, 7 skipped, 5 checked at submission
not ready: fix thinking_reproduces, thinking_revised, then check again
```

That is the landing evidence, and it is a change in behaviour. In pass 3 the same command
without `--transcripts` read `4 passed, 1 failed, 15 skipped`. Supplying the bundle moved
the transcript checks from *skipped* to *actually evaluated*: eleven now pass, and two fail
on substance rather than on absence.

Passing transcript checks include `thinking_in_window` (all 20 timestamps lie between the
opening at 2026-11-14T10:00:00.000Z and the receipt at 2026-11-25T15:14:52.094Z),
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

The five submission-time checks — `repo_public`, `repo_owner`, `repo_created_after_open`,
`commit_in_repo` (naming `4014e089cc54f3a5b7b417b158cff8051c679e7d`) and
`duplicate_snapshot` — all read "at submission". They are Father's gates.

## 4. This pass: the tree is clean, and the private bundle stays out of it

`git status --porcelain=v1` at the start of this pass returned exactly one line:
`?? transcripts.tar.gz`. The verify stage had already inspected that bundle and found it
is a `agent-fun/transcript-bundle/v1` bundle whose single session is
`sessions/chat-log/session-handover.json` — a verbatim record of a household conversation.
No key value is present in it, so it is not a credential leak; it is nonetheless a raw
private session record, and committing it to a public bounty repository is an irreversible
disclosure that no instruction in this item authorises.

Rather than commit it or leave the tree dirty, this pass added it to `.gitignore` with the
reason written in the file, and committed that one line:

```
337ff02 chore(token-radar-01): keep the private transcript bundle out of the public tree
```

`git status --porcelain=v1` after that commit returned **nothing** — the tree is clean.
The grader still reads the bundle from outside the tree via `--transcripts`, which is
exactly how pass 4 measured 11 passed / 2 failed. Father's word is required before the
bundle is ever committed.

## 5. The push, and why there is no PR URL

```
git push -u origin feature/work_647d5c582d-token-radar-01-land-20261125
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'
```

`git ls-remote --heads origin` returned **no branches at all** — nothing of ours has ever
reached the remote. `gh auth status` reports: "Failed to log in to github.com using token
(GITHUB_TOKEN) — The token in GITHUB_TOKEN is invalid."

The remote credential is dead. No branch left this container, so **no pull request exists
and none can be opened from here**. This is the same refusal recorded in `13d1e9d`,
`b2e7e51`, `02812c3`, `3399533` and `6477d28`; it is a credential Father must supply, not a
defect in the entry.

## 6. What remains

1. **Father: link a wallet** to the account. Without it `repo_owner` cannot pass and no
   entry is accepted.
2. **Father: make the repository public** (`repo_public`), and confirm it was created at
   or after 2026-11-14T10:00:00Z (`repo_created_after_open`).
3. **A working git credential**, so the branch can be pushed and a pull request opened.
   Until then the land stage cannot produce a PR URL.
4. **`thinking_reproduces` and `thinking_revised`** — these need the radar to be written or
   revised inside a recorded session, then re-bundled. That is real work, not a formality,
   and it is the honest remaining gap in the entry.
5. **Father only:** the entry signature (`entry_message`) and the submission POST. The API
   key cannot sign.

## 7. What I did not do

I did not commit `transcripts.tar.gz`. I did not make the repository public, link a wallet,
sign the entry message, or POST a submission. Those are Father's gates and I have not
crossed them.
