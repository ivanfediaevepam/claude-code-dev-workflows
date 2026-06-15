# Claude Code: Common Development Workflows

## Voiceover Script — Theory Block (~40 min)

> **Legend**
> 🎤 Say this out loud
> ❓ Audience question — pause, wait for responses
> 😄 Light moment / joke
> ⏱️ Target timestamp
> → Next slide cue

---

## SLIDE 1 — Title slide: GenAI Intensive Program with Claude Code

⏱️ 0:00

🎤
"Welcome to Masterclass 3 of the GenAI Intensive Program. Today is Common Development Workflows — which is a slightly boring name for what is actually the most hands-on session in this series.

Sessions 1 and 2 gave you the foundation: what Claude Code is, how to set it up, how to think about it. Today we earn it. We take those concepts and run them through the workflows you actually live in every day — generating code, fixing bugs, writing tests, refactoring, documenting, building tooling, working with Git.

The format is 40 minutes of theory, 40 minutes of live demo on a real TypeScript codebase. I'll narrate every keystroke.

Let's go."

→

---

## SLIDE 2 — Title: Common Development Workflows / Masterclass #3

⏱️ 0:30

🎤
"Quick orientation before we dive in. This is session 3, which means you've already seen sessions 1 and 2. So I'm going to skip the 'what is Claude Code' preamble — you know what it is, you have the license, you've used it.

What I want to focus on today is the *how*. How do you actually integrate this into a real project? What do you do when it goes wrong? What's the mental model that makes the difference between getting garbage output and getting something you'd actually push to main?

That's what the next 40 minutes is about."

→

---

## SLIDE 3 — AI Masterclass Outline: Learning Objectives + Topics

⏱️ 1:30

🎤
"Here's what we're covering. Three learning objectives: automate routine tasks, generate tests and docs, create custom tooling. And nine topics — code generation, test generation, documentation, refactoring, tooling, Git, bug fixing, problem solving, deep research.

That's ambitious for 80 minutes, so here's the honest version: we'll go deep on the core seven and give you the mental model for the last two."

❓
"Quick show of hands — which of these nine do you already use Claude Code for regularly? Don't be shy, raise your hand or drop it in chat."

*[Wait 10–15 seconds. Acknowledge answers.]*

🎤
"Good. Whatever you're already using — by the end of today I want you to walk away with at least two more that feel natural. Let's see if we can do that."

→

---

## SLIDE 4 — Effective Prompting Patterns (Weak vs Strong)

⏱️ 3:00

🎤
"Before we touch any specific workflow, I need to talk about prompting. Because it doesn't matter which workflow you're in — if your prompt is weak, your output is weak.

Look at the left column. 'Fix this bug.' 'Write tests.' 'Refactor this code.' Be honest with yourselves — how many of you have typed exactly one of these? I definitely have."

😄
"'Fix this bug' is the developer equivalent of calling IT support and saying 'my computer doesn't work.' Technically correct. Completely useless."

🎤
"Now look at the right column. Same intent, completely different framing. 'Fix the null check in `parseUser` that crashes when email is missing.' 'Add unit tests for `OrderService` covering edge cases: empty cart, expired discount, null user.'

What's the pattern? Three things. One: describe the goal and the constraint, not the solution. Two: be specific about scope — which file, which function, which edge case. Three: reference existing patterns in the codebase — 'follow the pattern in `src/utils/`' is worth more than two paragraphs of explanation.

And there's a fourth thing that isn't on this slide, but it might be the most important: give Claude a way to verify its own work. Tests it can run. A build it can check. Expected output it can compare against. Without that feedback loop, you get code that looks right. With it, you get code that is right.

Memorize these four. They apply to every workflow we're going to cover today."

→

---

## SLIDE 5 — Common Pitfalls & Antipatterns

⏱️ 6:00

🎤
"Now the antipatterns. And I want to be direct here — every single item on this list is something I've seen experienced developers do. This isn't beginner stuff. These are failure modes that happen even when you know better."

❓
"I'll go through these and I want you to mentally flag the ones you're guilty of. Be honest. Ready?"

🎤
"First: vague prompts. We just covered this. 'Fix this' without context. Moving on.

Second: skipping Plan Mode for large changes. This one is sneaky because it *feels* faster to just let Claude generate. And for small tasks it is. But for anything non-trivial — a new feature, a significant refactor — skipping Plan Mode means you get one massive diff that's very hard to reason about and even harder to review. We'll see Plan Mode in the demo and I think it'll click immediately.

Third: not running tests before and after refactoring. If you refactor without a test suite and something breaks, you have no idea what broke or when. You're flying blind.

Fourth — this one matters — accepting generated code without review. Especially for security-sensitive code. Claude will write authentication logic. It will write SQL queries. It will write input validation. You must review it. Always.

Fifth: overloading a single session. Mixing three unrelated tasks in one session degrades context quality. One logical unit per session.

Sixth: empty CLAUDE.md. This is the one I see most in real projects. If CLAUDE.md is empty, Claude guesses your conventions instead of following them. We'll fix this in the demo.

Last: ignoring permission prompts. Auto-accepting everything defeats the safety model. Configure `allowedTools` in `settings.json` instead — whitelist what you want, block what you don't."

😄
"The good news: if you're guilty of all seven, you're about to fix all seven in one session. So actually, great timing."

→

---

## SLIDE 6 — Multi-file Context: How Claude Code Navigates Your Codebase

⏱️ 10:00

🎤
"How does Claude actually understand your project? This is worth spending two minutes on because it shapes how you should work with it.

When you start a session, Claude doesn't wait passively for instructions. It explores. It uses glob patterns to find files, grep to search content, and it spawns sub-agents to explore large codebases in parallel. Think of it as a new engineer's first day — they open the repo, look at the folder structure, read a few key files, and start building a mental model.

The implication: help Claude focus. If you know which file has the problem, use `@filename` to point directly at it. If you're scoping a task to one module, say 'only modify files in `src/services/`'. The narrower the context, the higher the output quality. Claude's context window is finite and valuable — spend it on what matters.

And this is why the slide says 'use CLAUDE.md to list key files and architecture' — because if you front-load Claude with the right context, it starts from a much stronger position."

❓
"Does anyone have a large codebase where you've already experimented with context management? How did you handle it — did you use CLAUDE.md, or did you just point at files inline?"

*[Wait for responses. Engage briefly.]*

→

---

## SLIDE 7 — Context Management & Session Strategy

⏱️ 13:00

🎤
"Session strategy — when to start fresh, how to stay productive in long sessions.

Three signals that it's time to start a new session: you're switching to a completely unrelated part of the codebase; Claude is making mistakes it wasn't making earlier in the conversation; or you've just finished a logical unit of work and committed it.

