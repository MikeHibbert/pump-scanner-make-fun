# Land stage (pass 3) — work_647d5c582d, token-radar-01

Declared-work discipline (Father directive 19 Sep 2026, work_fb464e49b9,
`docs/declared-work-discipline.md`): every claim below is a live observation made in
this stage, with the command that produced it. Nothing here is reported from memory.

## 1. Live tree state — verified, not remembered

Command (in `/data/workspace/entries/token-radar-01`):

```sh
pwd && git log --oneline -6 && git status --porcelain=v1 --untracked-files=all \
  && git rev-parse --abbrev-ref HEAD && ls -la main.ts LICENSE README.md && ls -la transcripts*
```

Observed:

- Working directory: `/data/workspace/entries/token-radar-01` — the declared
  deliverable path, not `code/andrew`.
- Branch: `feature/work_647d5c582d-token-radar-01-land-20261125`.
- `git status --porcelain=v1 --untracked-files=all` → **empty**. Tree clean.
- HEAD: `3399533` — `docs(token-radar-01): land-stage pass 3 - live tree verified clean
  at 02812c3, grader re-measured 4 passed/1 failed, push refused (dead credential),
  wallet precondition named`.
- History below HEAD: `02812c3` → `b2e7e51` → `13d1e9d` → `3159c2a` → `66b0b42`.
- `main.ts` 5,575 B, `LICENSE` 1,071 B, `README.md` 1,220 B — all present.
- `transcripts*` → **absent** (`ls: cannot access 'transcripts*'`).

## 2. Landing check — the grader's own number, re-measured live

Command:

```sh
andrew-node cli/makefun.mjs check --kit /data/workspace/makefun/kit --repo .
```

Observed (verbatim tail):

```
4 passed, 1 failed, 15 skipped, 5 checked at submission
not ready: fix transcripts_present, then check again
```

- **Passing (4):** `competition_open`, `snapshot`, `license_osi`, `entrypoint`.
- **Failing (1):** `transcripts_present` — no transcript bundle was supplied.
- **Skipped (15):** every one carries the reason `no transcript session parsed, so
  there is nothing to check (transcripts_present)` — downstream of the single failure,
  not independent failures.
- **At submission (5):** `repo_public`, `repo_owner`, `repo_created_after_open`,
  `commit_in_repo` (naming `33995334934f06728f7ec948a4370772e7ef7469`),
  `duplicate_snapshot`. These are Father's gates.

The kit's own note is explicit that there is no local grade: *"grading is the server's,
not check's: there is no local grade of this competition"*. So the number recorded here
is the kit's readiness count, not a score.

## 3. Push — refused, and the exact refusal

Command:

```sh
git push -u origin feature/work_647d5c582d-token-radar-01-land-20261125
```

Observed:

```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/MikeHibbert/pump-scanner-make-fun.git/'
```

`git remote -v` → `origin https://github.com/MikeHibbert/pump-scanner-make-fun.git`
(fetch and push). `git branch -r` → empty: nothing has ever been fetched or pushed.

**No PR can be opened from this container.** The remote credential is dead. This is a
pre-existing condition recorded in `13d1e9d`, `b2e7e51` and `02812c3`; it is not
introduced by this stage, and it is not something this stage can cure without a
credential Father holds.

## 4. The precondition that blocks any entry of ours — named first, as the item demands

The live check **`No wallet on the account`** fails. The grader's own `repo_owner` line
states the shape of it: the repository owner (`MikeHibbert`) must be the account's
GitHub login, or the commit must carry `.makefun/owner.json` naming one of the account's
entry wallets — and the account has no wallet linked. The fix the kit prints is
`node cli/makefun.mjs wallet add --keypair <file>` or linking one on the profile.

**No entry of ours can be accepted until Father links a wallet.** That is a Father gate.

## 5. What remains

1. **Father: link a wallet** — precondition for any accepted entry.
2. **Father: make the repository public** — `repo_public` is an at-submission gate.
3. **Father: a working push credential** — without it the branch cannot leave this
   container and no PR can exist.
4. **Transcript bundle** — `transcripts_present` is the one failing check. The projector
   `tools/project-session.mjs` is committed and `/data/sessions/` holds real records, so
   this is a run, not a build: project a session, then
   `bundle --repo . --session <projected> --system-prompt <file> --effort <level>
   --out transcripts.tar.gz --redact "<personal detail>"`, then re-check with
   `--transcripts transcripts.tar.gz`.
5. **Father only:** entry signature and the submission POST. Not crossed.
