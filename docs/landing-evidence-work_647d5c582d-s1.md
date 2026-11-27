# Landing evidence — work_647d5c582d-s1 (token-radar-01, land stage)

Recorded 2026-11-25, in `entries/token-radar-01`, on branch
`feature/work_647d5c582d-token-radar-01-land-20261125`.

## What was built

The entry itself was already complete at `de672d2`. This run added the one
missing piece the kit's own grader named, and measured it:

- `tools/session-log.mjs` (commit `dcc5035`) — a recorder that projects the
  run's own `/data/sessions` log into a bundle-readable session file, so the
  entry can carry a transcript at all. WHY: the kit's `transcripts_present`
  check failed with "no transcripts were uploaded", and Andrew keeps no
  session record of its own that `bundle` can read.
- `transcripts.tar.gz` — produced this stage by the kit's own `bundle`
  command from that projected session (7,789 bytes, sha256
  `0be88357f871441ccfc5e442f4c05cb87b5a676f6647f59c36267322257fa0a2`).
  It stays gitignored: it is a raw private session record, and the
  `.gitignore` note (citing `work_fb464e49b9`) requires Father's word before
  it is ever committed. It is supplied to the grader from outside the tree
  via `check --transcripts transcripts.tar.gz`.

## Verify result (stage 2 receipts, cited not re-run)

Stage 2 reported the tree clean at `dcc5035`, one commit ahead of origin.
This stage re-read the live tree: `git status --short` returned nothing and
`git log --oneline -3` shows `517b5f1`, `dcc5035`, `de672d2`. The change is
present.

## Landing check — observed, not remembered

Command (Node 22.23.5, the version the competition requires; the
`andrew-node` wrapper is broken by a CRLF shebang and is bypassed):

```
/opt/nvm/versions/node/v22.23.5/bin/node cli/makefun.mjs check \
  --kit /data/workspace/makefun/kit --repo . --transcripts transcripts.tar.gz
```

Observed tally, verbatim from the run:

```
4 passed, 1 failed, 15 skipped, 5 checked at submission
```

Without `--transcripts` the same command gives `4 passed, 1 failed, 15
skipped` with `transcripts_present` FAIL. With the bundle supplied,
`transcripts_present` flips to **pass** — "1 agent session parsed (1
chat-log)" — and `transcripts_run_record`, `thinking_wellformed`,
`thinking_in_window` and `thinking_turns` all pass. That is the behaviour
change this stage lands: the entry now carries a transcript the kit can
read.

The one remaining FAIL is `thinking_revised` (and, with the bundle,
`thinking_reproduces`): no file takes its final content from two or more
assistant messages, and the transcripts account for 0 of 325,533 counted
lines. The kit's own fix text is explicit — continue the same session, run
the entry, have the agent edit the code to improve it, then bundle again.
That is a build act for a later run, not a measurement this stage can
manufacture.

## What remains — the Father gates

1. **Solana wallet** (`account_wallet`): the escrowed prize is paid on chain
   to the signing wallet. No wallet is linked to the account.
2. **Signing the entry message** (`thinking_committed` skips: "the entry is
   not signed"): `submit --keypair` signs the entry message over exactly the
   transcripts uploaded. That needs the wallet above.
3. **Repository gates at submission**: `repo_public`, `repo_owner`
   (`.makefun/owner.json` naming an account wallet), `repo_created_after_open`,
   `commit_in_repo`, `duplicate_snapshot`. All are the site's checks at
   submission time and all depend on the wallet and the push.

The push credential is **not** a gate: Open Mother verified it live and a
`git push --dry-run` from this directory succeeded. The old 401 must not be
recorded again.
