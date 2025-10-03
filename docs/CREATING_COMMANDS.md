# Creating New Commands and Tasks

This guide walks you through creating new commands and tasks in YAR following the established architectural patterns.

## Architecture Overview

YAR follows a layered architecture:

```
Command (CLI parsing)
  ↓
Task (orchestration)
  ↓
Services (reusable logic)
  ↓
Utils (pure functions)
```

## Quick Start: Creating a New Command

Let's create a hypothetical `review` command that analyzes code quality.

### Step 1: Create the Task Prompt File

Create `src/prompts/tasks/review.md`:

```markdown
Review the code in directory: {{directory}}

Focus on the following aspects:
- Code quality and maintainability
- Potential bugs and issues
- Best practices and patterns
- Performance considerations

{{#if specificFile}}
Pay special attention to: {{specificFile}}
{{/if}}

Provide actionable recommendations for improvement.
```

**Variable Naming**:
- Use lowercase with underscores: `{{specific_file}}`
- Or camelCase: `{{specificFile}}`
- Be descriptive: `{{target_directory}}` not `{{dir}}`

### Step 2: Create the Task

Create `src/tasks/review.ts`:

```typescript
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

import {CODE_ANALYSIS_SYSTEM_PROMPT} from '../config/system-prompts.js'
import {READ_ONLY_TOOLS} from '../config/tools.js'
import {executeAgent} from '../services/agent.js'
import {buildPrompt, loadPromptFromFile} from '../services/prompt-builder.js'

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Review Task Options
 */
export interface ReviewOptions {
  /** Directory to review */
  directory: string
  /** Optional specific file to focus on */
  specificFile?: string
  /** Optional user message */
  message?: string
  /** Optional additional context */
  context?: string
  /** Whether to show UI */
  showUI?: boolean
}

/**
 * Review Task Result
 */
export interface ReviewResult {
  /** The review text */
  review: string
  /** Duration in seconds */
  duration: number
  /** Number of messages exchanged */
  messageCount: number
  /** Number of tools used */
  toolUseCount: number
}

/**
 * Build review-specific prompt
 *
 * @param directory - Directory to review
 * @param specificFile - Optional file to focus on
 * @param message - Optional user message
 * @param context - Optional additional context
 * @returns The formatted review prompt
 */
async function buildReviewPrompt(
  directory: string,
  specificFile?: string,
  message?: string,
  context?: string,
): Promise<string> {
  // Load base prompt from src/prompts/tasks/ with variable substitution
  const promptFile = join(__dirname, '..', 'prompts', 'tasks', 'review.md')
  const basePrompt = await loadPromptFromFile(promptFile, {
    directory,
    specificFile: specificFile || '',
  })

  // Add message and context using the prompt builder
  return buildPrompt({
    basePrompt,
    context,
    message,
  })
}

/**
 * Review Task
 *
 * Analyzes code quality and provides recommendations.
 */
export async function reviewTask(options: ReviewOptions): Promise<ReviewResult> {
  const {context, directory, message, showUI = true, specificFile} = options

  // Build the prompt
  const prompt = await buildReviewPrompt(directory, specificFile, message, context)

  // Create agent configuration (read-only for safety)
  const config = {
    allowedTools: READ_ONLY_TOOLS,
    systemPrompt: CODE_ANALYSIS_SYSTEM_PROMPT,
  }

  // Execute the agent
  const result = await executeAgent({
    config,
    prompt,
    showUI,
  })

  return {
    duration: result.duration,
    messageCount: result.messageCount,
    review: result.text,
    toolUseCount: result.toolUseCount,
  }
}
```

### Step 3: Create the Command

Create `src/commands/review.ts`:

```typescript
import {Args, Command, Flags} from '@oclif/core'
import * as fs from 'node:fs/promises'

import {theme} from '../lib/theme/index.js'
import {reviewTask} from '../tasks/review.js'
import {readStdin} from '../utils/stdin.js'

export default class Review extends Command {
  static args = {
    directory: Args.string({
      description: 'Directory to review',
      required: true,
    }),
  }

  static description = 'Review code quality and provide recommendations'

  static examples = [
    '<%= config.bin %> <%= command.id %> .',
    '<%= config.bin %> <%= command.id %> ./src',
    '<%= config.bin %> <%= command.id %> . -f src/main.ts',
    '<%= config.bin %> <%= command.id %> . -m "Focus on security issues"',
    '<%= config.bin %> <%= command.id %> . -o review.md',
    'git diff | <%= config.bin %> <%= command.id %> .',
  ]

  static flags = {
    file: Flags.string({
      char: 'f',
      description: 'Specific file to focus on',
      required: false,
    }),
    message: Flags.string({
      char: 'm',
      description: 'Important message for the agent',
      required: false,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output file path to write the review to',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Review)
    const {directory} = args
    const {file, message, output} = flags

    // Check for piped input
    const stdinInput = await readStdin()

    // Suppress visual UI if writing to file
    const showUI = !output

    if (showUI) {
      // Display header
      theme().header('🔍 YAR Review Agent')
      theme().info(`Reviewing directory: ${directory}`)

      if (file) {
        theme().info(`Focusing on file: ${file}`)
      }

      if (stdinInput) {
        theme().info(`Piped input received: ${stdinInput.length} characters`)
      }

      if (message) {
        theme().warning(`User message: ${message}`)
      }

      theme().divider()
    }

    // Run the review task
    const result = await reviewTask({
      context: stdinInput || undefined,
      directory,
      message: message || undefined,
      showUI,
      specificFile: file || undefined,
    })

    // Write to file if output flag is provided
    if (output) {
      await fs.writeFile(output, result.review, 'utf8')
      theme().success(`Review written to: ${output}`)
      theme().info(
        `Duration: ${result.duration}s | Messages: ${result.messageCount} | Tools Used: ${result.toolUseCount}`,
      )
    } else {
      // Display completion summary
      theme().divider()

      theme().summaryBox('Review Complete', {
        Directory: directory,
        Duration: `${result.duration}s`,
        Messages: result.messageCount,
        'Tools Used': result.toolUseCount,
      })

      theme().displayToolStats()

      theme().success('Review completed successfully!')
    }
  }
}
```

