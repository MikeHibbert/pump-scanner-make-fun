# Landing record — work_647d5c582d-s1 (stage 3 of 3, LAND)

Date: 2026-11-25. Workdir: `entries/token-radar-01`. Branch: `work_647d5c582d-s1-land`.

## What was built

The token launch radar entry for make.fun `token-radar-01`, plus the two artefacts
that make a clean clone reproduce the verified run:

- `main.ts` — graded entrypoint (node22), reads `/input/snapshot.json` or `--input`,
  writes `board.json`, `data.js`, `dossier.json` and copies `dashboard/` + `screenshots/`.
- `lib/model.ts` — `parseSnapshot`, `buildRadar`, `boardIssue`, `dataScript`.
- `vendor/makefun-board.ts` — `buildDossier(dir, caps)`.
- `dashboard/{index.html,app.css,app.js}`, `screenshots/{1,2,3}.png`.
- `input/snapshot.json` — the board snapshot the radar reads through `MAKEFUN_INPUT_DIR`
  (committed at `08d952a`; without it a clean clone cannot reproduce the run).
- `transcripts.tar.gz` — the agent session bundle (committed at `08d952a`).
- `LICENSE` (SPDX MIT), `README.md`, `RULES.txt`, `competition.yaml`, `kit.json`.

WHY the snapshot and the bundle are in the tree: the declared-work discipline
(`work_fb464e49b9`, `docs/declared-work-discipline.md`) requires that what was
verified be reproducible from the repository, not from a working directory that
happens to hold the inputs.

## Verify result — cited from stage 2, not re-run

Stage 2 (VERIFY) reported the tree clean at `08d952a275ed303e29bd43bd6e20a69f2ce71d1f`
with `git status --porcelain` empty and exit code 0, and `git log` showing
`08d952a` on top of `e740f08`, `2638599`, `36a599f`. That is the verification of
the implement change; it is cited here rather than re-run, because re-running the
full suite in the land stage burned the 450s watchdog twice (pass-5 and
`work_5194d0ef53`).

## Landing evidence — observed live this stage

Node and entry shape:

```
$ /opt/nvm/versions/node/v22.23.5/bin/node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK
v22.23.5
ENTRY_SHAPE_OK
```

The kit's own grader, run against the committed tree with the transcript bundle:

```
$ node /data/workspace/makefun/kit/cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
pass  competition_open
pass  snapshot                 14 files, 840,899 bytes at ed52d284dc763145a7948d501484a526212b7232
pass  license_osi              SPDX-License-Identifier: MIT
pass  entrypoint               main.ts at the root selects node22
pass  transcripts_present      1 agent session parsed (1 chat-log)
pass  thinking_wellformed      1 session, 21 messages
pass  thinking_in_window       all 20 timestamps inside the window
pass  thinking_turns           10 assistant turns, at least 5 required
pass  thinking_priced          no usage record to price
pass  transcripts_run_record   the run record matches the upload
pass  thinking_own_work        0 of 12667 counted lines are the agent's own writing
FAIL  thinking_reproduces      the transcripts account for 0 of 12667 counted lines (0.0%), under the 30% required
FAIL  thinking_revised         no file takes its final content from 2 or more messages that write or edit it
11 passed, 2 failed, 7 skipped, 5 checked at submission
```

**Behaviour observably changed:** `transcripts_present` moved from **FAIL**
("no transcripts were uploaded", the prior run's tally of 4 pass / 3 skip / 1 fail)
to **pass** ("1 agent session parsed (1 chat-log)") once the bundle was committed
and passed with `--transcripts`. The transcript gate now reads a real session
rather than nothing.

## What remains — stated plainly

1. **`thinking_reproduces` (FAIL).** The bundle's session accounts for 0 of the
   12,667 counted lines; 30% is required. The session is a *handed-over* session
   (`sessions/chat-log/session-handover.json`), projected from Andrew's own
   `/data/sessions` log, which records no provider usage and no file-write tool
   calls. The fix is to run the build in a harness whose sessions `bundle` reads
   directly, so the writes to `main.ts` and `lib/model.ts` appear as tool calls.
2. **`thinking_revised` (FAIL).** No file takes its final content from two or more
   messages that write or edit it. Same root cause: the handed-over projection
   carries no write/edit tool calls, so no revision history exists to read.
3. **Handed-over ranking.** The kit states plainly that an entry with a handed-over
   session is ranked where it scores but takes no paid place. To compete for
   rewards the run must happen in a client whose sessions are recorded.
4. **Father gates (not mine to pass).** The account needs a Solana wallet for the
   escrowed prize (`repo_owner` / `.makefun/owner.json`), and the entry message
   must be signed over the bundle (`thinking_committed`). The push credential is
   *not* a gate — Open Mother verified it live and `git push --dry-run` succeeded.
5. **At-submission checks** (`repo_public`, `repo_owner`, `repo_created_after_open`,
   `commit_in_repo`, `duplicate_snapshot`) are the site's to run at submission;
   `commit_in_repo` is satisfied by this push.
