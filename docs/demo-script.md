# Demo Script — Prompt Cheat Sheet

> One page per segment. Title → action → prompt. Nothing else.
> Full context in `docs/demo-runbook.md` · Full narration in `docs/voiceover.md`

---

## 1 · Discovery

*Share screen. Claude Code open on `demo/start`.*

```text
Explain this codebase to me starting from the entry point. What framework is it,
what are the screens, and how does a booking get created end to end? Keep it to
the key files.
```

```text
Create a Mermaid sequence diagram of the AI booking chat data flow: from the user
typing in the chat panel, through /api/chat (Gemini vs the rule-based fallback),
to the booking being confirmed and saved. Base it on the actual code.
Save it to docs/architecture.md.
```

```text
Now add a Mermaid diagram of the React component hierarchy — layout, three routes,
and which components each screen composes. Append it to docs/architecture.md.
```

*Open `docs/architecture.md` in Markdown preview. End: "It said Next.js. Go open CLAUDE.md."*

---

## 2 · Code Generation + Build a Skill

*Show `src/app/api/activities/[id]/route.ts` briefly — "this is my golden example."*

**Generate the first route**

```text
Generate a new API route: GET /api/activities/[id]/availability that returns just
the bookable slots for an activity (id, date, time, spotsLeft, full) plus a
`spotsTotal` sum. Follow EXACTLY the pattern in
src/app/api/activities/[id]/route.ts — same params handling, same 404 shape, same
JSDoc header style, NextResponse.json. Then show me how to verify it with curl.
```

*Run `npx tsc --noEmit`. Then: "I don't want to type those conventions every time — let me capture them."*

**Build the skill live**

```text
Turn what you just did into a reusable skill at .claude/skills/new-api-route/SKILL.md.
The description must make Claude reach for it automatically whenever I ask to add an
API route — so be specific about when it applies. Capture the conventions you just
followed: JSDoc header documenting the response shapes, typed Promise params,
NextResponse.json, the { error } 404 shape, modeled on the activities routes. End
with a tsc + curl verification checklist.
```

*Open `.claude/skills/new-api-route/SKILL.md`. Point at: description = trigger, body = recipe.*

**Watch the skill auto-fire — no instructions given**

```text
Add a GET /api/activities/[id]/reviews endpoint that returns the activity's rating,
reviewsCount, and tags.
```

*Fallback: `cp docs/demo-assets/new-api-route.SKILL.md .claude/skills/new-api-route/SKILL.md`*

---

## 3 · Update Docs

*Open `CLAUDE.md` — read "server.ts + Express + Vite" aloud. "This is wrong. Here's the fix."*

```text
/update-docs 5
```

*Audit table appears first. Read the HIGH items. Claude then updates CLAUDE.md + README.*
*Run `git diff CLAUDE.md` to show the changes.*

---

## 4 · Bug Fix

*Browser: open any activity → pick June 13 slot → Confirm booking → read the success message.*
*"June 12. I booked June 13."*

```text
Bug: after confirming a booking, the success message always says "June 12" even when
the guest booked June 13.
- Symptom: chat success bubble shows the wrong date.
- Affected file: src/components/DetailView.tsx, executeConfirmBooking (~line 178).
- Repro: open an activity, pick a June 13 slot, confirm, read the success message.
First write a failing test that proves the bug (the success message should contain the
booked date), confirm it fails, then fix it, then show the test passing.
```

*Run `npm test` — fails, then fix, then green.*

---

## 5 · Test Generation

```text
Run `npm run test:coverage` and identify the most important untested code paths.
Focus on business logic: the useBookings hook (add, cancel, localStorage persistence,
the corrupt-JSON fallback) and the rule-based booking parser in the /api/chat fallback
(edge cases: FULL slot, group size over maxGroupSize, no date, plural vs singular guest).
For each gap: explain why it matters, then write tests that MATCH the style of
src/lib/__tests__/pricing.test.ts. Verify they pass.
```

*Coverage shows: useBookings 0%, chat parser 0%. "Zero. Both of them." Run `npm test` — green.*

---

## 6 · Refactor

*Press `Shift+Tab` — enter Plan Mode.*

```text
Goal: single source of truth for the rule-based booking parser. Current problem: the
"parse a date/time/people from a guest message" logic is duplicated in
src/app/api/chat/route.ts (server fallback) and src/components/DetailView.tsx (client
fallback), and the two versions disagree. This makes them impossible to test once and
keep in sync. Don't change code yet — present 2–3 approaches with trade-offs.
```

*Claude returns options. Pick option 1 (shared lib). Press `Shift+Tab` — exit Plan Mode.*

```text
Implement option 1 incrementally: extract a pure parseBookingIntent() into
src/lib/bookingParser.ts, point both call sites at it, and run `npm test` after
each step. Keep behaviour unchanged.
```

*Run `npm test` — all green.*

---

## 7 · Git + PR

```text
Review my changes and propose a series of Conventional Commits — one logical change
each (docs, the new endpoint, the bug fix, the tests, the refactor). Subject under
72 chars, body explains WHY. Don't commit yet — show me the messages first.
```

*Review, approve. Then:*

```text
Create a PR description with sections: Summary, What changed (grouped by type),
How to test it, Screens affected. Derive everything from the commits and diff.
Then create the PR with `gh pr create`.
```

*Close: `git log --oneline` — "That's the whole session. Five commits. One story."*
