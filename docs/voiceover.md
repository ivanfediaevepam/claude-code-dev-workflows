# Claude Code: Common Development Workflows

## Voiceover Script — Interleaved Theory + Demo (~80 min)

> **Legend**
> 🎤 Say this out loud
> ❓ Audience question — pause, wait for responses
> 😄 Light moment / joke
> ⏱️ Target timestamp
> → Next slide cue
> ⌨️ Type this into Claude Code (prompt follows)
> 👀 Narrate while Claude is running (5–20 s thinking time)
> 🖥️ Do this — browser, IDE, or terminal action (not a prompt)
>
> **Structure:** theory and demo are interleaved throughout.
> Each workflow concept is immediately followed by a live demo of that concept.
> All demos are chapters of one continuous session on the **Shoreline** Next.js app.
> Cross-reference with `docs/demo-runbook.md` for full prompt text and fallbacks.

---

## PART 1 — Foundations (~14 min)

*No demo yet. Set up the mental model before touching the keyboard.*

---

### SLIDE 1 — Title

⏱️ 0:00

🎤
"Welcome to Masterclass 3. Today is Common Development Workflows — the most hands-on session in this series.

Sessions 1 and 2 gave you the foundation. Today we earn it. We run those concepts through the workflows you actually live in every day: generating code, fixing bugs, writing tests, refactoring, documenting, working with Git.

The format today is different from what you might expect. We're not doing 40 minutes of slides and then 40 minutes of demo. We're going back and forth — concept, then immediately live on a real codebase, then next concept. Every idea gets shown, not just described.

Let's go."

→

---

### SLIDE 2 — Orientation

⏱️ 1:00

🎤
"Quick orientation. Session 3 — you know what Claude Code is, you have the license, you've used it. So I'm skipping the 'what is Claude Code' preamble entirely.

What I want to focus on is the *how*. How do you integrate this into a real project? What's the mental model that makes the difference between garbage output and something you'd actually push to main?

That's what the next 80 minutes is about."

→

---

### SLIDE 3 — Learning Objectives

⏱️ 2:00

🎤
"Three objectives: automate routine tasks, generate tests and docs, create custom tooling. Nine topics across the session.

Here's the honest version: we'll go deep on seven. Problem solving and deep research get the mental model only — no dedicated demo slot today."

❓
"Quick show of hands — which of these do you already use Claude Code for regularly?"

*[Wait 10–15 seconds. Acknowledge answers.]*

🎤
"Good. By the end I want you to walk away with at least two more that feel natural."

→

---

### SLIDE 4 — Effective Prompting Patterns

⏱️ 3:30

🎤
"Before we touch any workflow — prompting. Because none of this works if your prompts are weak.

Look at the left column. 'Fix this bug.' 'Write tests.' 'Refactor this code.' How many of you have typed exactly one of these?"

😄
"'Fix this bug' is the developer equivalent of calling IT support and saying 'my computer doesn't work.' Technically true. Completely useless."

🎤
"Right column. Same intent, different framing. 'Fix the null check in `parseUser` that crashes when email is missing.' 'Add unit tests for `OrderService` covering edge cases: empty cart, expired discount, null user.'

Four things that make the difference. One: describe the goal and the constraint, not the solution. Two: be specific — which file, which function, which edge case. Three: reference existing patterns — 'follow the pattern in `src/utils/`' is worth more than two paragraphs of description. Four — and this is the one not on the slide but might be the most important — give Claude a way to verify its own work. A test to run. A build to check. An expected output to compare against.

Memorize these four. They apply to every demo you're about to see."

→

---

### SLIDE 5 — Common Pitfalls

⏱️ 6:30

🎤
"Antipatterns. Every item on this list is something I've seen experienced developers do. Not juniors — seniors."

❓
"I'll go through these. Flag the ones you're guilty of."

🎤
"Vague prompts — covered. Moving on.

Skipping Plan Mode for large changes. Feels faster. For small tasks it is. For anything non-trivial — new feature, significant refactor — skipping Plan Mode gives you one massive diff that's hard to reason about and harder to review. We're using it in today's demo.

Not running tests before and after refactoring. If something breaks, you have no idea what or when. Flying blind.

Accepting generated code without review. Especially security-sensitive code. Claude will write auth logic, SQL queries, input validation. You must review it. Always.

