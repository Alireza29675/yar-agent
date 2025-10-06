# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YAR - **Understand Complex Codebases Fast**

An oclif-based CLI tool that uses Claude Agent SDK to analyze and understand codebases. It provides AI-powered code analysis through read-only operations with a rich terminal UI.

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
- `src/prompts/` - All prompts as Markdown files
  - `system/` - System prompts (code-analysis.md, code-generation.md, etc.)
  - `tasks/` - Task-specific prompts (study.md, etc.) with variable substitution
- `src/services/` - Reusable services for core functionality
  - `agent.ts` - AI agent orchestration and message handling
  - `prompt-builder.ts` - MD file loading, variable substitution, context/message formatting
- `src/config/` - Configuration and constants
  - `tools.ts` - Available tools, tool sets (read-only, file modification, etc.)
  - `system-prompts.ts` - Loads system prompts from src/prompts/system/ MD files
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
import { READ_ONLY_TOOLS } from '../config/tools.js'
import { executeAgent } from '../services/agent.js'
import { buildPrompt, loadPromptFromFile } from '../services/prompt-builder.js'

// 1. Load base prompt from MD: loadPromptFromFile('prompts/study.md', { directory })
// 2. Add context/message: buildPrompt({ basePrompt, message, context })
// 3. Create config: { allowedTools: READ_ONLY_TOOLS, systemPrompt: CODE_ANALYSIS_SYSTEM_PROMPT }
// 4. Execute: const result = await executeAgent({ prompt, config, showUI })
// 5. Return result
```

**Configuration** (`src/config/`):
- `tools.ts`: Tool types, tool sets (READ_ONLY_TOOLS, FILE_MODIFICATION_TOOLS, etc.)
- `system-prompts.ts`: Loads system prompts from `src/prompts/system/` MD files

**Prompt Files** (`src/prompts/`):
- **System prompts** (`system/`): code-analysis.md, code-generation.md, general-assistant.md
- **Task prompts** (`tasks/`): study.md, etc. with `{{variableName}}` substitution

**Services**:
- `agent.ts`: Handles message streaming, tool tracking, UI updates
- `prompt-builder.ts`: Loads MD files, substitutes variables, adds context/messages

Key features:
- `-m` flag: Important messages to direct agent focus
- `-o` flag: Write analysis to file (suppresses UI)
- Stdin support: Pipe context (git diff, notes, etc.) via `readStdin()`
- Read-only tools: `READ_ONLY_TOOLS` restricts to safe operations

## Agent Service Usage

Use the `agent.ts` service with system prompts and tool configurations:

```typescript
import { CODE_ANALYSIS_SYSTEM_PROMPT } from '../config/system-prompts.js'
import { READ_ONLY_TOOLS } from '../config/tools.js'
import { executeAgent } from '../services/agent.js'

// Create configuration with tools and system prompt
const config = {
  allowedTools: READ_ONLY_TOOLS,
  systemPrompt: CODE_ANALYSIS_SYSTEM_PROMPT,
}

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

## Task Configuration System

The task configuration system allows you to pass structured parameters to control agent behavior. **Each task defines its own specific configuration interface**, making it clear which parameters apply to which tasks.

### Architecture

Each task has:
1. A specific config interface (e.g., `StudyTaskConfig`, `PresentTaskConfig`)
2. A builder function (e.g., `buildStudyConfig()`, `buildPresentConfig()`)
3. Task-specific or shared configuration parameters

From `src/config/task-configurations.ts`:

**Study Task** (`StudyTaskConfig`):
- `effort?: 'low' | 'mid' | 'high'` - Analysis thoroughness

**Timeline Task** (`TimelineTaskConfig`):
- `effort?: 'low' | 'mid' | 'high'` - Historical analysis depth

**Present Task** (`PresentTaskConfig`):
- `theme?: 'light' | 'dark'` - Presentation theme

**Shared Parameters** (can be reused):
- `EFFORT_CONFIGS` - Used by both study and timeline
- Each task imports and uses only what it needs

### Using Task Configuration

**In Commands** (each task has type-safe configs):
```typescript
import { studyTask } from '../tasks/study.js'
import { timelineTask } from '../tasks/timeline.js'
import { presentTask } from '../tasks/present.js'

// Study task - type-safe StudyTaskConfig
const studyResult = await studyTask({
  directory: '.',
  outputFile: 'GUIDE.md',
  taskConfig: {
    effort: 'high'  // Only valid StudyTaskConfig options
  }
})

// Timeline task - type-safe TimelineTaskConfig
const timelineResult = await timelineTask({
  directory: '.',
  outputFile: 'TIMELINE.md',
  taskConfig: {
    effort: 'low'  // Only valid TimelineTaskConfig options
  }
})

// Present task - type-safe PresentTaskConfig (different from study/timeline)
const presentResult = await presentTask({
  content: markdown,
  taskConfig: {
    theme: 'dark'  // Present-specific configuration
  }
})
```

**Adding New Task-Specific Configuration**:

1. Define the task's config interface and builder in `src/config/task-configurations.ts`:

