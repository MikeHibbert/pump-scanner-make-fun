# Landing evidence — work_647d5c582d (token-radar-01, stage 3 LAND)

Read live 2026-11-25, in `/data/workspace/entries/token-radar-01`.
Every claim below is a command run in this stage, not a memory of an earlier one.

## What is present in the working tree (verified, not remembered)

`git log --oneline -3`:

```
e740f08 wip(work_647d5c582d): verify fix - board row contract aliases (tvl, impliedValue, farmPlan)
2638599 fix(token-radar-01): call buildDossier(dir, caps) and honour MAKEFUN_INPUT_DIR
36a599f feat(token-radar-01): token launch radar entrypoint, dashboard, dossier
```

`git status --porcelain -uall | wc -l` → `0` (clean tree; nothing uncommitted to checkpoint).

`git ls-files` (11 tracked files):

```
.gitignore
LICENSE
dashboard/app.css
dashboard/app.js
dashboard/index.html
lib/model.ts
main.ts
screenshots/1-board.png
screenshots/2-detail.png
screenshots/3-filtered.png
vendor/makefun-board.ts
```

## Landing check (behaviour observably changed)

Project-profile verify line, run live in this stage:

```
$ node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK
v20.20.2
ENTRY_SHAPE_OK
VERIFY_EXIT=0
```

Board contract, read from the produced artifact `/tmp/tr1/board.json`:

```
rows 200
keys rank,slug,name,category,chains,tvl_usd,change_7d,mcap_usd,listed_at,gecko_id,symbol,
     token_status,age_days,implied_value_usd,model,farm_steps,tvl,impliedValue,farmPlan
```

200 rows (requirement: >= 100), and every row carries the three contract aliases
`tvl`, `impliedValue`, `farmPlan` added by `e740f08` — that is the observable change
the verify fix landed.

Dashboard network check: `grep -c "http" dashboard/index.html dashboard/app.js` → `0` and `0`
(no network references; the "renders with no network" check is satisfied by construction).

## Push and PR — BLOCKED by a dead credential (re-measured this stage)

The work is committed and the tree is clean; the push is refused by GitHub, not by the code.
Re-measured live in this stage, four independent ways:

```
$ git push -u origin feature/work_647d5c582d-token-radar-01
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'

$ gh auth status
  X Failed to log in to github.com using token (GITHUB_TOKEN)
  - The token in GITHUB_TOKEN is invalid.

$ gh api repos/MikeHibbert/pump-scanner-make-fun
  "message": "Bad credentials",  "status": "401"

$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
401
```

Credential inventory, so the blocker is not mistaken for a missing helper:

- `GITHUB_TOKEN` is set, 40 characters, prefix `ghp_` — a classic PAT shape, and GitHub
  answers 401 to it directly at `api.github.com/user`. The token itself is revoked or expired.
- `~/.git-credentials` exists but is **0 bytes** — the `store` helper has nothing to offer.
- `~/.config/gh/hosts.yml` does not exist.
- No `~/.ssh/` directory and no `ssh` binary on the box, so the SSH transport is not an option either.

No PR URL can be produced until a valid token is supplied. This is a credential fault, not a
code fault: the branch is ready to push the moment a working token is in `GITHUB_TOKEN`.

## What remains (honest)

1. **Push and PR blocked on credentials** — see the four receipts above. Needs a valid
   `GITHUB_TOKEN` (or a `gh auth login`), then `git push -u origin feature/work_647d5c582d-token-radar-01`
   and a PR against `main`.
2. **The kit is still not unpacked** (`makefun/` holds only `comps.json`), so `vendor/makefun-board.ts`
   is the locally authored helper, not the kit's, and `node cli/makefun.mjs check <bundle>` cannot run.
   Per the `run_completes` check, no kit command grades this competition anyway; the docker
   double-run diff is the measurable substitute and has not been run in this stage.
3. **Father-only gates untouched:** public repo publication, wallet link, `entry_message` signature,
   and the submission POST. None were crossed.
