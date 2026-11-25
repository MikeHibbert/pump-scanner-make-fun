# token-radar-01 — landing evidence (work_647d5c582d, stage 3 land)

Read live on 2026-11-25 in `/data/workspace/entries/token-radar-01`, not from memory.
Every claim below is paired with the command that produced it.

## What was built

A token launch radar for make.fun competition `token-radar-01`. It reads the sealed
DefiLlama snapshot the kit supplies, finds every protocol that still records no token
(and is not a wrapped or staked product of one that trades), ranks them by what their
launch would be worth, and renders a static dashboard that needs no network.

| Path | Role |
| --- | --- |
| `main.ts` | graded entrypoint, node22, honours `MAKEFUN_INPUT_DIR`/`--input` and `MAKEFUN_OUTPUT_DIR`/`--output` |
| `lib/model.ts` | the model: `Snapshot`, `buildBoard`, `impliedValue`, `isPreToken`, `isRankable`, `buildRadar`, `dataScript`, `parseSnapshot` |
| `vendor/makefun-board.ts` | the kit's own dossier builder, `buildDossier(dir, caps)` |
| `dashboard/{index.html,app.js,app.css}` | static board, detail view and filter, no network |
| `screenshots/{1-board,2-detail,3-filtered}.png` | the three required captures |
| `README.md` | site template, three live badges, `## Run it`, make.fun footer |
| `LICENSE` | MIT, `Copyright (c) 2026 Andrew Hibbert` |
| `cli/makefun.mjs`, `input/snapshot.json`, `kit.json`, `RULES.txt` | the unpacked kit and its sealed fixture |

The architecture is ported from `mcp_binance/server.py`'s `tool_top_markets`: scan the
whole universe, aggregate, rank by one signal, surface a top-N board a person can act on.
The Python is not ported and Binance is never called — the snapshot is the fixture.

## Verify result (stage 2 receipts, cited not re-run)

Stage 2 ran the full pass and its receipts stand. Re-running them here would burn the
land watchdog for no new information (the same trap that cost pass-5 and
`work_5194d0ef53`). What stage 2 observed:

- `andrew-node --version` → `v22.23.5`; `test -f main.ts && test -f LICENSE` → `ENTRY_SHAPE_OK`.
- Two runs into `/tmp/tr1` and `/tmp/tr2`, then `diff -r` → empty, `DETERMINISTIC` printed.
- `board.json` → **200 rows**, keys `rank,slug,name,category,chains,tvl_usd,change_7d,mcap_usd,listed_at,gecko_id,symbol,token_status,age_days,implied_value_usd,model,farm_steps` plus the aliases `tvl,impliedValue,farmPlan`.

## Landing check — the grader number, measured this stage

The item's landing check is "run the kit's own grader locally and record the number".
Observed live in this stage:

```
$ andrew-node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo .
4 passed, 1 failed, 15 skipped, 5 checked at submission
not ready: fix transcripts_present, then check again
```

- **Passing:** `snapshot`, `license_osi`, `entrypoint`, `competition_open`.
- **Failing:** `transcripts_present` — the only failure, and it is ours to close.
- **Skipped (15):** every transcript check, because no session bundle was passed, plus
  `prerequisites` and `strategy_note`.
- **At submission (5):** `repo_public`, `repo_owner`, `repo_created_after_open`,
  `commit_in_repo`, `duplicate_snapshot` — Father's gates, correctly not closed here.

One trap worth naming: `check --kit . --repo .` is refused with "`--repo .` is the kit
itself", because the kit was unpacked *into* the entry. The pristine copy at
`/data/workspace/makefun/kit` must be named separately.

## What remains

1. **`transcripts_present` — the one failing check.** Run
   `andrew-node cli/makefun.mjs bundle --repo . --system-prompt <file> --effort <level>
   --out transcripts.tar.gz --redact "<full name>"` from inside the unpacked kit, then
   re-run `check --transcripts transcripts.tar.gz`. `thinking_revised` needs `main.ts`
   revised across ≥2 assistant messages — already true (`36a599f` then `2638599`/`e740f08`).
   Every timestamp must sit inside `2026-11-14T10:00:00Z..submit`. A session must never be
   written or rebuilt from memory.
2. **`.makefun/owner.json`** only if the GitHub owner is not the account login:
   `{"wallet": "35vXiXFq7gz1VCh7JNeenWRdeD9M68CXbekexmU9i4GK"}` and nothing else.
3. **The push is blocked by a dead credential.** `origin` is
   `https://github.com/MikeHibbert/pump-scanner-make-fun.git`; the stored credential no
   longer authenticates, so the branch cannot be pushed from here. Recorded honestly
   rather than worked around.

## Hard stop — Father only

Making the repository public, linking a wallet, signing `entry_message`, and the
submission POST. The API key acts as the account but cannot sign; `entry_signature` is
produced by a keypair over the make.fun entry v1 message. Build, measure and stage is
ours; signing and submitting is Father's.

## Declared-work discipline

This file is the declaration for stage 3: file, change, reason, and the live command
output behind each claim. Nothing above is reported from memory.

## Landing attempt — the push, and why no PR URL exists

Attempted live in this stage, from `/data/workspace/entries/token-radar-01`:

```
$ git push -u origin feature/work_647d5c582d-token-radar-01
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'
```

The credential is dead, and it is dead for every repository, not only this one:

```
$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
api_status=401
{"message": "Bad credentials", ...}

$ cd /data/workspace/code/andrew && git push --dry-run origin HEAD
remote: Invalid username or token. ...
fatal: Authentication failed for 'https://github.com/MikeHibbert/Andrew.git/'
```

`git ls-remote --heads origin` returns nothing, so the remote is unreachable for reads as
well as writes. No pull request can be opened from here: opening one requires either a
successful push or an authenticated API call, and both are refused with `401`.

**The work is committed locally and is not lost.** Branch
`feature/work_647d5c582d-token-radar-01`, HEAD `fe69fe1`, on top of `e2bf802` and
`c2a933d`. The moment a live credential is supplied, the landing is two commands:

```sh
cd /data/workspace/entries/token-radar-01
git push -u origin feature/work_647d5c582d-token-radar-01
# then open the PR against main
```

This is a credential failure, not a work failure, and it is reported as such rather than
worked around by committing to `main` or by inventing a PR URL.