### Step 4: Build and Test

```bash
# Build the project
pnpm run build

# Test the command
./bin/dev.js review .
./bin/dev.js review ./src -f src/main.ts
./bin/dev.js review . -m "Focus on performance" -o review.md
git diff | ./bin/dev.js review .
```

## Command Patterns and Best Practices

### Command Structure

```typescript
export default class MyCommand extends Command {
  // 1. Define arguments (positional)
  static args = {
    target: Args.string({
      description: 'Target to process',
      required: true,
    }),
  }

  // 2. Define description
  static description = 'What this command does'

  // 3. Define examples
  static examples = [
    '<%= config.bin %> <%= command.id %> .',
    '<%= config.bin %> <%= command.id %> ./src -f file.ts',
  ]

  // 4. Define flags (options)
  static flags = {
    myFlag: Flags.string({
      char: 'f',
      description: 'Flag description',
      required: false,
    }),
  }

  // 5. Implement run method
  public async run(): Promise<void> {
    // Parse args and flags
    // Read stdin if needed
    // Show UI (if not outputting to file)
    // Call task
    // Display results
  }
}
```

### Task Structure

```typescript
// 1. Define interfaces
export interface MyTaskOptions {
  target: string
  option?: string
  message?: string
  context?: string
  showUI?: boolean
}

export interface MyTaskResult {
  output: string
  duration: number
  messageCount: number
  toolUseCount: number
}

// 2. Create prompt builder (private)
async function buildMyPrompt(...): Promise<string> {
  const basePrompt = await loadPromptFromFile(...)
  return buildPrompt({ basePrompt, message, context })
}

// 3. Implement task (public)
export async function myTask(options: MyTaskOptions): Promise<MyTaskResult> {
  // Build prompt
  // Configure agent
  // Execute agent
  // Return result
}
```

## Common Patterns

### Reading Stdin

```typescript
import {readStdin} from '../utils/stdin.js'

const stdinInput = await readStdin()
if (stdinInput) {
  theme().info(`Piped input received: ${stdinInput.length} characters`)
}
```

### Conditional UI Display

```typescript
const showUI = !flags.output  // Suppress UI when writing to file

if (showUI) {
  theme().header('🔍 Command Name')
  theme().info('Processing...')
}
```

### Writing Output Files

```typescript
if (output) {
  await fs.writeFile(output, result.text, 'utf8')
  theme().success(`Written to: ${output}`)
  theme().info(`Duration: ${result.duration}s`)
} else {
  theme().summaryBox('Complete', {
    Duration: `${result.duration}s`,
    Messages: result.messageCount,
  })
}
```

### Using Different Agent Configurations

```typescript
// Read-only (safe for analysis)
const config = createReadOnlyAgentConfig()

// Custom configuration
const config = {
  systemPrompt: 'Your custom system prompt here',
  allowedTools: ['Read', 'Grep', 'Write'],  // Be careful with Write!
}
```

## File Naming Conventions

- **Commands**: `src/commands/command-name.ts` (kebab-case)
- **Tasks**: `src/tasks/task-name.ts` (kebab-case)
- **Task Prompts**: `src/prompts/tasks/task-name.md` (matches task name)
- **System Prompts**: `src/prompts/system/prompt-name.md` (kebab-case)

## Variable Naming in Prompts

```markdown
Good:
{{directory}}
{{target_file}}
{{analysisType}}

Avoid:
{{dir}}
{{f}}
{{x}}
```

## TypeScript Conventions

```typescript
// Use explicit types for options and results
export interface TaskOptions { ... }
export interface TaskResult { ... }

// Private functions for prompt building
async function buildMyPrompt(...): Promise<string> { ... }

// Public exported task function
export async function myTask(...): Promise<TaskResult> { ... }
```

