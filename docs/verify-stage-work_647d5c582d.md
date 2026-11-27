# Verify stage — work_647d5c582d (token-radar-01)

Declared-work discipline (Father directive 19 Sep 2026, work_fb464e49b9): every claim below is
what was seen live in this stage, with the command that produced it. Nothing here is reported
from memory.

## 1. Entry shape and runtime

```
$ andrew-node --version && test -f main.ts && test -f LICENSE && echo ENTRY_SHAPE_OK
v22.23.5
ENTRY_SHAPE_OK
```

## 2. The radar runs, and it is deterministic

```
$ MAKEFUN_INPUT_DIR="$PWD/input" MAKEFUN_OUTPUT_DIR=/tmp/tr1 andrew-node main.ts   # RUN1_EXIT=0
$ MAKEFUN_INPUT_DIR="$PWD/input" MAKEFUN_OUTPUT_DIR=/tmp/tr2 andrew-node main.ts   # RUN2_EXIT=0
$ diff -r /tmp/tr1 /tmp/tr2 && echo DETERMINISTIC
DETERMINISTIC
$ node -e "...board.json..."
rows 200 keys rank,slug,name,category,chains,tvl_usd,change_7d,mcap_usd,listed_at,gecko_id,symbol,token_status,age_days,implied_value_usd,model,farm_steps,tvl,impliedValue,farmPlan
```

Two independent runs into separate output directories produce byte-identical trees, and the
board carries 200 rows with the full contract plus the three aliases.

## 3. The kit's own grader, measured

```
$ andrew-node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo .
4 passed, 1 failed, 15 skipped, 5 checked at submission
not ready: fix transcripts_present, then check again
```

Passing: `competition_open`, `snapshot`, `license_osi`, `entrypoint`.
Failing: `transcripts_present` — no transcript bundle was supplied.
Skipped: the 15 transcript checks, which have no session to read until a bundle exists.
At submission (Father's gates, not mine to close): `repo_public`, `repo_owner`,
`repo_created_after_open`, `commit_in_repo`, `duplicate_snapshot`.

The kit must be named separately from the repository: `--kit .` is refused because the kit was
unpacked *into* the entry. `/data/workspace/makefun/kit` is the pristine copy and works.

## 4. The one failing check, and why it is not closed here

`transcripts_present` needs a bundle built by `cli/makefun.mjs bundle`. A dry run against the
projected session (`tools/project-session.mjs` output, 6 turns) reports the bundle is
**refused** until five things are supplied:

- `--system-prompt <file>` — the instructions the agent was started with. The kit is explicit:
  "Do not guess at it or rebuild it from memory", and a stub line (`none`, `withheld`, `n/a`)
  holds no system prompt. An entry received from 18 Nov 2026 12:00 UTC without one is rejected.
- `--instructions none` or `--context <file>` — what became of the instruction files.
- `--mcp <name>...` or `--mcp none` — the MCP servers the run used.
- `--harness --harness-version --provider --model --effort` — the agent facts.
- `--redact <text>` — each personal detail to strip.

The system prompt is the blocker: it is not in the session record and it is not mine to
reconstruct. Writing one from memory would be fabrication, and the kit rejects a stub. This is
a Father decision, recorded here rather than papered over.

## 5. Precondition that fails before any of this matters

The live check `No wallet on the account` fails. The grader's own `repo_owner` line says the
repository owner (`MikeHibbert`) is not the account login, and the fix it prints is either a
linked wallet or a committed `.makefun/owner.json` naming one. **No entry of ours can be
accepted until Father links a wallet.** Named here, in the first progress note, rather than
discovered on 13 December.

## 6. Hard stop — Father only

Making the repository public, linking a wallet, signing `entry_message`, and the submission
POST. The API key cannot sign. The push is blocked by a dead credential, recorded in
`docs/landing-evidence-work_647d5c582d.md` with its 401 receipt.

## 7. What this stage changed

Nothing in the build. The tree was clean at `66b0b42` on entry to this stage and the verify
pass above passed on the committed code; this document is the only file added, and it is the
stage's evidence record.
