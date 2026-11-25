# Land stage — work_647d5c582d (token-radar-01)

Stage 3 of 3 (LAND). Written 2026-11-25. Every claim below is a live reading taken in
this stage, not a memory of an earlier one.

## 1. The change is present in the live working tree

Read in `/data/workspace/entries/token-radar-01`:

- `ls -la` → `main.ts` (5,575 bytes), `LICENSE` (1,071), `README.md` (1,220),
  `lib/`, `vendor/`, `dashboard/`, `screenshots/`, `tools/`, `cli/`, `input/`,
  `kit.json`, `RULES.txt`, `competition.yaml`, `docs/` all present.
- `node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK`
  → `v20.20.2` / `ENTRY_SHAPE_OK` (the project profile's own verify line).
- `git status --porcelain` → empty. `git log --oneline -1` → `3159c2a`.

## 2. Verify result — cited from stage 2, not re-run

Stage 2 (`docs/verify-stage-work_647d5c582d.md`, committed at `3159c2a`) observed:

- Entry shape OK; two independent runs of `main.ts` into `/tmp/tr1` and `/tmp/tr2`
  diffed clean → `DETERMINISTIC`.
- `board.json` → 200 rows with the full graded key set.
- The kit's own grader, `andrew-node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo .`
  → **4 passed, 1 failed, 15 skipped, 5 checked at submission**;
  `not ready: fix transcripts_present`.
  Passing: `competition_open`, `snapshot`, `license_osi`, `entrypoint`.
  Failing: `transcripts_present` (no transcript bundle uploaded).
  The five `at submission` items are Father's gates and are correctly not closed here.

Per the land-stage directive the full verify suite was **not** re-run in this stage —
the 450s watchdog was burned twice by re-verification (pass-5, work_5194d0ef53).

## 3. Landing check — observed evidence

The item's landing check is "behaviour observably changed". Observed:

- The entry runs and produces output: `board.json` (200 rows), `data.js`,
  `dossier.json`, `dashboard/`, `screenshots/` — measured in stage 2.
- The grader's verdict moved from "nothing to grade" to a measured
  **4 passed / 1 failed**, with the single remaining failure named exactly
  (`transcripts_present`). That is an observable change in the graded state.

## 4. What remains — and why the PR could not be opened

**The push is refused by a dead credential.** Live receipts from this stage:

```
$ git push -u origin feature/work_647d5c582d-token-radar-01
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'
PUSH_EXIT=128
```

```
$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
HTTP=401
{"message": "Bad credentials", ...}
```

`GITHUB_TOKEN` is set but 40 characters long and rejected; `GH_TOKEN` is empty;
`/root/.git-credentials` is a 0-byte file; `credential.helper=store`. There is no
working GitHub credential in this container, so **no pull request URL can be produced
from here**. This is the same 401 recorded earlier at `017bcb5`.

**Father's hard stops, untouched:** making the repository public, linking a wallet,
signing `entry_message`, and the submission POST. The live check
`No wallet on the account` still fails, so no entry of ours can be accepted until
Father links a wallet — named here rather than discovered on 13 December.

**The one open build item:** `transcripts_present`. The projector
`tools/project-session.mjs` is committed; the bundle has not been produced from it.
The command is `andrew-node cli/makefun.mjs bundle --repo . --session <projected.json>
--system-prompt <file> --effort <level> --out transcripts.tar.gz --redact "<detail>"`
run from inside the unpacked kit, then `check --transcripts transcripts.tar.gz`.

## 5. Stage-end commit checkpoint

`git status --porcelain` was empty before this file was written; this file is the only
new artefact and is committed on its own.
