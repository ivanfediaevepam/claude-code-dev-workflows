---
name: new-api-route
description: >-
  Scaffold a new Next.js App Router API route under src/app/api. Use this
  whenever the user asks to add, create, generate, or build an API
  endpoint/route in this project. Produces a route handler that matches the
  codebase conventions — a JSDoc header documenting the response shapes, typed
  dynamic params (Promise<{ ... }>), NextResponse.json responses, and the
  consistent { error } 404 shape — modeled on
  src/app/api/activities/[id]/route.ts.
---

# New API Route

Generate a Next.js App Router route handler that is indistinguishable in style
from the existing routes in this repo. **Match the golden examples — do not
invent a new structure.**

## Golden examples (read the closest one first)

- `src/app/api/activities/[id]/route.ts` — dynamic route, single resource, 404 path
- `src/app/api/activities/route.ts` — collection route, query-param filtering

## Conventions to follow

1. **Location**: `src/app/api/<segments>/route.ts`. Dynamic segments use
   `[param]` folders, e.g. `src/app/api/activities/[id]/availability/route.ts`.
2. **Imports**: `import { NextRequest, NextResponse } from "next/server";` and
   data from `@/data/activities` (or the relevant `@/` module).
3. **JSDoc header**: document the method + path, the success (200) response
   shape, and any error (e.g. 404) response shape — same style as the golden
   files.
4. **Dynamic params** are a promise; await them:

   ```ts
   interface RouteContext {
     params: Promise<{ id: string }>;
   }

   export async function GET(_request: NextRequest, context: RouteContext) {
     const { id } = await context.params;
     // ...
   }
   ```

5. **Responses**: always `NextResponse.json(...)`. Wrap success payloads as
   `{ data }` (single resource) or `{ data, total }` (collections). Keep the
   404 shape `{ error: "<message>" }` with `{ status: 404 }`.
6. **No new dependencies, no side effects**: read from the existing in-memory
   `ACTIVITIES` source unless told otherwise.

## After generating — verify (always)

Emit a short checklist and run what you can:

- [ ] `npx tsc --noEmit` passes
- [ ] Happy path: `curl -s localhost:3000/api/<path>` returns the documented shape
- [ ] Error path: `curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/api/<bad>` returns the documented status

Report the file created plus the two curl commands so the route is reviewable in
under a minute.