That last one is the healthy habit: finish → commit → new session. Clean boundaries.

For long sessions: `/compact` summarizes the conversation history and frees up context window space. Think of it like git squash but for the conversation — you keep the outcomes, drop the intermediate steps. Use it when you feel the session getting noisy.

Re-anchoring: if Claude loses the thread — which does happen in long sessions — restate your goal and current state explicitly. 'We're implementing the auth module. We've done the JWT setup. Next we need the refresh token logic.' That reset costs you 30 seconds and saves you 10 minutes of going in circles.

And `claude --continue` — if you close the terminal mid-session by accident, this command picks up exactly where you left off. Worth knowing before you need it."

→

---

## SLIDE 8 — AI-Assisted Use Cases (list)

⏱️ 16:00

🎤
"Here are the seven use cases we're covering today. Code generation, documentation, refactoring, test generation, tooling, Git, bug fixing.

I want to make one framing point before we go through each one: these aren't isolated skills. In the demo, we're going to run them as a pipeline — one session that chains from a raw codebase all the way to a pull request. The value isn't in any single workflow. It's in how they compose together.

Let's go through each one."

→

---

## SLIDE 9 — Mind map: AI Coding Assistant Use Cases

⏱️ 17:00

🎤
"This mind map is worth pausing on for a moment. It shows the full landscape of what an AI coding assistant can do — not just the seven we're covering today, but the whole space.

A few things that stand out: Discovery & Understanding — this is underused. Claude Code is genuinely excellent at onboarding to an unfamiliar codebase: tracing data flow, mapping service dependencies, explaining what a piece of code actually does. If you join a new project, 'explain this codebase to me starting from the entry point' is one of the most useful prompts you can give.

Code Review Support — PR description generation, review comment generation. These are high-value, low-effort wins. We'll do one in the demo.

And Development Velocity — interrupted work capture, context preservation, staying in flow. These are the benefits you don't often talk about explicitly but they compound significantly over time.

Keep this map in mind as a menu. Today we're ordering from about a third of it. The rest is yours to explore."

→

---

## SLIDE 10 — Boilerplate Generation

⏱️ 19:00

🎤
"Code generation. Let's be precise about what this means in the Claude Code context — it's not 'have AI write code.' It's AI-assisted generation of repetitive, standard structures that follow established conventions. The key phrase: established conventions.

Claude Code generates to patterns. If you have strong, consistent patterns in your codebase — consistent folder structure, consistent naming, consistent error handling — Claude will match them. If your codebase is a mix of five different patterns, Claude will pick one and you'll spend your time arguing with it about which one.

The practical implication: before you start generating, invest 10 minutes making sure your patterns are clear. Either in CLAUDE.md or in a golden example file you point Claude at."

→

---

## SLIDE 11 — Use Skills for Boilerplate Generation

⏱️ 20:30

🎤
"Skills. This is one of the most underused features in Claude Code.

A skill is a reusable, structured unit of prompting that Claude can load and apply automatically. You define it once, store it in `.claude/skills/`, and Claude decides when to use it based on its description — you don't have to invoke it manually every time.

Compare that to slash commands, which you explicitly call. Both have their place. The difference: if you have a skill for 'generate a new API endpoint' and it's in the skills directory with a good description, Claude will offer to use it whenever it detects you're building a new endpoint. You don't have to remember to call it.

The example on the slide shows a FastAPI CRUD skill. The prompt is very specific — it lists the exact patterns: router with APIRouter and proper tags, Pydantic schemas with field validation, dependency injection for DB sessions, custom exception handlers returning RFC 7807 responses, structured logging with structlog. That level of specificity is what makes the skill produce consistent output across the team.

For Node.js — which we'll use in the demo — the equivalent would be: Express router with typed request/response, Zod schemas for validation, consistent error middleware pattern, JSDoc on all public methods."

❓
"Has anyone here built a skill yet? Not a slash command — a proper skill with a SKILL.md? Drop a yes or no in chat."

*[Brief pause.]*

🎤
"If the answer is mostly no, that's great — by end of the demo you'll have seen exactly what one looks like."

→

---

## SLIDE 12 — Boilerplate Generation output (FastAPI table)

⏱️ 23:00

🎤
"This is what good skill output looks like. A complete feature table: what was implemented, how, which files were created. API endpoints listed with methods, paths, and descriptions. Setup instructions.

The reason this matters isn't the prettiness of the output — it's that this level of structure means the output is *auditable*. You can review a table like this in 60 seconds and know whether Claude did what you asked. That's the goal of structured output: make review fast.

When you define a skill, build in an output format that makes review easy. A table, a checklist, a summary section. It costs Claude nothing extra and saves you significant review time."

→

---

## SLIDE 13 — Features with Plan Mode

⏱️ 24:30

🎤
"Plan Mode. This is the single highest-leverage habit I can give you today.

The idea: before Claude writes a single line of code, it produces an implementation plan you can review, correct, and approve. Human-in-the-loop validation before the work starts, not after.

You activate it with Shift+Tab in the Claude Code terminal. Claude goes into a planning-only mode — it will read your codebase, think through the problem, and produce a structured plan. It will not write code. You review the plan. If it's wrong, you correct it. Then you exit Plan Mode and it implements."

😄
"Think of it as Claude raising its hand and saying 'before I do this, can I just check my understanding?' Which is exactly what you'd want from a junior developer. And unlike a junior developer, it does this every time without being asked twice."

🎤
"I've tested every major model release. Code quality is consistently better with Plan Mode on. The reason is simple: the planning step forces Claude to build a more complete understanding of the codebase before acting. Without it, Claude pattern-matches to the first reasonable-looking solution. With it, it evaluates multiple approaches and picks the most appropriate one for your specific context."

→

---

## SLIDE 14 — Plan Mode examples

⏱️ 27:00

🎤
"Two examples of Plan Mode prompts. Notice the structure.

First one — background task processing system. It lists what's needed: Celery with Redis, retry logic with exponential backoff, dead letter queue, monitoring dashboard, FastAPI integration. Then: 'Create a plan that considers our current architecture in `src/` and proposes the integration approach.'

That last sentence is the key. It anchors Claude to your actual codebase, not to a hypothetical. Without it, Claude writes a generic plan. With it, Claude writes a plan for your project.

Second example — user authentication system. Same pattern: list the requirements, then 'analyze our current FastAPI codebase and create a detailed implementation plan before writing any code.'

The phrase 'before writing any code' is doing real work there. It's an explicit instruction to stay in planning mode. Without it, some models will start implementing during the planning response."

