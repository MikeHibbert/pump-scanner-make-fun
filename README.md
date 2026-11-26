# token-radar-01

Entry for the make.fun competition `token-radar-01`.

## What this is

A minimal, self-contained submission scaffold. The competition terms (as fetched from
`/api/competitions/token-radar-01/requirements`) require three form fields and one file:

| field | kind | required |
|---|---|---|
| `repo_url` | form_field | true |
| `commit_sha` | form_field | true |
| `bundle` | file | true |
| `transcripts` | file | false |

This repository exists so that `repo_url` and `commit_sha` can be supplied honestly: a
public GitHub repository and a full 40-character SHA reachable on a branch of it.

## Status of the terms

The fetched requirements JSON was truncated at 24,000 characters, cutting off inside the
`transcripts` deliverable description. The following terms are therefore **UNSTATED** in
the material available at build time and are not invented here:

- closing time (UTC)
- entry fee
- eligibility (account, wallet, licence, geography, tax)
- judging rubric / named grader beyond the phrase "thinking checks"
- numeric size cap for the bundle
- runtime cap
- repo size / file count cap

See `TERMS.md` for the verbatim quotes that *are* available and the explicit list of gaps.

## Producing the bundle

The `bundle` deliverable must be produced by the kit's own CLI, run from inside the
unpacked kit:

```
node cli/makefun.mjs bundle
```

This repository does not vendor the kit. The bundle is produced from the agent sessions
that built the entry, not from this repository's contents.

## Honest caveat

Whether this environment's sessions satisfy the kit's recording rules (harness-written
logs, per-response usage, parent-session chains up to four links, system prompt uploaded
or in-session) has **not** been verified. If they do not, the fallback is a
`handed_over` session, which the terms state takes no paid place. That check belongs
before any build work.
