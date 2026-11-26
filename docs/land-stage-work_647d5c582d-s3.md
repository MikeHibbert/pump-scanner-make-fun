# Land stage — work_647d5c582d (token-radar-01), stage 3 of 3

Written 2026-11-26. Every claim below is what I saw in this stage, with the command
that produced it. Nothing here is reported from memory.

## 1. Live state of the deliverable directory

`entries/token-radar-01` is the build target (project profile: makefun). Verified live:

```
$ git status --porcelain          -> (empty)
$ git rev-parse --abbrev-ref HEAD -> feature/work_647d5c582d-token-radar-01-land-20261125
$ git rev-parse HEAD              -> b86d689c7a486fd63640e986e2dcccccd05dd3bf
$ git log --oneline origin/feature/...land-20261125..HEAD -> (empty: level with upstream)
$ git remote -v                   -> https://github.com/MikeHibbert/pump-scanner-make-fun.git
```

Entry shape spot check:

```
MAIN_TS_OK   (main.ts, 5575 B)
LICENSE_OK   (MIT, Copyright (c) 2026 Andrew Hibbert)
BUNDLE_OK    (transcripts.tar.gz, 7806 B)
OWNER_JSON_ABSENT  (.makefun/owner.json is NOT present)
```

## 2. What was built (stages 1–2, cited not redone)

The token launch radar, committed in this repository:

- `main.ts` — graded entrypoint (node22), honours `MAKEFUN_INPUT_DIR`/`--input` and
  `MAKEFUN_OUTPUT_DIR`/`--output`.
- `lib/model.ts` — `Snapshot`, `MODEL_VERSION='radar-1'`, `EARLY_ROWS=160`,
  `LIVE_ROWS=24`, `BoardRow`, `buildBoard`, `impliedValue`, `isPreToken`,
  `isRankable`, `stepText`, `boardIssue`, `buildRadar`, `dataScript`, `parseSnapshot`.
- `vendor/makefun-board.ts` — `buildDossier(dir, caps)`, `canonicalJson`,
  `DOSSIER_SCHEMA='makefun/dossier/v1'`.
- `dashboard/{index.html,app.js,app.css}` — static, no network.
- `screenshots/{1-board,2-detail,3-filtered}.png` — three captures.
- `tools/project-session.mjs` — session projector (`HARNESS='andrew'`).
- `sessions/chat-log/session-handover.json` — the handed-over session the bundle was built from.
- `transcripts.tar.gz`, `README.md`, `LICENSE`, `kit.json`, `RULES.txt`, `competition.yaml`.

Board contract met in code and output: 200 rows, keys
`rank,slug,name,category,chains,tvl_usd,change_7d,mcap_usd,listed_at,gecko_id,symbol,token_status,age_days,implied_value_usd,model,farm_steps`
plus aliases `tvl,impliedValue,farmPlan`.

## 3. Verify result — citing stage 2's receipts

Stage 2 ran the kit's own grader and recorded the number. I cite it rather than
re-running the full suite (the 450 s land watchdog was burned twice by
re-verification — pass-5 and work_5194d0ef53).

Stage 2's observed result, and the one spot check I re-ran this stage to confirm the
number has not moved:

```
$ node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
EXIT=1
FAIL  thinking_reproduces  the transcripts account for 0 of 337847 counted lines
                          (0.0%: 0 authored, 0 pasted), under the 30% required;
                          the entrypoint main.ts has no authored line
                          (80 counted: 0 pasted, 0 read, 80 absent)
FAIL  thinking_revised     no file takes its final content from 2 or more messages
                          that write or edit it: no line of the snapshot first
                          appears in a message that writes its file
11 passed, 2 failed, 7 skipped, 5 checked at submission
not ready: fix thinking_reproduces, thinking_revised, then check again
```

Passing: `competition_open`, `snapshot`, `license_osi`, `entrypoint`,
`transcripts_present` ("1 agent session parsed (1 chat-log)"), `thinking_wellformed`
(21 messages, timestamps in order), `thinking_in_window` (all 20 timestamps inside
2026-11-14T10:00:00Z..2026-11-26T09:01:33Z), `thinking_turns` (10 assistant turns),
and the remaining skips.

`transcripts_recorded` is a **skip with a note, not a rejection**: the session was
handed over by the agent, so the entry "is ranked where it scores but takes no paid
place".

**So the verify is RED on two transcript checks, and honestly so.** The build is
sound; the transcript projection is what fails.

## 4. The precondition that must be named first (item directive)

The live check **"No wallet on the account"** fails. The grader's own `repo_owner`
line, read this stage:

```
at submission  repo_owner  its GitHub owner must be your account's GitHub login, or the
                           commit must carry .makefun/owner.json naming one of your
                           account's entry wallets ...
               to pass: Commit .makefun/owner.json containing {"wallet": "<your wallet address>"}
               to https://github.com/MikeHibbert/pump-scanner-make-fun.git (a wallet on your
               account; with none, add one first: node cli/makefun.mjs wallet add --keypair <file>,
               ... or link one on your profile), push it, and submit that new commit's sha
               before 2026-12-14T10:00:00.000Z
```

No entry of ours can be accepted until Father links a wallet. That is a Father gate,
not mine to cross. `.makefun/owner.json` is absent from the tree, as it must be until
a wallet exists to name.

## 5. Landing evidence — behaviour observably changed

The landing check for this item is that the radar runs and produces a board. Observed
in stage 2 and unchanged in the tree this stage:

- `main.ts` runs under node22 with `MAKEFUN_INPUT_DIR`/`MAKEFUN_OUTPUT_DIR` and writes
  `board.json` with 200 rows carrying the full key set above.
- Two consecutive runs produce byte-identical output (`diff -r` empty) — the radar is
  deterministic.
- The dashboard renders the board from `data.js` with no network access.

## 6. What remains

1. **Father gate — wallet.** Link a wallet to the account, then commit
   `.makefun/owner.json` naming it. Until then `repo_owner` cannot pass and no entry
   is accepted.
2. **`thinking_reproduces`** — re-project the session from `/data/sessions/` with
   `tools/project-session.mjs` in a mode that carries tool calls and their results,
   then re-bundle with `cli/makefun.mjs bundle`. Never rebuild a session from memory.
3. **`thinking_revised`** — the projected session must show `main.ts` (or
   `lib/model.ts`) written and then edited across at least two assistant messages.
   The real history has that (`36a599f` then `2638599`/`e740f08`); the projection is
   losing it. Fix the projection, not the file.
4. **Father gates, uncrossed:** making the repository public, linking a wallet,
   signing `entry_message`, and the submission POST. The API key cannot sign.

## 7. Push status

The branch `feature/work_647d5c582d-token-radar-01-land-20261125` is level with its
upstream (`git log origin/...land-20261125..HEAD` empty), so the commits are already
on the remote. The pull request is opened by a human per this project's profile
(`human-opens-pr`); the repository is private and the push credential is recorded as
dead in `docs/landing-evidence-work_647d5c582d.md`.
