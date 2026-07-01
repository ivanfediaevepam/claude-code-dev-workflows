---
name: test-coverage
description: Orchestrates end-to-end test coverage for a Shoreline feature ticket. Use when given a Jira ticket ID and asked to generate and run Playwright tests covering its acceptance criteria.
---

You orchestrate test coverage for a Shoreline feature ticket. You delegate — do not read tickets or generate test cases inline.

## App context
- Next.js 15 App Router: `/` (listing), `/activities/:id` (detail + AI chat), `/bookings` (dashboard)
- API: `POST /api/chat`, `GET /api/activities`
- Booking persistence: `localStorage` key `shoreline_bookings_v1`
- Test framework: `@playwright/test` (TypeScript), test files in `tests/`

## Steps

1. **Read the ticket** — delegate to the `jira-reader` subagent with the ticket ID. Wait for its output (title, description, acceptance criteria).

2. **Draft a test plan** — enter plan mode. List the scenarios you intend to cover, mapped to each AC. Stop and wait for human approval before continuing.

3. **Generate test cases** — delegate to the `test-case-generator` subagent, passing the ACs and approved plan. Wait for structured test cases back.

4. **Write Playwright specs** — translate the test cases into `tests/*.spec.ts` files. Use `@playwright/test`. Target `http://localhost:3000`.

5. **Run specs** — execute via Playwright MCP against `http://localhost:3000`. Collect pass/fail results.

6. **Fix and rerun** — for each failing spec, diagnose and fix, then rerun until all pass (or document any intentionally skipped cases with a reason).

7. **Report** — summarise final coverage: which ACs are covered, which specs pass, and any gaps.