Overloading a single session. Three unrelated tasks in one session degrades context quality. One logical unit per session.

Empty CLAUDE.md. The one I see most in real projects. If it's empty, Claude guesses your conventions. We're about to see what happens when it's *wrong* — which is worse than empty."

😄
"And last: auto-accepting every permission prompt. That defeats the safety model entirely. We've pre-configured `allowedTools` in `.claude/settings.json` for today so the safe commands never interrupt us. That's the right way to do it."

→

---

### SLIDE 6 — Multi-file Context

⏱️ 10:00

🎤
"How does Claude actually understand your project?

It explores. Glob patterns, grep, sub-agents working in parallel on large repos. Think of it as a new engineer's first morning — they open the repo, look at the structure, read a few key files, start building a mental model.

The implication: help Claude focus. Point at specific files. Scope tasks to specific modules. Claude's context window is finite and valuable — spend it on what matters.

This is why CLAUDE.md matters: front-load Claude with the right context and it starts from a much stronger position every single session."

❓
"Has anyone experimented with context management on a large codebase? CLAUDE.md or inline file pointers?"

*[Brief pause. Engage.]*

→

---

### SLIDE 7 — Session Strategy

⏱️ 13:00

🎤
"Three signals it's time to start a new session: switching to an unrelated part of the codebase; Claude making mistakes it wasn't making earlier; just finished a logical unit and committed it.

That last one is the healthy habit: finish → commit → new session.

`/compact` for long sessions — summarizes history, frees context. Like git squash for the conversation.

And `claude --continue` — if you close the terminal mid-session by accident, this picks up exactly where you left off. Worth knowing before you need it."

→

---

### SLIDES 8–9 — Use Cases + Mind Map

⏱️ 16:00

🎤
"Seven use cases today. Not isolated skills — they form a pipeline. One session from a raw codebase to a pull request. The value is how they compose.

The mind map shows the full landscape. A few underused ones worth naming: Discovery and Understanding — genuinely excellent for onboarding to an unfamiliar repo. That's exactly what we're about to do.

Code Review Support — PR description generation. We'll do one at the end.

Development Velocity — interrupted work capture, context preservation. These compound over time and don't get talked about enough.

Keep this map in mind as a menu. Today we're ordering from about a third of it."

→

---

## PART 1 → DEMO: Discovery + Diagrams (~5 min)

> 🖥️ Share screen. Terminal open, Claude Code running, repo is on `demo/start`.
> *This is the first time the audience sees the codebase.*

⏱️ 18:00

🎤
"Okay — terminal. Here's the Shoreline app. Beach activity booking marketplace. Real Next.js codebase, real TypeScript, Gemini API integration. I am going to pretend I joined this team five minutes ago.

First thing I do on any unfamiliar repo: ask Claude to walk me through it."

⌨️

```text
Explain this codebase to me starting from the entry point. What framework is it,
what are the screens, and how does a booking get created end to end? Keep it to
the key files.
```

👀 *(~10 s)*
"Watch the tool calls — globbing the file tree, grepping imports, reading layout files. Slide 6 in action. It doesn't wait for instructions, it explores."

*[Claude returns: Next.js 15 App Router, three screens, /api/chat with Gemini + fallback, localStorage]*

🎤
"Next.js 15. App Router. Three screens — listing, activity detail with an AI chat panel, booking history. Now I want a visual."

⌨️

```text
Create a Mermaid sequence diagram of the AI booking chat data flow: from the user
typing in the chat panel, through /api/chat (Gemini vs the rule-based fallback),
to the booking being confirmed and saved. Base it on the actual code.
Save it to docs/architecture.md.
```

👀 *(~15 s)*
"This is the underused Discovery use case from the mind map. Sequence diagrams, data flow maps. Onboarding used to take two days. This takes three prompts."

⌨️

```text
Now add a Mermaid diagram of the React component hierarchy — layout, three routes,
and which components each screen composes. Append it to docs/architecture.md.
```

🖥️ *Open docs/architecture.md in IDE Markdown preview.*

🎤
"Two diagrams — data flow and component tree — generated from the actual code, saved to a file we can check in. Living architecture doc.

One more thing. It said Next.js 15 App Router. Hold that thought. Go open CLAUDE.md."

→ *Back to slides.*

