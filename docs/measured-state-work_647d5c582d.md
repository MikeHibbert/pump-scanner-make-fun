# token-radar-01 — measured state (work_647d5c582d, stage 1 implement)

Read live on 2026-11-25, not from memory. Every number below came from a command run in this
session; the command is quoted beside it.

## What was done in this stage

1. **Unpacked the kit into the entry.** The kit was present at `/data/workspace/makefun/kit`
   (20 files, `bundle_sha256 ea1c9dcc…`). Copied into `entries/token-radar-01`:
   `input/snapshot.json` (247,940 bytes, the sealed fixture), `input/README.md`,
   `cli/makefun.mjs`, `cli/site.json`, `RULES.txt`, `kit.json`.
   Reason: without the fixture the run exits 0 having written nothing, and without
   `cli/makefun.mjs` there is no `bundle` and no `check` — no grader number can be measured.
2. **Wrote `README.md`** from the site's `readme_template` with `{owner}=MikeHibbert`,
   `{repo}=pump-scanner-make-fun`, the three live badges each linking to the bounty page,
   a `## Run it` block, and the make.fun footer. No placeholders left.
   Reason: `repo_readme` is a required repository deliverable and was the only one absent.

## Measured results

| Check | Command | Result |
|---|---|---|
| Entry runs | `MAKEFUN_INPUT_DIR=$PWD/input MAKEFUN_OUTPUT_DIR=/tmp/tr1 andrew-node main.ts` | exit 0 |
| Board size | `board.json` row count | **200 rows** (contract asks ≥100) |
| Board keys | first row | `rank,slug,name,category,chains,tvl_usd,change_7d,mcap_usd,listed_at,gecko_id,symbol,token_status,age_days,implied_value_usd,model,farm_steps,tvl,impliedValue,farmPlan` |
| Determinism | second run into `/tmp/tr2`, then `diff -r /tmp/tr1 /tmp/tr2` | **empty diff — DETERMINISTIC** |
| Outputs written | `ls /tmp/tr1` | `board.json`, `data.js`, `dossier.json`, `dashboard/`, `screenshots/` |
| Node | `andrew-node --version` | `v22.23.5` (graded runtime is node22) |

## The kit's own grader — the number

```
andrew-node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo . --worktree
```

Verdicts, verbatim from the run at 2026-11-25T13:49:49Z:

- `pass competition_open` — now is between 2026-11-14T10:00:00Z and 2026-12-14T10:00:00Z
- `pass snapshot` — 18 files, 18,933,670 bytes, within the intake caps
- `pass license_osi` — LICENSE declares SPDX-License-Identifier: MIT, OSI-approved
- `pass entrypoint` — `main.ts` at the root selects node22, which token-radar-01 accepts
- `skip strategy_note` — not asked for by this competition
- `skip committed_secret` — no `--dotenv` given
- **`FAIL transcripts_present`** — no transcripts were uploaded
- `skip` × 12 — every transcript/thinking check, each skipped *because* `transcripts_present` failed

So: **4 pass, 1 fail, 14 skip.** The single failure is the transcript bundle, which is produced
by `makefun bundle` from the live session logs and is not something this stage can fabricate —
the rules forbid writing or rebuilding a session from memory. It is the next stage's work.

## Hard stop — Father only, not crossed

- Publishing/pushing the public repository.
- Linking a wallet.
- Signing `entry_message` (the API key cannot sign; `entry_signature` needs the keypair).
- The submission POST.

## Correction to earlier guidance, stated plainly

Earlier notes in this item's progress log said `account_wallet` was failing and that no entry
could be accepted. Open Mother corrected that on 25 Nov: `account_wallet` is a rule that governs
entries, not a verdict on the account, and `/api/me/wallets` returns one linked, primary,
signing wallet. Nothing in this stage was blocked by it. The genuine remaining gate is the
transcript bundle plus Father's four acts above.