## Agent Configuration Options

### Read-Only (Recommended for Analysis)

```typescript
import { CODE_ANALYSIS_SYSTEM_PROMPT } from '../config/system-prompts.js'
import { READ_ONLY_TOOLS } from '../config/tools.js'

const config = {
  allowedTools: READ_ONLY_TOOLS,
  systemPrompt: CODE_ANALYSIS_SYSTEM_PROMPT,
}
// Tools: Read, Grep, Glob, ListDir
```

### Available System Prompts

From `src/config/system-prompts.ts`:

```typescript
// For code analysis (read-only operations)
import { CODE_ANALYSIS_SYSTEM_PROMPT } from '../config/system-prompts.js'

// For code generation/modification
import { CODE_GENERATION_SYSTEM_PROMPT } from '../config/system-prompts.js'

// For general purpose tasks
import { GENERAL_ASSISTANT_SYSTEM_PROMPT } from '../config/system-prompts.js'
```

### Available Tool Sets

From `src/config/tools.ts`:

```typescript
import { READ_ONLY_TOOLS, FILE_MODIFICATION_TOOLS, EXECUTION_TOOLS, ALL_TOOLS } from '../config/tools.js'

// READ_ONLY_TOOLS: ['Read', 'Grep', 'Glob', 'ListDir']
// FILE_MODIFICATION_TOOLS: ['Write', 'Edit']
// EXECUTION_TOOLS: ['Bash']
// ALL_TOOLS: All available tools
```

### Custom Configuration

```typescript
import { type AvailableTool, READ_ONLY_TOOLS } from '../config/tools.js'

const config = {
  systemPrompt: `You are a specialized assistant that...`,
  allowedTools: [...READ_ONLY_TOOLS, 'Write'] as AvailableTool[],  // Combine tool sets
}
```

### Creating Custom System Prompts

If none of the provided system prompts fit your needs, create a custom one:

```typescript
import { READ_ONLY_TOOLS } from '../config/tools.js'

const CUSTOM_SYSTEM_PROMPT = `You are a specialized assistant that performs X task.

You have access to these tools: Read, Grep, Write.

Guidelines:
- Be specific about what you're doing
- Follow existing code patterns
- Ask for clarification if needed

Always explain your actions clearly.`

const config = {
  allowedTools: READ_ONLY_TOOLS,
  systemPrompt: CUSTOM_SYSTEM_PROMPT,
}
```

### System Prompt Guidelines

- Be specific about the agent's role
- Clearly state any restrictions
- Explain the expected output format
- Mention any safety constraints
- List available tools explicitly

## Error Handling

```typescript
try {
  const result = await myTask(options)
  // Handle success
} catch (error) {
  theme().error(`Failed: ${error.message}`)
  this.exit(1)
}
```

## Testing Your Command

1. **Build**: `pnpm run build`
2. **Run in dev mode**: `./bin/dev.js your-command [args]`
3. **Test with flags**: `./bin/dev.js your-command . -m "test message"`
4. **Test with stdin**: `echo "test" | ./bin/dev.js your-command .`
5. **Test output**: `./bin/dev.js your-command . -o output.md`

## Checklist

When creating a new command, ensure:

- [ ] Created task prompt file in `src/prompts/tasks/`
- [ ] Created task in `src/tasks/` with interfaces
- [ ] Created command in `src/commands/`
- [ ] Added proper TypeScript types
- [ ] Added examples to command
- [ ] Handled stdin input
- [ ] Support output to file with `-o` flag
- [ ] Used `theme()` for consistent UI
- [ ] Used appropriate agent configuration
- [ ] Built successfully with `pnpm run build`
- [ ] Tested the command in dev mode

## Complete Example Structure

```
src/
├── commands/
│   └── review.ts              # CLI command implementation
├── tasks/
│   └── review.ts              # Task orchestration
├── prompts/
│   ├── system/                # System prompts (auto-loaded)
│   │   ├── code-analysis.md
│   │   ├── code-generation.md
│   │   └── general-assistant.md
│   └── tasks/                 # Task-specific prompts
│       ├── study.md
│       └── review.md          # Your new prompt with {{variables}}
├── config/
│   ├── tools.ts               # Tool configurations
│   └── system-prompts.ts      # Loads system/*.md files
├── services/
│   ├── agent.ts               # Reuse existing
│   └── prompt-builder.ts      # Reuse existing
└── utils/
    └── stdin.ts               # Reuse existing
```

## Next Steps

After creating your command:

1. Update README.md with command documentation
2. Consider adding to docs/ if complex
3. Build and test thoroughly
4. Commit with descriptive message
5. Consider creating evaluations for quality testing

## Need Help?

- See existing commands: `src/commands/study.ts`
- See existing tasks: `src/tasks/study.ts`
- See architecture: `CLAUDE.md`
- See UI library: `docs/UI_LIBRARY.md`