❓
"Question — and I genuinely don't know what the split will be: how many of you use Plan Mode consistently? Every non-trivial task? And how many use it sometimes, or never?"

*[Pause for responses.]*

🎤
"Whatever the split — by end of demo, I think the 'sometimes' and 'never' camp will have moved."

→

---

## SLIDE 15 — Plan Mode output example

⏱️ 29:30

🎤
"This is what Plan Mode output looks like for the auth system example. Four phases: foundation, core authentication, OAuth integration, security features. Each phase has an estimated file count and line count. Then a dependencies list.

The value here is not just the plan content — it's the *scope estimate*. 'Phase 2 will touch 6 files and approximately 400 lines.' If that seems too broad for what you're trying to do, you say so before any code is written. You redirect: 'Actually, skip OAuth for now, just do phases 1 and 2.'

That's the conversation you want to have at planning time, not after you've got a 1500-line diff to review.

And the final line — 'Shall I proceed with Phase 1?' — that's Claude pausing for explicit approval. This is the pattern: plan, approve, implement in phases, test between phases."

→

---

## SLIDE 16 — Code Generation: Readiness Checklist

⏱️ 31:30

🎤
"Readiness checklist for code generation. Keep this mental checklist before any significant generation task.

CLAUDE.md with project context — tech stack, architecture, coding conventions, key file pointers. Kept under 200 lines. This is loaded every session, so every token here earns its place.

Golden example files — two or three reference implementations for each major pattern. 'Follow exactly the pattern in `UserService.ts`' is worth more than any amount of prose description. Claude matches existing code better than it follows abstract instructions.

Project spec with data models and API contracts — this is what the slide calls 'written specs.' AI reasons better from written specifications than from verbal descriptions. If your API contracts exist in a `docs/` folder, point Claude at them. If they don't exist yet, generating them before generating code is a good investment.

Slash commands for repeatable scaffolding — wrap common generation tasks as commands with post-generation checklists: register in DI container, run tests, update route index.

Naming conventions and variable schemas — without these, each generation follows a different pattern. Over multiple sessions on the same codebase, this compounds into inconsistency.

Plan Mode for features — always. Non-negotiable for anything non-trivial.

And verification mechanism — the number one rule. Give Claude a way to verify its own work. Minimum: build and test. Better: run the application, make API calls, check the response."

→

---

## SLIDE 17 — Code Documentation

⏱️ 34:30

🎤
"Documentation. The one everyone says is important and everyone neglects.

The insight from the slide: use Claude Code not just for initial generation but to *maintain* existing docs. That's the shift. Documentation isn't a one-time task you do at the end of a project — it's a continuous workflow that happens at the commit boundary.

The reason this matters for Claude Code specifically: Claude relies on documentation, especially what's in CLAUDE.md and your `docs/` folder, to understand your project. Stale docs actively mislead Claude. A doc that says your API uses JWT when you've since migrated to sessions is worse than no doc at all."

→

---

## SLIDE 18 — Code Documentation: Use Slash Command

⏱️ 36:00

🎤
"Two prompt examples for documentation.

First: generate a comprehensive README. The prompt lists exactly what to include — project overview, prerequisites, installation, config options derived from `.env.example`, API endpoints extracted from the actual routes, development workflow, deployment guide. And the critical instruction: 'Base this on the actual code structure, not assumptions.'

That last line matters. Without it, Claude will fill gaps with plausible-sounding but potentially wrong information. With it, Claude reads the actual files and documents what's actually there.

Second prompt — the one I think is more practically valuable: 'Review the changes in the last 5 commits and update any documentation that's now out of sync.' This is the commit-boundary workflow. You make changes, you run this, you get a documentation diff. You review it in the same PR.

Make this a habit: every PR includes a documentation sync step."

→

---

## SLIDE 19 — Code Documentation output (summary dashboard)

⏱️ 37:30

🎤
"This is what documentation audit output looks like — a summary dashboard. Each area has a status, a count of issues found, and a priority.

README: missing, high priority. Docstrings: excellent, 2 minor issues. Type hints: comprehensive. FastAPI docs: excellent.

This format is useful because it's actionable. You look at it, you know exactly what needs to be fixed and in what order. The high priority item — missing README — gets fixed first. The low priority items get fixed when there's capacity or bundled into the next sprint.

Build this into your workflow: run a doc audit at the start of a feature, fix the high priority items, then generate the new code. Don't start generating on top of missing documentation."

→

---

## SLIDE 20 — Documentation Tiers (HOT / WARM / COLD)

⏱️ 39:00

🎤
"Documentation tiers. This is a framework worth adopting directly.

HOT — always loaded, every session. This is CLAUDE.md. Under 60 lines. Pointers only — links to other docs, never duplicate content here. Every token in CLAUDE.md is loaded into every Claude Code session, every time. Make them count.

WARM — on-demand, loaded when relevant. Living specifications: `docs/constitution.md` with your non-negotiable rules, `docs/project-specification.md` with architecture and API contracts, domain-specific documentation. Claude loads these when the task requires them.

COLD — archived, reference only. Frozen planning artifacts: PRDs, architecture decisions that are no longer changing. Completed story records. These exist for historical reasons and deep analysis, not for active development sessions.

The practical test for where something goes: if Claude needs it every session, it's HOT. If Claude needs it for some tasks but not all, it's WARM. If Claude never needs it but you want to keep it, it's COLD."

😄
"Think of it like your browser tabs. HOT is the tabs you always have open. WARM is the tabs you open when you need them. COLD is your 'read it later' folder that you haven't touched in 8 months."

→

---

## SLIDE 21 — AI Docs: Key Principles

⏱️ 41:30

🎤
"Five key principles for AI-assisted documentation. I'm going to spend a moment on each.

Single source of truth: each fact lives in exactly one place. Docs reference code, never duplicate it. The moment you have the same information in two places, they will eventually disagree.

Living specs vs frozen artifacts: your `docs/` folder has living documents that evolve with the code. Planning artifacts — PRDs, architecture sketches — are frozen after implementation. Don't update them; archive them.

Agents don't update docs unprompted — and this is confirmed by every research study on the topic. You have to build documentation updates explicitly into your workflow. It will not happen automatically. We'll talk about how in the next slide.

Auto-generate what you can: DB schema from ORM definitions, environment variables from `.env.example`, API docs from router definitions. If it can be derived from code, generate it from code.

And validate freshness in CI: check that referenced files still exist. Flag docs older than 30 days. Stale docs caught in CI are stale docs that don't mislead Claude and don't mislead your teammates."

❓
"Is anyone here already running doc freshness checks in CI? Even a basic file-exists check? I'm curious how widespread this is."

*[Brief pause.]*

