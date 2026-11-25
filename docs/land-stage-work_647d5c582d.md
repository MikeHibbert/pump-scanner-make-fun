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

## 6. Landing re-confirmation, second pass (2026-11-25, this run)

Read live in this stage, not from memory:

```
$ cd entries/token-radar-01 && node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK
v20.20.2
ENTRY_SHAPE_OK

$ MAKEFUN_INPUT_DIR="$PWD/input" MAKEFUN_OUTPUT_DIR=/tmp/land1 andrew-node main.ts
RUN_EXIT=0
board.json      472614 bytes
data.js          64735 bytes
dossier.json    705011 bytes
dashboard/      present
screenshots/    present
rows 200
```

The landing check holds: the radar produces a 200-row board from the sealed snapshot.

## 7. Push refused — no PR possible from this container

```
$ git push -u origin feature/work_647d5c582d-token-radar-01
PUSH_EXIT=128
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'

$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
HTTP=401
{"message": "Bad credentials", ...}
```

`GITHUB_TOKEN` is present (40 chars) but dead. `~/.git-credentials` is a 0-byte file.
The branch is committed locally at `13d1e9d` and cannot be pushed, so no pull request
can be opened from here. This is a credential gate for Father, not a code defect.

## 8. What remains

1. **Father: link a wallet.** The live check `No wallet on the account` fails; no entry
   of ours can be accepted until it is linked. This is the precondition named in the item.
2. **Father: supply a live GitHub token** (or push the branch himself) so the PR can open.
3. **`transcripts_present`** — the one failing grader check. `tools/project-session.mjs`
   is committed and ready; the bundle run is the remaining step.
4. **Father-only gates, not crossed:** making the repo public, linking the wallet,
   signing `entry_message`, and the submission POST.