---

## PART 2 — Code Generation (~12 min)

---

### SLIDE 10 — Boilerplate Generation

⏱️ 23:00

🎤
"Code generation. Let's be precise — it's not 'have AI write code.' It's AI-assisted generation of repetitive structures that follow established conventions. Key phrase: *established conventions*.

Claude generates to patterns. Strong consistent patterns in → consistent output. Mixed patterns in → Claude picks one, you argue with it.

Practical implication: before generating, invest 10 minutes making your patterns clear. Either in CLAUDE.md or in a golden example file you point Claude at. 'Follow exactly this file' beats two paragraphs of style guide."

→

---

### SLIDE 11 — Skills

⏱️ 24:30

🎤
"Skills — the most underused feature in Claude Code.

A skill is a reusable prompting unit stored in `.claude/skills/`. Claude loads it automatically when it detects it's relevant — you don't invoke it manually every time. That's different from slash commands, which you explicitly call.

For our TypeScript project: an endpoint generation skill would list exact patterns — NextResponse.json, same params shape, same JSDoc header, same 404 format. That level of specificity is what makes output consistent across sessions."

❓
"Has anyone built a proper skill? Not a slash command — a SKILL.md?"

*[Brief pause.]*

🎤
"By the end of today you'll have seen what one looks like and how to build it."

→

---

### SLIDES 12–13 — Skill Output + Plan Mode

⏱️ 26:00

🎤
"Structured skill output is auditable — a feature table you can review in 60 seconds. That's the goal.

Plan Mode. This is the single highest-leverage habit I can give you today.

Shift+Tab. Claude goes into planning-only mode — reads the codebase, thinks through the problem, produces a structured plan. It does not write code. You review. You correct if needed. Then you exit and it implements."

😄
"Claude raising its hand and saying 'before I do this, can I check my understanding?' Which is exactly what you'd want from a junior dev. And unlike a junior dev, it does this every time without being asked twice."

🎤
"Code quality is consistently better with Plan Mode on. The planning step forces a more complete understanding before acting. Without it, Claude pattern-matches to the first reasonable-looking solution. With it, it evaluates options and picks the best fit for your specific context."

→

---

### SLIDES 14–16 — Plan Mode Examples + Readiness Checklist

⏱️ 28:30

🎤
"Two Plan Mode prompt examples. Notice the structure — list the requirements, then anchor to your actual codebase. 'Analyze our current architecture in `src/` and propose the integration approach.' Without that anchor, Claude writes a generic plan. With it, it writes a plan for *your* project.

And the phrase 'before writing any code' at the end is doing real work — it keeps Claude in planning mode even if you've technically exited it.

Readiness checklist. The two that matter most: golden example files — concrete reference implementations Claude can match. And a verification mechanism — minimum: build and test. The number one rule: give Claude a way to verify its own work."

❓
"How many of you use Plan Mode consistently — every non-trivial task?"

*[Brief pause. Note the split.]*

🎤
"Watch the demo. I think the answer will shift."

→

---

## PART 2 → DEMO: Code Generation (~5 min)

⏱️ 31:00

🎤
"Docs are accurate now — we'll get to that. Let me show you code generation.

There's a gap in this API. You can fetch a full activity with its slots, but there's no dedicated endpoint for *just* the availability. Let's add it."

🖥️ *Briefly show `src/app/api/activities/[id]/route.ts` in the IDE.*

🎤
"Here's the pattern I want to match. JSDoc header, NextResponse.json, same 404 shape, same params handling. I'm pointing Claude directly at this file — that's my golden example."

⌨️

```text
Generate a new API route: GET /api/activities/[id]/availability that returns just
the bookable slots for an activity (id, date, time, spotsLeft, full) plus a
`spotsTotal` sum. Follow EXACTLY the pattern in
src/app/api/activities/[id]/route.ts — same params handling, same 404 shape, same
JSDoc header style, NextResponse.json. Then show me how to verify it with curl.
```

👀 *(~15 s)*
"Four things in that prompt — goal, constraint, reference to the golden file, a verification path. Slide 4."

*[Claude creates the new route file with matching JSDoc and structure.]*

🎤
"Same header structure, same 404 shape, same import path. It matched the convention because I gave it a concrete example, not an abstract description."

