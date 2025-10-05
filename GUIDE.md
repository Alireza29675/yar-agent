# YAR Codebase Guide

**Analysis Date:** October 5, 2025

---

## Overview

YAR (یار - meaning "companion" in Farsi) is an agentic CLI tool built on Claude Agent SDK for understanding complex codebases through AI-powered exploration. It helps developers quickly onboard to unfamiliar codebases by providing:

1. **study** - Deep analysis of directory structure, architecture, patterns, and ways of working
2. **timeline** - Git history analysis to understand codebase evolution and identify modern vs legacy patterns
3. **present** - Convert analysis outputs into beautiful HTML presentations for knowledge sharing

**Key Facts:**
- **Package Name:** yar-agent (published on npm)
- **Current Version:** 0.2.0
- **License:** MIT
- **Author:** Alireza Sheikholmolouki
- **Repository:** https://github.com/Alireza29675/yar
- **Lines of Code:** ~2,100 TypeScript lines across 20 files
- **Node Version:** 18+ required

**Installation:**
```bash
npm install -g yar-agent
```

**Quick Start:**
```bash
cd /path/to/complex/codebase
yar study . -o REPORT.md && yar present -o slides.html -f REPORT.md --serve
```

## Structure

```
yar/
├── bin/                    # CLI entry points
│   ├── run.js             # Production entry (uses compiled dist/)
│   └── dev.js             # Development entry (uses ts-node)
├── src/                   # TypeScript source code
│   ├── commands/          # oclif command implementations (CLI layer)
│   │   ├── study.ts       # Study command
│   │   ├── timeline.ts    # Timeline command
│   │   ├── present.ts     # Present command
│   │   └── ui-demo.ts     # UI demo for testing
│   ├── tasks/             # Task orchestration (business logic)
│   │   ├── study.ts       # Study task implementation
│   │   ├── timeline.ts    # Timeline task implementation
│   │   └── present.ts     # Present task implementation
│   ├── services/          # Core reusable services
│   │   ├── agent.ts       # AI agent orchestration & message handling
│   │   └── prompt-builder.ts  # Prompt loading & variable substitution
│   ├── config/            # Configuration
│   │   ├── tools.ts       # Tool definitions and sets
│   │   └── tool-validators.ts  # File access validators
│   ├── prompts/           # AI prompts as Markdown files
│   │   ├── system/        # System prompts (auto-loaded)
│   │   │   └── app_introduction.md
│   │   └── tasks/         # Task-specific prompts
│   │       ├── study.md   # Study prompt with {{variables}}
│   │       ├── timeline.md
│   │       └── present.md
│   ├── lib/               # UI library and theming
│   │   ├── theme/         # Theme system
│   │   │   ├── interface.ts    # Theme interface
│   │   │   ├── manager.ts      # Global theme manager
│   │   │   ├── default.ts      # Default theme implementation
│   │   │   └── index.ts        # Theme exports
│   │   ├── ui.ts          # Legacy export (deprecated)
│   │   └── ui-example.ts  # UI demo examples
│   └── utils/             # Utility functions
│       ├── stdin.ts       # Stdin reading for piped input
│       └── date.ts        # Date formatting utilities
├── docs/                  # Documentation
│   ├── CREATING_COMMANDS.md    # Guide for creating new commands
│   ├── THEME_SYSTEM.md         # Theme system documentation
│   ├── UI_LIBRARY.md           # UI library API reference
│   ├── TOOL_VALIDATORS.md      # Tool validator documentation
│   └── ...
├── .github/workflows/     # CI/CD
│   └── publish.yml        # npm publishing workflow
├── .changeset/            # Changesets for version management
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── eslint.config.mjs      # ESLint configuration
└── README.md             # User-facing documentation
```

## Tech Stack

**Runtime & Language:**
- **Node.js:** 18+ (ES Modules with Node16 module resolution)
- **TypeScript:** Strict mode, compiles to ES2022
- **Package Manager:** pnpm (version 9)

**Core Dependencies:**
- **CLI Framework:** oclif v4 (Command Line Interface framework)
- **AI SDK:** @anthropic-ai/claude-agent-sdk (^0.1.5)
- **Anthropic SDK:** @anthropic-ai/sdk (^0.65.0)
- **MCP SDK:** @modelcontextprotocol/sdk (^1.19.1)

**UI Libraries:**
- **chalk** (^5.6.2) - Terminal colors
- **ora** (^9.0.0) - Spinners
- **boxen** (^8.0.1) - Boxes
- **cli-table3** (^0.6.5) - Tables
- **gradient-string** (^3.0.0) - Gradient text
- **figures** (^6.1.0) - Unicode symbols

