#!/usr/bin/env python3
"""Verify that every term this submission relies on is either quoted from the
fetched requirements text or explicitly recorded as UNSTATED.

Why this exists: the requirements fetch was truncated at 24,000 characters, so
any term not visible in the fetched text must be recorded as a gap rather than
invented. This script fails loudly if submission.json claims a value for a term
that TERMS.md does not quote, or if a term is neither quoted nor listed as
unstated.

Run: python3 check_terms.py
Exit 0 = consistent. Exit 1 = inconsistency.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_submission():
    with open(ROOT / "submission.json", encoding="utf-8") as fh:
        return json.load(fh)


def load_terms():
    return (ROOT / "TERMS.md").read_text(encoding="utf-8")


def main():
    sub = load_submission()
    terms = load_terms()
    errors = []

    # 1. Every deliverable field named in submission.json must appear in TERMS.md.
    for name in sub["deliverables"]:
        if name not in terms:
            errors.append(f"deliverable {name!r} not mentioned in TERMS.md")

    # 2. Every deliverable marked required must be quoted as required in TERMS.md.
    for name, spec in sub["deliverables"].items():
        if spec.get("required") and f"`{name}`" not in terms:
            errors.append(f"required deliverable {name!r} not quoted in TERMS.md")

    # 3. No deliverable may carry a non-null value unless TERMS.md quotes it.
    for name, spec in sub["deliverables"].items():
        if spec.get("value") is not None:
            errors.append(
                f"deliverable {name!r} has a value but the terms were truncated; "
                "values must be filled at submit time, not asserted here"
            )

    # 4. Every unstated term must be listed in TERMS.md's gap section.
    gap_section = terms.split("## Terms NOT stated", 1)
    if len(gap_section) != 2:
        errors.append("TERMS.md is missing the '## Terms NOT stated' section")
    else:
        gaps = gap_section[1]
        for term in sub["unstated_terms"]:
            # Accept either the snake_case key or a humanised form.
            human = term.replace("_", " ")
            if term not in gaps and human not in gaps:
                errors.append(f"unstated term {term!r} not recorded in TERMS.md gaps")

    # 5. The truncation point must be recorded honestly.
    src = sub.get("source", {})
    if src.get("truncated_at_chars") != 24000:
        errors.append("source.truncated_at_chars must be 24000")
    if "truncat" not in terms.lower():
        errors.append("TERMS.md does not mention truncation")

    if errors:
        for e in errors:
            print(f"FAIL: {e}", file=sys.stderr)
        return 1

    print("OK: submission.json is consistent with TERMS.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