🖥️ *Run: `npx tsc --noEmit`*

🎤
"Type-check passes. Valid TypeScript before we've even run the dev server.

The next step — in a real project — would be wrapping this prompt as a `.claude/skills/` entry so it fires automatically. Slides 11 and 12. Take 10 minutes after this session."

→ *Back to slides.*

---

## PART 3 — Documentation (~11 min)

---

### SLIDE 17 — Code Documentation

⏱️ 36:00

🎤
"Documentation. The one everyone says is important and everyone neglects.

The insight: use Claude Code not just for initial generation but to *maintain* existing docs. Documentation isn't a one-time task — it's a continuous workflow that happens at the commit boundary.

Why this matters specifically for Claude Code: Claude relies on your documentation, especially CLAUDE.md and your `docs/` folder, to understand your project. Stale docs actively mislead it. A doc that says your API uses one framework when you've migrated to another is worse than no doc at all."

→

---

### SLIDES 18–19 — Doc Prompts + Audit Output

⏱️ 37:30

🎤
"Two prompt patterns for documentation.

Generate comprehensive README — the prompt lists exactly what to include and ends with 'base this on the actual code structure, not assumptions.' Without that line, Claude fills gaps with plausible-but-wrong information. With it, Claude reads the actual files.

Coverage gap finder: 'Review the changes in the last five commits and update any documentation that's now out of sync.' That's the commit-boundary workflow. Make changes, run this, get a documentation diff, review it in the same PR.

Output looks like a dashboard — each area, status, issue count, priority. You look at it, you know exactly what needs fixing and in what order."

→

---

### SLIDES 20–23 — Documentation Tiers + Principles + SDLC

⏱️ 39:30

🎤
"Three tiers. HOT: always loaded, every session — CLAUDE.md. Under 60 lines, pointers only. Every token here is loaded into every Claude Code session. Make them count. WARM: on-demand — living specs, architecture docs, domain references. COLD: archived — PRDs, completed planning artifacts.

Practical test: if Claude needs it every session, HOT. Some tasks but not all, WARM. Never needs it but you want to keep it, COLD."

😄
"HOT is the tabs you always have open. WARM is the tabs you open when you need them. COLD is your 'read it later' folder that hasn't been touched in eight months."

🎤
"Five key principles. Single source of truth — each fact lives in exactly one place. Living specs evolve with code; planning artifacts are frozen after implementation. Agents don't update docs unprompted — you build it explicitly into the workflow. Auto-generate what you can from code. And validate freshness in CI.

And one important limit: AI documents accurately what code *does*. It cannot reliably document *why* a business decision was made. That part stays human."

→

---

## PART 3 → DEMO: Update Documentation (~5 min)

⏱️ 44:00

🖥️ *Open CLAUDE.md in the IDE — visible on screen.*

🎤
"Remember when Claude said 'Next.js 15 App Router'? Read the first line of CLAUDE.md.

'Single server entry point — `server.ts` runs Express and serves both the API and the React SPA.' Vite middleware. `App.tsx` local state router.

This project has none of those things. Not one. It was migrated to Next.js — look at the git log — and nobody updated the docs.

This is pitfall six from Slide 5: empty CLAUDE.md. Except this is *worse* than empty. Empty is silent. Wrong is actively misleading — every Claude session loads this file, every session thinks it's working on an Express app."

😄
"So every time someone asked Claude to add a new API route, it was about to create an Express router. In a Next.js project. Fun debugging session."

🎤
"We have a slash command for this."

⌨️

```text
/update-docs 5
```

👀 *(~20 s)*
"Reading CLAUDE.md, checking actual API routes in src/app/api, reading .env.example, checking package.json. Triggered update, not scheduled — Slides 21 and 22. The workflow triggers the doc update, not a calendar reminder."

*[Claude returns an audit table: Area / Status / Issue / Priority]*

🎤
"Look at that table. Framework: incorrect, HIGH. Model name: incorrect, HIGH. Missing npm test command. README: boilerplate only, HIGH. It shows us the audit before touching anything — actionable output, Slide 19."

*[Claude updates CLAUDE.md and README.md]*

🖥️ *Show `git diff CLAUDE.md` in terminal.*

🎤
"Framework: Next.js 15 App Router. Four real API endpoints. gemini-2.5-flash, not 3.5. All the real commands. Under 200 lines. Pointers only. Every token earns its place."