**Development:**
- **ESLint:** v9 with oclif and prettier configs
- **Changesets:** For version management
- **ts-node:** For development execution

## Architecture & Patterns

YAR follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Commands (CLI Layer)                      │
│  - Parse arguments & flags (oclif)                          │
│  - Read stdin for piped input                               │
│  - Delegate to tasks                                        │
│  - Display results via theme system                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Tasks (Orchestration Layer)                  │
│  - Coordinate services to accomplish goals                   │
│  - Build prompts with variables                             │
│  - Configure agent (tools, validators)                      │
│  - Execute agent and return results                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Services (Business Logic)                  │
│  - agent.ts: Execute AI agents, handle messages            │
│  - prompt-builder.ts: Load MD files, substitute variables   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Utils (Pure Functions)                     │
│  - stdin.ts: Read piped input                               │
│  - date.ts: Format dates and contexts                       │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Patterns

#### 1. **Prompt-as-Code Pattern**
All AI prompts are stored as Markdown files with variable substitution:

```typescript
// Load prompt from file with variable substitution
const basePrompt = await loadPromptFromFile(
  'prompts/tasks/study.md',
  { directory: '/src', outputFile: '/output.md' }
)

// Add user context and message
const finalPrompt = buildPrompt({
  basePrompt,
  message: 'Focus on security',
  context: gitDiffOutput
})
```

**Benefits:**
- Easy to read and modify prompts
- Version control for AI instructions
- Clear separation of code and AI behavior
- Support for variable interpolation (`{{directory}}`, `{{outputFile}}`)

#### 2. **Tool Validator Pattern**
Restricts AI agent file access for safety:

```typescript
// Only allow writing to the specific output file
const fileValidator = createFileAccessValidator(outputFile)

const config = {
  allowedTools: [...READ_ONLY_TOOLS, 'Edit', 'Write'],
  canUseTool: fileValidator  // Blocks access to other files
}
```

**Safety Levels:**
- `READ_ONLY_TOOLS`: Safe exploration (Read, Grep, Glob, ListDir)
- `FILE_MODIFICATION_TOOLS`: Controlled writing (Edit, Write)
- `EXECUTION_TOOLS`: Command execution (Bash)

#### 3. **Theme System Pattern**
Singleton-based UI theming with interface-driven design:

```typescript
// Consistent UI across commands
theme().header('Processing')
theme().info('Reading files...')
theme().toolUse('Read', { file: 'config.ts' })
theme().summaryBox('Complete', { Duration: '5s' })
```

**Features:**
- Automatic tool usage tracking
- Runtime theme switching
- Mock themes for testing
- Consistent visual language

#### 4. **Progressive Output Pattern**
Agents write output incrementally rather than all at once:

```
Agent Instructions:
- Write initial draft immediately
- Update and expand as you discover more
- Don't wait until end to create file
```

This provides:
- Real-time progress feedback
- Partial results if interrupted
- Better user experience

#### 5. **Automatic Update Pattern**
YAR automatically detects and updates existing outputs:

```bash
# First run: creates file
yar study . -o GUIDE.md

# Subsequent runs: automatically detects and updates existing file
yar study . -o GUIDE.md
```

**Implementation:**
- Automatically checks if output file exists
- If exists, reads content and passes to agent as context
- Agent preserves good content and adds new findings
- No special flag needed
- Perfect for CI/CD documentation updates

## How To

### Setup & Development

**Prerequisites:**
```bash
# Required
node -v  # Should be 18+
pnpm -v  # Should be 9+

# Set API key
export ANTHROPIC_API_KEY="sk-ant-..."
```

**Installation:**
```bash
# Clone repository
git clone https://github.com/Alireza29675/yar
cd yar

# Install dependencies
pnpm install

# Build project
pnpm run build
```

**Development Workflow:**
```bash
# Run in dev mode (no compilation needed)
./bin/dev.js study . -o output.md

# Build for production
pnpm run build

# Lint code
pnpm run lint

# Test production build
./bin/run.js study . -o output.md
```

### Common Tasks

#### Adding a New Command

Follow the comprehensive guide in `docs/CREATING_COMMANDS.md`. Quick overview:

1. **Create task prompt** (`src/prompts/tasks/my-task.md`):
```markdown
Analyze {{directory}} for {{issue_type}} issues.
Focus on security and provide recommendations.
```

2. **Create task** (`src/tasks/my-task.ts`):
```typescript
export interface MyTaskOptions {
  directory: string
  message?: string
  showUI?: boolean
}

export async function myTask(options: MyTaskOptions) {
  const prompt = await buildMyPrompt(options)
  const config = { allowedTools: READ_ONLY_TOOLS }
  return await executeAgent({ prompt, config, showUI })
}
```

