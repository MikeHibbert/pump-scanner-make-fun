# Landing record — work_647d5c582d-s1 (token-radar-01, slice 1/2)

Written at the land stage, 2026-11-25. Every claim below is a live sighting from
this stage, not a memory of an earlier one.

## What was built

The token launch radar entry at `entries/token-radar-01`:

- `main.ts` — graded entrypoint, node22, reads `--input` and writes the board.
- `lib/model.ts` — the radar model (scoring, filtering, dossier assembly).
- `vendor/makefun-board.ts` — the board row contract.
- `dashboard/{index.html,app.js,app.css}` — the static dashboard.
- `screenshots/{1-board,2-detail,3-filtered}.png` — captured views.
- `input/snapshot.json` — the board snapshot the run consumes.
- `LICENSE` — SPDX MIT.
- `transcripts.tar.gz` — the agent session bundle (`agent-fun/transcript-bundle/v1`).

## Landing evidence (observed this stage)

| Check | Command | Observed |
|---|---|---|
| Entry shape | `node --version && test -f main.ts && test -f LICENSE` | `v22.23.5`, `ENTRY_SHAPE_OK` |
| Program runs | `MAKEFUN_OUTPUT_DIR=out node main.ts --input input/snapshot.json` | exit 0; `out/` holds `board.json`, `data.js`, `dossier.json`, `dashboard/`, `screenshots/` |
| Kit grader | `makefun check --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz` | **11 pass, 7 skip, 2 FAIL** |
| Branch pushed | `git push origin work_647d5c582d-s1-land` | `d718d32..cda759b` |
| Remote agrees | `git ls-remote --heads origin work_647d5c582d-s1-land` | `cda759b07054964237cfe870a84b6eb678993f1c` = local `HEAD` |

## The two failing checks, stated plainly

1. `thinking_reproduces` — the transcripts account for 0 of 12,720 counted lines
   (0.0%, under the 30% required). The entrypoint `main.ts` has no authored line
   in the session.
2. `thinking_revised` — no file takes its final content from two or more
   assistant messages.

Both are transcript-provenance checks, not program checks. The program itself
passes every shape and run check. The cause is that the entry was written in
earlier runs whose sessions were not captured into the bundle; the bundle holds
one handed-over chat-log session (`sessions/chat-log/session-handover.json`,
21 messages) that does not contain the file writes.

`transcripts_recorded` is a **skip**, not a pass: the session was handed over by
the agent rather than recorded by its harness, so the entry is ranked where it
scores but takes no paid place. That is a property of the client, not of the code.

## What remains

- Regenerate the bundle from a session that actually contains the file writes, so
  `thinking_reproduces` and `thinking_revised` can pass. This needs a recorded
  harness session, not a handover.
- **Father gate 1:** the account's Solana wallet for the escrowed prize.
- **Father gate 2:** signing the entry message over the bundle
  (`entry_signature`, 600 s freshness) — `thinking_committed` is a skip until then.

## Why this file exists

Declared-work discipline (Father directive 19 Sep 2026, work_fb464e49b9,
`docs/declared-work-discipline.md`): work in the open, declare each change, and
never report work as done from memory. This record is the landing evidence for
this item, and it names the two failures rather than reporting a clean pass.
