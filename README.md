# AI Work Flow

AI Work Flow is a browser-based workflow builder for orchestrating AI and automation steps in a visual canvas.
It combines three ideas in one product:

1. a node editor for building workflows,
2. a runtime that executes those workflows step by step,
3. a live console that shows runs, outputs, errors, and browser session replay.

The app is built with Next.js 16 App Router, Clerk for authentication and billing, Liveblocks for collaborative workflow state, Trigger.dev for run orchestration, Stagehand and Browserbase for browser automation, Neon Postgres for persistence, and Resend for transactional email.

## What This Product Does

The app lets an organization sign in, create workflows, connect nodes, and run them.

Each workflow is a directed graph of steps. A workflow can:

- open URLs,
- click and interact with browser pages,
- extract information from pages,
- observe candidate actions on a page,
- run a broader AI agent loop,
- send email through Resend.

Runs are executed server-side. The canvas is collaborative and live, so changes can sync in real time. The console below the canvas shows run history, step status, outputs, errors, timing, and browser session replay for completed runs.

## High-Level Architecture

The system is split into five major layers:

### 1. App layer

The `app/` directory contains the route groups and pages:

- public auth pages,
- the dashboard shell,
- workflow pages,
- pricing page,
- API routes for Liveblocks and Browserbase replay.

### 2. Workflow feature layer

The `features/workflows/` directory contains the product logic:

- workflow data access,
- workflow actions,
- canvas and sidebar UI,
- node registry and node executors,
- run task and run-state plumbing,
- console, inspector, replay, and selection logic,
- helper hooks and utility functions.

### 3. Infrastructure layer

The app depends on external services:

- Clerk for auth, organizations, and billing,
- Liveblocks for collaborative editing and presence,
- Trigger.dev for background workflow runs,
- Browserbase + Stagehand for browser automation and replay,
- Neon Postgres for data storage,
- Resend for email delivery.

### 4. Shared component layer

The `components/` directory holds reusable UI primitives and layout building blocks:

- sidebar shell,
- theme provider,
- shadcn/ui primitives,
- resizable panel system,
- forms, dialogs, tabs, menus, and other base components.

### 5. Database layer

The `lib/db/` directory contains the Drizzle schema, database client, and migrations.
Workflow graph state and metadata are stored in Neon Postgres.

## Core User Flow

This is the user-facing flow:

1. A signed-in organization opens the dashboard.
2. The sidebar lists workflows for that organization.
3. The user creates or opens a workflow.
4. The workflow canvas lets them add and connect nodes.
5. The right sidebar lets them edit node fields and inspect dependencies.
6. Clicking Run validates the graph, saves it, and triggers a Trigger.dev task.
7. The task executes each node in order.
8. The console shows every run, every step, timing, outputs, and errors.
9. For browser-based runs, the console can replay the Browserbase session.

## Tech Stack

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui component primitives
- `@xyflow/react` for the canvas
- `react-resizable-panels` for shell layout
- `pretty-ms` for human-readable durations
- `hls.js` for replay playback

### Backend and runtime

- Trigger.dev 4 for workflow runs
- Stagehand 3 for browser automation
- Browserbase SDK for sessions and replay retrieval
- Clerk server APIs for auth and billing
- Resend SDK for email sending

### Data and collaboration

- Neon serverless Postgres
- Drizzle ORM + Drizzle Kit
- Liveblocks for real-time graph state and user sync

## Repository Layout

### `app/`

Route groups and pages.

- `app/(auth)` - sign-in and sign-up pages
- `app/(dashboard)` - protected dashboard routes
- `app/(dashboard)/workflows/[id]` - workflow editor page
- `app/(dashboard)/pricing` - organization pricing page
- `app/api/liveblocks/*` - Liveblocks auth and user routes
- `app/api/replays/[sessionId]` - Browserbase replay proxy

### `components/`

Shared UI and app shell pieces.