→

---

## SLIDE 22 — Doc Updates in SDLC

⏱️ 44:00

🎤
"This is how documentation fits into the development lifecycle — and the key insight is in the bottom of the slide: triggered updates beat scheduled updates. Docs drift when they're decoupled from the workflow.

Story implementation: after every story, there's a doc-check step. If your changes affect architecture, API contracts, or conventions — update the relevant doc. Not a big thing. Often one paragraph.

Code review: the reviewer verifies that docs still match code. This is a checklist item, not an opinion. 'Does this PR change any API endpoint? Is it reflected in `docs/API.md`?'

Epic completion: auto-generate the things that can be auto-generated — environment variables, DB schema, service documentation — and do a full review against the epic's original goals.

Deployment: final validation. Does what we're deploying match what we documented? This is the last checkpoint before it's someone else's problem.

And across all of it, the CI pipeline runs freshness checks on every PR. Referenced files exist. Docs aren't stale. `/update-docs` is available as a manual refresh when needed.

This sounds heavyweight. In practice, each checkpoint is 2–5 minutes. The cost is low. The compound benefit over a 6-month project is significant."

→

---

## SLIDE 23 — Code Documentation: Readiness Checklist

⏱️ 46:30

🎤
"Readiness checklist for documentation. Quick version:

Doc format standards in CLAUDE.md — JSDoc style, 'write WHY not WHAT' rule. Documentation tiers configured. Well-documented reference functions as examples. CI validation for freshness. Trigger-based update workflow, not scheduled. And the one on business context: AI documents accurately what code *does* but cannot reliably document *why* a business decision was made. You have to provide that context. That's the one part of documentation that stays fully human."

→

---

## SLIDE 24 — Code Refactoring

⏱️ 48:00

🎤
"Refactoring. This one requires a specific discipline.

The key phrase on the slide: 'Use Plan Mode to select a refactoring approach. Start from principles and goals and drill down to details.'

This is the opposite of how most refactoring prompts are written. Most people say 'extract this into an interface' — they've already decided the solution. The better approach: describe the *problem* you're solving. 'We have tight coupling between the order service and the inventory service. This makes them impossible to test independently. Propose approaches to fix this coupling.'

Then Claude shows you options. You pick the best fit for your codebase. Then you plan the incremental implementation. Small steps, tested between each one."

→

---

## SLIDE 25 — Code Refactoring (step by step + examples)

⏱️ 49:30

🎤
"Seven steps for refactoring with Claude Code. Let me go through these quickly because they compose into a reliable process.

One: run tests first. Non-negotiable. If you don't have tests, generate them first — we'll see this in the demo. Two: enter Plan Mode. Three: describe the goal, not the solution. Four: review the approach options Claude proposes, including trade-offs. Five: approve an incremental plan — small, testable steps. Six: run tests after each step to confirm behavior is unchanged. Seven: commit each logical change separately.

The example prompt on the slide: 'Goal: reduce coupling between our order processing and inventory management modules. Current problem: OrderService directly imports and calls InventoryService methods, making them hard to test independently. Don't change code yet — present options with trade-offs.'

That final instruction — 'don't change code yet' — is doing heavy lifting. It keeps Claude in Plan Mode mentally even if you've technically exited it. Without that, some models will start making changes inline with the plan."

→

---

## SLIDE 26 — Code Refactoring: Readiness Checklist

⏱️ 51:30

🎤
"Readiness checklist for refactoring. The two that matter most:

Passing test suite — teams report 60% fewer regressions with proper coverage on the target code. If you don't have tests on the code you're about to refactor, stop and write them first.

And: defensive pattern awareness in CLAUDE.md. Document why your circuit breakers, retries, and rate limiters exist. AI will remove code it sees as 'unnecessary' — retry logic that's 'just a loop,' circuit breakers that 'seem redundant.' If there's no explanation of why they exist, they're at risk. Add a comment in the code and a note in CLAUDE.md."

→

---

## SLIDE 27 — Test Generation

⏱️ 53:00

🎤
"Test generation. The AI use case with the highest ROI and the lowest adoption. Which is a gap I want to help close today.

Claude Code analyzes your code to identify critical test scenarios, uncover edge cases, generate realistic test data, and write assertions — all while matching your existing testing patterns. That last part is key: if you have well-structured existing tests, Claude matches them. If you don't, it generates textbook tests with excessive mocking that break on every refactoring."

→

---

## SLIDE 28 — Test Generation: Use Slash Command

⏱️ 54:00

🎤
"Two prompt examples for test generation.

First: generate comprehensive pytest tests — but look at what's specified. Framework, fixtures, parametrized tests for specific edge cases, which dependencies to mock, async testing library, error scenarios. Then: 'Use our existing test patterns from `tests/` and aim for >90% coverage.'

That instruction to reference existing patterns is everything. Without it, Claude decides what 'good tests' look like. With it, Claude matches what your team has already agreed looks good.

Second prompt — the coverage gap finder. 'Run pytest with coverage and identify untested code paths. For each uncovered path: explain why it matters, generate appropriate tests, verify the new tests pass. Focus on critical business logic first.' This is a guided discovery workflow — Claude finds the gaps, explains them, fixes them."

❓
"How many of you have used Claude Code specifically to fill coverage gaps — not write tests from scratch, but find and fill the gaps in existing test suites?"

*[Brief pause. Acknowledge responses.]*

🎤
"This is one of the most time-efficient things you can do with Claude Code. 30 minutes to go from 40% coverage to 80% coverage on a service layer. We'll do a version of this in the demo."

→

---

## SLIDE 29 — Test Generation: Readiness Checklist

⏱️ 56:00

🎤
"Readiness checklist for testing. Three highlights:

TDD workflow — write failing tests first, then implement. This is especially powerful with AI-assisted code because Claude can iterate autonomously until tests pass. You define the contract; Claude fulfills it.

Edge cases in the prompt upfront — list them explicitly. Empty, null, boundary, auth failure, concurrency. If you don't list them, Claude over-tests happy paths and under-tests error paths. Every time.

And know AI testing limits: Claude excels at regression tests, API-level tests, and the edge cases humans skip. Claude is weak at exploratory testing and security threat modeling. Know the limits. Fill those gaps yourself."

→

---

## SLIDE 30 — Bug Fixing

⏱️ 57:30

🎤
"Bug fixing. The most contextually demanding workflow.

The key insight: bug fixing isn't just code generation. It requires understanding existing code, existing tests, what changed between working and broken states. It requires building context before proposing a fix.

Claude Code accelerates this by searching patterns, reviewing git history, examining tests — and then generating targeted fixes and validating them by running builds and test suites. But it needs you to give it the right starting information."

