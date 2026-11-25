# Landing evidence — work_647d5c582d (token-radar-01, stage 3 LAND)

Read live 2026-11-25, in `/data/workspace/entries/token-radar-01`.

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

Project-profile verify line, run live:

```
$ node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK
v20.20.2
ENTRY_SHAPE_OK
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

## What remains (honest)

1. **Push and PR are blocked by credentials, not by the work.** `git push -u origin
   feature/work_647d5c582d-token-radar-01` returned
   `remote: Invalid username or token. Password authentication is not supported for Git operations.`
   `gh auth status` reports `The token in GITHUB_TOKEN is invalid`; `gh api repos/MikeHibbert/pump-scanner-make-fun`
   returns `401 Bad credentials`. The same failure occurs against `MikeHibbert/Andrew`, so the
   credential is dead box-wide, not repo-specific. No PR URL can be produced until a valid token is supplied.
2. **The kit is still not unpacked** (`makefun/` holds only `comps.json`), so `vendor/makefun-board.ts`
   is the locally authored helper, not the kit's, and `node cli/makefun.mjs check <bundle>` cannot run.
   Per the `run_completes` check, no kit command grades this competition anyway; the docker
   double-run diff is the measurable substitute and has not been run in this stage.
3. **Father-only gates untouched:** public repo publication, wallet link, `entry_message` signature,
   and the submission POST. None were crossed.
