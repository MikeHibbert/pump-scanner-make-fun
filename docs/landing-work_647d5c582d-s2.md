# Landing record — slice 2/2 (work_647d5c582d-s2)

## What this slice built

The radar's model, raised from `radar-1` to `radar-2` in `entries/token-radar-01/lib/model.ts`.

**The change.** `radar-1` ranked on TVL, growth and age alone, so two protocols with the same TVL and the
same growth scored identically however differently they were actually shaped. The radar exists to find
early launches before they are obvious, and a farm-shaped protocol — one chain, one category, no breadth —
is not the same find as one that is spreading. `radar-2` adds a second, independent signal: **breadth**,
how many chains the protocol runs on, derived from the snapshot's own `chains` field.

**Why it is bounded.** The breadth multiplier is clamped to `[breadth_floor, breadth_cap]` = `[0.9, 1.1]`
with `breadth_weight` 0.15. Breadth can reorder near-ties; it can never manufacture a top row out of a
small protocol. The value ranking still leads.

**Why no other file changed.** Every exported signature in `lib/model.ts` is identical — `MODEL`,
`MODEL_VERSION`, `buildBoard`, `buildRadar`, `boardIssue`, `dataScript`, `parseSnapshot` and the rest. So
`main.ts` and `dashboard/app.js` needed no edit, and the dossier contract in `vendor/makefun-board.ts` is
untouched. The new constants live in `MODEL` (`ModelConstants`), never as bare literals.

## What was verified live in this stage

```
$ /opt/nvm/versions/node/v22.23.5/bin/node --version
v22.23.5
$ MAKEFUN_INPUT_DIR=./input MAKEFUN_OUTPUT_DIR=./out node main.ts
rows 200
top  steakhouse-financial 597999688 breadth 1.1
last vault-street 1043835
```

The pipeline runs end to end on node22, produces 200 rows, applies the breadth multiplier (visible at the
cap of 1.1 on the top row), and the board still spans $598M down to $1.04M — a real ranking, not a
collapse.

Note: the sandbox's default `node` is v20.20.2, which cannot load a `.ts` entrypoint
(`ERR_UNKNOWN_FILE_EXTENSION`). The entry is graded on node22, and node22 is what was used.

## The kit tally, re-read live

**11 pass, 7 skip, 2 FAIL** — unchanged from slice 1. The two failures are `thinking_reproduces` (0 of
337,102 counted lines trace to the session) and `thinking_revised`. Both are a property of the handed-over
chat-log session, which carries 21 messages and 0 tool results, so no file appears as the call that wrote
it. The full tally is in `docs/kit-check-work_647d5c582d-s2.md`.

## The Father gates — not crossed

The item names four hard stops, and this slice crossed none of them:

1. **Public repository** — not created.
2. **Wallet link** — not made. This is the live failing precondition: `No wallet on the account` still
   fails, so **no entry of ours can be accepted until Father links a wallet.**
3. **Entry signature** — not made. `thinking_committed` skips for want of it.
4. **Submission POST** — not sent.

## What remains for stage 3

- Rebuild `transcripts.tar.gz` **after** the final commit, so `manifest.repo.commit` equals the submitted
  40-character `commit_sha` — the gap slice 1 recorded (`c93a4f4` vs `102b3bb`) is still open.
- The two `thinking_*` failures cannot be cleared by any edit in this repository. They need a recorded
  client session, which is a Father decision.