```typescript
// ============================================================================
// Review Task Configuration (example)
// ============================================================================

const STRICTNESS_CONFIGS: Record<'low' | 'high', TaskConfigParameter> = {
  high: {
    name: 'strictness',
    value: 'high',
    meaning: 'Apply strict code review standards, flag all potential issues'
  },
  low: {
    name: 'strictness',
    value: 'low',
    meaning: 'Focus only on critical issues'
  }
}

export interface ReviewTaskConfig {
  strictness?: 'low' | 'high'
  focus?: 'security' | 'performance' | 'style'
}

export function buildReviewConfig(options: ReviewTaskConfig): TaskConfigParameter[] {
  const config: TaskConfigParameter[] = []

  if (options.strictness) {
    config.push(STRICTNESS_CONFIGS[options.strictness])
  }

  if (options.focus) {
    config.push({
      name: 'focus',
      value: options.focus,
      meaning: `Focus the review on ${options.focus} aspects`
    })
  }

  return config
}
```

2. Use it in your task (`src/tasks/review.ts`):

```typescript
import { buildReviewConfig, type ReviewTaskConfig } from '../config/task-configurations.js'

export interface ReviewOptions {
  // ... other options
  taskConfig?: ReviewTaskConfig
}

async function buildReviewPrompt(..., taskConfig?: ReviewTaskConfig) {
  const taskConfiguration = taskConfig ? buildReviewConfig(taskConfig) : undefined
  return buildPrompt({ ..., taskConfiguration })
}
```

3. Add flags to your command (`src/commands/review.ts`):

```typescript
static flags = {
  strictness: Flags.string({
    options: ['low', 'high'],
    default: 'high',
    description: 'Review strictness level'
  }),
  focus: Flags.string({
    options: ['security', 'performance', 'style'],
    description: 'Review focus area'
  })
}

// Pass to task
taskConfig: {
  strictness: flags.strictness as 'low' | 'high',
  focus: flags.focus as 'security' | 'performance' | 'style' | undefined
}
```

**Reusing Shared Parameters**:

If you want to reuse `effort` in a new task, just import and use `EFFORT_CONFIGS`:

```typescript
import { EFFORT_CONFIGS } from '../config/task-configurations.js'

export interface NewTaskConfig {
  effort?: 'low' | 'mid' | 'high'  // Reuse effort
  someOtherParam?: string
}

export function buildNewTaskConfig(options: NewTaskConfig): TaskConfigParameter[] {
  const config: TaskConfigParameter[] = []

  if (options.effort) {
    config.push(EFFORT_CONFIGS[options.effort])  // Reuse!
  }

  // Add task-specific params...

  return config
}
```

## Prompt File System

All prompts are stored as Markdown files in `src/prompts/`:

### System Prompts (`src/prompts/system/`)

System prompts define agent behavior and are loaded by `src/config/system-prompts.ts`:
- `code-analysis.md` - For read-only code analysis
- `code-generation.md` - For code generation/modification
- `general-assistant.md` - General purpose tasks

These are automatically loaded and exported as constants.

### Task Prompts (`src/prompts/tasks/`)

Task-specific prompts with variable substitution:

**Creating a task prompt** (`src/prompts/tasks/example.md`):
```markdown
Analyze the {{target}} and look for {{issue_type}} issues.

Focus on {{area}} and provide detailed recommendations.
```

**Loading and using task prompts**:
```typescript
import { loadPromptFromFile, buildPrompt } from '../services/prompt-builder.js'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function buildMyPrompt(target: string, issueType: string) {
  // Load task prompt from src/prompts/tasks/
  const basePrompt = await loadPromptFromFile(
    join(__dirname, '..', 'prompts', 'tasks', 'example.md'),
    { target, issue_type: issueType, area: 'security' }
  )

  // Add user message and context
  return buildPrompt({ basePrompt, message, context })
}
```

**Benefits**:
- All prompts in one place (`src/prompts/`)
- System prompts automatically loaded at module initialization
- Task prompts loaded on-demand with variable substitution
- Easy to find, read, and edit all prompts
- Clear separation: system behavior vs task instructions

## Important Conventions

1. **ES Modules**: Always use `.js` extensions in imports (TypeScript will resolve to `.ts` files)
2. **Layered Architecture**:
   - Commands: Thin CLI parsing layer
   - Tasks: Orchestrate services to accomplish goals
   - Services: Reusable business logic (agent, prompt-builder)
   - Utils: Pure utility functions (stdin)
3. **Separation of Concerns**: Extract reusable logic into services/utils, not tasks
4. **Prompt Files**: All prompts in `src/prompts/` - system prompts in `system/`, task prompts in `tasks/`
5. **Configuration**: Import tools and system prompts from `src/config/` and create config objects directly
6. **Theme Usage**: Always use `theme()` from `./lib/theme/index.js`, never import `ui` directly
7. **Agent Service**: Use `executeAgent()` service instead of directly calling Claude SDK
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
1. Create task prompt: `src/prompts/tasks/my-task.md`
2. Create task: `src/tasks/my-task.ts`
3. Create command: `src/commands/my-command.ts`
4. Build and test: `pnpm run build && ./bin/dev.js my-command`

Note: System prompts already exist in `src/prompts/system/` and are auto-loaded by `src/config/system-prompts.ts`.

## Testing

No traditional tests exist. The project uses evaluations (evals) to assess AI agent behavior in the future.

## Output Modes

Commands can operate in two modes:
- **Interactive**: Full UI with colors, spinners, tool tracking (`showUI: true`)
- **Silent**: Minimal output for file writing or piping (`showUI: false`)
- keep the docs up to date.
- do pnpm build after each change.
- do not commit unless asked.
- commit messages should be short but relevant. follow angular convention for commit messages
- always keep the README.md up-to-date
- The code should be DRY. reuse duplicated code.