# YAR - Your AI Research Assistant

An agentic CLI tool for analyzing and understanding codebases through AI-powered exploration, built with Claude Agent SDK.

[![npm version](https://badge.fury.io/js/yar-cli.svg)](https://www.npmjs.com/package/yar-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install -g yar-cli
```

## Requirements

- Node.js 18+
- [Claude Code CLI](https://claude.com/code) - Must be set up before running YAR
  - Uses your existing Claude subscription with no additional charges

## Commands

### `yar study [directory]`

Analyze directory structure, architecture, and patterns.

```bash
# Study current directory
yar study -o analysis.md

# Study specific directory with focus
yar study ./src -m "Focus on security" -o security-analysis.md

# Update existing analysis
yar study -o analysis.md --update
```

**Options:**
- `-o, --output` - Output file (required)
- `-m, --message` - Focus area for analysis
- `-u, --update` - Update existing output file

### `yar timeline [directory]`

Trace Git history to understand codebase evolution.

```bash
# Analyze current directory timeline
yar timeline -o timeline.md

# Focus on specific aspects
yar timeline ./src -m "Focus on architecture changes" -o evolution.md

# Update existing timeline
yar timeline -o timeline.md --update
```

**Options:**
- `-o, --output` - Output file (required)
- `-m, --message` - Focus area for analysis
- `-u, --update` - Update existing output file

### `yar present [options]`

Convert content to reveal.js presentation.

```bash
# From files
yar present -o slides.html -f content.md

# From multiple files
yar present -o slides.html -f intro.md -f main.md -f conclusion.md

# From stdin
cat notes.md | yar present -o slides.html

# Serve immediately
yar present -o slides.html -f content.md --serve

# Update existing presentation
yar present -o slides.html -f new-content.md --update
```

**Options:**
- `-o, --output` - Output HTML file (required)
- `-f, --file` - Input file(s) (can be specified multiple times)
- `-m, --message` - Instructions for the AI
- `--serve` - Serve presentation after generation
- `-u, --update` - Update existing presentation

## Features

- 🔍 **Study**: Comprehensive codebase analysis
- ⏳ **Timeline**: Git history exploration
- 🎨 **Present**: Teaching-focused presentations
- 🔄 **Update Mode**: Keep documentation up-to-date
- 📊 **Clean UI**: Real-time progress feedback

## Use Cases

**Documentation:**
```bash
yar study . -o docs/GUIDE.md
```

**CI Integration:**
```yaml
- name: Update docs
  run: yar study . -o docs/GUIDE.md -u
```

**Presentations:**
```bash
yar present -o onboarding.html -f README.md -f ARCHITECTURE.md
```

## Why YAR?

In Farsi (my mother language), YAR (یار) means companion.

## License

MIT © Alireza Sheikholmolouki

## Links

- [GitHub](https://github.com/Alireza29675/yar)
- [Issues](https://github.com/Alireza29675/yar/issues)