→

---

## SLIDE 31 — Bug Fixing: Use Sub Agent (ultrathink example)

⏱️ 58:30

🎤
"The bug fixing example on the slide uses `ultrathink` — that keyword at the top of the prompt. Let me explain what this does.

`ultrathink` tells Claude to allocate maximum thinking budget to the next turn. The model reasons more deeply before responding. It's not magic — it's compute. Use it selectively: complex bugs, subtle race conditions, anything where pattern-matching to the first obvious fix is likely to miss the real issue.

The example: an intermittent bug where async tasks are being processed twice, happening roughly 1 in 1000 tasks. That's exactly the kind of bug where you need deep reasoning. The prompt gives Claude everything it needs: the system configuration, when the bug started, what to look at. `ultrathink` allocates the reasoning budget to find the actual root cause rather than a surface fix."

😄
"For 'my button doesn't work' — no `ultrathink` needed. For 'our distributed task queue has a race condition that corrupts data 0.1% of the time' — yes, use it."

→

---

## SLIDE 32 — Bug Fixing: Readiness Checklist

⏱️ 1:00:30

🎤
"Readiness checklist for bug fixing. The one that matters most:

Bug Reproduction Test first. Google research shows providing a failing test that proves the bug fixes 30% more bugs in 50% fewer steps. You define the bug in executable form — Claude has something concrete to make green.

The structured bug report format: environment + symptom + exact error + affected files + reproduction steps. This format versus 'it's broken' is the number one factor in fix quality.

And the two-attempt rule: if Claude is stuck after two attempts, switch approach. Different model, smaller problem scope, more context. Don't loop on the same strategy. If it hasn't worked twice, the third time won't either."

→

---

## SLIDE 33 — Problem Solving / Ideation / Rubber Ducking

⏱️ 1:02:00

🎤
"Problem solving and rubber ducking. This one is different from the others — it's not about generating output, it's about thinking.

Claude Code is genuinely useful as a thinking partner. Not 'write me the solution' but 'help me think through this problem.' The format: open dialogue, iterative, specific questions, active engagement.

The best practices on the slide: start broad, then narrow. Ask 'what if' questions. Challenge your own assumptions — 'is there a reason this approach won't work that I'm not seeing?' Think out loud — verbalize your reasoning and let Claude identify gaps.

The common pitfall: focusing on getting 'the answer' rather than exploring the problem space. This is the rubber duck pattern — sometimes the most valuable output is realizing your own assumption was wrong, not getting a solution from Claude.

Quick tip: 'I'm thinking about this problem. Here's my current approach and my concerns about it. What am I missing?' is one of the most useful prompts you can give."

→

---

## SLIDE 34 — Deep Research

⏱️ 1:03:30

🎤
"Deep research — comprehensive investigation of complex topics using multiple sources and advanced reasoning.

Three tools worth knowing for this: Claude AI's deep search mode for broad multi-source research; the `@deep-research-agent` sub-agent in Claude Code for codebase-grounded research; and Context7 MCP for getting up-to-date library documentation without relying on web search.

That last one is particularly useful: Context7 MCP pulls current documentation for packages directly into the conversation context. So when you're asking Claude to help with a library that's had recent breaking changes, Claude has the actual current docs, not its training data snapshot.

For architecture decisions, technology evaluations, and understanding a new domain before building in it — this is the workflow."

→

---

## SLIDE 35 — Tooling Generation

⏱️ 1:05:00

🎤
"Tooling generation. With AI-assisted development, the cost of generating a custom tool has collapsed to near zero. Scripts that would take half a day to write you can generate in 10 minutes.

The pattern: scripts and utilities for development tasks, operations automation, project-specific tooling. Anything from database seeding scripts to deployment automation to log analysis tools.

The shift this enables: instead of using a generic tool that almost fits your workflow, you generate a specific tool that exactly fits it. And if it needs to change, you modify the prompt and regenerate."

→

---

## SLIDE 36 — Tooling Generation (5 steps + example)

⏱️ 1:06:00

🎤
"Five steps for tooling generation. Generate, test and refine, document usage, convert to skill, share with team.

The documentation step — `--help` flag — is non-negotiable, not optional. Here's why: when Claude Code encounters an unfamiliar CLI tool, the first thing it does is run `--help`. If your tool has it, Claude can use it autonomously in future sessions. If it doesn't, Claude has to guess the interface. Make your tools self-documenting.

The example on the slide shows a database migration CLI tool. Notice the requirements: type hints throughout, colored output, `--dry-run` flag for safe testing, environment-aware, follows existing patterns in `scripts/`. These requirements are what make the output usable rather than generic."

→

---

## SLIDE 37 — Tooling Generation: Readiness Checklist

⏱️ 1:07:30

🎤
"Readiness checklist for tooling — one highlight:

Spec-driven approach for complex tools. Create `requirements.md` and `design.md` before generating. The spec serves as a contract that both human and AI can reference. This is 2025 best practice for anything beyond a simple script.

And the CLI discovery pattern: Claude can learn unfamiliar CLI tools via `--help`. Prompt: 'Use `foo-tool --help` to learn about it, then use it to solve X.' This means Claude can operate tools it's never seen before, as long as they have proper help documentation."

→

---

## SLIDE 38 — Working with Git

⏱️ 1:09:00

🎤
"Git. Claude Code handles four things particularly well: commit workflows with conventional message formats, parallel development with worktrees, pull request creation, and merge conflict resolution.

Worktrees are worth highlighting. You can have multiple Claude Code agents running in parallel — each in its own worktree, working on different features simultaneously, completely isolated. No stashing, no branch juggling. For teams running multiple parallel workstreams, this is significant."

→

---

## SLIDE 39 — Working with Git (prompts)

⏱️ 1:10:00

🎤
"Three prompt examples for Git workflows.

Commit message: 'Review my staged changes and create a commit message that follows conventional commits, has a clear subject line under 72 chars, explains WHY these changes were made, and references related issues. Don't commit yet — show me the message first.'

That last sentence — 'show me first' — is good practice for any Git operation. Review before commit. Review before push.

Worktree setup: 'I need to work on two features simultaneously. Set up a git worktree for the hotfix so I can switch between them without stashing. Explain the workflow.'

PR description: specifies exactly what sections to include, what to derive from commits, what to check. Using `gh pr create` at the end to actually create it."

→

---

## SLIDE 40 — Working with Git: Readiness Checklist

⏱️ 1:11:30

🎤
"Git readiness checklist — two I want to call out:

Commit convention in CLAUDE.md. Define your format, your types, your scoping conventions, the imperative tense rule. Claude generates excellent commit messages when the format is explicitly defined. Without it, the quality varies significantly.