3. **Create command** (`src/commands/my-command.ts`):
```typescript
export default class MyCommand extends Command {
  async run() {
    const {args, flags} = await this.parse(MyCommand)
    const result = await myTask({ ...args, ...flags })
    theme().summaryBox('Complete', { Duration: `${result.duration}s` })
  }
}
```

4. **Build and test**:
```bash
pnpm run build
./bin/dev.js my-command . -o output.md
```

#### Modifying AI Behavior

**Option 1: Edit prompt files** (recommended for task-specific changes)
```bash
# Edit the prompt directly
vim src/prompts/tasks/study.md

# Rebuild (prompts are copied to dist/)
pnpm run build
```

**Option 2: Edit system prompt** (for global behavior changes)
```bash
vim src/prompts/system/app_introduction.md
pnpm run build
```

**Option 3: Add user message** (runtime customization)
```bash
yar study . -m "Focus on security vulnerabilities" -o report.md
```

#### Publishing a New Version

YAR uses Changesets for version management:

```bash
# 1. Create a changeset describing your changes
pnpm exec changeset

# 2. Choose version bump type (major, minor, patch)
# 3. Write description

# 3. Commit the changeset
git add .changeset/
git commit -m "chore: add changeset for feature X"

# 4. Push to main branch
git push origin main

# 5. GitHub Actions automatically:
#    - Creates a "Release PR" OR
#    - Publishes to npm if Release PR is merged
```

**Manual release** (if needed):
```bash
pnpm run build
pnpm run release  # Runs changeset publish
```

#### Adding UI Components

```typescript
// Use existing theme methods
theme().header('Title')
theme().section('Section')
theme().info('Message')
theme().success('Done!')
theme().error('Failed!')
theme().warning('Warning!')
theme().dim('Subtle text')
theme().divider()

// Tables
theme().table(
  ['Column1', 'Column2'],
  [['Row1Col1', 'Row1Col2'], ['Row2Col1', 'Row2Col2']]
)

// Summary boxes
theme().summaryBox('Title', {
  'Key 1': 'Value 1',
  'Key 2': 123
})

// Spinners
theme().startSpinner('Processing...')
theme().updateSpinner('Still processing...')
theme().stopSpinner('Done!')

// Tool display
theme().toolUse('Read', { file: 'config.ts' })
theme().displayToolStats(toolUseCounts)
```

#### Reading User Input

**From flags:**
```typescript
const {args, flags} = await this.parse(MyCommand)
const directory = args.directory
const message = flags.message
```

**From stdin (piped input):**
```typescript
const stdinInput = await readStdin()
if (stdinInput) {
  // User piped content: git diff | yar study .
  // Use as context for agent
}
```

**Example usage:**
```bash
# Via flags
yar study . -m "Focus on authentication"

# Via stdin
git diff | yar study . -o analysis.md
cat notes.txt | yar timeline ./src -o evolution.md
```

### CI/CD Integration

YAR can automatically update documentation in CI:

```yaml
name: Update Documentation

on:
  push:
    branches: [main]

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install YAR
        run: npm install -g yar-agent

      - name: Update analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          yar study . -o docs/GUIDE.md

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/GUIDE.md
          git commit -m "docs: update codebase analysis" || exit 0
          git push
```

**Key Points:**
- YAR automatically detects and updates existing files
- Set `ANTHROPIC_API_KEY` as GitHub secret
- Agent reads existing content and updates with new findings
- Commit messages follow Angular convention

## Dependencies & Integrations

### Core Dependencies

**Claude Agent SDK (@anthropic-ai/claude-agent-sdk)**
- Core abstraction for agentic workflows
- Provides `query()` function for AI agent execution
- Message streaming and tool execution
- Version: ^0.1.5

**oclif (@oclif/core)**
- CLI framework with command parsing, flags, args
- Plugin system (@oclif/plugin-help, @oclif/plugin-plugins)
- Automatic help generation
- Version: ^4

**Anthropic API**
- Requires `ANTHROPIC_API_KEY` environment variable
- Uses user's existing Claude subscription
- No additional charges beyond normal API usage

### Tool Ecosystem

YAR agents have access to these Claude Code tools:

| Tool | Purpose | Safety Level |
|------|---------|--------------|
| **Read** | Read file contents | Safe |
| **Grep** | Search file contents | Safe |
| **Glob** | Find files by pattern | Safe |
| **ListDir** | List directory contents | Safe |
| **Edit** | Edit file with find/replace | Restricted |
| **Write** | Write/overwrite file | Restricted |
| **Bash** | Execute shell commands | Restricted |