→ *Back to slides.*

---

## PART 4 — Fix, Test, Refactor (~25 min)

*These three workflows are tightly coupled — you fix, you test the fix, you refactor safely because you have tests. The demos reflect that dependency.*

---

### SLIDES 30–32 — Bug Fixing

⏱️ 49:00

🎤
"Bug fixing. The most contextually demanding workflow.

It's not just code generation. It requires understanding existing code, existing tests, what changed between working and broken states. It requires building context before proposing a fix.

Claude Code accelerates this by searching patterns, reviewing git history, examining tests — but it needs you to give it the right starting information."

🎤
"The prompt example uses `ultrathink` — that keyword allocates maximum reasoning budget to the next turn. Use it selectively: complex bugs, subtle race conditions, anything where pattern-matching to the first obvious fix will miss the real issue."

😄
"'My button doesn't work' — no ultrathink needed. 'Our distributed task queue has a race condition that corrupts data 0.1% of the time' — yes, use it."

🎤
"Readiness checklist. The one that matters most: bug reproduction test first. Google research: providing a failing test fixes 30% more bugs in 50% fewer steps. You define the bug in executable form — Claude has something concrete to make green.

Structured report format: environment, symptom, exact error, affected files, reproduction steps. That format versus 'it's broken' is the number one factor in fix quality.

And the two-attempt rule: if Claude is stuck after two tries, switch approach. Don't loop on the same strategy."

→

---

## PART 4a → DEMO: Bug Fix (~6 min)

⏱️ 53:00

🎤
"There's a real bug in this codebase. Let me show you."

🖥️ *In browser: go to an activity → click the June 13 slot → confirm the booking → watch the success message.*

🎤
"Watch the chat bubble."

*[Success message: "Your reservation for June 12 was successfully registered…"]*

😄
"June 12. I booked June 13. Classic hardcoded string. Line 178 of DetailView.tsx — a template literal with the date hardcoded instead of using `newBooking.date`. Been there since the component was written.

Now — the wrong way to report this is 'the date is wrong.' The right way is Slide 32."

⌨️

```text
Bug: after confirming a booking, the success message always says "June 12" even when
the guest booked June 13.
- Symptom: chat success bubble shows the wrong date.
- Affected file: src/components/DetailView.tsx, executeConfirmBooking (~line 178).
- Repro: open an activity, pick a June 13 slot, confirm, read the success message.
First write a failing test that proves the bug (the success message should contain the
booked date), confirm it fails, then fix it, then show the test passing.
```

👀 *(~10 s)*
"Environment, symptom, exact file, repro steps. And I asked for a failing test first. Research from Slide 32: gives Claude something concrete to make green."

*[Claude writes the test — asserts success message contains `newBooking.date`. Fails.]*

🖥️ *Run: `npm test`*

*[Test fails: expected "June 12" to include "June 13"]*

🎤
"The test fails. That's what we want — it proves the bug exists and defines exactly what 'fixed' means."

*[Claude fixes: replaces literal string with `${newBooking.date}`]*

🖥️ *Run: `npm test` — all pass.*

🎤
"One line. `${newBooking.date}`. Test green. Regression guard in place — this bug cannot come back without breaking that test."

→ *Back to slides.*

---

### SLIDES 27–29 — Test Generation

⏱️ 59:00

🎤
"Test generation. The AI use case with the highest ROI and the lowest adoption. That gap is what I want to help close.

Claude Code analyzes your code to identify critical test scenarios, uncover edge cases, generate realistic test data, and write assertions — all while matching your existing testing patterns. That last part is key: if you have well-structured existing tests, Claude matches them. If you don't, it generates textbook tests with excessive mocking that break on every refactoring."

🎤
"Two prompts worth knowing. First: generate comprehensive tests — but look at what's specified. Framework, fixtures, parametrized tests, specific edge cases, which dependencies to mock. And: 'use our existing test patterns from `tests/`.' Without that instruction, Claude decides what good tests look like. With it, Claude matches what your team already agreed looks good.

Second — the coverage gap finder: 'Run coverage, identify untested paths, explain why each matters, write tests for them, verify they pass.' Guided discovery. Claude finds the gaps, explains them, fixes them.

