# Tool Validators

Tool validators allow you to restrict which files the agent can access when using Edit and Write tools. This provides hard enforcement at the tool level, preventing the agent from accessing files outside the allowed scope.

## File Access Validator

The `createFileAccessValidator()` function accepts either a string or a RegExp pattern:

### String Pattern (Exact File or Directory)

When you pass a string, it restricts access to:
- **A specific file** - if the path points to a file
- **All files in a directory** - if the path points to a directory

```typescript
import { executeAgent } from '../services/agent.js'
import { createFileAccessValidator } from '../config/tool-validators.js'

// Single file only
const fileValidator = createFileAccessValidator('/path/to/config.json')

// Directory (all files within)
const dirValidator = createFileAccessValidator('/path/to/project/src')

const result = await executeAgent({
  prompt: 'Update the timeout value to 5000 in the config file',
  config: {
    allowedTools: ['Edit', 'Write', 'Read'],
    canUseTool: fileValidator
  },
  showUI: true
})
```

### RegExp Pattern (Flexible Matching)

When you pass a RegExp, files matching the pattern are allowed:

```typescript
import { createFileAccessValidator } from '../config/tool-validators.js'

// All markdown files
const mdValidator = createFileAccessValidator(/\.md$/)

// All files in docs directory
const docsValidator = createFileAccessValidator(/\/docs\//)

// Specific file types in src
const srcValidator = createFileAccessValidator(/\/src\/.*\.(ts|js)$/)

const result = await executeAgent({
  prompt: 'Update all markdown documentation',
  config: {
    allowedTools: ['Edit', 'Write', 'Read', 'Grep', 'Glob'],
    canUseTool: mdValidator
  }
})
```

**Behavior:**
- Agent can use Edit/Write ONLY on files matching the pattern
- Any attempts to access other files will be denied with an interrupt message
- Other tools (Read, Grep, etc.) work normally without restrictions

## Creating Custom Validators

You can create custom validators by implementing the `CanUseTool` type:

```typescript
import type { CanUseTool } from '@anthropic-ai/claude-agent-sdk'

const customValidator: CanUseTool = async (toolName, input) => {
  // Your validation logic here

  if (/* should allow */) {
    return {
      behavior: 'allow',
      updatedInput: input
    }
  } else {
    return {
      behavior: 'deny',
      message: 'Custom error message to the agent',
      interrupt: true
    }
  }
}
```

## Use Cases

### 1. Safe Config Editing
Let the agent edit a single config file without risk of modifying code:
```typescript
const validator = createFileAccessValidator('/app/config.json')
```

### 2. Scoped Refactoring
Allow refactoring within a specific module/directory:
```typescript
const validator = createFileAccessValidator('/src/auth')
```

### 3. Documentation Updates
Restrict to markdown files anywhere in the project:
```typescript
const validator = createFileAccessValidator(/\.md$/)
```

### 4. Controlled Code Generation
Allow creating files only in specific directories:
```typescript
const validator = createFileAccessValidator(/\/src\/(components|utils)\//)
```

### 5. File Type Restrictions
Only allow editing specific file types:
```typescript
const validator = createFileAccessValidator(/\.(ts|tsx)$/)
```

## Security Note

Tool validators provide **hard enforcement** - the agent physically cannot access files outside the allowed scope, even if it tries. This is much more secure than relying on prompt instructions alone.
