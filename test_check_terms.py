#!/usr/bin/env python3
"""Tests for check_terms.py.

These pin the behaviour the judging description implies: the entry must not
claim a term the fetched text does not state. Each test mutates a copy of the
real files in a temp dir and asserts check_terms.py rejects the mutation.
"""

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def run_check(workdir: Path):
    return subprocess.run(
        [sys.executable, str(workdir / "check_terms.py")],
        cwd=workdir,
        capture_output=True,
        text=True,
    )


class CheckTermsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        for name in ("check_terms.py", "submission.json", "TERMS.md"):
            shutil.copy(ROOT / name, self.tmp / name)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _mutate_submission(self, fn):
        path = self.tmp / "submission.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        fn(data)
        path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def test_baseline_passes(self):
        result = run_check(self.tmp)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_rejects_asserted_value(self):
        def mutate(d):
            d["deliverables"]["repo_url"]["value"] = "https://github.com/x/y"

        self._mutate_submission(mutate)
        result = run_check(self.tmp)
        self.assertEqual(result.returncode, 1)
        self.assertIn("has a value", result.stderr)

    def test_rejects_unknown_deliverable(self):
        def mutate(d):
            d["deliverables"]["mystery_field"] = {
                "kind": "form_field",
                "required": False,
                "value": None,
            }

        self._mutate_submission(mutate)
        result = run_check(self.tmp)
        self.assertEqual(result.returncode, 1)
        self.assertIn("mystery_field", result.stderr)

    def test_rejects_unrecorded_unstated_term(self):
        def mutate(d):
            d["unstated_terms"].append("invented_term")

        self._mutate_submission(mutate)
        result = run_check(self.tmp)
        self.assertEqual(result.returncode, 1)
        self.assertIn("invented_term", result.stderr)

    def test_rejects_wrong_truncation_point(self):
        def mutate(d):
            d["source"]["truncated_at_chars"] = 99999

        self._mutate_submission(mutate)
        result = run_check(self.tmp)
        self.assertEqual(result.returncode, 1)
        self.assertIn("truncated_at_chars", result.stderr)


if __name__ == "__main__":
    unittest.main()
