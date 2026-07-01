---
name: test-case-from-template
description: >
  Generates structured test cases from feature descriptions or acceptance criteria,
  strictly following a fixed template format. Use this skill whenever the user asks
  to "write test cases for", "cover this feature with tests", "add test scenarios",
  "generate QA cases", "create test coverage for", or describes a feature/flow and
  wants test documentation produced. Trigger even when phrasing is casual — e.g.
  "can you write some tests for the login page?" or "I need scenarios for the
  checkout flow". Prefer this skill over ad-hoc test writing whenever a feature
  or acceptance criteria is provided.
---

# Test Case Generator

Your job is to read a feature description or acceptance criteria and produce a
complete, well-structured set of test cases that follow the exact template in
`assets/test-case-template.md`.

## Template (always use this format)

Read the template from `assets/test-case-template.md`. Every test case you write
must reproduce that structure exactly — no extra headings, no omitted fields.

## Filling in each field

- **id** — sequential integers starting from 1, zero-padded to two digits when
  the total count exceeds 9 (TC-01, TC-02 …). Reset to 1 for each new feature
  unless the user asks you to continue a sequence.
- **title** — a short imperative phrase that names the scenario, not the
  outcome (e.g. "Submit booking with valid dates", not "Booking succeeds").
- **Feature** — the name of the product area or user story being tested.
  Infer it from the request if not stated explicitly.
- **Precondition** — the minimal system and user state required before step 1.
  Be specific: logged-in vs. guest, empty cart vs. cart with items, etc.
  If there are genuinely no preconditions, write "None."
- **Steps** — a numbered list of user actions or API calls. Each step is one
  atomic action; do not bundle multiple interactions into one step.
- **Expected** — the single observable outcome that passes the test. Write
  what a tester sees, not what the code does internally.
- **Type** — choose exactly one:
  - `happy path` — the standard success flow
  - `edge case` — a boundary, limit, or unusual-but-valid input
  - `error case` — invalid input, missing data, or failure recovery

## Coverage strategy

Aim for breadth across all three types. A good default set for a feature:
- 1–2 happy path cases covering the main success scenarios
- 1–2 edge cases (empty states, max/min values, optional fields omitted)
- 1–2 error cases (invalid input, unauthorized access, network failure if relevant)

Scale up or down based on feature complexity. If the user specifies a number
of cases, respect it exactly.

## Output format

Output the test cases as plain Markdown, one after another, with a blank line
between each. Do not wrap them in a code block. Do not add introductory prose
or a summary section — just the test cases.

If the feature name is not given, add a single line at the top:
`# Test Cases: <inferred feature name>`

## What to avoid

- Vague steps like "navigate to the page" — be specific about where.
- Expected results that describe implementation ("the database updates") — describe what the user observes.
- Combining two scenarios into one test case — split them.
- Adding fields not in the template (e.g. "Priority:", "Author:").