- `app-sidebar.tsx` - authenticated org sidebar
- `sidebar-org-switcher.tsx` - organization switching
- `theme-provider.tsx` - theme support and hotkey
- `ui/` - reusable primitives

### `features/workflows/`

Workflow product implementation.

- `actions.ts` - server actions for create, delete, run, cancel
- `data.ts` - workflow persistence helpers
- `components/` - canvas, sidebar, console, inspector, replay, step node
- `hooks/` - workflow hooks such as upstream connection lookup and pro gating
- `lib/` - workflow helper functions
- `nodes/` - node registry, executors, and node-specific logic
- `tasks/run-workflow.ts` - Trigger.dev workflow runner

### `lib/`

Shared utilities and infrastructure code.

- `db/` - Drizzle client, schema, and migrations
- `resend.ts` - server-only Resend client
- `utils.ts` - shared utility helpers

## Workflow System

Workflows are graph-driven.

Each node has:

- a type,
- a kind (`trigger` or `action`),
- a display label,
- an icon and accent color,
- input fields,
- outputs that downstream nodes can reference.

The registry lives in `features/workflows/nodes/node-registry.ts`.

### Node types

Current node types:

- `start` - workflow trigger
- `open-url` - opens a browser page
- `act` - performs browser actions
- `extract` - extracts information from a page
- `observe` - finds possible actions on a page
- `agent` - runs a broader browser-based AI agent loop
- `send-email` - sends transactional email through Resend

### Adding a node

The system is registry-driven. A node is added by editing three places:

1. add the executor in `features/workflows/nodes/<node>.ts`,
2. register it in `features/workflows/nodes/node-executor.ts`,
3. add its manifest entry in `features/workflows/nodes/node-registry.ts`.

The canvas and runner discover nodes from the registry, so adding a node does not require changing the core canvas or run loop.

## Runtime Flow

Workflow execution starts in `features/workflows/actions.ts`.

When the user clicks Run:

1. The graph is validated.
2. The workflow graph is persisted.
3. A Trigger.dev task is started.
4. The task topologically sorts the graph.
5. Each step is executed in order.
6. Step metadata is updated as the run progresses.
7. The final output includes the Browserbase session id and the completed step list.

### Step metadata tracked during runs

Each step records:

- node id,
- node type,
- title,
- current status,
- start time,
- finish time,
- duration,
- output,
- error message.

This powers the console UI and replay lookup.

### Browser automation runtime

Browser-based steps use Stagehand with Browserbase.

The runner creates a Browserbase-backed Stagehand instance when the workflow needs it. The session id is captured and returned as part of the completed run output so the UI can replay the browser session later.

### Email runtime

The `send-email` node uses the shared server-side Resend client from `lib/resend.ts`.

It sends from the hardcoded sender:

- `onboarding@resend.dev`

The executor explicitly throws if the Resend SDK returns an error object, because the SDK does not throw on API failure by itself.

## Console and Run Viewer

The bottom console under the canvas shows:

- every recorded run,
- each step in the run,
- step duration,
- step success or failure state,
- the human-readable output for the selected step,
- the error if the step failed,
- browser session replay for completed runs.

### Console layout

The console is split into:

- logs list,
- inspector / output panel.

It supports a selection model with:

- a step selection,
- a replay selection.

### Output language

The inspector intentionally shows plain-language summaries first.

It is designed to read like:

- “Opened the page ...”
- “The action finished.”
- “It read the page and pulled out the important information.”
- “The assistant finished its task.”
- “The email was sent successfully.”

A technical details section is still available underneath for debugging.

## Browserbase Replay

Completed browser runs can be replayed in the console.

Replay works like this:

1. The run captures the Browserbase session id.
2. The UI stores that session id on the run.
3. The client requests replay data from a server route.
4. The server route proxies the replay request to Browserbase using the secret API key.
5. Browserbase returns an HLS playlist when the replay is ready.
6. The frontend plays that playlist with `hls.js`.

