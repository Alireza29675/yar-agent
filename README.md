# YAR - Your AI Research Assistant

An agentic CLI tool for analyzing and understanding codebases through AI-powered exploration, built on top of Claude Agent SDK.

## Features

- 🔍 **Study Command**: Analyze directory structure, architecture, and patterns
- ⏳ **Timeline Command**: Trace Git history to understand codebase evolution
- 🎨 **Clean UI**: Professional terminal output with minimal visual noise
- 🤖 **AI-Powered**: Uses Claude Agent SDK for intelligent exploration
- 📊 **Tool Tracking**: Real-time feedback showing AI operations
- 🎯 **Modern Stack**: TypeScript, ESM, oclif 4

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
- **[Creating Commands](./docs/CREATING_COMMANDS.md)** - Step-by-step guide to creating new commands and tasks
- **[Study Command Features](./docs/STUDY_COMMAND_FEATURES.md)** - Complete guide to the study command
- **[UI Library Reference](./docs/UI_LIBRARY.md)** - API documentation and examples
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - Technical details and architecture
- **[Changelog](./docs/CHANGELOG.md)** - Version history and release notes

## Commands

### `yar study [directory]`

Analyze directory structure, architecture, patterns, and functionality. The AI agent will explore and understand:
- Purpose and functionality
- Structure and architecture
- Dependencies and integrations
- Patterns, conventions, and ways of working
- Testing, security, observability
- Documentation and onboarding

**Examples:**
```bash
# Study current directory
yar study -o analysis.md

# Study specific directory
yar study ./src -o analysis.md

# Focus the analysis
yar study -m "Focus on security" -o security-analysis.md

# Provide additional context via stdin
git diff | yar study -o changes-analysis.md
cat notes.txt | yar study ./api -o api-analysis.md
```

**Features:**
- Defaults to current directory (`.`)
- Read-only operations (safe to run)
- Focus with `-m` flag
- Context via stdin
- Required `-o` flag for output file
- Comprehensive structured analysis

### `yar timeline [directory]`

Trace Git history to understand how a directory evolved over time. The AI agent will:
- Find when the directory was created and by whom
- Identify key milestones and major changes
- Track how patterns and approaches evolved
- Highlight modern vs legacy practices
- Extract notable commits and their impact

**Examples:**
```bash
# Analyze current directory timeline
yar timeline -o timeline.md

# Analyze specific directory
yar timeline ./src -o src-evolution.md

# Focus on specific aspects
yar timeline -m "Focus on architecture changes" -o arch-evolution.md

# Provide context
cat notes.txt | yar timeline ./packages/core -o core-timeline.md
```

**Features:**
- Defaults to current directory (`.`)
- Git operations (read-only)
- Focus with `-m` flag
- Context via stdin
- Required `-o` flag for output file
- Chronological narrative of evolution

## UI & Output

YAR provides a clean, professional terminal interface with:
- Minimal visual noise
- Real-time tool usage feedback
- Progress indicators
- Summary statistics
- Structured markdown output files

All analysis is written to files (required `-o` flag) while providing live feedback in the terminal.

## Architecture

```
yar/
├── src/
│   ├── commands/          # CLI commands (thin layer)
│   │   ├── study.ts
│   │   └── timeline.ts
│   ├── tasks/             # Business logic orchestration
│   │   ├── study.ts
│   │   └── timeline.ts
│   ├── services/          # Core services
│   │   ├── agent.ts       # AI agent execution
│   │   └── prompt-builder.ts
│   ├── prompts/           # All prompts as Markdown
│   │   ├── system/        # Base system prompt
│   │   └── tasks/         # Task-specific prompts
│   ├── config/            # Configuration
│   │   └── tools.ts       # Available tools
│   ├── lib/               # Shared libraries
│   │   └── theme/         # UI theme system
│   └── utils/             # Utilities
├── bin/                   # Executables
├── dist/                  # Compiled output
└── docs/                  # Documentation
```

YAR follows a layered architecture:
1. **Commands**: Parse CLI args and delegate to tasks
2. **Tasks**: Orchestrate services to accomplish goals
3. **Services**: Reusable business logic (agent, prompts)
4. **Prompts**: All prompts stored as Markdown files
5. **Theme**: Consistent UI rendering

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

YAR uses the Claude Agent SDK with a base system prompt that defines its behavior:
- Curious, thorough, and critical thinking
- Pragmatic engineer and product thinker mindset
- Seeks deep understanding before drawing conclusions

**Agent Capabilities:**
1. **Read & Search**: Read, Grep, Glob, ListDir tools
2. **Git Operations**: Bash tool for Git history (timeline only)
3. **Analyze**: Claude's reasoning understands structure and patterns
4. **Explain**: Clear, comprehensive markdown output

All operations are read-only for safety.

## Creating New Commands

See [CREATING_COMMANDS.md](./docs/CREATING_COMMANDS.md) for a comprehensive guide on creating new commands and tasks.

## Contributing

1. Create a new branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Author

Alireza Sheikholmolouki
