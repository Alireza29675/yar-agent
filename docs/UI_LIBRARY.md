# YAR UI Library

A modern, colorful CLI UI library for building beautiful terminal interfaces. This library provides a consistent way to display information, track progress, and create engaging user experiences across all YAR commands.

## Features

- 🎨 **Rich Colors**: Modern color scheme with chalk
- 🔄 **Spinners**: Elegant loading indicators with ora
- 📊 **Tables**: Clean data presentation with cli-table3
- 📦 **Boxes**: Highlighted content areas with boxen
- 🌈 **Gradients**: Beautiful gradient text for headers
- 🎯 **Icons**: Unicode symbols for better visual communication
- 📈 **Tool Tracking**: Automatic tracking and statistics for tool usage

## Installation

The UI library is already included in the project. Simply import it:

```typescript
import {ui} from '../lib/ui.js'
```

## Usage

### Basic Messages

```typescript
// Success message
ui.success('Operation completed successfully')

// Error message
ui.error('Something went wrong')

// Warning message
ui.warning('This is a warning')

// Info message
ui.info('Here is some information')

// Dim/subtle text
ui.dim('This is less important')
```

### Headers and Sections

```typescript
// Display a gradient header with box
ui.header('🔍 YAR Study Agent')

// Section header
ui.section('Analysis Results')

// Divider line
ui.divider()
```

### Tool Usage Display

The library automatically tracks tool usage and displays it beautifully:

```typescript
// Display tool usage (automatically tracked)
ui.toolUse('Read', {path: '/path/to/file.ts'})
ui.toolUse('Grep', {pattern: 'console.log', path: '.'})
ui.toolUse('ListDir', {target_directory: './src'})

// Display tool results
ui.toolResult('Read', true, '150 lines read')
ui.toolResult('Write', false, 'Permission denied')

// Show statistics at the end
ui.displayToolStats()

// Reset for next operation
ui.resetToolStats()
```

### Spinners

For long-running operations:

```typescript
// Start a spinner
ui.startSpinner('Processing files...')

// Update spinner text
ui.updateSpinner('Still processing...')

// Stop with success
ui.stopSpinner('Processing complete!')

// Or stop with failure
ui.failSpinner('Processing failed')
```

### Tables

Display structured data:

```typescript
ui.table(
  ['File', 'Lines', 'Type'],  // Headers
  [
    ['index.ts', '42', 'TypeScript'],
    ['app.tsx', '156', 'React'],
    ['styles.css', '89', 'CSS'],
  ]
)
```

### Summary Boxes

Highlight important information:

```typescript
ui.summaryBox('Operation Complete', {
  'Duration': '5.2s',
  'Files Processed': 42,
  'Status': 'Success',
  'Tools Used': 15,
})
```

### Assistant Messages

Format AI assistant responses:

```typescript
ui.assistantMessage(`
# Analysis Results

The codebase follows modern TypeScript patterns:
- Uses ES modules
- Implements strict type checking
- Follows clean architecture
`)
```

## Complete Example

```typescript
import {query} from '@anthropic-ai/claude-agent-sdk'
import {Args, Command} from '@oclif/core'
import {ui} from '../lib/ui.js'

export default class MyCommand extends Command {
  static args = {
    input: Args.string({required: true}),
  }

  async run(): Promise<void> {
    const {args} = await this.parse(MyCommand)

    // Show header
    ui.header('🚀 My Command')
    ui.info(`Processing: ${args.input}`)
    ui.divider()

    // Start spinner
    ui.startSpinner('Analyzing...')

    const startTime = Date.now()
    let toolCount = 0

    // Process with Claude Agent SDK
    const result = await query({
      options: {
        allowedTools: ['Read', 'Grep'],
        systemPrompt: 'You are a helpful assistant.',
      },
      prompt: `Analyze: ${args.input}`,
    })

    ui.stopSpinner()

    // Handle messages
    for await (const message of result) {
      if (message.type === 'assistant') {
        const {content} = message.message

        for (const block of content) {
          if (block.type === 'text' && block.text.trim()) {
            ui.section('Analysis')
            ui.assistantMessage(block.text)
          } else if (block.type === 'tool_use') {
            toolCount++
            ui.toolUse(block.name, block.input)
          }
        }
      }
    }

    // Show summary
    ui.divider()
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    ui.summaryBox('Complete', {
      'Duration': `${duration}s`,
      'Tools Used': toolCount,
    })

    ui.displayToolStats()
    ui.success('Command completed successfully!')
  }
}
```

## Color Scheme

The library uses a consistent color scheme:

- 🔴 **Red**: Errors
- 🟢 **Green**: Success
- 🟡 **Yellow**: Warnings
- 🔵 **Cyan**: Info, headers, sections
- 🟣 **Magenta**: Highlights, important values
- 🔵 **Blue**: Tool names
- ⚫ **Dim**: Subtle text, context

## Icons

The library uses Unicode figures for better visual communication:

- ✓ Success
- ✗ Error
- ⚠ Warning
- ℹ Info
- → Arrow
- … Ellipsis
- And many more from the `figures` library

## Best Practices

1. **Use headers for major operations**: Start each command with `ui.header()`
2. **Use sections for subsections**: Break up output with `ui.section()`
3. **Show tool usage**: Let users see what the agent is doing with `ui.toolUse()`
4. **Display summaries**: End commands with `ui.summaryBox()` and `ui.displayToolStats()`
5. **Use spinners for async operations**: Keep users informed with `ui.startSpinner()`
6. **Be consistent**: Use the same patterns across all commands

## Extending the Library

To add new functionality to the UI library, edit `src/lib/ui.ts`. The library is designed to be easily extensible while maintaining a consistent API.

## Dependencies

- **chalk**: Terminal string styling
- **ora**: Elegant terminal spinners
- **cli-table3**: Beautiful tables
- **boxen**: Create boxes in terminal
- **gradient-string**: Gradient colored text
- **figures**: Unicode symbols

All dependencies are modern, actively maintained, and support ESM.