Testing limits: Claude excels at regression tests, API-level tests, edge cases humans skip. Claude is weak at exploratory testing and security threat modeling. Know the limits. Fill those gaps yourself."

→

---

## PART 4b → DEMO: Test Generation (~5 min)

⏱️ 1:03:00

🎤
"We just fixed a bug and gave it one test. What's the overall coverage picture?"

⌨️

```text
Run `npm run test:coverage` and identify the most important untested code paths.
Focus on business logic: the useBookings hook (add, cancel, localStorage persistence,
the corrupt-JSON fallback) and the rule-based booking parser in the /api/chat fallback
(edge cases: FULL slot, group size over maxGroupSize, no date, plural vs singular guest).
For each gap: explain why it matters, then write tests that MATCH the style of
src/lib/__tests__/pricing.test.ts. Verify they pass.
```

👀 *(~15 s)*
"Two things in that prompt: explicit edge cases listed upfront — FULL slot, over-capacity, corrupt JSON — and a reference to the existing test file as the style guide. Slide 28 is emphatic about both. Without explicit edge cases, Claude over-tests happy paths. Without a style reference, you get mocked-to-death tests that break on every refactor."

*[Claude returns: useBookings 0%, chat parser 0%]*

🎤
"Zero. Both of them. Highest-risk files in the app — the hook that touches localStorage, the parser that handles all booking intent logic. No tests at all.

Highest ROI AI use case. Lowest adoption. That's the gap. Slide 27."

*[Claude generates tests mirroring the golden test style. All pass.]*

🖥️ *Run: `npm test` — new suites green.*

🎤
"Look at the test names — matching the `describe / it` structure of the golden test. Because I gave it a concrete example instead of a description."

→ *Back to slides.*

---

### SLIDES 24–26 — Code Refactoring

⏱️ 1:08:00

🎤
"Refactoring. Requires a specific discipline.

The key: 'Use Plan Mode to select a refactoring approach. Start from principles and goals and drill down to details.'

This is the opposite of how most refactoring prompts are written. Most people say 'extract this into an interface' — they've already decided the solution. Better: describe the *problem*. 'We have tight coupling between these two modules. This makes them impossible to test independently. Propose approaches to fix this coupling.' Then Claude shows you options. You pick the best fit. Then plan the incremental implementation."

🎤
"Seven steps for refactoring with Claude Code: run tests first — non-negotiable, if you don't have tests, generate them first; enter Plan Mode; describe the goal, not the solution; review options with trade-offs; approve an incremental plan; run tests after each step; commit each logical change separately.

The example prompt ends with 'don't change code yet — present options with trade-offs.' That final instruction keeps Claude in planning mode even if you've technically exited it.

Readiness checklist. Two that matter: passing test suite — teams report 60% fewer regressions with proper coverage. And defensive pattern awareness in CLAUDE.md — document why your circuit breakers and retry logic exist. AI will remove code it sees as 'unnecessary.' A retry loop that looks redundant is at risk if there's no explanation of why it exists."

→

---

## PART 4c → DEMO: Refactoring (~7 min)

⏱️ 1:11:30

🎤
"Now we have tests. *Now* we can refactor.

There's a structural problem I noticed during discovery. The rule-based booking parser — the fallback when Gemini is down — exists in two places. Server side in `api/chat/route.ts`. Client side in `DetailView.tsx`. Two copies. Slightly different behavior. Neither tested in isolation.

Coupling problem from Slide 24. And the reason I didn't refactor before Segment 5 — before we had tests — is that you don't refactor code you can't verify. Now we can."

🎤
"Plan Mode first."

🖥️ *Press Shift+Tab — show Plan Mode indicator.*

🎤
"Claude will read the codebase, think through the problem, and produce a plan. It will not write code. And notice the prompt — problem, not solution."

⌨️

```text
Goal: single source of truth for the rule-based booking parser. Current problem: the
"parse a date/time/people from a guest message" logic is duplicated in
src/app/api/chat/route.ts (server fallback) and src/components/DetailView.tsx (client
fallback), and the two versions disagree. This makes them impossible to test once and
keep in sync. Don't change code yet — present 2–3 approaches with trade-offs.
```

👀 *(~20 s)*
"'Reduce the coupling.' Not 'extract a function.' The goal and the problem — Claude figures out the approach."