PR template with structured sections — `.github/PULL_REQUEST_TEMPLATE.md`. Claude fills this automatically from diff analysis. If the template exists, Claude uses it. If it doesn't, Claude invents a structure. Your structure is almost certainly better than an invented one."

→

---

## SLIDE 41 — Evolve Your Claude Code Setup Incrementally

⏱️ 1:13:00

🎤
"This slide captures the right mindset for adopting Claude Code workflows: incrementally.

Week 1: one workflow — pick the one with the highest daily impact for you. Basic CLAUDE.md. One slash command. Run it for a week, get comfortable with it.

Week 2: add a second workflow. Expand your CLAUDE.md. Add a skill.

Week 3: optimize based on actual usage. What prompts are you running repeatedly? Package them. What's producing inconsistent output? Improve the context.

Week 4+: team sharing. Document what works and commit it so everyone benefits.

The cycle is: execute, reflect, improve, reuse. This isn't a one-time setup — it's a practice that compounds.

The trap to avoid: trying to set up everything on day one. You don't know which workflows matter most for your specific work until you've used Claude Code for a week. Start narrow, go deep, then expand."

❓
"If you were to pick one workflow to start with — just one — which would it be? No wrong answers. Drop it in chat."

*[Read a few responses. Brief comment on the variety.]*

→

---

## SLIDE 42 — Workflow Chaining

⏱️ 1:15:30

🎤
"Last theory slide. Workflow chaining.

The seven workflows aren't isolated skills — they form a natural pipeline in daily development. Look at the diagram: Bug Report → Bug Fix → Test Generation → Code Refactoring → Git Commit → Pull Request. One session. One logical unit of work that starts from a bug report and ends with a PR ready for review.

That's the target state. Not 'I use Claude Code for this one thing' but 'I run my entire development loop through Claude Code and it accelerates every stage.'

The feedback loops matter: if tests fail after the bug fix, Claude goes back and fixes before moving forward. If tests fail after refactoring, same thing. The loop doesn't break — it iterates until it's clean.

This is what we're going to build in the demo. Same pipeline, real code, real bugs, real output. Let's switch to the terminal."

→

---

## SLIDE 43 — What's Next: Advanced Development Workflows

⏱️ 1:16:30

🎤
"Before we go to the demo — quick preview of what's next in the series: Advanced Development Workflows. If today is 'how do I use these workflows,' next session is 'how do I chain them into full SDLC automation, agent teams, and multi-session workflows.'

But first — the demo. Let me share my screen."

---

---

## QUICK REFERENCE — Audience Interaction Points

| Slide | Type | Purpose |
|---|---|---|
| Outline | ❓ Poll | Which workflows do you already use? Warm up the room. |
| Pitfalls | ❓ Self-audit | Which pitfalls are you guilty of? Create self-awareness. |
| Multi-file context | ❓ Open Q | Large codebase experience — surface real-world context. |
| Plan Mode examples | ❓ Poll | How many use Plan Mode consistently? Calibrate depth. |
| Skills | ❓ Poll | Has anyone built a skill? Set expectations for the demo. |
| Test generation | ❓ Open Q | Coverage gap filling — find who's ahead to learn from. |
| Doc freshness in CI | ❓ Open Q | Who's doing this? Surface good examples. |
| Incremental setup | ❓ Closing | Which workflow would you start with? End on intention. |

---

---

## DEMO BLOCK — Live Session (~40 min)

> **Legend additions for the demo block**
> ⌨️ Type this into Claude Code — copy-paste from `docs/demo-runbook.md`
> 👀 Narrate while Claude is running (it takes 5–20 s)
> 🖥️ Do this — browser, IDE, terminal action (not a prompt)
> 😬 If it goes sideways — recovery line

---

### TRANSITION — from Slide 43 to screen share

⏱️ 1:17:00

🎤
"Alright. Let me share my screen."

*[Share screen. Show terminal with Claude Code running. Repo is on `demo/start`, working tree clean.]*

🎤
"Okay. This is the Shoreline app — a beach activity booking marketplace. Real Next.js codebase, real TypeScript, real Gemini API integration. I want to pretend I just joined this team five minutes ago. Which means I know nothing.

That's the setup. Let's go."

---

### SEGMENT 1 — Discovery + Mermaid Diagrams

⏱️ 1:17:30

🎤
"First thing I do on any unfamiliar repo: I ask Claude to walk me through it. Not 'summarize the README' — I want it to actually read the code."

⌨️

```text
Explain this codebase to me starting from the entry point. What framework is it,
what are the screens, and how does a booking get created end to end? Keep it to
the key files.
```

👀 *(while Claude explores — ~10 s)*
"Watch the tool calls. It's globbing the file tree, grepping for imports, reading layout files. This is the Slide 6 behavior — it doesn't wait for instructions, it explores. New engineer, first morning."

*[Claude returns: Next.js 15 App Router, three screens, /api/chat with Gemini + fallback, localStorage for bookings]*

🎤
"Good. So it found Next.js 15 App Router. Three screens: listing, activity detail with the AI chat panel, bookings history. Booking flow goes through /api/chat to Gemini, then confirms in localStorage.

Now I want a visual. Because 'I read it' and 'I can draw it' are different things."

⌨️

```text
Create a Mermaid sequence diagram of the AI booking chat data flow: from the user
typing in the chat panel, through /api/chat (Gemini vs the rule-based fallback),
to the booking being confirmed and saved. Base it on the actual code.
Save it to docs/architecture.md.
```

👀 *(while it generates — ~15 s)*
"And this is the underused use case from the mind map slide — Discovery and Understanding. Sequence diagrams, service maps, data flow. Onboarding a new engineer used to take two days. This takes three prompts."

*[Claude writes the sequence diagram to docs/architecture.md]*

⌨️

```text
Now add a Mermaid diagram of the React component hierarchy — layout, three routes,
and which components each screen composes. Append it to docs/architecture.md.
```

🖥️ *(open docs/architecture.md in IDE Markdown preview)*

🎤
"There it is. Two diagrams — data flow and component tree — generated from the actual code, saved to a file we can check in. That's a living architecture doc."

*[Plant the hook:]*
🎤
"Quick — notice something. When it described the framework, it said Next.js 15 App Router. Hold that thought. Go open CLAUDE.md."

---

### SEGMENT 2 — Update Documentation

⏱️ 1:22:30

🖥️ *(open CLAUDE.md in the IDE — visible on screen)*

🎤
"Read the first line. 'Single server entry point — `server.ts` runs Express and serves both the API and the React SPA.' Vite middleware. `App.tsx` local state router.

