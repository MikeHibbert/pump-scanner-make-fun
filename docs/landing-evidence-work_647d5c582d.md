# Landing evidence — work_647d5c582d (token-radar-01)

Stage 3 of 3 (LAND). Written 2026-11-25. Every claim below was read live in this stage;
nothing is reported from memory. Declared-work discipline: work_fb464e49b9.

## 1. What was built

The token launch radar for make.fun `token-radar-01`, in `entries/token-radar-01`:

| Path | Role |
| --- | --- |
| `main.ts` | graded entrypoint (node22), honours `MAKEFUN_INPUT_DIR`/`--input` and `MAKEFUN_OUTPUT_DIR`/`--output` |
| `lib/model.ts` | snapshot parsing, ranking, implied value, farm plan, board/radar builders |
| `vendor/makefun-board.ts` | kit library; `buildDossier(dir, caps)`, `canonicalJson`, `DOSSIER_SCHEMA='makefun/dossier/v1'` |
| `dashboard/{index.html,app.js,app.css}` | static dashboard, renders with no network |
| `screenshots/{1-board,2-detail,3-filtered}.png` | the three required captures |
| `cli/makefun.mjs` | the kit's own CLI (17,991,208 bytes, sha matches `kit.json`) |
| `input/snapshot.json` | the sealed fixture (247,940 bytes, sha matches `kit.json`); gitignored, never committed |
| `README.md` | from the site template, three live badges, `## Run it`, byline "Built and entered by Andrew Hibbert." |
| `LICENSE` | MIT, `Copyright (c) 2026 Andrew Hibbert` |

## 2. Landing check — behaviour observably changed

The item's landing check is that the radar actually produces a board. Observed live this
stage, not inferred:

```
$ MAKEFUN_INPUT_DIR="$PWD/input" MAKEFUN_OUTPUT_DIR=/tmp/land1 andrew-node main.ts
EXIT=0
board.json      472614 bytes
data.js          64735 bytes
dossier.json    705011 bytes
dashboard/      present
screenshots/    present

$ andrew-node -e "...require('/tmp/land1/board.json')..."
ROWS 200
KEYS rank,slug,name,category,chains,tvl_usd,change_7d,mcap_usd,listed_at,gecko_id,
     symbol,token_status,age_days,implied_value_usd,model,farm_steps,tvl,impliedValue,farmPlan
```

200 rows — the ≥100-row contract is met with margin — and all three contract aliases
(`tvl`, `impliedValue`, `farmPlan`) are present in the emitted rows, not merely in the type.

## 3. Verify result — citing stage 2's receipts

Stage 2 ran the verification; its observed results are cited here rather than re-run, per
the land-stage rule (the 450s watchdog was burned twice by re-verification — pass-5 and
work_5194d0ef53).

- **Determinism:** two runs into `/tmp/tr1` and `/tmp/tr2`, `diff -r` empty → `DETERMINISTIC`.
- **Grader, measured not asserted:**
  `andrew-node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo .`
  → **4 passed, 1 failed, 15 skipped, 5 checked at submission**.
  Passing: `snapshot`, `license_osi`, `entrypoint`, `competition_open`.
  Failing: `transcripts_present` — the only red.
  Skipped: the 15 transcript checks (no session bundle to read), plus `prerequisites`
  and `strategy_note`.
- **Trap worth keeping:** `check --kit . --repo .` is refused with "`--repo .` is the kit
  itself", because the kit was unpacked *into* the entry. The kit must be named
  separately; `/data/workspace/makefun/kit` is the pristine copy and works.

## 4. What remains

1. **`transcripts_present` is still red.** The session bundle has not been produced.
   `andrew-node cli/makefun.mjs bundle --repo . --system-prompt <file> --effort <level>
   --out transcripts.tar.gz --redact "<personal detail>"`, then re-run `check
   --transcripts transcripts.tar.gz`. `thinking_revised` needs `main.ts` revised across
   ≥2 assistant messages — already true (`36a599f` then `2635999`/`e740f08`) — and every
   timestamp must sit inside `2026-11-14T10:00:00Z..submit`. A session must never be
   written or rebuilt from memory.
2. **The push is blocked by a dead credential.** See §5.
3. **Father's hard stop, untouched:** making the repo public, linking a wallet, signing
   `entry_message`, and the submission POST. The API key cannot sign. None of these was
   attempted.

## 5. The push refusal, with receipts

The branch is committed locally and clean. The push is refused:

```
$ git push -u origin feature/work_647d5c582d-token-radar-01
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'
```

The credential is present but dead. Three independent paths agree:

```
$ printf '%s' "$GITHUB_TOKEN" | wc -c
40

$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
HTTP=401  {"message": "Bad credentials", ...}

$ curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/repos/MikeHibbert/pump-scanner-make-fun
HTTP=401  {"message": "Bad credentials", ...}

$ GH_TOKEN="$GITHUB_TOKEN" gh auth status
X Failed to log in to github.com using token (GH_TOKEN)
  - The token in GH_TOKEN is invalid.

$ git ls-remote --heads origin
(no output — the remote is unreachable for reads as well as writes)
```

No pull request can be opened from here: opening one requires either a successful push or
an authenticated API call, and both are refused with `401`. This is a credential failure,
not a work failure, and it is reported as such rather than worked around by committing to
`main` or by inventing a PR URL.

**The work is committed locally and is not lost.** Branch
`feature/work_647d5c582d-token-radar-01`. The moment a live credential is supplied, the
landing is two commands:

```sh
cd /data/workspace/entries/token-radar-01
git push -u origin feature/work_647d5c582d-token-radar-01
gh pr create --repo MikeHibbert/pump-scanner-make-fun \
  --base main --head feature/work_647d5c582d-token-radar-01 \
  --title "feat(token-radar-01): token launch radar, measured with the kit" \
  --body-file docs/landing-evidence-work_647d5c582d.md
```

## 6. Untracked kit files, deliberately left out

`competition.yaml`, `harness/`, `starter/` are the kit's own unpacked files. They are not
this item's authored work and are left untracked on purpose; `input/snapshot.json` is
gitignored because the sealed fixture must never be committed.
