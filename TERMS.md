# token-radar-01 — terms as stated, and terms not stated

Source: `GET /api/competitions/token-radar-01/requirements`, fetched at build time.
The response was truncated at 24,000 characters, ending mid-sentence inside the
`transcripts` deliverable description ("...when its ins"). Everything after that point is
not available. Nothing below is inferred.

## Deliverables (verbatim field names and flags)

- `repo_url` — required, `kind: form_field`
  > "The public repository to enter, https://github.com/<owner>/<repo>."
- `commit_sha` — required, `kind: form_field`
  > "The full 40-character sha of the commit to enter; it must be on a branch of the repository."
- `bundle` — required, `kind: file`
  > "One transcript bundle (.tar.gz) of the agent sessions that built the entry, made by the kit's CLI (node cli/makefun.mjs bundle, run from inside the unpacked kit); or send them as loose files in transcripts instead."
- `transcripts` — optional, `kind: file` (repeatable)
  > "Loose transcript files (repeat the field), instead of one bundle: .jsonl / .json transcripts, Markdown chat histories and exports (.md: Aider, Perplexity, Cherry Studio), a Copilot coding agent log (.sse), SQLite stores (.db / .sqlite / .sqlite3 / .vscdb) and compressed logs (.jsonl.gz / .jsonl.zst / .jsonl.zstd), from any coding agent the kit reads."

## Judging, as stated

> "make.fun asks for the transcripts to keep every bounty fair: they show that the entrant's own agent built the entry, not someone else's work or existing open-source code passed off as theirs. The thinking checks match the code against the sessions that wrote it."

> "Its entry is graded and ranked, and labelled Handed over."

A `harness: "program/v1"` identifier appears in the fetched object; its semantics are
not explained in the visible text.

## Bundle validation, as stated

The kit's `bundle` command is described as:

- writing no bundle while a part of it is missing, saying what to add;
- refusing `builtin` for any other name;
- refusing a flag for a mismatched harness/model;
- warning on incomplete uploads.

This is a pre-submission checker, not the grader.

## Deadline and repository age, as stated by the site's own checker (27 Nov 2026)

The requirements fetch was truncated, but the kit's `check` command states the dates it enforces.
Run on this repository (kit level 46):

`makefun check --kit /data/workspace/makefun/kit --repo . --worktree`

> "push it, and submit that new commit's sha before 2026-12-14T10:00:00.000Z"

> "GitHub's creation time of the repository must be at or after the opening, 2026-11-14T10:00:00.000Z"

This closes the `closing_time_utc` gap: the closing time is stated by the checker, not inferred from
the truncated fetch. The repository-age rule is new information the fetch did not carry: it means a
repository created before 2026-11-14T10:00:00.000Z is refused at intake whatever it contains.

## Terms NOT stated in the available text

Each of the following is absent from the fetched material. They are recorded as gaps,
not filled in:

Each key below is the exact `unstated_terms` entry in `submission.json`, so the check that pins
this file names the same gap this file records. Nothing here is inferred from elsewhere.

- `entry_fee` — no fee field and no sentence about a fee in the visible text
- `eligibility_account` — the eligibility rules sit past the truncation point
- `eligibility_wallet` — same; no wallet requirement visible
- `eligibility_licence` — same; no licence requirement visible
- `eligibility_geography` — same; no geography restriction visible
- `eligibility_tax` — same; no tax attestation visible
- `judging_rubric` — "thinking checks" is named; the rubric and scoring formula are not
- `named_grader` — no judge or grader is named in the visible text
- `bundle_size_cap_bytes` — the phrase "over the size cap" appears; the value does not
- `runtime_cap` — no runtime limit visible
- `repo_size_cap` — no repo size / file count cap visible
- `submit_endpoint_url` — the requirements endpoint was fetched, not the submit page

## To close the gaps

One of:

1. the untruncated requirements JSON;
2. the competition landing page `https://make.fun/competitions/token-radar-01`;
3. confirmation that the requirements JSON genuinely contains no such fields — which
   would make them UNSTATED *by the site*, a materially different fact from UNSTATED
   *by truncation*.
