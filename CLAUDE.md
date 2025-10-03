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

- `src/commands/` - oclif command implementations
- `src/tasks/` - Business logic separated from command parsing (e.g., `studyTask()`)
- `src/lib/theme/` - Theme system for UI rendering
  - `manager.ts` - Global theme state management via `ThemeManager`
  - `default.ts` - Default theme implementation with chalk, ora, boxen, etc.
  - `interface.ts` - Theme interface definition
- `src/lib/ui.ts` - Legacy export for backward compatibility (deprecated)

### Command Pattern

Commands follow this structure:
1. Parse args/flags using oclif
2. Optionally read stdin for piped input
3. Call a task function from `src/tasks/` with parsed options
4. Display results using the theme system

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

The `study` command (`src/commands/study.ts`) demonstrates the full architectural pattern:

1. **Stdin handling**: Checks `process.stdin.isTTY` to detect piped input
2. **Task delegation**: Calls `studyTask()` from `src/tasks/study.ts`
3. **UI suppression**: Can disable visual output with `showUI: false` for file output
4. **Agent configuration**: Uses Claude Agent SDK with restricted tools (`Read`, `Grep`, `Glob`, `ListDir`)

Key features:
- `-m` flag: Important messages to direct agent focus
- `-o` flag: Write analysis to file (suppresses UI)
- Stdin support: Pipe context (git diff, notes, etc.) to the agent
- System prompt: Enforces read-only operations

## Agent SDK Usage

When using `@anthropic-ai/claude-agent-sdk`:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

const result = await query({
  prompt: 'Your task description',
  options: {
    systemPrompt: 'System instructions',
    allowedTools: ['Read', 'Grep', 'Glob', 'ListDir'], // Restrict tools
  },
})

for await (const message of result) {
  if (message.type === 'assistant') {
    // Handle assistant messages
    const { content, stop_reason } = message.message
  } else if (message.type === 'result') {
    // Handle final result
  }
}
```

Available tools: `Read`, `Write`, `Grep`, `Glob`, `ListDir`, `Bash`, `Edit`

## Important Conventions

1. **ES Modules**: Always use `.js` extensions in imports (TypeScript will resolve to `.ts` files)
2. **File Structure**: Keep command logic minimal; move complex logic to `src/tasks/`
3. **Theme Usage**: Always use `theme()` from `./lib/theme/index.js`, never import `ui` directly
4. **Tool Restrictions**: For user-facing commands, restrict AI to read-only tools for safety
5. **API Key**: Requires `ANTHROPIC_API_KEY` environment variable

## Testing

No traditional tests exist. The project uses evaluations (evals) to assess AI agent behavior in the future.

## Output Modes

Commands can operate in two modes:
- **Interactive**: Full UI with colors, spinners, tool tracking (`showUI: true`)
- **Silent**: Minimal output for file writing or piping (`showUI: false`)
