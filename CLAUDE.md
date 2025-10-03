# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YAR (Your AI Research Assistant) is an oclif-based CLI tool that uses Claude Agent SDK to analyze and understand codebases. It provides AI-powered code analysis through read-only operations with a rich terminal UI.

## Key Technologies

- **Framework**: oclif 4 (CLI framework)
- **Language**: TypeScript with ES modules (Node16 module resolution)
- **AI**: Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)
- **Package Manager**: pnpm
- **Node**: 18+ required

## Build & Development Commands

```bash
# Build the project (clears dist/ and recompiles)
pnpm run build

# Run in development mode (uses bin/dev.js, not compiled)
./bin/dev.js [command]

# Lint
pnpm run lint
```

## Architecture

### Core Structure

- `src/commands/` - oclif command implementations (thin layer for CLI parsing)
- `src/tasks/` - Business logic orchestration for commands (e.g., `studyTask()`)
- `src/services/` - Reusable services for core functionality
  - `agent.ts` - AI agent orchestration and message handling
  - `prompt-builder.ts` - Structured prompt generation with context
- `src/utils/` - Shared utilities
  - `stdin.ts` - Stdin reading for piped input
- `src/lib/theme/` - Theme system for UI rendering
  - `manager.ts` - Global theme state management via `ThemeManager`
  - `default.ts` - Default theme implementation with chalk, ora, boxen, etc.
  - `interface.ts` - Theme interface definition
- `src/lib/ui.ts` - Legacy export for backward compatibility (deprecated)

### Layered Architecture

The codebase follows a layered architecture:

1. **Commands** (`src/commands/`) - Thin CLI layer
   - Parse arguments and flags
   - Read stdin using `readStdin()` utility
   - Delegate to task functions
   - Handle output (UI or file)

2. **Tasks** (`src/tasks/`) - Business logic orchestration
   - Coordinate services to accomplish goals
   - Example: `studyTask()` uses prompt builder + agent service

3. **Services** (`src/services/`) - Reusable business logic
   - `agent.ts`: Execute AI agents, handle messages, track stats
   - `prompt-builder.ts`: Build structured prompts with context

4. **Utils** (`src/utils/`) - Pure utility functions
   - `stdin.ts`: Read from piped input

5. **Theme** (`src/lib/theme/`) - UI rendering system
   - Consistent terminal output across commands

### Theme System

The theme system provides UI rendering:

```typescript
import { theme } from '../lib/theme/index.js'

// Display components
theme().header('Title')
theme().info('Message')
theme().success('Done!')
theme().toolUse('Read', { file: 'foo.ts' })
theme().summaryBox('Title', { key: 'value' })
theme().displayToolStats()
```

The theme system:
- Automatically tracks tool usage statistics across commands
- Uses a singleton `ThemeManager` for global state
- Always import from `./lib/theme/index.js`, not `./lib/ui.js`

## Study Command Architecture

The `study` command demonstrates the full layered architecture:

**Command** (`src/commands/study.ts`):
```typescript
import { readStdin } from '../utils/stdin.js'
import { studyTask } from '../tasks/study.js'

// 1. Parse CLI args/flags
// 2. Read stdin: const input = await readStdin()
// 3. Delegate to task: const result = await studyTask({ directory, message, context: input, showUI })
// 4. Output results (UI or file)
```

**Task** (`src/tasks/study.ts`):
```typescript
import { executeAgent, createReadOnlyAgentConfig } from '../services/agent.js'
import { buildStudyPrompt } from '../services/prompt-builder.js'

// 1. Build prompt: const prompt = buildStudyPrompt(directory, message, context)
// 2. Configure agent: const config = createReadOnlyAgentConfig()
// 3. Execute: const result = await executeAgent({ prompt, config, showUI })
// 4. Return result
```

**Services**:
- `agent.ts`: Handles message streaming, tool tracking, UI updates
- `prompt-builder.ts`: Formats prompts with user messages and context

Key features:
- `-m` flag: Important messages to direct agent focus
- `-o` flag: Write analysis to file (suppresses UI)
- Stdin support: Pipe context (git diff, notes, etc.) via `readStdin()`
- Read-only tools: `createReadOnlyAgentConfig()` restricts to safe operations

## Agent Service Usage

Use the `agent.ts` service instead of directly using the SDK:

```typescript
import { executeAgent, createReadOnlyAgentConfig } from '../services/agent.js'

const config = createReadOnlyAgentConfig() // Pre-configured read-only tools
const result = await executeAgent({
  prompt: 'Your task description',
  config,
  showUI: true, // Enable UI feedback
})

// Returns: { text, messageCount, toolUseCount, duration }
```

For custom configurations:

```typescript
const config = {
  systemPrompt: 'Your custom system prompt',
  allowedTools: ['Read', 'Grep', 'Write'], // Specify tools
}
```

Available tools: `Read`, `Write`, `Grep`, `Glob`, `ListDir`, `Bash`, `Edit`

The agent service automatically:
- Handles message streaming from the SDK
- Displays UI feedback via the theme system
- Tracks tool usage statistics
- Accumulates text output

## Important Conventions

1. **ES Modules**: Always use `.js` extensions in imports (TypeScript will resolve to `.ts` files)
2. **Layered Architecture**:
   - Commands: Thin CLI parsing layer
   - Tasks: Orchestrate services to accomplish goals
   - Services: Reusable business logic (agent, prompt-builder)
   - Utils: Pure utility functions (stdin)
3. **Separation of Concerns**: Extract reusable logic into services/utils, not tasks
4. **Theme Usage**: Always use `theme()` from `./lib/theme/index.js`, never import `ui` directly
5. **Agent Service**: Use `executeAgent()` service instead of directly calling Claude SDK
6. **Tool Restrictions**: Use `createReadOnlyAgentConfig()` for read-only operations
7. **API Key**: Requires `ANTHROPIC_API_KEY` environment variable

## Testing

No traditional tests exist. The project uses evaluations (evals) to assess AI agent behavior in the future.

## Output Modes

Commands can operate in two modes:
- **Interactive**: Full UI with colors, spinners, tool tracking (`showUI: true`)
- **Silent**: Minimal output for file writing or piping (`showUI: false`)
