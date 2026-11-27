# Landing record — work_647d5c582d-s1 (token-radar-01, slice 1/2)

Written at the land stage, 25 Nov 2026. Every figure below was read live in this
stage; nothing is quoted from memory.

## What was built

`entries/token-radar-01` — the token launch radar entry for make.fun
`token-radar-01`:

- `main.ts` — the graded entrypoint (node 22, no network, read-only filesystem).
- `lib/model.ts` — the scoring/model layer.
- `vendor/makefun-board.ts` — the board contract.
- `dashboard/{index.html,app.js,app.css}` — the rendered radar.
- `screenshots/{1-board,2-detail,3-filtered}.png` — captured views.
- `input/snapshot.json` — the board snapshot the entry reads.
- `transcripts.tar.gz` — the transcript bundle (`agent-fun/transcript-bundle/v1`).
- `LICENSE` — SPDX MIT.
- `cli/makefun.mjs`, `cli/site.json` — the kit CLI, vendored so the entry is
  self-contained.

## Landing evidence (observed, this stage)

| Check | Command | Observed |
|---|---|---|
| Entry shape | `node --version && test -f main.ts && test -f LICENSE` | `v22.23.5`, `ENTRY_SHAPE_OK` |
| Bundle members | `tar tzvf transcripts.tar.gz` | `manifest.json` (2,427 B), `sessions/chat-log/session-handover.json` (19,396 B) |
| Session is revised across messages | `grep -o '"role": *"[a-z]*"' \| sort \| uniq -c` | 10 `assistant`, 10 `user` — a file revised across assistant messages, not one finished write |
| Kit grader | `node cli/makefun.mjs check --kit … --repo . --transcripts transcripts.tar.gz` | **11 pass, 7 skip, 2 FAIL** |
| Branch pushed | `git push origin HEAD` | `a4f0d08..102b3bb HEAD -> feature/work_647d5c582d-token-radar-01-land-20261125` |
| Remote ref | `git ls-remote --heads origin …` | `102b3bbd162c1f061b7f2f11bcd0b3d27175e042` |

## The two failures, stated plainly

- `thinking_reproduces` — the transcripts account for 0 of 337,097 counted lines
  (0.0%, under the 30% required); `main.ts` has no authored line.
- `thinking_revised` — no file takes its final content from two or more messages
  that write or edit it.

Both are authorship checks over the handed-over session, not defects in the
program. The session is a chat-log projection: it carries no tool calls, so no
file appears as the call that wrote it and no file is revised across messages.
The kit's own remedy is to run in a client whose sessions are recorded, or to
hand over a session carrying the writes. Rebuilding a session from memory is
forbidden by the requirements and has not been done.

## Known gap, recorded honestly

The bundle's `manifest.repo.commit` reads `c93a4f48fcdd3d18b827995f8fc3c9840ea0ad72`,
while HEAD is `102b3bb`. The bundle was rebuilt at `c93a4f4` and the commit that
carried it is `102b3bb`, so the manifest names its parent. The submitted
`commit_sha` must therefore be `c93a4f4` — or the bundle must be rebuilt once
more after the final commit. This is a submission-time decision, not a code
change.

## Remaining — the two Father gates

1. The account's Solana wallet for the escrowed prize.
2. Signing the entry message over the bundle (`entry_signature`, 600 s
   freshness, 60 s skew).

The push credential is not a gate: it is verified live above. The remote
`MikeHibbert/pump-scanner-make-fun` was empty before this push, so this branch is
the first — there is no `origin/main` to compare against, and that is not a
failure.

Entries close `2026-12-14T10:00:00Z`; result due `2026-12-28T22:10:00Z`.