*[Claude returns 2–3 options with trade-offs: shared lib, server-only consolidation, inline dedup]*

🎤
"Options. Trade-offs. This is the conversation you want at planning time, not after a 400-line diff. Slide 15.

Option 1 — shared lib. Right call. Let's go."

🖥️ *Press Shift+Tab — exit Plan Mode.*

⌨️

```text
Implement option 1 incrementally: extract a pure parseBookingIntent() into
src/lib/bookingParser.ts, point both call sites at it, and run `npm test` after
each step. Keep behaviour unchanged.
```

👀 *(~30 s)*
"Incremental. Tested between each step. Steps five and six of Slide 25's seven-step process."

*[Claude extracts, rewires both call sites, runs tests between steps — all green]*

🖥️ *Run: `npm test`*

🎤
"Green. The tests we wrote in the test-gen demo are now covering the extracted function. No new tests needed — existing tests proved correctness through the refactor.

That's the feedback loop from Slide 42: tests fail after refactor, loop back; tests pass, move forward."

→ *Back to slides.*

---

## PART 5 — Git (~7 min)

---

### SLIDES 38–40 — Working with Git

⏱️ 1:18:30

🎤
"Git. Four things Claude Code handles particularly well: commit workflows with conventional message formats, parallel development with worktrees, pull request creation, and merge conflict resolution.

Worktrees — worth a moment. Multiple Claude Code agents running in parallel, each in its own worktree, working on different features simultaneously, completely isolated. No stashing, no branch juggling. For teams running parallel workstreams, this is significant."

🎤
"Three prompt patterns. Commit message — ends with 'show me the message first, don't commit yet.' Review before commit. That's the habit. Every Git operation.

Worktree setup: 'I need to work on two features simultaneously. Set up a git worktree for the hotfix so I can switch without stashing.'

PR description — lists exactly what sections to include, what to derive from commits, runs `gh pr create` at the end."

🎤
"Readiness checklist. Two that matter: commit convention in CLAUDE.md — define format, types, scoping, imperative tense rule. Claude generates excellent commit messages when the format is explicit. Without it, quality varies. And PR template in `.github/PULL_REQUEST_TEMPLATE.md` — Claude fills this automatically from diff analysis. If the template exists, Claude uses it. If it doesn't, Claude invents a structure. Your structure is better."

→

---

## PART 5 → DEMO: Git + PR (~4 min)

⏱️ 1:22:30

🎤
"Last step. This is where the whole session becomes a story."

⌨️

```text
Review my changes and propose a series of Conventional Commits — one logical change
each (docs, the new endpoint, the bug fix, the tests, the refactor). Subject under
72 chars, body explains WHY. Don't commit yet — show me the messages first.
```

👀 *(~10 s)*
"'Show me first.' Every Git operation. Review before commit, review before push."

*[Claude proposes: docs: fix stale CLAUDE.md and README / feat: add /api/activities/[id]/availability / fix: use booked date in success message / test: add coverage for useBookings and parser / refactor: extract parseBookingIntent into shared lib]*

🎤
"Five commits. Docs, feature, bug fix, tests, refactor. That's our entire session in five conventional commits. A story you can read in `git log`.

Commit convention is now in CLAUDE.md — the updated one — so the format was right the first time."

*[Review messages, approve, Claude commits.]*

⌨️

```text
Create a PR description with sections: Summary, What changed (grouped by type),
How to test it, Screens affected. Derive everything from the commits and diff.
Then create the PR with `gh pr create`.
```

*[Claude generates PR body and runs gh pr create.]*

🎤
"There's the PR. Summary, grouped change log, test steps. Generated from the diff. Not written from scratch."

→ *Back to slides.*

---

## PART 6 — Close (~6 min)

---

### SLIDES 33–37 — Problem Solving, Deep Research, Tooling (Brief)

⏱️ 1:26:30

🎤
"Three more workflows I want to name before we close.

Problem solving and rubber ducking — Claude as a thinking partner, not just a code generator. Not 'write me the solution' but 'help me think through this problem.' Best prompt: 'Here's my current approach and my concerns about it. What am I missing?' The most valuable output is often realizing your own assumption was wrong.

