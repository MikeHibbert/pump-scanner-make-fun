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

## Terms NOT stated in the available text

Each of the following is absent from the fetched material. They are recorded as gaps,
not filled in:

- closing time (UTC) — no `deadline` / `closes_at` field visible; `status` is `"open"`
- entry fee
- eligibility: account criteria, wallet, licence, geography, tax
- judging rubric, scoring formula, named human judges
- numeric bundle size cap (the phrase "over the size cap" appears; the value does not)
- runtime cap
- repo size / file count cap
- submit endpoint URL (the requirements endpoint was fetched, not the submit page)

## To close the gaps

One of:

1. the untruncated requirements JSON;
2. the competition landing page `https://make.fun/competitions/token-radar-01`;
3. confirmation that the requirements JSON genuinely contains no such fields — which
   would make them UNSTATED *by the site*, a materially different fact from UNSTATED
   *by truncation*.
