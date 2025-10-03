# YAR - Your AI Research Assistant

A modern CLI tool powered by Claude Agent SDK for code analysis and understanding.

## Features

- 🔍 **Study Command**: Recursively analyze and understand codebases
- 🎨 **Rich UI**: Beautiful terminal output with colors, spinners, tables, and boxes
- 🤖 **AI-Powered**: Uses Claude Agent SDK for intelligent code analysis
- 📊 **Tool Tracking**: Visual feedback showing what the AI is doing in real-time
- 🎯 **Modern Stack**: Built with TypeScript, ESM, and latest CLI best practices

## Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run locally
./bin/dev.js [command]
```

## 📚 Documentation

For detailed documentation, see the [docs/](./docs/) directory:

- **[CLAUDE.md](./CLAUDE.md)** - Guide for AI coding assistants (Claude Code, Cursor, etc.)
- **[Study Command Features](./docs/STUDY_COMMAND_FEATURES.md)** - Complete guide to the study command
- **[UI Library Reference](./docs/UI_LIBRARY.md)** - API documentation and examples
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - Technical details and architecture
- **[Changelog](./docs/CHANGELOG.md)** - Version history and release notes

## Commands

### `yar study <directory>`

Study a directory and understand how it works recursively. The AI agent will:
- Explore the directory structure
- Read and analyze key files
- Understand dependencies and architecture
- Provide comprehensive insights

**Examples:**
```bash
# Study the current directory
yar study .

# Study a specific directory
yar study ./src

# Direct the agent's focus with a message
yar study . -m "Focus on security vulnerabilities"

# Study with piped context
git diff | yar study .

# Save analysis to file
yar study . -o analysis.md

# Combine all features
git diff | yar study . -m "Analyze breaking changes" -o report.md
```

**Features:**
- Read-only operations (safe to run anywhere)
- **Important messages**: Direct agent focus with `-m` flag
- **Piped input support**: Provide context from other CLI commands
- **Output to file**: Save analysis with `-o` flag
- Visual feedback showing tool usage
- Comprehensive analysis with structured output
- Statistics and summaries

See [STUDY_COMMAND_FEATURES.md](./docs/STUDY_COMMAND_FEATURES.md) for detailed documentation.

### `yar ui-demo`

Demonstrates the UI library capabilities including:
- Colored messages (success, error, warning, info)
- Tool usage displays with icons
- Loading spinners
- Data tables
- Summary boxes
- Tool statistics

Run this command to see all available UI components!

## UI Library

YAR includes a comprehensive UI library for building beautiful CLI interfaces. All commands use this library to provide a consistent, modern user experience.

**Key Features:**
- 🎨 Rich colors with chalk
- 🔄 Elegant spinners with ora
- 📊 Beautiful tables with cli-table3
- 📦 Boxed content with boxen
- 🌈 Gradient text for headers
- 🎯 Unicode icons with figures
- 📈 Automatic tool usage tracking

See [UI_LIBRARY.md](./docs/UI_LIBRARY.md) for complete documentation and examples.

## Architecture

```
yar/
├── src/
│   ├── commands/          # CLI commands
│   │   ├── study.ts       # Study command
│   │   └── ui-demo.ts     # UI demo command
│   ├── lib/               # Shared libraries
│   │   ├── ui.ts          # Rich UI library
│   │   └── ui-example.ts  # Usage examples
│   └── index.ts           # Entry point
├── bin/                   # Executables
├── dist/                  # Compiled output
└── docs/                  # Documentation
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run in development mode
./bin/dev.js [command]

# Lint
pnpm run lint
```

## Evaluations

Tests have been removed in favor of evaluations. Evals will be added in the future to better assess AI agent performance and behavior.

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required for AI features)

## Technologies

- **Runtime**: Node.js 18+
- **Language**: TypeScript with strict mode
- **CLI Framework**: oclif 4
- **AI**: Claude Agent SDK
- **UI Libraries**: chalk, ora, cli-table3, boxen, gradient-string, figures
- **Package Manager**: pnpm

## How It Works

YAR uses the Claude Agent SDK to create AI agents that can:

1. **Read & Search**: Use tools like Read, Grep, Glob, and ListDir
2. **Analyze**: Claude's advanced reasoning understands code structure
3. **Explain**: Provides clear, comprehensive insights
4. **Track**: Visual feedback shows all operations in real-time

The study command gives the AI agent permission to explore directories and files, but restricts it to read-only operations for safety.

## Creating New Commands

To create a new command that uses the rich UI:

```typescript
import {Args, Command} from '@oclif/core'
import {query} from '@anthropic-ai/claude-agent-sdk'
import {ui} from '../lib/ui.js'

export default class MyCommand extends Command {
  static args = {
    input: Args.string({required: true}),
  }

  async run(): Promise<void> {
    const {args} = await this.parse(MyCommand)
    
    ui.header('🚀 My Command')
    ui.info(`Processing: ${args.input}`)
    
    // Your command logic here
    
    ui.success('Complete!')
  }
}
```

See [UI_LIBRARY.md](./docs/UI_LIBRARY.md) for full documentation.

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Author

Alireza Sheikholmolouki
