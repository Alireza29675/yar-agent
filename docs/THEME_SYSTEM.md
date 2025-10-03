# Theme System

YAR uses a flexible theme system that controls all visual output in the CLI.

## Architecture

The theme system consists of three main components:

### 1. Theme Interface (`src/lib/theme/interface.ts`)

Defines the contract that all themes must implement. This ensures consistency across different themes.

```typescript
export interface Theme {
  header(text: string): void
  section(text: string): void
  success(message: string): void
  error(message: string): void
  // ... and more
}
```

### 2. Theme Manager (`src/lib/theme/manager.ts`)

Manages the global theme state and provides access to the current theme. Allows themes to be changed at runtime.

```typescript
// Get the current theme
const currentTheme = theme()

// Change theme at runtime
ThemeManager.setTheme(new CustomTheme())
```

### 3. Default Theme (`src/lib/theme/default.ts`)

The default implementation with modern colors, spinners, tables, and rich formatting.

## Usage in Commands

Commands should use the `theme()` function to access the current theme:

```typescript
import {theme} from '../lib/theme/index.js'

export default class MyCommand extends Command {
  async run(): Promise<void> {
    theme().header('My Command')
    theme().info('Processing...')
    theme().success('Done!')
  }
}
```

## Creating Custom Themes

To create a custom theme, implement the `Theme` interface:

```typescript
import type {Theme} from './interface.js'

export class MinimalTheme implements Theme {
  header(text: string): void {
    console.log(`=== ${text} ===`)
  }

  success(message: string): void {
    console.log(`✓ ${message}`)
  }

  error(message: string): void {
    console.log(`✗ ${message}`)
  }

  // ... implement all required methods
}
```

### Inheriting from Default Theme

You can extend the default theme to override specific methods:

```typescript
import {DefaultTheme} from './default.js'

export class CustomTheme extends DefaultTheme {
  // Override specific methods
  header(text: string): void {
    // Custom header implementation
    console.log(`>>> ${text} <<<`)
  }

  // All other methods inherited from DefaultTheme
}
```

## Setting a Theme

### At Startup

The default theme is automatically initialized when the theme system is imported.

### At Runtime

Change the theme dynamically:

```typescript
import {ThemeManager} from './lib/theme/index.js'
import {MinimalTheme} from './lib/theme/minimal.js'

// Switch to minimal theme
ThemeManager.setTheme(new MinimalTheme())
```

### Per Command

Different commands can use different themes:

```typescript
export default class MyCommand extends Command {
  async run(): Promise<void> {
    // Save current theme
    const originalTheme = theme()

    // Use custom theme for this command
    ThemeManager.setTheme(new CustomTheme())

    // ... command logic ...

    // Restore original theme
    ThemeManager.setTheme(originalTheme)
  }
}
```

## Theme Interface Methods

### Display Methods
- `header(text)` - Display gradient header with box
- `section(text)` - Display section header
- `divider()` - Display horizontal line

### Message Methods
- `success(message)` - Green success message with ✓
- `error(message)` - Red error message with ✗
- `warning(message)` - Yellow warning message with ⚠
- `info(message)` - Cyan info message with ℹ
- `dim(message)` - Subtle/dim text

### Tool Tracking
- `toolUse(name, input)` - Display tool usage
- `toolResult(name, success, summary)` - Display tool result
- `displayToolStats()` - Show tool usage statistics
- `resetToolStats()` - Clear tool statistics

### Interactive Elements
- `startSpinner(text)` - Start loading spinner
- `updateSpinner(text)` - Update spinner text
- `stopSpinner(message)` - Stop with success
- `failSpinner(message)` - Stop with failure

### Data Display
- `table(headers, rows)` - Display data table
- `summaryBox(title, items)` - Display summary box
- `assistantMessage(text)` - Format AI response

### Utility
- `thinking()` - Show thinking indicator
- `getSpinner()` - Get current spinner instance

## State Management

The theme system uses a singleton pattern for state management:

- **Global State**: One theme is active globally at any time
- **Thread-Safe**: Theme changes affect all subsequent calls
- **Stateful**: Themes can maintain internal state (e.g., tool usage counts)
- **Accessible**: Use `theme()` anywhere in the codebase

## Benefits

### 1. Consistency
All visual output follows the same patterns across commands.

### 2. Flexibility
Easy to create custom themes for different contexts (CI, debug, minimal, etc.).

### 3. Testability
Mock themes can be used in tests to capture output.

### 4. Extensibility
New commands automatically get theming support.

### 5. Runtime Configuration
Themes can be changed based on environment, flags, or user preferences.

## Example: CI Theme

```typescript
export class CITheme implements Theme {
  // Minimal output for CI environments
  header(text: string): void {
    console.log(`[${text}]`)
  }

  success(message: string): void {
    console.log(`PASS: ${message}`)
  }

  error(message: string): void {
    console.error(`FAIL: ${message}`)
  }

  // Disable interactive elements in CI
  startSpinner(text: string): void {
    console.log(text)
  }

  stopSpinner(message?: string): void {
    if (message) console.log(message)
  }

  // ... implement other methods
}

// Usage
if (process.env.CI) {
  ThemeManager.setTheme(new CITheme())
}
```

## Migration from Legacy UI

The old `ui` export is deprecated but still available for backward compatibility:

```typescript
// Old way (deprecated)
import {ui} from '../lib/ui.js'
ui.header('Title')

// New way (recommended)
import {theme} from '../lib/theme/index.js'
theme().header('Title')
```

## Future Enhancements

Potential improvements to the theme system:

1. **Theme Configuration Files**: JSON/YAML theme definitions
2. **Theme Plugins**: Load themes from npm packages
3. **Theme Presets**: Built-in themes (minimal, verbose, colorblind-friendly)
4. **User Preferences**: Save theme choice to config
5. **Conditional Theming**: Auto-detect terminal capabilities
6. **Theme Composition**: Mix and match components from different themes

## See Also

- [UI Library Documentation](./UI_LIBRARY.md) - Detailed API reference
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical details