Deep research — comprehensive investigation using multiple sources. Tools worth knowing: Claude AI's deep search mode, the `@deep-research-agent` sub-agent for codebase-grounded research, and Context7 MCP for up-to-date library documentation without web search. Particularly useful for architecture decisions and technology evaluations.

Tooling generation — the cost of generating a custom tool has collapsed to near zero with AI. Scripts, database seed tools, deployment automation, log analysis. The key: always add a `--help` flag. When Claude encounters an unfamiliar CLI tool, the first thing it does is run `--help`. If your tool has it, Claude can use it autonomously in future sessions."

→

---

### SLIDE 41 — Evolve Your Setup Incrementally

⏱️ 1:29:00

🎤
"Right mindset for adopting these workflows: incrementally.

Week 1: one workflow. Pick the one with the highest daily impact for you. Basic CLAUDE.md. One slash command. Run it for a week.

Week 2: add a second. Expand CLAUDE.md. Add a skill.

Week 3: optimize based on actual usage. What prompts are you running repeatedly? Package them. What's producing inconsistent output? Improve the context.

Week 4+: team sharing. Document what works, commit it, everyone benefits.

The trap: trying to set up everything on day one. You don't know which workflows matter most until you've used Claude Code for a week. Start narrow, go deep, then expand."

❓
"If you were going to try one workflow this week — just one — which would it be? Drop it in chat."

*[Read a few responses. Brief comment on the variety.]*

→

---

### SLIDE 42 — Workflow Chaining

⏱️ 1:31:00

🖥️ *Open terminal. Run: `git log --oneline`*

🎤
"This slide shows the pipeline as a diagram. Let me show you the same thing as a git log.

Discovery → Docs update → New endpoint → Bug fix → Tests → Refactor → PR.

That's what we just did. One session. One logical unit. Started from 'I just joined this team' and ended at a PR with five clean commits.

The feedback loops — tests fail after bug fix, Claude goes back. Tests fail after refactor, Claude goes back. The loop doesn't break, it iterates. That's what the diagram is describing. You just saw it happen."

🎤
"Not 'I use Claude Code for this one thing.' The whole loop. Every stage accelerated. That's the target state."

→

---

### SLIDE 43 — What's Next

⏱️ 1:33:00

🎤
"Next session: Advanced Development Workflows. If today is 'how do I use these workflows,' next session is 'how do I chain them into full SDLC automation, agent teams, and multi-session workflows.'

Today was the foundation. Questions?"

*[Take questions for remaining time.]*

---

## QUICK REFERENCE — Theory Interaction Points

| Slide | Type | Purpose |
|---|---|---|
| Objectives (3) | ❓ Poll | Which workflows do you already use? Warm up the room. |
| Pitfalls (5) | ❓ Self-audit | Which are you guilty of? Create self-awareness. |
| Multi-file context (6) | ❓ Open Q | Large codebase experience — surface real-world context. |
| Skills (11) | ❓ Poll | Has anyone built a proper skill? |
| Plan Mode (14) | ❓ Poll | How many use Plan Mode consistently? |
| Incremental setup (41) | ❓ Closing | Which workflow would you start with? End on intention. |

---

## QUICK REFERENCE — Demo Interaction Points

| Segment | Cue | Purpose |
|---|---|---|
| Discovery | 👀 Narrate tool calls | Show multi-file exploration live (Slide 6) |
| Discovery → Docs | 🎤 "It said Next.js. Go open CLAUDE.md." | Plant the hook for the docs reveal |
| Docs | 🖥️ Open CLAUDE.md | Audience reads the wrong framework themselves |
| Docs audit table | 🎤 Read it aloud | HOT tier, triggered updates, AI documents *what* not *why* |
| Code gen | 🖥️ Show golden file | "This is the pattern Claude will match" |
| Bug fix | 🖥️ Show browser | Book June 13, see "June 12" — audience catches it |
| Bug fix | 🎤 Failing test first | "Define the bug in executable form" (Slide 32) |
| Test gen | 👀 Coverage gaps | "Zero. Both of them." — land the ROI point (Slide 27) |
| Refactor | 🖥️ Shift+Tab | Plan Mode — most important habit (Slide 13) |
| Git | 🎤 "Show me first" | Review before commit, every time (Slide 39) |
| Close | 🖥️ git log --oneline | Land Slide 42 on the actual work done |

---

*End of voiceover script.*
