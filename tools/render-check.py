#!/usr/bin/env python3
"""render-check.py - load the dashboard in a real DOM and report what it painted.

WHY (work_7dfd321917, Lesson 16): the artifact gate passed 7/7 while the dashboard painted nothing,
because a temporal-dead-zone throw in dashboard/app.js happened before first paint and nothing in the
gate ever executed the page. This helper is the browser half of the `renders` row: it opens
out/dashboard/index.html over file://, lets the page's own scripts run unmodified, and reports the
painted tbody row count, the first row's detail label, and whether the empty-state placeholder is
present. It asserts nothing itself - tools/render-check.mjs owns the assertions - so the browser
dependency stays in one small file and the gate's verdict stays in one place.

A page that throws before first paint is a RESULT, not a harness failure: the helper still prints its
verdict (with page_error set and rows_painted 0) and exits 0, so the gate reports "the page threw"
rather than "the browser would not start". Exit 2 is reserved for a browser that cannot launch.

Prints exactly one JSON object on stdout.
"""

import argparse
import json
import sys

from playwright.sync_api import sync_playwright


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", required=True, help="absolute path to dashboard/index.html")
    args = parser.parse_args()

    verdict = {
        "rows_painted": 0,
        "detail_label": None,
        "detail_visible": False,
        "empty_state_present": None,
        "page_error": None,
    }

    # The whole browser session - launch, drive, read, close - lives inside one `with` block. An
    # earlier draft closed the browser in a `finally` outside the context manager, which stopped
    # Playwright first and made every read raise "Event loop is closed!"; the page verdict was then
    # lost and a healthy build looked broken. Keep the session and its reads in the same scope.
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(args=["--no-sandbox"])
            try:
                page = browser.new_page()
                errors = []
                page.on("pageerror", lambda e: errors.append(str(e)))
                page.goto("file://" + args.page, wait_until="load")

                # The page renders synchronously at the end of app.js, so the board is painted by the
                # time `load` fires. A short settle wait covers a future async render without turning
                # a page that threw before paint into a ten-second hang.
                page.wait_for_timeout(250)

                verdict["rows_painted"] = page.eval_on_selector_all(
                    "main#board table tbody tr", "els => els.length"
                )
                verdict["empty_state_present"] = page.eval_on_selector_all(
                    "main#board .empty", "els => els.length > 0"
                )

                # Open the first row's detail panel the way a reader would, then read the label the
                # panel shows. The panel is a <dialog>; showModal() makes it visible, and
                # #detail-title carries the protocol name.
                first = page.query_selector("main#board table tbody tr")
                if first is not None:
                    first.click()
                    page.wait_for_selector("dialog#detail[open]", timeout=5_000)
                    title = page.query_selector("dialog#detail #detail-title")
                    if title is not None:
                        verdict["detail_label"] = (title.inner_text() or "").strip()
                        verdict["detail_visible"] = title.is_visible()

                if errors:
                    verdict["page_error"] = errors[0]
            finally:
                browser.close()
    except Exception as exc:  # noqa: BLE001 - a launch or page failure is a named verdict, not a crash
        message = str(exc)
        if "could not launch" in message or "Executable doesn't exist" in message:
            sys.stderr.write("render helper could not launch the browser: %s\n" % message)
            return 2
        verdict["page_error"] = verdict["page_error"] or message

    sys.stdout.write(json.dumps(verdict) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