**Tool Sets:**
```typescript
READ_ONLY_TOOLS        // [Read, Grep, Glob, ListDir]
FILE_MODIFICATION_TOOLS // [Write, Edit]
EXECUTION_TOOLS        // [Bash]
ALL_TOOLS              // All of the above
```

### External Integrations

**Git Integration:**
- Timeline command uses `git log`, `git show`, `git diff`
- Analyzes commit history for evolution tracking
- Requires git to be installed and repository initialized

**Reveal.js (for presentations):**
- Loaded via CDN in generated HTML
- Version: 4.6.0
- No installation required
- Presentations are self-contained HTML files

**NPM Registry:**
- Published as `yar-agent`
- Automated publishing via GitHub Actions
- Uses changesets for version management

### Protocol & Communication

**Claude Agent SDK Flow:**
```
Command → Task → executeAgent() → Claude Agent SDK → Claude API
                                        ↓
                        Message Stream (text, tool_use, results)
                                        ↓
                        Process messages → Update UI → Return results
```

**Message Types:**
- `assistant` - Contains text and tool_use blocks
- `result` - Final summary information

**Tool Execution:**
1. Agent requests tool use
2. SDK executes tool locally
3. Result returned to agent
4. Agent continues or finishes

## Key Insights

### 1. Safety-First Design

YAR implements multiple safety layers:

- **Tool Validators:** Restrict file access to specific paths
- **Tool Sets:** Predefined safe combinations
- **Read-Only by Default:** Study command uses only read operations
- **Explicit Write Permissions:** Write/Edit only for output files

Example from `studyTask()`:
```typescript
// Only allow editing the output file
const fileValidator = createFileAccessValidator(outputFile)

const config = {
  allowedTools: [...READ_ONLY_TOOLS, 'Edit', 'Write'],
  canUseTool: fileValidator  // Blocks other files
}
```

### 2. Progressive Complexity

Code is organized by complexity:
- **Commands:** Simple, declarative
- **Tasks:** Orchestration, no complex logic
- **Services:** Reusable, well-tested business logic
- **Utils:** Pure functions

### 3. Prompt Engineering Excellence

Prompts are carefully crafted with:
- Clear task descriptions
- Output format specifications
- Progressive disclosure instructions
- Safety constraints
- Date/time context for temporal awareness

### 4. Modern Development Practices

- **ES Modules:** Full ESM with `.js` imports
- **TypeScript Strict Mode:** Maximum type safety
- **Angular Commit Convention:** Consistent git history
- **Changesets:** Automated versioning
- **Documentation-First:** Comprehensive docs/

### 5. User Experience Focus

- **Real-time Feedback:** Spinners, progress updates
- **Beautiful Output:** Colors, tables, boxes, gradients
- **Flexible Input:** Flags, stdin, files
- **Self-Contained:** Presentations work offline
- **CI-Friendly:** Update mode for automation

### 6. Architectural Decisions

**Why oclif?**
- Industry-standard CLI framework
- Plugin ecosystem
- Automatic help generation
- TypeScript support

**Why Markdown prompts?**
- Easy to read and edit
- Version control friendly
- Clear separation from code
- Support for complex formatting

**Why theme system?**
- Consistent UI across commands
- Easy to mock for testing
- Runtime customization
- Supports CI/no-TTY environments

**Why progressive output?**
- Better UX (see results immediately)
- Fault tolerance (partial results on crash)
- Debugging (see where agent stopped)

### 7. Evolution Insights (from Git History)

Recent significant changes:
- **Oct 5, 2025:** Automatic update detection (removed `-u` flag, now always checks for existing files)
- **Oct 5, 2025:** Added date context to outputs (time-aware analysis)
- **Oct 5, 2025:** Renamed package `yar-cli` → `yar-agent`
- **Earlier:** Removed gradient branding for cleaner output
- **Initial:** Project created with 3 core commands

**Modern patterns:**
- Theme system (newer) vs direct `ui` import (legacy)
- File validators (current) vs unrestricted tools (never implemented)
- Progressive output (current) vs batch output (initial approach)

### 8. Code Quality Observations

**Strengths:**
- Clear separation of concerns
- Comprehensive documentation
- Type-safe throughout
- Consistent naming conventions
- Minimal dependencies

**Technical Debt:**
- No automated tests (plans for evals)
- Legacy `ui.ts` export (deprecated but maintained)
- Some documentation duplication between docs/ and CLAUDE.md

## Open Questions & Uncertainties

### 1. Testing Strategy

**Question:** Why no traditional unit/integration tests?