This keeps the Browserbase secret key server-side and avoids exposing it in the browser.

## Billing Model

Billing is organization-based through Clerk Billing.

Current gates:

- the `Agent` node is premium,
- creating a workflow requires the `pro` plan.

There is a reusable hook in `features/workflows/hooks/use-pro-plan.ts` that lets the UI redirect non-pro orgs to the pricing page.

The pricing page is in the dashboard route group and uses Clerk’s organization pricing table.

## Authentication and Organizations

The app uses Clerk for:

- sign-in/sign-up,
- organization membership,
- protected dashboard access,
- billing plan checks,
- org-aware workflow ownership.

Only authenticated users with an active organization can use the dashboard.

## Data Model

The workflow graph and workflow metadata are persisted in Postgres.

Workflow records are organization scoped.

The schema is managed with Drizzle migrations in `lib/db/migrations/`.

The project follows this rule:

- database row types should come from the Drizzle schema, not handwritten partial types.

## API Routes

### Liveblocks

- `app/api/liveblocks/auth` - Liveblocks auth endpoint
- `app/api/liveblocks/users` - Liveblocks user endpoint

### Browserbase replay

- `app/api/replays/[sessionId]` - server-side replay proxy that retrieves the HLS playlist

## Environment Variables

The app expects several environment variables. The most important ones are:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_LIVEBLOCK_PUB_KEY`
- `LIVEBLOCKS_SECRET_KEY`
- `BROWSERBASE_API_KEY`
- `RESEND_API_KEY`
- `TRIGGER_SECRET_KEY`

There may be additional environment variables for local development and service integrations.

## Scripts

From `package.json`:

- `npm run dev` - start the Next.js dev server
- `npm run build` - build the app
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run format` - format TypeScript and TSX files
- `npm run typecheck` - run TypeScript type checking
- `npm run db:generate` - generate Drizzle migrations
- `npm run db:migrate` - apply migrations
- `npm run db:push` - push schema changes
- `npm run db:studio` - open Drizzle Studio

## Important Design Decisions

### Live workflow state is separate from run state

The canvas is for editing. The console is for execution history. They are related, but not the same data.

### Node registry is the source of truth

Node appearance, fields, and outputs all come from the registry. The UI and runtime both read from it.

### Browser automation is server-side

Browser sessions, replay retrieval, and automation execution stay on the server-side path.

### Raw output is preserved

Runs record outputs and errors, but the UI translates them into human-readable summaries for normal users.

### Replays are proxied

Replay playback requires Browserbase secret access, so the app proxies that request through a server route.

## What To Know Without Running It

If you only want the mental model:

- This is a workflow builder with AI/browser/email actions.
- Workflows are graphs.
- Runs are executed by Trigger.dev.
- Browser steps use Stagehand on Browserbase.
- The console shows run history and replay.
- Clerk controls auth, orgs, billing, and pricing access.
- Liveblocks keeps the editor collaborative.
- Neon stores workflow data.
- Resend sends email from workflow nodes.

## Status

The project is actively developed and already includes:

- workflow editor,
- run console,
- browser replay,
- billing gates,
- transactional email node,
- collaboration plumbing.

If you want a quick code map for a specific feature, the most useful files are:

- [features/workflows/components/workflow-shell.tsx](features/workflows/components/workflow-shell.tsx)
- [features/workflows/components/right-sidebar.tsx](features/workflows/components/right-sidebar.tsx)
- [features/workflows/components/console-panel.tsx](features/workflows/components/console-panel.tsx)
- [features/workflows/tasks/run-workflow.ts](features/workflows/tasks/run-workflow.ts)
- [features/workflows/nodes/node-registry.ts](features/workflows/nodes/node-registry.ts)
- [features/workflows/actions.ts](features/workflows/actions.ts)
- [app/api/replays/[sessionId]/route.ts](app/api/replays/[sessionId]/route.ts)

