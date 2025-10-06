# YAR Usage Guide

Complete documentation for using YAR to analyze codebases, trace history, and create presentations.

## Table of Contents

- [Installation](#installation)
- [Commands](#commands)
  - [yar study](#yar-study)
  - [yar timeline](#yar-timeline)
  - [yar present](#yar-present)
- [Common Workflows](#common-workflows)
- [CI/CD Integration](#cicd-integration)
- [Advanced Usage](#advanced-usage)

## Installation

### Prerequisites

1. **Node.js 18+**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **Claude Code CLI**
   ```bash
   npm install -g @anthropic-ai/claude-code-cli
   ```

3. **Anthropic API Key**

   Set your API key as an environment variable:
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

   Or add it to your shell profile (~/.bashrc, ~/.zshrc, etc.):
   ```bash
   echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.zshrc
   ```

### Install YAR

```bash
npm install -g yar-agent

# Verify installation
yar --version
```

## Commands

### yar study

Analyzes a directory and creates comprehensive onboarding guides.

#### Basic Usage

```bash
# Study current directory (creates GUIDE.md)
yar study .

# Study specific directory
yar study ./src

# Study with focus
yar study . -m "Focus on security patterns"

# Custom output file
yar study . -o analysis.md
```

#### Options

- **`-o, --output <file>`** (optional, default: GUIDE.md) - Output file path
- **`-m, --message <text>`** - Focus message to guide the analysis
- **`--effort <level>`** (optional, default: mid) - Analysis effort level:
  - `low` - Quick overview focusing on most important aspects
  - `mid` - Balanced analysis with good coverage
  - `high` - Thorough investigation, leave no stone unturned

#### Features

**Automatic Updates**: If the output file exists, YAR automatically reads it and updates with new findings:

```bash
# First run - creates GUIDE.md
yar study .

# Second run - updates existing GUIDE.md with new insights
yar study .
```

**Piped Input**: Provide additional context via stdin:

```bash
# Analyze with git diff context
git diff | yar study .

# Analyze with notes
cat notes.txt | yar study ./src

# Analyze with specific focus
echo "Focus on authentication" | yar study .

# Thorough deep-dive analysis
yar study . --effort=high

# Quick high-level overview
yar study . --effort=low
```

#### What It Analyzes

- **Architecture**: Directory structure, key abstractions, design patterns
- **Entry Points**: Where execution begins, main files
- **How-To**: Common development tasks, workflows
- **Dependencies**: Key libraries, integrations
- **Conventions**: Coding patterns, naming conventions
- **Modern vs Legacy**: Current best practices vs deprecated approaches

#### Output Format

Creates a comprehensive markdown guide with sections like:
- Overview
- Getting Started
- Architecture
- How To
- Key Insights
- Dependencies & Integrations
- Open Questions & Uncertainties

### yar timeline

Traces Git history to understand how a codebase evolved.

#### Basic Usage

```bash
# Analyze current directory's evolution (creates TIMELINE.md)
yar timeline .

# Analyze specific directory
yar timeline ./src/api

# Focus on specific aspects
yar timeline . -m "Focus on architecture changes"

# Custom output file
yar timeline . -o EVOLUTION.md
```

#### Options

- **`-o, --output <file>`** (optional, default: TIMELINE.md) - Output file path
- **`-m, --message <text>`** - Focus message to guide the analysis
- **`--effort <level>`** (optional, default: mid) - Analysis effort level:
  - `low` - Quick overview of evolution
  - `mid` - Balanced timeline analysis
  - `high` - Detailed historical investigation

#### Features

**Requires Git**: This command needs a Git repository to function.

**Automatic Updates**: Like study, supports updating existing files:

```bash
# Add new commits to existing timeline
yar timeline .
```

**Piped Input**: Add context for specific analysis:

```bash
# Focus on recent changes
git log --since="1 month ago" --oneline | yar timeline .
```

#### What It Analyzes

- **Origin**: When and how the directory was created
- **Evolution**: How structure and functionality changed over time
- **Key Milestones**: Significant changes, refactors, new features
- **Patterns**: Evolution of approaches and conventions
- **Modern vs Legacy**: Current patterns vs older approaches

#### Output Format

Creates a chronological narrative with:
- Overview
- Origin
- Timeline of Evolution
- Patterns & Approaches
- Notable Files & Components
- Key Insights

### yar present

Converts markdown content into beautiful reveal.js presentations.

#### Basic Usage

```bash
# Create presentation from file (creates GUIDE.slides.html and serves it)
yar present -f GUIDE.md

# Combine multiple sources
yar present -f GUIDE.md -f TIMELINE.md

# Custom output file
yar present -f GUIDE.md -o slides.html

# Don't serve automatically
yar present -f GUIDE.md --no-serve
```

#### Options

- **`-f, --file <file>`** (required) - Input file(s) (can be used multiple times)
- **`-o, --output <file>`** (optional, default: GUIDE.slides.html) - Output HTML file path
- **`-m, --message <text>`** - Additional instructions for the presentation
- **`--serve / --no-serve`** - Automatically open presentation in browser (default: true)

#### Features

**Self-Contained HTML**: Generated presentations are standalone HTML files with:
- Embedded reveal.js (loaded from CDN)
- All content included
- No external dependencies after first load

**Browser Opens Automatically**: By default, YAR starts a local server and opens your browser. Use `--no-serve` to skip this.

**Progressive Updates**: Can update existing presentations:

```bash
# Update with new content
yar present -f updated-guide.md -u
```

#### Customization

Guide presentation style with the `-m` flag:

```bash
yar present -f GUIDE.md \
  -m "Use dark theme with blue accents. Focus on visual diagrams."
```

## Common Workflows

### Onboarding New Team Members

```bash
# 1. Create comprehensive guide
yar study .

# 2. Turn it into a presentation
yar present -f GUIDE.md

# 3. Share both files with new team member
```

### Understanding Legacy Code

```bash
# 1. Study current state
yar study ./legacy-module

# 2. Trace evolution
yar timeline ./legacy-module

# 3. Create presentation combining both
yar present -f GUIDE.md -f TIMELINE.md
```

### Security Review

```bash
# Study with security focus
yar study . -m "Focus on security: authentication, authorization, input validation, secrets management"

# Present findings
yar present -f GUIDE.md
```

### Architecture Documentation

```bash
# Analyze architecture
yar study . -m "Focus on architecture: service boundaries, data flow, dependencies, patterns"

# Keep it updated on every commit (via Git hooks or CI)
```

### Change Analysis

```bash
# Analyze recent changes
git diff main...feature-branch | yar study . -m "Analyze these changes"
```

## CI/CD Integration

### GitHub Actions

Keep documentation automatically up-to-date:

```yaml
name: Update Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Claude Code CLI
        run: npm install -g @anthropic-ai/claude-code-cli

      - name: Install YAR
        run: npm install -g yar-agent

      - name: Update documentation
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          yar study .
          yar timeline .

      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/
          git commit -m "docs: update codebase analysis" || exit 0
          git push
```

### GitLab CI

```yaml
update-docs:
  stage: docs
  script:
    - npm install -g @anthropic-ai/claude-code-cli yar-agent
    - yar study .
    - yar timeline .
    - git add GUIDE.md TIMELINE.md
    - git commit -m "docs: update analysis" || exit 0
    - git push
  only:
    - main
  variables:
    ANTHROPIC_API_KEY: $ANTHROPIC_API_KEY
```

### Pre-commit Hook

Update documentation before commits:

```bash
# .git/hooks/pre-commit
#!/bin/bash
yar study .
git add GUIDE.md
```

## Advanced Usage

### Multiple File Analysis

Analyze specific parts of your codebase:

```bash
# Analyze multiple directories
yar study ./src/api -o api-guide.md
yar study ./src/ui -o ui-guide.md
yar study ./src/database -o db-guide.md

# Combine into single presentation
yar present -f api-guide.md -f ui-guide.md -f db-guide.md -o complete-overview.html
```

### Iterative Analysis

Start broad, then focus:

```bash
# 1. High-level overview
yar study .

# 2. Deep dive on specific area
yar study ./src/auth -m "Focus on security implementation details" -o auth-deep-dive.md
```

### Documentation Workflow

```bash
# 1. Initial analysis
yar study .

# 2. Review and add notes
vim GUIDE.md  # Add your insights

# 3. Update with latest changes
yar study .  # Preserves your notes, adds new findings

# 4. Create presentation
yar present -f GUIDE.md
```

### Combining with Other Tools

```bash
# Analyze test coverage gaps
npm run coverage | yar study . -m "Analyze test coverage"

# Document API endpoints
grep -r "app.get\|app.post" ./src | yar study . -m "Document API"

# Analyze dependencies
npm list | yar study . -m "Document dependencies"
```

## Tips & Best Practices

### 1. Be Specific with Messages

```bash
# ❌ Vague
yar study . -m "Look at security"

# ✅ Specific
yar study . -m "Focus on authentication flow, authorization checks, and how secrets are managed"
```

### 2. Use Piped Input for Context

```bash
# Provide context about what you're looking for
echo "We're migrating from REST to GraphQL" | yar study ./src/api
```

### 3. Update Documentation Regularly

```bash
# Run in CI after every merge
# Or set up a weekly cron job
```

### 4. Combine Study and Timeline

```bash
# Understand both current state and evolution
yar study .
yar timeline .
yar present -f GUIDE.md -f TIMELINE.md
```

### 5. Version Your Documentation

```bash
# Keep historical snapshots
yar study . -o docs/analysis-$(date +%Y-%m-%d).md
```

## Troubleshooting

### Command Not Found

```bash
# Ensure global install
npm install -g yar-agent

# Check PATH
echo $PATH | grep npm
```

### API Key Issues

```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Test Claude Code CLI
claude-code --version
```

### Large Codebases

For very large codebases:
- Focus on specific directories
- Use `-m` flag to guide the analysis
- Run multiple targeted analyses instead of one large one

```bash
# Instead of analyzing everything
yar study .  # Might be too broad

# Focus on specific areas
yar study ./src/core -o core.md
yar study ./src/features -o features.md
```

## Getting Help

- **Command help**: `yar --help` or `yar <command> --help`
- **Issues**: [GitHub Issues](https://github.com/Alireza29675/yar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Alireza29675/yar/discussions)

---

For contributing to YAR itself, see [CONTRIBUTOR_ONBOARDING.md](./CONTRIBUTOR_ONBOARDING.md).
