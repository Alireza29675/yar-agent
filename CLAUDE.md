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
  - `prompts/` - Task-specific prompts as Markdown files with variable substitution
- `src/services/` - Reusable services for core functionality
  - `agent.ts` - AI agent orchestration and message handling
  - `prompt-builder.ts` - MD file loading, variable substitution, context/message formatting
- `src/config/` - Configuration and constants
  - `tools.ts` - Available tools, tool sets (read-only, file modification, etc.)
  - `system-prompts.ts` - Reusable system prompts for different task types
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
   - `prompt-builder.ts`: Load MD files, substitute variables, add context/messages

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
import { CODE_ANALYSIS_SYSTEM_PROMPT } from '../config/system-prompts.js'
import { executeAgent, createReadOnlyAgentConfig } from '../services/agent.js'
import { buildPrompt, loadPromptFromFile } from '../services/prompt-builder.js'

// 1. Load base prompt from MD: loadPromptFromFile('prompts/study.md', { directory })
// 2. Add context/message: buildPrompt({ basePrompt, message, context })
// 3. Configure agent with system prompt: createReadOnlyAgentConfig(CODE_ANALYSIS_SYSTEM_PROMPT)
// 4. Execute: const result = await executeAgent({ prompt, config, showUI })
// 5. Return result
```

**Configuration** (`src/config/`):
- `tools.ts`: Tool types, tool sets (READ_ONLY_TOOLS, FILE_MODIFICATION_TOOLS, etc.)
- `system-prompts.ts`: Reusable system prompts (CODE_ANALYSIS_SYSTEM_PROMPT, etc.)

**Prompt Files** (`src/tasks/prompts/`):
- Task-specific prompts stored as Markdown files
- Variables defined as `{{variableName}}`
- Example: `study.md` contains the base prompt with `{{directory}}` variable

**Services**:
- `agent.ts`: Handles message streaming, tool tracking, UI updates
- `prompt-builder.ts`: Loads MD files, substitutes variables, adds context/messages

Key features:
- `-m` flag: Important messages to direct agent focus
- `-o` flag: Write analysis to file (suppresses UI)
- Stdin support: Pipe context (git diff, notes, etc.) via `readStdin()`
- Read-only tools: `createReadOnlyAgentConfig()` restricts to safe operations

## Agent Service Usage

Use the `agent.ts` service with system prompts and tool configurations:

```typescript
import { CODE_ANALYSIS_SYSTEM_PROMPT } from '../config/system-prompts.js'
import { executeAgent, createReadOnlyAgentConfig } from '../services/agent.js'

// Read-only agent with a system prompt
const config = createReadOnlyAgentConfig(CODE_ANALYSIS_SYSTEM_PROMPT)
const result = await executeAgent({
  prompt: 'Your task description',
  config,
  showUI: true, // Enable UI feedback
})

// Returns: { text, messageCount, toolUseCount, duration }
```

### Available System Prompts

From `src/config/system-prompts.ts`:
- `CODE_ANALYSIS_SYSTEM_PROMPT` - For analyzing/understanding code (read-only)
- `CODE_GENERATION_SYSTEM_PROMPT` - For generating/modifying code
- `GENERAL_ASSISTANT_SYSTEM_PROMPT` - General purpose assistant

### Available Tools

From `src/config/tools.ts`:
- `READ_ONLY_TOOLS` - `['Read', 'Grep', 'Glob', 'ListDir']`
- `FILE_MODIFICATION_TOOLS` - `['Write', 'Edit']`
- `EXECUTION_TOOLS` - `['Bash']`
- `ALL_TOOLS` - All available tools

### Custom Configuration

```typescript
import { type AvailableTool, READ_ONLY_TOOLS } from '../config/tools.js'

const config = {
  systemPrompt: 'Your custom system prompt here',
  allowedTools: [...READ_ONLY_TOOLS, 'Write'] as AvailableTool[], // Add Write to read-only
}
```

The agent service automatically:
- Handles message streaming from the SDK
- Displays UI feedback via the theme system
- Tracks tool usage statistics
- Accumulates text output

## Prompt File System

Prompts are stored as Markdown files in `src/tasks/prompts/` with variable substitution:

**Creating a prompt file** (`src/tasks/prompts/example.md`):
```markdown
Analyze the {{target}} and look for {{issue_type}} issues.

Focus on {{area}} and provide detailed recommendations.
```

**Loading and using the prompt**:
```typescript
import { loadPromptFromFile, buildPrompt } from '../services/prompt-builder.js'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function buildMyPrompt(target: string, issueType: string) {
  // Load base prompt with variable substitution
  const basePrompt = await loadPromptFromFile(
    join(__dirname, 'prompts', 'example.md'),
    { target, issue_type: issueType, area: 'security' }
  )

  // Add user message and context
  return buildPrompt({ basePrompt, message, context })
}
```

**Benefits**:
- Prompts are easy to read and edit (Markdown format)
- Variables use clear `{{variableName}}` syntax
- Task-specific prompts stay with their tasks
- Generic prompt processing (context, messages) handled by service

## Important Conventions

1. **ES Modules**: Always use `.js` extensions in imports (TypeScript will resolve to `.ts` files)
2. **Layered Architecture**:
   - Commands: Thin CLI parsing layer
   - Tasks: Orchestrate services to accomplish goals
   - Services: Reusable business logic (agent, prompt-builder)
   - Utils: Pure utility functions (stdin)
3. **Separation of Concerns**: Extract reusable logic into services/utils, not tasks
4. **Prompt Files**: Store task-specific prompts in `src/tasks/prompts/` as MD files with `{{variables}}`
5. **Theme Usage**: Always use `theme()` from `./lib/theme/index.js`, never import `ui` directly
6. **Agent Service**: Use `executeAgent()` service instead of directly calling Claude SDK
7. **Tool Restrictions**: Use `createReadOnlyAgentConfig()` for read-only operations
8. **API Key**: Requires `ANTHROPIC_API_KEY` environment variable

## Creating New Commands

See [docs/CREATING_COMMANDS.md](./docs/CREATING_COMMANDS.md) for a comprehensive guide on creating new commands and tasks. The guide covers:

- Complete example with a `review` command
- Step-by-step instructions
- Architecture patterns and best practices
- Prompt file creation with variable substitution
- Task implementation patterns
- Command structure and conventions
- Testing and validation

Quick reference:
1. Create prompt file: `src/tasks/prompts/my-task.md`
2. Create task: `src/tasks/my-task.ts`
3. Create command: `src/commands/my-command.ts`
4. Build and test: `pnpm run build && ./bin/dev.js my-command`

## Testing

No traditional tests exist. The project uses evaluations (evals) to assess AI agent behavior in the future.

## Output Modes

Commands can operate in two modes:
- **Interactive**: Full UI with colors, spinners, tool tracking (`showUI: true`)
- **Silent**: Minimal output for file writing or piping (`showUI: false`)
- keep the docs up to date.