**Observations:**
- Comment in CLAUDE.md mentions "evals" (evaluations) for future
- Suggests AI agent behavior testing approach
- Unclear what the eval framework will look like
- No test files or test runner configured

**Impact:** Difficult to verify behavior changes, refactoring safety

### 2. System Prompt Loading

**Question:** How are system prompts loaded and when?

**Observation:**
- `src/prompts/system/app_introduction.md` exists
- CLAUDE.md mentions multiple system prompts (code-analysis.md, etc.)
- But only `app_introduction.md` found in the codebase
- `src/config/system-prompts.ts` not found (referenced in docs)

**Uncertainty:**
- Are other system prompts removed or never implemented?
- Is there a single system prompt approach now?
- Documentation may be outdated

### 3. MCP SDK Usage

**Question:** What is @modelcontextprotocol/sdk used for?

**Observations:**
- Listed as dependency (^1.19.1)
- Not imported anywhere in current codebase
- No references in documentation
- Possible future feature or removed functionality?

### 4. Theme Manager State

**Question:** How is global theme state managed across concurrent operations?

**Observation:**
- `ThemeManager` uses singleton pattern
- Tool usage tracking is global
- Unclear what happens with concurrent yar commands
- No locking mechanism visible

**Potential Issue:** If multiple yar processes run simultaneously, tool stats might interfere

### 5. Error Handling Strategy

**Question:** What's the error handling philosophy?

**Observations:**
- Commands use `this.error()` which exits process
- Agent service doesn't show explicit error handling
- No retry logic visible
- No error recovery mechanisms

**Uncertainty:** How are transient API errors handled? Network issues? Rate limits?

### 6. Output File Conflicts

**Question:** What happens if output file is being written by another process?

**Observation:**
- No file locking mechanism
- No conflict detection
- Agent reads file at start, but no check if file changed during execution

**Potential Issue:** Race conditions in CI or parallel runs

### 7. API Key Management

**Question:** Are there plans for API key configuration beyond env var?

**Observations:**
- Only supports `ANTHROPIC_API_KEY` environment variable
- No config file support
- No key validation at startup
- Errors presumably happen at first API call

**Uncertainty:** Would a config file or alternative key sources be valuable?

### 8. Performance Characteristics

**Question:** What are typical execution times and costs?

**Observations:**
- Results show duration in seconds
- No token usage tracking
- No cost estimation
- No guidance on typical analysis times

**Uncertainty:**
- How long should a study command take?
- What's the API cost for typical analysis?
- Any optimization strategies?

### 9. Prompt Template Versioning

**Question:** How are prompt changes managed across versions?

**Observations:**
- Prompts in `src/prompts/` are copied to `dist/prompts/`
- Package includes prompts in published files
- If users modify prompts locally, updates would overwrite

**Uncertainty:**
- Should users be able to customize prompts?
- Are prompts considered part of the API contract?
- How to version prompt changes?

### 10. Presentation Customization

**Question:** Can users customize presentation themes/styles?

**Observations:**
- Present task generates complete HTML with embedded styles
- No external CSS or theme files
- Styles are in the AI prompt
- Users would need to modify prompt or post-process HTML

**Potential Enhancement:** External theme system for presentations?

### 11. Build Process

**Question:** Why is prompt copying done manually in build script?

**Observation:**
```json
"build": "shx rm -rf dist && tsc -b && shx cp -r src/prompts dist/prompts"
```

**Uncertainty:**
- Could TypeScript handle this?
- Are there other files that need copying?
- Why not use a build tool like esbuild?

### 12. VSCode Integration

**Question:** Is there VSCode extension planned?

**Observation:**
- `.vscode/launch.json` exists for debugging
- But no extension code
- Could YAR integrate as VSCode extension for in-editor analysis?

---

## Summary

YAR is a well-architected, safety-focused CLI tool that demonstrates excellent separation of concerns and modern development practices. The codebase is clean, well-documented, and follows consistent patterns throughout. Key strengths include the prompt-as-code pattern, safety-first tool access, and beautiful terminal UI.

The main areas of uncertainty revolve around testing strategy, error handling, and some implementation details that are referenced in documentation but not found in code. These don't impact current functionality but would be important for future contributions.

**For Contributors:**
- Start with `docs/CREATING_COMMANDS.md` for adding features
- Follow the layered architecture strictly
- Update prompts to change AI behavior
- Use theme system for all UI
- Follow Angular commit conventions
- Add changesets for version bumps

**For Users:**
- Powerful tool for codebase understanding
- Safe by design (read-only by default)
- Great for onboarding and documentation
- Works well in CI/CD pipelines
- Beautiful presentations for knowledge sharing