This project has none of those things. Not one. It was migrated to Next.js — look at the git log — and nobody updated the docs.

This is Slide 5, pitfall number six: 'empty CLAUDE.md.' Except it's worse than empty. Empty is silent. Wrong is actively misleading. Every Claude session loads this file. Every session thinks it's working on an Express app."

😄
"So every time someone asked Claude to 'add a new API route,' it was about to create an Express router. In a Next.js project. That's a fun debugging session."

🎤
"Here's the fix. I have a slash command ready for exactly this."

⌨️

```text
/update-docs 5
```

👀 *(while it audits — ~20 s)*
"It's reading CLAUDE.md, checking the actual API routes in src/app/api, reading .env.example, checking package.json scripts. Triggered update, not scheduled — this is Slides 21 and 22. The workflow triggers the doc update, not a calendar reminder."

*[Claude returns an audit table first: Area / Status / Issue / Priority]*

🎤
"Look at that table. Framework: incorrect, HIGH. Model name: incorrect, HIGH. Commands: missing npm test. README: boilerplate only, HIGH. It's showing us the audit before touching anything.

That's the pattern from Slide 19 — actionable output. You can review a table like that in 60 seconds and know the priority order."

*[Claude proceeds to update CLAUDE.md and README.md]*

🖥️ *(show git diff CLAUDE.md in terminal)*

🎤
"Framework: Next.js 15 App Router. Routes: the four real API endpoints. Model: gemini-2.5-flash, not 3.5. Commands: dev, build, start, lint, test. README: actual install steps, actual env vars from .env.example.

That's what CLAUDE.md should look like. Under 200 lines. Pointers only. Every token earns its place because every session loads it."

---

### SEGMENT 3 — Code Generation

⏱️ 1:27:30

🎤
"Docs are accurate now. I know the codebase. Let's build something.

There's a gap in the API — you can fetch a full activity with its slots, but there's no dedicated endpoint that returns *just* the availability. Let's add that."

🖥️ *(briefly show src/app/api/activities/[id]/route.ts in IDE)*

🎤
"Here's the pattern I want to match. JSDoc header, NextResponse.json, same 404 shape, same params handling. I'm going to point Claude directly at this file.

Slide 16 talks about 'golden example files.' This is one. 'Follow exactly this pattern' is worth more than two paragraphs of style guide."

⌨️

```text
Generate a new API route: GET /api/activities/[id]/availability that returns just
the bookable slots for an activity (id, date, time, spotsLeft, full) plus a
`spotsTotal` sum. Follow EXACTLY the pattern in
src/app/api/activities/[id]/route.ts — same params handling, same 404 shape, same
JSDoc header style, NextResponse.json. Then show me how to verify it with curl.
```

👀 *(while it generates — ~15 s)*
"Notice the prompt structure: goal, constraint, explicit reference to the golden file, a verification path — curl. Those four things. Slide 4."

*[Claude creates the new route file + curl commands]*

🎤
"Look at the output — same JSDoc header structure, same 404 shape, same import path. It matched the convention because I gave it a concrete example to match, not an abstract description."

🖥️ *(run: npx tsc --noEmit)*
🎤
"Type-check passes. The new route is valid TypeScript before I've even run the dev server."

😄
"If we had time, I'd convert this prompt into a `.claude/skills/` entry so it fires automatically whenever Claude detects we're adding an endpoint. That's Slides 11 and 12. Take 10 minutes after the session."

---

### SEGMENT 4 — Bug Fix

⏱️ 1:32:30

🎤
"Alright. There's a bug in this codebase. A real one, not planted — I found it in the code. Let me show you."

🖥️ *(in browser: go to an activity, click the June 13 slot, confirm the booking)*

🎤
"Watch the chat bubble. I just confirmed a booking for June 13."

*[Success message appears: "Your reservation for June 12 was successfully registered..."]*

😄
"June 12. I booked June 13. Classic hardcoded string. Line 178 of DetailView.tsx — there's a template literal with the date hardcoded as 'June 12' instead of using `newBooking.date`. The bug has been there since the component was written."

🎤
"Now — the wrong way to report this bug is 'the date is wrong.' The right way is what's on Slide 32."

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

👀 *(while Claude reads the file — ~10 s)*
"Environment, symptom, exact file, repro steps. And — the key thing — I asked it to write a failing test first. Research from Slide 32: giving Claude a failing test to make green fixes 30% more bugs in 50% fewer steps. You're defining the bug in executable form."

*[Claude writes the test — it calls executeConfirmBooking with a June 13 booking and asserts the message contains "June 13"]*

🖥️ *(run: npm test)*

*[Test fails: expected "June 12" to include "June 13"]*

🎤
"The test fails. That's correct — we want it to fail. It proves the bug exists and defines exactly what 'fixed' means."

*[Claude fixes the bug — replaces the literal string with `${newBooking.date}`]*

🖥️ *(run: npm test)*

*[All tests pass]*

🎤
"One line. `${newBooking.date}` instead of the hardcoded string. Test is green. And now we have a regression guard — this bug cannot come back without breaking that test."

---

### SEGMENT 5 — Test Generation

⏱️ 1:38:30

🎤
"We just fixed a bug and gave it a test. But that test was narrow — it only covers that one success message. What's the overall coverage picture?"

⌨️

```text
Run `npm run test:coverage` and identify the most important untested code paths.
Focus on business logic: the useBookings hook (add, cancel, localStorage persistence,
the corrupt-JSON fallback) and the rule-based booking parser in the /api/chat fallback
(edge cases: FULL slot, group size over maxGroupSize, no date, plural vs singular guest).
For each gap: explain why it matters, then write tests that MATCH the style of
src/lib/__tests__/pricing.test.ts. Verify they pass.
```

👀 *(while it runs coverage — ~15 s)*
"Two things I did there: I listed the edge cases explicitly — FULL slot, over capacity, corrupt JSON — and I pointed at an existing test file as the style reference. Slide 28 is emphatic about both. Without explicit edge cases, Claude over-tests the happy path. Without a style reference, you get textbook tests with excessive mocking that break on every refactor."

*[Claude returns coverage report — useBookings: 0%, chat parser: 0%]*

🎤
"Zero. Both of them. These are the highest-risk files in the app — the hook that touches localStorage, the parser that handles all the booking intent logic. And they have no tests at all.

Slide 27: highest ROI AI use case, lowest adoption."

*[Claude generates tests for useBookings and the parser, mirroring the pricing test style]*

🖥️ *(run: npm test)*

*[All tests pass — new suite shows up]*

🎤
"Look at the test names — they match the `describe / it` structure of the golden test. That's because I gave it a concrete example. That's the pattern. Use what already exists."

