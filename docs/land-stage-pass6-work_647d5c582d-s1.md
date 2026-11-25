# Land stage (pass 6) — work_647d5c582d-s1

Declared-work discipline (work_fb464e49b9): this file declares what was done in
this stage, what was observed live, and what remains. Nothing here is reported
from memory.

## What was built (stages 1-2, already committed)

The token-radar-01 entry is complete and committed on branch
`feature/work_647d5c582d-token-radar-01-land-20261125`:

- `main.ts` — the graded program (reads `/input/snapshot.json` or `--input`,
  writes `/output/board.json`, `data.js`, `dossier.json`, copies `dashboard/`
  and `screenshots/`).
- `lib/model.ts` — `parseSnapshot`, `buildRadar`, `boardIssue`, `dataScript`.
- `vendor/makefun-board.ts` — `buildDossier`.
- `dashboard/{index.html,app.css,app.js}`, `screenshots/{1-board,2-detail,3-filtered}.png`.
- `LICENSE` (OSI-approved), `README.md`, `RULES.txt`, `competition.yaml`,
  `kit.json`, `.gitignore`.
- `cli/makefun.mjs` (the kit CLI: `check`, `bundle`, `enter`), `input/snapshot.json`,
  `harness/`, `tools/project-session.mjs`.

## Verify result (citing stage 2's receipts — not re-run here)

Stage 2 recorded the kit grader's own tally: **11 passed, 2 failed**, both
failures being transcript-authorship checks (the bundle must show a file revised
across assistant messages, not one finished write). That measurement is
committed at `132fe18` and is the verification for this item. Per the land-stage
instruction (work_5194d0ef53, pass-5 watchdog burn) the full verify suite was
NOT re-run in this stage.

## Landing check — observed live in this stage

Command (timeout 120s):

```
cd entries/token-radar-01 && node --version && node cli/makefun.mjs check
```

Observed output, verbatim tail:

```
v20.20.2
file:///data/workspace/entries/token-radar-01/cli/makefun.mjs:43186
import { constants as zlibConstants, createZstdCompress, createZstdDecompress } from "node:zlib";
                                     ^^^^^^^^^^^^^^^^^^
SyntaxError: The requested module 'node:zlib' does not provide an export named 'createZstdCompress'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:213:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:320:5)
    at async ModuleLoader.import (node:internal/modules/esm/loader:606:24)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v20.20.2
```

Exit code 2. **The landing check did not pass in this environment**: the sandbox
`node` is v20.20.2 and the kit CLI requires the `createZstdCompress` /
`createZstdDecompress` exports that arrive in Node 22.18+. This is the same
blocker recorded in passes 3-5; it is an environment limit, not a defect in the
entry.

Entry shape check, observed live (exit 0):

```
v20.20.2
ENTRY_SHAPE_OK
```

## What remains

1. **Node 22.18+ to run the kit grader.** The 11/2 tally was measured in an
   earlier stage on a Node that accepted the CLI; it cannot be reproduced on
   this sandbox's v20.20.2. Re-running `node cli/makefun.mjs check` on Node
   22.18+ (or 24/26) is the outstanding measurement.
2. **Father gate — Solana wallet.** `account_wallet` requires the account to
   hold a Solana wallet; the escrowed prize is paid on chain to the signing
   wallet. Not mine to pass.
3. **Father gate — push credential.** `git_push` from this workdir is refused
   by the code gate ("untested mutation ... run the affected-surface tests
   first"); the affected-surface tests are the Andrew repo's pytest suite,
   which cannot collect here (`OSError: [Errno 30] Read-only file system:
   '/data/logs/andrew.log'`). No PR can be opened from this environment.
4. **Transcript bundle.** `transcripts.tar.gz` exists in the tree and is
   gitignored (commit `337ff02` kept it out of the public tree). It must be
   produced by `node cli/makefun.mjs bundle` from the real harness sessions with
   `--redact` for each personal detail judging does not need — which again needs
   a Node the CLI accepts.
