# Cursor Mastery Guide: Parallel Vibe Coding, Modes, Sessions & Advanced Concepts

> A complete reference for building production-level hackathon projects at maximum speed.

---

## Table of Contents

1. [Your Current Problem: Sequential Bottleneck](#1-your-current-problem-sequential-bottleneck)
2. [Parallel Vibe Coding: 5x Speed](#2-parallel-vibe-coding-5x-speed)
3. [Production-Level Hackathon Approaches](#3-production-level-hackathon-approaches)
4. [Cursor Modes: Plan, Agent, Debug, Ask](#4-cursor-modes-plan-agent-debug-ask)
5. [Session Types: Local, Worktree, Cloud](#5-session-types-local-worktree-cloud)
6. [MCP (Model Context Protocol)](#6-mcp-model-context-protocol)
7. [Multi-Agents & Subagents](#7-multi-agents--subagents)
8. [Skills, Rules & AGENTS.md](#8-skills-rules--agentsmd)
9. [Context Management (@-mentions)](#9-context-management--mentions)
10. [Prompt Engineering for Cursor](#10-prompt-engineering-for-cursor)
11. [Complete Hackathon Workflow: Start to Deploy](#11-complete-hackathon-workflow-start-to-deploy)
12. [Pro Tips & Hidden Features](#12-pro-tips--hidden-features)

---

## 1. Your Current Problem: Sequential Bottleneck

### What You're Doing Now

```
Method 1 (6-Prompt JSON Pipeline):
  Prompt 1 → wait 40min → Prompt 2 → wait 40min → ... → Prompt 6
  Total: ~240 minutes (4 hours)

Method 2 (Iterative Natural Language):
  Base → wait → Add feature A → wait → Add feature B → wait → ...
  Total: Unpredictable, often 3-5 hours
```

### Why It's Slow

- Each prompt waits for the previous one to finish
- Later prompts often break what earlier prompts built
- Context window fills up, model forgets early decisions
- No isolation: one bad change cascades everywhere

### The Fix: Parallel Architecture

```
                    ┌─ Session 1: Frontend UI ─────────┐
                    │                                    │
Plan (20 min) ──────┼─ Session 2: Backend API ──────────┼── Merge (30 min) → Done
                    │                                    │
                    ├─ Session 3: Database + Auth ───────┤
                    │                                    │
                    └─ Session 4: Smart Contracts ───────┘

Total: 20 + 40 + 30 = 90 minutes (vs 240 sequential)
```

---

## 2. Parallel Vibe Coding: 5x Speed

### Strategy A: Multiple Worktree Sessions (Best for Hackathons)

Git worktrees let you have multiple working copies of the same repo, each on its own branch, each in its own Cursor window. This is the single most powerful parallel technique.

**How it works:**

```bash
# You're on main branch in your project
cd your-project

# Create worktrees for each feature
git worktree add ../project-frontend feat/frontend
git worktree add ../project-backend feat/backend
git worktree add ../project-contracts feat/contracts
git worktree add ../project-ai feat/ai-service
```

Now you have 4 separate folders, each with its own branch. Open each in a separate Cursor window.

**Each Cursor window = independent agent session:**

| Window | Branch | Task | Time |
|--------|--------|------|------|
| Window 1 | `feat/frontend` | React UI, components, styling | 40 min |
| Window 2 | `feat/backend` | API routes, middleware, auth | 40 min |
| Window 3 | `feat/contracts` | Solidity contracts, tests | 40 min |
| Window 4 | `feat/ai-service` | AI model integration, endpoints | 40 min |

**After all windows finish (40 min total, not 160):**

```bash
# Merge everything back
git checkout main
git merge feat/frontend
git merge feat/backend
git merge feat/contracts
git merge feat/ai-service

# Clean up worktrees
git worktree remove ../project-frontend
git worktree remove ../project-backend
git worktree remove ../project-contracts
git worktree remove ../project-ai
```

**Critical Rule:** Define clear interfaces BEFORE splitting. Each session needs to know:
- What functions/APIs it should expose
- What data shapes other parts expect
- What ports/endpoints to use

### Strategy B: Cursor Background Agents (Yolo Mode)

Background agents run in the cloud without blocking your main session. You can launch multiple at once.

**How to use:**
1. Open Command Palette → "Background Agent"
2. Or click the agent icon in the sidebar
3. Give it a self-contained task with full context
4. Launch multiple background agents simultaneously
5. They each get their own branch and work independently

**Best for:**
- Writing tests for existing code
- Documentation generation
- Refactoring a specific module
- Adding error handling across files
- Setting up CI/CD configs

**Example: Launch 3 background agents simultaneously:**

```
Agent 1: "Write comprehensive unit tests for all functions in src/lib/.
          Use Jest. Cover edge cases. Create test files next to source files."

Agent 2: "Add proper TypeScript types to all components in src/components/.
          Create a types.ts file for shared types. No 'any' types."

Agent 3: "Set up ESLint, Prettier, and husky pre-commit hooks.
          Add a GitHub Actions CI pipeline that runs lint and tests."
```

All three work in parallel. Each creates its own PR. You review and merge.

### Strategy C: Subagent Parallelism (Within One Session)

Inside a single Cursor Agent session, the AI can launch multiple subagents that work in parallel using the Task tool.

**You can trigger this by saying:**
> "Do these tasks in parallel: (1) create the database schema, (2) set up the API routes, (3) build the auth middleware"

The agent will launch multiple Task subagents simultaneously, each working on its piece.

### Strategy D: Multi-Window Local Sessions

Open the same project in multiple Cursor windows (File → New Window → Open Folder).

**Conflict avoidance:** Each window should work on completely separate files.

```
Window 1: Only touches src/components/
Window 2: Only touches src/api/
Window 3: Only touches src/lib/
Window 4: Only touches contracts/
```

**Warning:** Unlike worktrees, these share the same files. If two windows edit the same file, you get conflicts. Use this only when file boundaries are very clear.

### Strategy E: Cloud Sessions

Cursor Cloud sessions run on remote machines. You can have multiple cloud sessions active simultaneously, each working on a different branch or task.

**Best for:**
- When your local machine is slow
- Running resource-heavy tasks (compilation, training)
- Having more parallel sessions than your machine can handle

### Comparison Table

| Strategy | Isolation | Merge Effort | Max Parallel | Best For |
|----------|-----------|-------------|-------------|----------|
| Worktrees | Full (separate branches) | Medium (git merge) | Limited by CPU/RAM | Feature-level parallelism |
| Background Agents | Full (cloud branches) | Low (PR review) | 5+ | Independent tasks |
| Subagents | None (same workspace) | None | 3-5 per message | File-level parallelism |
| Multi-Window | None (same files) | Manual conflict resolution | 2-3 | Directory-level parallelism |
| Cloud Sessions | Full (remote machines) | Medium | 3+ | Heavy computation |

---

## 3. Production-Level Hackathon Approaches

### Approach 1: Plan-First Architecture (Recommended)

Instead of jumping into code, spend 15-20 minutes in **Plan Mode** designing everything.

**Step 1: System Design Prompt**
```
I'm building [project] for [hackathon]. I need you to design the complete architecture:

1. System architecture diagram (what talks to what)
2. Database schema (every table, every field, every relation)
3. API contract (every endpoint, request/response shapes)
4. Component tree (every UI component, what props it takes)
5. Smart contract interfaces (every function signature)
6. File structure (every file that will exist)

Output this as a structured plan I can hand to separate agents.
```

**Step 2: Generate Interface Contracts**

From the plan, create actual interface files:

```typescript
// src/types/api.ts - This file is the contract between frontend and backend
export interface CreateUserRequest { ... }
export interface CreateUserResponse { ... }

// contracts/interfaces/IToken.sol - Contract between frontend and blockchain
interface IToken {
    function mint(address to, uint256 amount) external;
    ...
}
```

**Step 3: Parallel Implementation**

Hand each agent/session the plan + interface files. They code to the interfaces.

**Step 4: Integration**

Merge and connect the pieces. Because everyone coded to the same interfaces, integration is smooth.

### Approach 2: Skeleton-First (Fast Prototyping)

**Step 1: Generate the entire project skeleton in one prompt:**

```
Create the complete file structure and skeleton code for [project]:
- Every file should exist with the correct exports
- Functions should have correct signatures but TODO bodies
- Components should render placeholder UI with correct props
- Routes should be defined but return mock data
- Contracts should have function signatures but empty bodies

I will fill in the implementations separately.
```

**Step 2: Fill in implementations in parallel sessions.**

Each session picks a module and replaces TODOs with real code. The skeleton ensures everything connects correctly from the start.

### Approach 3: Reference Implementation + Adapt

Find an open-source project similar to what you're building. Use it as a reference.

```
Here is a reference implementation of [similar project]: @reference-repo

I'm building [my project] which is similar but with these differences:
1. [difference 1]
2. [difference 2]

Adapt the architecture and patterns from the reference to build my project.
```

This is faster than designing from scratch because the AI can pattern-match against real, working code.

### Approach 4: AGENTS.md-Driven Development

Create an `AGENTS.md` file at your project root that defines coding standards, architecture decisions, and conventions. Every Cursor session reads this file automatically.

```markdown
# AGENTS.md

## Architecture
- Next.js 15 App Router with Server Components
- PostgreSQL with Drizzle ORM
- tRPC for type-safe API calls

## Conventions
- All components go in src/components/{feature}/
- All API routes follow REST conventions
- Use Zod for all input validation
- Error responses always use { error: string, code: number } shape

## Data Models
- User: { id, email, name, avatar, role }
- Project: { id, title, description, ownerId, status }

## API Endpoints
- POST /api/users → create user
- GET /api/projects → list projects
...
```

Every session/agent in the project automatically follows these rules, keeping code consistent even across parallel work.

### Approach 5: Test-Driven Vibe Coding

Write tests first, then let the AI implement.

```
Step 1: "Write failing tests for the user authentication system.
         Test: signup, login, logout, password reset, session management."

Step 2: "Make all the tests pass. Don't modify the tests."
```

This gives the AI a crystal-clear spec. The tests are the contract. Multiple agents can implement different test suites in parallel.

---

## 4. Cursor Modes: Plan, Agent, Debug, Ask

### Plan Mode

**What it does:** Read-only collaborative mode. The AI can read your code, search, and discuss, but cannot make any changes. You design the approach together before touching code.

**When to use:**
- Starting a new feature (before writing any code)
- The task has multiple valid approaches (JWT vs sessions, REST vs GraphQL)
- Large refactors that touch many files
- You're unsure about the scope or requirements
- Architecture decisions are needed

**When NOT to use:**
- Simple, clear tasks (just use Agent mode)
- You already know exactly what to do
- Bug fixes where the problem is obvious

**How to use it effectively:**

```
1. Switch to Plan Mode
2. Describe what you want to build
3. AI proposes an approach with trade-offs
4. You discuss, refine, agree on the plan
5. Switch to Agent Mode
6. Say "implement the plan we discussed"
7. AI executes the agreed plan
```

**Pro tip:** Plan Mode output becomes context for Agent Mode. The AI remembers the plan and follows it. This means Agent Mode doesn't waste tokens figuring out what to do - it just does it.

### Agent Mode (Default)

**What it does:** Full power mode. The AI can read, write, create, delete files, run terminal commands, use MCP tools, launch subagents, and make any changes.

**When to use:**
- Implementing features
- Writing code
- Running builds and tests
- Installing dependencies
- Git operations
- Any task that requires making changes

**Best practices:**
- Give clear, specific instructions
- Reference files with @-mentions: `@src/components/Hero.jsx`
- Tell it what NOT to do if there's a risk of unwanted changes
- For large tasks, start in Plan, then switch to Agent

### Debug Mode

**What it does:** Systematic troubleshooting mode focused on finding and fixing bugs. It follows a structured diagnostic process with runtime evidence.

**When to use:**
- Something is broken and you don't know why
- Tests are failing unexpectedly
- Runtime errors, crashes, unexpected behavior
- Performance issues
- Build failures with unclear errors

**How it works differently from Agent:**
- Debug Mode is more methodical: it hypothesizes, tests, verifies
- It reads error logs, stack traces, and terminal output more carefully
- It avoids making changes until it understands the root cause
- It verifies the fix actually works before moving on

**Example:**
```
"My app crashes when I click the submit button. The console shows
'TypeError: Cannot read property of undefined'. Here's the error:
[paste error]"
```

Debug Mode will: read the relevant code → form a hypothesis → check related files → identify the root cause → fix it → verify the fix.

### Ask Mode

**What it does:** Read-only mode for exploring and understanding code. No file changes allowed. No MCP access.

**When to use:**
- Understanding how existing code works
- Learning about the codebase structure
- Asking "what does this function do?"
- Code review (reading without modifying)
- Understanding error messages or concepts

**When NOT to use:**
- When you need changes made (use Agent)
- When debugging (use Debug)
- When planning implementation (use Plan)

### Mode Selection Cheat Sheet

```
"Build me a login page"                    → Agent Mode
"How should I structure the auth system?"  → Plan Mode
"Why is the login failing?"                → Debug Mode
"What does the authMiddleware function do?" → Ask Mode
"Add dark mode to the settings page"       → Agent Mode
"Should I use Redux or Zustand?"           → Plan Mode
"The API returns 500 on POST /users"       → Debug Mode
"Explain the database schema"              → Ask Mode
```

### The Power Combo: Plan → Agent → Debug

```
Step 1: Plan Mode
  "I need to add real-time chat to my app. What's the best approach?"
  → AI suggests WebSocket with Socket.io, discusses trade-offs
  → You agree on the plan

Step 2: Agent Mode
  "Implement the real-time chat system we planned"
  → AI builds it following the agreed architecture

Step 3: Debug Mode (if something breaks)
  "Messages aren't appearing in real-time, they only show after refresh"
  → AI systematically diagnoses the WebSocket connection issue
  → Finds the event listener is missing, fixes it

Step 4: Back to Agent Mode
  "Now add typing indicators and read receipts"
  → AI extends the working chat system
```

---

## 5. Session Types: Local, Worktree, Cloud

### Local Sessions

**What it is:** The default. AI runs against your local filesystem. All changes happen on your machine in real-time.

**Pros:**
- Instant file access (no network latency)
- Works offline (model calls still need internet)
- Full access to your local tools, databases, servers
- Changes are immediately visible in your editor

**Cons:**
- Limited by your machine's resources
- One session per window (though you can open multiple windows)
- Long-running tasks block your session

**Best for:**
- Day-to-day development
- Quick changes and iterations
- When you need to run local servers/databases
- When you want maximum control

### Worktree Sessions

**What it is:** Uses `git worktree` to create an isolated copy of your repo on a separate branch. The AI works in this isolated copy without affecting your main working directory.

**How to start:** Cursor has built-in worktree support. When you create a new agent session, you can choose "Worktree" to have it work in an isolated worktree.

**Pros:**
- Complete isolation: AI changes don't touch your main branch
- Perfect for risky/experimental changes
- Can run multiple worktree sessions in parallel
- Easy to discard bad attempts (just delete the worktree)
- Clean merge via git when the work is good

**Cons:**
- Slight setup overhead
- Need to merge changes back manually
- Disk space for multiple copies

**Best for:**
- Parallel feature development (the core of parallel vibe coding)
- Experimental/risky changes you might want to throw away
- When you want to compare multiple approaches (best-of-N)
- Hackathon parallel pipelines

**Worktree + Parallel = Maximum Speed:**

```
Main Session (Local): You work here, coordinating

Worktree 1 (feat/auth):     Agent builds authentication
Worktree 2 (feat/ui):       Agent builds frontend components
Worktree 3 (feat/api):      Agent builds API layer
Worktree 4 (feat/contracts): Agent builds smart contracts

All four work simultaneously → merge into main when done
```

### Cloud Sessions

**What it is:** Agent runs on a remote cloud machine. It has its own compute, file system, and terminal. You get results back as a PR or branch.

**How to start:** Look for "Cloud" or "Remote" session options in the Cursor agent panel. Background agents often run as cloud sessions.

**Pros:**
- Doesn't use your local CPU/RAM
- Can run heavy tasks (compilation, ML training) without slowing your machine
- Can run even when your laptop is closed (background agents)
- Multiple cloud sessions can run simultaneously

**Cons:**
- Network latency for file operations
- Can't access local databases or services directly
- Some local tools may not be available
- May have usage limits depending on your plan

**Best for:**
- Background agents (fire-and-forget tasks)
- Heavy compilation or build tasks
- When your local machine is underpowered
- Running tasks overnight
- CI/CD-like tasks (linting, testing across the codebase)

### Session Type Decision Matrix

```
┌────────────────────────────────┬──────────┬──────────┬──────────┐
│ Scenario                       │  Local   │ Worktree │  Cloud   │
├────────────────────────────────┼──────────┼──────────┼──────────┤
│ Quick single-file edit         │   BEST   │    -     │    -     │
│ Feature implementation         │   Good   │   BEST   │   Good   │
│ Parallel development           │    -     │   BEST   │   Good   │
│ Risky experiment               │    -     │   BEST   │   Good   │
│ Heavy computation              │    -     │    -     │   BEST   │
│ Writing tests                  │   Good   │   Good   │   BEST   │
│ Documentation                  │   Good   │    -     │   BEST   │
│ Debugging                      │   BEST   │    -     │    -     │
│ Working with local DB/server   │   BEST   │   Good   │    -     │
│ Overnight tasks                │    -     │    -     │   BEST   │
│ Best-of-N attempts             │    -     │   BEST   │   Good   │
└────────────────────────────────┴──────────┴──────────┴──────────┘
```

---

## 6. MCP (Model Context Protocol)

### What Is MCP?

MCP is a protocol that lets the AI agent connect to external tools and services. Think of it as "plugins for your AI agent." Without MCP, the agent can only read/write files and run terminal commands. With MCP, it can:

- Control a browser (navigate, click, fill forms, take screenshots)
- Query databases directly
- Call external APIs (GitHub, Jira, Figma, etc.)
- Access specialized tools (SEO analysis, image generation, etc.)
- Interact with any service that has an MCP server

### How MCP Works

```
┌──────────────┐     MCP Protocol      ┌─────────────────┐
│              │ ◄──────────────────── │                 │
│  Cursor AI   │                        │   MCP Server    │
│   Agent      │ ────────────────────► │ (Browser, DB,   │
│              │    Tool calls &        │  GitHub, etc.)  │
└──────────────┘    Responses           └─────────────────┘
```

1. MCP Servers expose "tools" (functions the AI can call)
2. MCP Servers expose "resources" (data the AI can read)
3. Cursor discovers available tools from configured MCP servers
4. The AI agent calls these tools just like it calls built-in tools

### Setting Up MCP Servers

MCP servers are configured in your Cursor settings. There are two levels:

**Project-level** (`.cursor/mcp.json` in your project):
```json
{
  "mcpServers": {
    "browser": {
      "command": "npx",
      "args": ["@anthropic/mcp-browser"]
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}
```

**User-level** (Cursor Settings → MCP):
Configured through the Cursor settings UI. These are available across all projects.

### Most Useful MCP Servers for Hackathons

| MCP Server | What It Does | Hackathon Use |
|------------|-------------|---------------|
| **Browser** | Navigate pages, click, type, screenshot | Test your app, scrape data |
| **GitHub** | Create PRs, issues, read repos | Automate git workflows |
| **Postgres/SQLite** | Query databases directly | Debug data issues |
| **Filesystem** | Advanced file operations | Bulk file processing |
| **Fetch/HTTP** | Make HTTP requests | Test APIs, fetch data |
| **Figma** | Read Figma designs | Build UI from designs |
| **Supabase** | Manage Supabase projects | Backend setup |

### MCP in Action: Browser Testing Example

With the browser MCP, the AI can actually test your web app:

```
You: "Test the login flow on my app running at localhost:3000"

AI Agent:
  1. browser_navigate → goes to localhost:3000
  2. browser_snapshot → sees the login page
  3. browser_fill → types email and password
  4. browser_click → clicks the login button
  5. browser_snapshot → verifies the dashboard loaded
  6. Reports: "Login flow works correctly. Dashboard shows user name."
```

### Creating Custom MCP Servers

You can build your own MCP server for project-specific tools:

```javascript
// my-mcp-server.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({ name: "my-tools", version: "1.0.0" });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "deploy_contract",
    description: "Deploy a smart contract to WireFluid testnet",
    inputSchema: {
      type: "object",
      properties: {
        contractName: { type: "string" }
      }
    }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "deploy_contract") {
    // Your deployment logic here
    return { content: [{ type: "text", text: "Deployed!" }] };
  }
});
```

---

## 7. Multi-Agents & Subagents

### What Are Subagents?

Within a single Cursor Agent session, the AI can spawn child agents (subagents) that work on subtasks. These are different from opening multiple windows - they run within the same conversation.

### Types of Subagents

| Subagent Type | Purpose | Tools Available |
|--------------|---------|----------------|
| `generalPurpose` | Complex multi-step tasks | All tools |
| `explore` | Fast codebase exploration | Search, read only |
| `shell` | Terminal command execution | Shell only |
| `browser-use` | Web automation and testing | Browser MCP |
| `best-of-n-runner` | Isolated experiments in git worktrees | All tools (isolated) |

### How to Trigger Subagents

You don't need to explicitly ask for subagents. The AI uses them automatically when:

- You ask it to explore a codebase it doesn't know
- You ask for multiple independent tasks
- You ask it to try multiple approaches

But you can explicitly request them:

```
"Explore the codebase and tell me how the authentication system works"
→ AI launches an 'explore' subagent

"Try three different approaches to optimize this function,
 each in a separate worktree, and tell me which is fastest"
→ AI launches three 'best-of-n-runner' subagents

"Run the tests and also check for lint errors simultaneously"
→ AI launches two 'shell' subagents in parallel
```

### Best-of-N Pattern (Powerful for Hackathons)

This pattern tries multiple implementations in parallel and picks the best one:

```
You: "I need a real-time notification system. Try 3 different approaches:
      1. WebSocket with Socket.io
      2. Server-Sent Events
      3. Long polling
      Each in a separate worktree. Compare performance and code simplicity."

AI: Launches 3 best-of-n-runner subagents:
  ├─ Runner 1 (worktree): Implements Socket.io approach
  ├─ Runner 2 (worktree): Implements SSE approach
  └─ Runner 3 (worktree): Implements long polling approach

AI: "Runner 2 (SSE) is the best balance of simplicity and performance.
     Here's the comparison: ..."

You: "Merge the SSE approach into main"
```

### Subagent Communication Pattern

Subagents don't share context with each other. They only know what you tell them. This means:

```
WRONG:
  "Do tasks A, B, C in parallel"
  (If B depends on A's output, B will fail)

RIGHT:
  "Do tasks A, B, C in parallel"
  (All three are independent)
  Then: "Now do task D which combines the results"
```

### When to Use Which

```
Single focused task          → Just use Agent mode directly
Explore unfamiliar codebase  → explore subagent
Multiple independent tasks   → generalPurpose subagents in parallel
Try multiple approaches      → best-of-n-runner subagents
Run commands in background   → shell subagent
Test a web app               → browser-use subagent
```

---

## 8. Skills, Rules & AGENTS.md

### AGENTS.md (Project-Level Intelligence)

`AGENTS.md` is a markdown file at your project root that every AI session reads automatically. It's the single most impactful file for consistent AI behavior.

**What to put in AGENTS.md:**

```markdown
# AGENTS.md

## Project Overview
Brief description of what this project is.

## Tech Stack
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: tRPC, Drizzle ORM, PostgreSQL
- Blockchain: Solidity 0.8.33, Hardhat, WireFluid Testnet

## Architecture Decisions
- Use Server Components by default, Client Components only when needed
- All API calls go through tRPC, no raw fetch()
- All forms use react-hook-form with Zod validation

## Coding Conventions
- File naming: PascalCase for components, camelCase for utilities
- Always use TypeScript strict mode
- No `any` types - use `unknown` and narrow
- Prefer `const` assertions for literal types

## File Structure
src/
  app/        → Next.js pages and layouts
  components/ → Reusable UI components
  lib/        → Utilities, helpers, config
  server/     → tRPC routers and procedures
  types/      → Shared TypeScript types

## Common Patterns
[Document patterns specific to your project]

## DO NOT
- Do not use `var`
- Do not add console.log in production code
- Do not modify the database schema without migration
```

**Why this is powerful:** Every AI session, every subagent, every background agent reads this file. It ensures consistent code quality even across parallel development.

### .cursor/rules/ (File-Specific Rules)

Rules in `.cursor/rules/` directory apply to specific file patterns. They're more granular than AGENTS.md.

**Example: `.cursor/rules/react-components.mdc`**
```markdown
---
description: Rules for React components
globs: src/components/**/*.tsx, src/components/**/*.jsx
---

- All components must be functional components with TypeScript
- Use named exports, not default exports
- Props interface must be defined above the component
- Use Tailwind CSS for styling, no inline styles
- Every component must have proper aria-labels for accessibility
```

**Example: `.cursor/rules/solidity.mdc`**
```markdown
---
description: Rules for Solidity smart contracts
globs: contracts/**/*.sol
---

- Use Solidity ^0.8.20
- Every contract must have SPDX license identifier
- Use custom errors instead of require strings
- All state changes must emit events
- Use OpenZeppelin contracts for standards
- NatSpec comments on all public functions
```

### Skills (Reusable Agent Capabilities)

Skills are markdown files that teach the AI how to perform specific tasks. They live in `~/.cursor/skills-cursor/` or `~/.claude/skills/`.

**What a Skill contains:**
- When to activate (trigger words)
- Step-by-step instructions
- Tools to use
- Expected outputs

**Example: Creating a custom skill**

File: `~/.cursor/skills-cursor/deploy-wirefluid/SKILL.md`
```markdown
# Deploy to WireFluid Skill

## Triggers
Use when user says "deploy to wirefluid", "deploy contract", or "wirefluid deployment"

## Steps
1. Check hardhat.config.ts has wirefluidTestnet network configured
2. Verify .env has WIREFLUID_RPC_URL and PRIVATE_KEY
3. Run `npx hardhat compile` and fix any errors
4. Run `npx hardhat test` and ensure all pass
5. Run deployment: `npx hardhat ignition deploy ignition/modules/[Module].ts --network wirefluidTestnet`
6. Save deployed addresses to src/lib/addresses.ts
7. Verify on WireScan: https://wirefluidscan.com

## Common Issues
- "insufficient funds" → Get WIRE from https://faucet.wirefluid.com
- "nonce too high" → Reset nonce in MetaMask or wait for pending tx
```

### Hierarchy of Instructions

```
Most Specific (wins conflicts)
│
├── .cursor/rules/*.mdc (file-pattern specific)
│
├── AGENTS.md (project-wide)
│
├── ~/.cursor/skills-cursor/ (user-wide skills)
│
├── ~/.cursor/rules/ (user-wide rules)
│
└── AI's base knowledge (least specific)
```

---

## 9. Context Management (@-mentions)

### Available @-mentions

The `@` symbol in Cursor chat lets you attach context. This is critical for getting good AI responses.

| @-mention | What It Does | When to Use |
|-----------|-------------|-------------|
| `@filename` | Attaches a specific file | When AI needs to see/edit that file |
| `@foldername/` | Attaches all files in a folder | When AI needs folder context |
| `@Codebase` | Searches the entire codebase | When you don't know where something is |
| `@Web` | Searches the internet | When you need current docs/APIs |
| `@Docs` | Searches documentation | When you need library-specific help |
| `@Git` | Attaches git context | When discussing changes or history |
| `@Chat` | References another chat session | When continuing a previous conversation |
| `@Definitions` | Shows symbol definitions | When discussing specific functions/classes |
| `@Notepads` | Attaches notepad content | When using persistent notes |
| `@Recent Changes` | Shows recent file changes | When debugging recent modifications |

### Context Strategy

**Too little context:** AI guesses wrong, makes assumptions.
**Too much context:** AI gets confused, loses focus, wastes tokens.

**Rules of thumb:**
1. Always @-mention files you want modified
2. @-mention interface/type files for consistency
3. Use `@Codebase` for "find where X is done"
4. Use `@Web` for library docs and current best practices
5. Don't dump 20 files - be selective

**Example: Good context management**
```
"Add a new API route for user registration.
Follow the pattern in @src/api/auth/login.ts
Use the types from @src/types/user.ts
Validate with the schema in @src/lib/validation.ts"
```

The AI now has exactly the context it needs: the pattern to follow, the types to use, and the validation approach.

### Notepads (Persistent Context)

Notepads are persistent notes that survive across chat sessions. Create them for:

- Architecture decisions
- API contracts
- Design system tokens
- Deployment checklists
- Project-specific knowledge

**How to use:**
1. Open the Notepads panel in Cursor
2. Create a new notepad (e.g., "API Contracts")
3. Write your content
4. In any chat, type `@Notepads` → select the notepad
5. AI now has that context

**Hackathon use:** Create a "Project Brief" notepad with your hackathon requirements, judging criteria, and tech constraints. Reference it in every session.

---

## 10. Prompt Engineering for Cursor

### The SPEAR Framework for Cursor Prompts

**S** - Scope: What files/areas are involved
**P** - Pattern: What existing patterns to follow
**E** - Exact: Precise requirements and constraints
**A** - Anti-patterns: What NOT to do
**R** - Result: What the output should look like

**Example:**
```
SCOPE: Create a new page at src/app/dashboard/page.tsx

PATTERN: Follow the layout pattern in @src/app/profile/page.tsx
         Use the same data fetching approach as @src/lib/api.ts

EXACT:
- Show user stats: total projects, active tasks, recent activity
- Use the Card component from @src/components/ui/Card.tsx
- Fetch data server-side (this is a Server Component)
- Mobile responsive with Tailwind

ANTI-PATTERNS:
- Don't use client-side data fetching
- Don't create new components - use existing ones from @src/components/ui/
- Don't add any console.log statements

RESULT:
A complete dashboard page that loads instantly (server-rendered)
with stat cards across the top and an activity feed below.
```

### Effective Prompt Patterns

**The "Expert Persona" Pattern:**
```
"You are an expert Solidity developer who has audited 100+ smart contracts.
 Review @contracts/Token.sol for security vulnerabilities and gas optimization."
```

**The "Before/After" Pattern:**
```
"The current behavior is: [describe current].
 The desired behavior is: [describe desired].
 Change @src/components/Form.tsx to make this happen."
```

**The "Constraint" Pattern:**
```
"Implement user search with these constraints:
 - Must work with existing Prisma schema (don't modify database)
 - Must return results in under 200ms
 - Must support fuzzy matching
 - Must be XSS-safe"
```

**The "Incremental" Pattern (for complex features):**
```
Message 1: "Create the data model and types for a chat system"
Message 2: "Now add the API routes that use these types"
Message 3: "Now build the React components that call these APIs"
Message 4: "Now add real-time updates with WebSocket"
```

Each message builds on the previous, keeping context focused.

### What NOT to Do in Prompts

```
BAD:  "Make a chat app"
      (Too vague. AI will make arbitrary decisions.)

BAD:  "Make a chat app with React, Node, Socket.io, PostgreSQL, Redis,
       JWT auth, file uploads, reactions, threads, mentions, search,
       admin panel, analytics, rate limiting, and dark mode"
      (Too much at once. AI will do everything poorly.)

GOOD: "Create the foundation for a chat app:
       1. Database schema for users, channels, messages
       2. Auth API (signup/login) with JWT
       3. Basic message CRUD API
       4. Simple React UI that shows channels and messages
       Use @AGENTS.md conventions."
      (Focused, clear, references conventions.)
```

---

## 11. Complete Hackathon Workflow: Start to Deploy

### Phase 1: Planning (20 minutes)

```
1. Open Cursor → Plan Mode
2. Paste hackathon brief + judging criteria
3. Ask: "Design the complete architecture for this project.
         Include: tech stack, file structure, database schema,
         API contract, component tree, deployment plan."
4. Discuss and refine the plan
5. Create AGENTS.md from the agreed plan
6. Create interface/type files that define contracts between modules
```

### Phase 2: Skeleton (10 minutes)

```
1. Switch to Agent Mode
2. "Generate the complete project skeleton based on our plan.
    Every file should exist with correct exports and TODO bodies.
    Include: package.json, tsconfig, tailwind config, etc."
3. Verify the skeleton runs: npm install && npm run dev
```

### Phase 3: Parallel Implementation (40 minutes)

```
Option A: Worktree Sessions
  - Create 3-4 worktrees for different features
  - Open each in a Cursor window
  - Each agent implements its module
  - All work simultaneously

Option B: Background Agents
  - Launch 3-4 background agents
  - Each gets a specific module to implement
  - You work on the most critical piece in your main session
  - Review and merge their PRs

Option C: Hybrid
  - You work on frontend in main session
  - Background agent 1: Backend API
  - Background agent 2: Smart contracts
  - Background agent 3: Tests and documentation
```

### Phase 4: Integration (20 minutes)

```
1. Merge all branches/PRs
2. Fix any merge conflicts
3. Run the full app: npm run dev
4. Use Debug Mode for any integration issues
5. Use browser MCP to test the full user flow
```

### Phase 5: Polish (15 minutes)

```
1. "Add loading states, error handling, and empty states
    to all pages"
2. "Add proper meta tags, OG images, and SEO"
3. "Make sure all forms validate inputs and show helpful errors"
4. "Add a landing page hero section that explains the product"
```

### Phase 6: Deploy (5 minutes)

```
1. "Set up Vercel deployment with proper environment variables"
2. Push to GitHub
3. Vercel auto-deploys
4. Test the production URL
```

**Total: ~110 minutes for a production-quality hackathon project.**

---

## 12. Pro Tips & Hidden Features

### Tip 1: Notepad as Shared Memory

Create a notepad called "Decisions" and log every major decision:
```
## Decisions Log
- [x] Using Next.js App Router (not Pages Router) - better for RSC
- [x] PostgreSQL over MongoDB - we need relations
- [x] JWT in httpOnly cookies, not localStorage - security
- [x] Socket.io for real-time - better browser support than raw WS
```

Reference `@Notepads → Decisions` in every new chat to maintain consistency.

### Tip 2: Checkpoint Before Risky Changes

Before any major refactor or risky operation:
```
"Before making changes, create a git commit with message
 'checkpoint: before auth refactor' so we can revert if needed"
```

### Tip 3: Use the AI to Write AGENTS.md

```
"Analyze this codebase and generate an AGENTS.md file that documents:
 1. The tech stack and architecture
 2. Coding conventions used consistently across files
 3. File organization patterns
 4. Common patterns and utilities
 5. Anything a new developer (or AI agent) would need to know"
```

### Tip 4: Terminal Multiplexing

Run dev servers in background terminals and have the AI monitor them:
```
"Start the Next.js dev server, the backend API server,
 and the Hardhat local node - each in a separate terminal.
 Then test that they all communicate correctly."
```

### Tip 5: Use @Web for Cutting-Edge Libraries

When using a new or recently updated library:
```
"@Web How do I set up Drizzle ORM with PostgreSQL in Next.js 15?
 Use the latest docs and API."
```

This prevents the AI from using outdated patterns from its training data.

### Tip 6: The "Review My Code" Pattern

After a session of vibe coding:
```
"Review all changes in this git diff for:
 1. Security vulnerabilities
 2. Performance issues
 3. Missing error handling
 4. Accessibility problems
 5. TypeScript type safety issues

 Fix anything you find."
```

### Tip 7: Composer for Multi-File Edits

Use Cursor Composer (Ctrl/Cmd + I) for:
- Renaming a function/variable across all files
- Applying a pattern change to multiple files
- Consistent style changes across components

### Tip 8: Image Context

You can paste screenshots into Cursor chat. This is powerful for:
- "Make my app look like this" (paste a design screenshot)
- "This error appeared" (paste an error screenshot)
- "Fix the layout issue" (paste a screenshot of the broken UI)

### Tip 9: Git Diff as Context

```
"Look at the recent git changes and write a comprehensive
 commit message explaining what was changed and why"
```

Or review what an agent did:
```
"Show me all the changes you made. Explain each change and why."
```

### Tip 10: Use .env.example as Context

Always maintain a `.env.example` file. When the AI needs to use environment variables, it checks this file to know what's available.

```env
# .env.example
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
NEXT_PUBLIC_API_URL=http://localhost:3001
WIREFLUID_RPC_URL=https://evm.wirefluid.com
PRIVATE_KEY=0x_your_private_key_here
```

### Tip 11: Custom Instructions via Cursor Settings

Go to Cursor Settings → General → "Rules for AI" and add global instructions:

```
- Always use TypeScript, never JavaScript
- Prefer Tailwind CSS over other styling solutions
- Always handle loading, error, and empty states
- Write self-documenting code, minimal comments
- When creating React components, always make them responsive
```

These apply to EVERY session across all projects.

### Tip 12: Toon Format for Complex Prompts

You mentioned using toonformat.dev to convert prompts. This is smart for:
- Compressing long prompts to fit more in context
- Maintaining structure while reducing tokens
- Making prompts parseable by the AI

But note: For Cursor Agent specifically, natural language often works better than highly structured formats because Cursor is optimized for conversational instructions. Use Toon Format mainly when you need to fit a lot of context into a single prompt.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                CURSOR QUICK REFERENCE                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  MODES                                                   │
│  ├─ Plan:  Design before building (read-only)           │
│  ├─ Agent: Build and change things (full power)         │
│  ├─ Debug: Fix bugs systematically                      │
│  └─ Ask:   Understand code (read-only)                  │
│                                                          │
│  SESSIONS                                                │
│  ├─ Local:    Your machine, your files                  │
│  ├─ Worktree: Isolated branch, separate copy            │
│  └─ Cloud:    Remote machine, background capable        │
│                                                          │
│  PARALLEL STRATEGIES                                     │
│  ├─ Worktree sessions: Best for feature parallelism     │
│  ├─ Background agents: Best for independent tasks       │
│  ├─ Subagents: Best for in-session parallelism          │
│  └─ Multi-window: Best for directory-level split        │
│                                                          │
│  CONTEXT (@-mentions)                                    │
│  ├─ @file:      Attach specific file                    │
│  ├─ @folder/:   Attach folder contents                  │
│  ├─ @Codebase:  Search everything                       │
│  ├─ @Web:       Search internet                         │
│  ├─ @Notepads:  Attach persistent notes                 │
│  └─ @Git:       Attach git context                      │
│                                                          │
│  KEY FILES                                               │
│  ├─ AGENTS.md:         Project-wide AI instructions     │
│  ├─ .cursor/rules/:    File-specific AI rules           │
│  ├─ .cursor/mcp.json:  MCP server configuration         │
│  ├─ SKILL.md:          Reusable agent capabilities      │
│  └─ .env.example:      Environment variable template    │
│                                                          │
│  WORKFLOW: Plan → Skeleton → Parallel Build → Integrate │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

*This guide was created for maximum hackathon velocity. The single biggest improvement you can make is switching from sequential to parallel development using worktree sessions or background agents. Everything else is optimization on top of that.*