---

### SEGMENT 6 — Refactoring

⏱️ 1:43:30

🎤
"Now. We have tests. Which means — *now* — we can refactor safely.

There's a structural problem in this codebase that I noticed during discovery. The rule-based booking parser — the fallback when the Gemini API is down — exists in two places. Server side, in api/chat/route.ts. Client side, in DetailView.tsx. Two copies. Slightly different behavior. Neither of them tested in isolation.

That's the coupling problem from Slide 24. And the reason I didn't refactor this first — before Segment 5 — is that you don't refactor code you can't verify. Now we can verify."

🎤
"I'm going to enter Plan Mode before touching anything."

🖥️ *(press Shift+Tab — show Plan Mode indicator)*

🎤
"Plan Mode. Claude will read the codebase, think through the problem, and produce a plan. It will not write code. That's the rule.

And notice the prompt — I'm describing the *problem*, not the solution."

⌨️

```text
Goal: single source of truth for the rule-based booking parser. Current problem: the
"parse a date/time/people from a guest message" logic is duplicated in
src/app/api/chat/route.ts (server fallback) and src/components/DetailView.tsx (client
fallback), and the two versions disagree. This makes them impossible to test once and
keep in sync. Don't change code yet — present 2–3 approaches with trade-offs.
```

👀 *(while it reads and plans — ~20 s)*
"'Reduce the coupling.' Not 'extract a function.' Not 'create an interface.' The goal and the problem — Claude figures out the approach. Slide 24."

*[Claude returns 2-3 options with trade-offs — e.g.: shared lib in src/lib, server-side only fallback, inline deduplication]*

🎤
"Look at this. It's giving me options. Shared library, server-only consolidation, inline dedup. Each with trade-offs.

This is the conversation you want to have at planning time, not after you've got a 400-line diff to review. Slide 15."

🎤
"Option 1 — shared lib. That's the right call here. Let's go."

🖥️ *(press Shift+Tab again — exit Plan Mode)*

⌨️

```text
Implement option 1 incrementally: extract a pure parseBookingIntent() into
src/lib/bookingParser.ts, point both call sites at it, and run `npm test` after
each step. Keep behaviour unchanged.
```

👀 *(while it extracts and refactors — ~30 s)*
"Incremental. Tested between each step. That's Slide 25 — seven steps for refactoring. We're on steps five and six right now."

*[Claude extracts the function, rewires both call sites, runs tests between steps — all green]*

🖥️ *(run: npm test)*

🎤
"Green. The tests we wrote in Segment 5 — they're now covering the extracted function. We didn't write new tests. The existing tests proved correctness through the refactor.

That's the feedback loop from Slide 42. Tests fail after refactor? Loop back. Tests pass? Move forward."

---

### SEGMENT 7 — Git & Pull Request

⏱️ 1:50:30

🎤
"Last step. And this is the one that closes the loop.

We've done a session's worth of work. Discovery, docs fix, new endpoint, bug fix, tests, refactor. Now I want that history to tell a clean story."

⌨️

```text
Review my changes and propose a series of Conventional Commits — one logical change
each (docs, the new endpoint, the bug fix, the tests, the refactor). Subject under
72 chars, body explains WHY. Don't commit yet — show me the messages first.
```

👀 *(while it drafts — ~10 s)*
"'Show me first.' Every Git operation. That's on the slide and it's the habit. Review before commit, review before push."

*[Claude proposes 5 commits: docs: fix stale CLAUDE.md and README / feat: add /api/activities/[id]/availability route / fix: use booked date in booking success message / test: add coverage for useBookings and chat parser / refactor: extract parseBookingIntent into shared lib]*

🎤
"Five commits. Docs, feature, bug fix, tests, refactor. That's our entire session, in five conventional commits. That's a story you can read in `git log`.

Commit convention is defined in CLAUDE.md now — the updated one — so Claude knows the format. Slide 40."

*[Review the messages, approve, let Claude commit]*

⌨️

```text
Create a PR description with sections: Summary, What changed (grouped by type),
How to test it, Screens affected. Derive everything from the commits and diff.
Then create the PR with `gh pr create`.
```

*[Claude generates the PR body and runs gh pr create]*

🎤
"There's the PR. Summary, change log grouped by docs / feat / fix / test / refactor, manual test steps.

Generated from the diff. Not written from scratch."

---

### CLOSE — Back to Slide 42

⏱️ 1:54:00

🖥️ *(switch back to the deck — Slide 42, the workflow chaining diagram)*

🎤
"This. This is what we just did.

Discovery → Docs → Code Gen → Bug Fix → Test Generation → Refactor → PR.

One session. One story. Started from 'I just joined this team' and ended at a PR with five clean commits and a generated description.

Not every session looks like this — sometimes it's just a bug fix, sometimes it's just tests. But the point is: *these workflows compose*. Each one feeds the next. Tests made refactoring safe. Docs made code gen accurate. The bug repro test became a regression guard.

That's the target state. Not 'I use Claude Code for this one thing.' The whole loop."

❓
"Quick — what's the first workflow you're going to try this week? Not the whole pipeline. Just one. Drop it in chat."

*[Read a few responses.]*

🎤
"Perfect. Start with that one. Get comfortable. Then add another. That's exactly what Slide 41 says — increment.

Questions?"

*[Take questions for the remaining time.]*

---

## QUICK REFERENCE — Demo Interaction Points

| Segment | Type | Purpose |
|---|---|---|
| Transition | 🖥️ Share screen | Establish the narrative: "I just joined this team" |
| Discovery | 👀 Narrate tool calls | Show multi-file exploration live (Slide 6) |
| Discovery → Docs | 🎤 Plant the hook | "It said Next.js. Go open CLAUDE.md." |
| Docs reveal | 🖥️ Open CLAUDE.md | The "aha" moment — wrong framework, live on screen |
| Docs audit table | 🎤 Read it aloud | HOT tier, triggered updates, AI documents *what* not *why* |
| Code gen | 🖥️ Show golden file | "This is the pattern Claude will match" |
| Bug fix | 🖥️ Show browser | Book June 13, see "June 12" — audience sees it themselves |
| Bug fix | 🎤 Failing test first | "Define the bug in executable form" (Slide 32) |
| Test gen | 👀 Coverage gaps | "Zero. Both of them." — land the ROI point (Slide 27) |
| Refactor | 🖥️ Shift+Tab | Plan Mode — the most important habit (Slide 13) |
| Git | 🎤 "Show me first" | Review before commit — every time (Slide 39) |
| Close | 🖥️ Back to Slide 42 | Land the pipeline diagram on real work we just did |

---

*End of voiceover script.*
