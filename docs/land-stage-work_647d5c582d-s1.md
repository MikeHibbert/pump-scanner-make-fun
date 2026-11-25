# Land stage — work_647d5c582d-s1 (token-radar-01, slice 1/2)

Recorded live in the land stage, 2026-11-25. Every claim below is something I
looked at in this turn; where I am carrying a memory from an earlier stage I say
so and name the record it came from.

## What was built (stages 1–2, already committed)

The entry at `entries/token-radar-01` is complete and committed on branch
`feature/work_647d5c582d-token-radar-01-land-20261125`:

- `main.ts` — the graded program. Reads `/input/snapshot.json` (or `--input`),
  writes `board.json`, `data.js`, `dossier.json`, and copies `dashboard/` and
  `screenshots/` into the output directory.
- `lib/model.ts` — `parseSnapshot`, `buildRadar`, `boardIssue`, `dataScript`.
- `vendor/makefun-board.ts` — `buildDossier`.
- `dashboard/{index.html,app.css,app.js}`, `screenshots/{1-board,2-detail,3-filtered}.png`.
- `LICENSE` (OSI-approved), `README.md`, `RULES.txt`, `competition.yaml`,
  `kit.json` (`agent-fun/kit/v1`, phase `dev`, per-file sha256s), `.gitignore`.
- `cli/makefun.mjs` — the kit CLI (`check`, `bundle`, `enter`).
- `input/snapshot.json`, `harness/` (harness source + sha256 manifests).
- `transcripts.tar.gz` — present in the tree, deliberately gitignored (commit
  `337ff02`) so Father's private session material never enters the public repo.

## Live state confirmed this stage

- `git status` in `entries/token-radar-01`: branch line only, no modified,
  staged or untracked entries — clean tree.
- `git log -6`: tip is `132fe18` (verify-stage measurement record), beneath it
  `7e024cb` (kit-grader tally), `fd3b4b8` (land pass 5), `337ff02` (transcript
  bundle kept private), `6477d28` (land pass 4), `4014e08` (pass 3).
- `node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK`
  → `v20.20.2` then `ENTRY_SHAPE_OK`. The graded shape is present.
- `git remote -v` → `origin https://github.com/MikeHibbert/pump-scanner-make-fun.git`.
  `git rev-parse --abbrev-ref @{u}` → `fatal: no upstream configured for branch
  feature/work_647d5c582d-token-radar-01-land-20261125`. The branch is local only.

## Verify result (citing stage 2's receipts — not re-run here)

Stage 2 recorded the kit grader's own tally as **11 passed, 2 failed**, with the
transcript bundle supplied; both failures are transcript-authorship checks (the
bundle must show a file revised across assistant messages, not one finished
write). That number is carried from the stage-2 record and from commit `7e024cb`;
I did not re-run the grader in this stage, by design — the 450s land watchdog was
burned twice by re-verification (pass 5, work_5194d0ef53).

## Landing check — observed, and it did NOT pass

The landing check is "the entry runs and produces its graded artefacts". I ran it
live:

```
cd entries/token-radar-01 && mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts --input input/snapshot.json
```

Observed: **exit 1**, with

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /data/workspace/entries/token-radar-01/main.ts
    at Object.getFileProtocolModuleFormat ...
Node.js v20.20.2
```

So the program did not execute in this sandbox. The cause is the sandbox Node:
`v20.20.2` cannot load a `.ts` entry point, and the kit CLI needs the zstd
exports that arrive in Node 22.18+ (`node cli/makefun.mjs check` dies at import
with `SyntaxError: The requested module 'node:zlib' does not provide an export
named 'createZstdCompress'`). The competition requires Node 22.18 or later; the
grader runs on node22.

The `out/` directory does contain `board.json` (472,614 bytes), `data.js`
(64,735 bytes), `dossier.json` (705,011 bytes), `dashboard/` and `screenshots/`
— but those are **stale artefacts from an earlier run**, not output of this
command, which exited 1 before writing anything. I state that plainly rather
than claiming a pass.

## What remains — the two Father gates

1. **Wallet.** The account must hold a Solana wallet (`account_wallet`); an
   escrowed prize is paid on chain to the signing wallet. Not mine to supply.
2. **Push credential.** `git_push` on this branch was refused in this stage by
   the code gate: *"untested mutation on /data/workspace/entries/token-radar-01
   — code changed since the last test run"*. Earlier land passes recorded a 401
   refusal on the same credential. Either way, no PR can be opened from here.

Also outstanding, and honest: the grader has not been run on a Node the CLI
accepts, so the 11/2 figure is a record, not a sighting from this stage; and the
contents of `transcripts.tar.gz` have not been inspected against the
revision-across-messages requirement.
