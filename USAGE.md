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
# Study current directory
yar study . -o GUIDE.md

# Study specific directory
yar study ./src -o analysis.md

# Study with focus
yar study . -m "Focus on security patterns" -o security-guide.md
```

#### Options

- **`-o, --output <file>`** (required) - Output file path
- **`-m, --message <text>`** - Focus message to guide the analysis

#### Features

**Automatic Updates**: If the output file exists, YAR automatically reads it and updates with new findings:

```bash
# First run - creates new file
yar study . -o GUIDE.md

# Second run - updates existing file with new insights
yar study . -o GUIDE.md
```

**Piped Input**: Provide additional context via stdin:

```bash
# Analyze with git diff context
git diff | yar study . -o changes.md

# Analyze with notes
cat notes.txt | yar study ./src -o analysis.md

# Analyze with specific focus
echo "Focus on authentication" | yar study . -o auth-guide.md
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
# Analyze current directory's evolution
yar timeline . -o EVOLUTION.md

# Analyze specific directory
yar timeline ./src/api -o api-evolution.md

# Focus on specific aspects
yar timeline . -m "Focus on architecture changes" -o arch-timeline.md
```

#### Options

- **`-o, --output <file>`** (required) - Output file path
- **`-m, --message <text>`** - Focus message to guide the analysis

#### Features

**Requires Git**: This command needs a Git repository to function.

**Automatic Updates**: Like study, supports updating existing files:

```bash
# Add new commits to existing timeline
yar timeline . -o EVOLUTION.md
```

**Piped Input**: Add context for specific analysis:

```bash
# Focus on recent changes
git log --since="1 month ago" --oneline | yar timeline . -o recent.md
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
# Create presentation from file
yar present -o slides.html -f GUIDE.md

# Create and serve immediately
yar present -o slides.html -f GUIDE.md --serve

# Combine multiple sources
yar present -o slides.html -f GUIDE.md -f EVOLUTION.md

# From stdin
cat notes.md | yar present -o slides.html
```

#### Options

- **`-o, --output <file>`** (required) - Output HTML file path
- **`-f, --file <file>`** - Input file(s) (can be used multiple times)
- **`-m, --message <text>`** - Additional instructions for the presentation
- **`--serve`** - Automatically open presentation in browser

#### Features

**Self-Contained HTML**: Generated presentations are standalone HTML files with:
- Embedded reveal.js (loaded from CDN)
- All content included
- No external dependencies after first load

**Browser Opens Automatically**: With `--serve` flag, YAR starts a local server and opens your browser.

**Progressive Updates**: Can update existing presentations:

```bash
# Update with new content
yar present -o slides.html -f updated-guide.md
```

#### Customization

Guide presentation style with the `-m` flag:

```bash
yar present -o slides.html -f GUIDE.md \
  -m "Use dark theme with blue accents. Focus on visual diagrams."
```

## Common Workflows

### Onboarding New Team Members

```bash
# 1. Create comprehensive guide
yar study . -o ONBOARDING.md

# 2. Turn it into a presentation
yar present -o onboarding-slides.html -f ONBOARDING.md --serve

# 3. Share both files with new team member
```

### Understanding Legacy Code

```bash
# 1. Study current state
yar study ./legacy-module -o current-state.md

# 2. Trace evolution
yar timeline ./legacy-module -o evolution.md

# 3. Create presentation combining both
yar present -o legacy-review.html \
  -f current-state.md \
  -f evolution.md \
  --serve
```

### Security Review

```bash
# Study with security focus
yar study . -m "Focus on security: authentication, authorization, input validation, secrets management" -o security-review.md

# Present findings
yar present -o security-slides.html -f security-review.md
```

### Architecture Documentation

```bash
# Analyze architecture
yar study . -m "Focus on architecture: service boundaries, data flow, dependencies, patterns" -o ARCHITECTURE.md

# Keep it updated on every commit (via Git hooks or CI)
```

### Change Analysis

```bash
# Analyze recent changes
git diff main...feature-branch | \
  yar study . -m "Analyze these changes" -o change-analysis.md
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
          yar study . -o docs/GUIDE.md
          yar timeline . -o docs/EVOLUTION.md

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
    - yar study . -o docs/GUIDE.md
    - yar timeline . -o docs/EVOLUTION.md
    - git add docs/
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
yar study . -o GUIDE.md
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
yar present -o complete-overview.html \
  -f api-guide.md \
  -f ui-guide.md \
  -f db-guide.md
```

### Iterative Analysis

Start broad, then focus:

```bash
# 1. High-level overview
yar study . -o overview.md

# 2. Deep dive on specific area
yar study ./src/auth -m "Focus on security implementation details" -o auth-deep-dive.md
```

### Documentation Workflow

```bash
# 1. Initial analysis
yar study . -o GUIDE.md

# 2. Review and add notes
vim GUIDE.md  # Add your insights

# 3. Update with latest changes
yar study . -o GUIDE.md  # Preserves your notes, adds new findings

# 4. Create presentation
yar present -o slides.html -f GUIDE.md --serve
```

### Combining with Other Tools

```bash
# Analyze test coverage gaps
npm run coverage | yar study . -m "Analyze test coverage" -o coverage-analysis.md

# Document API endpoints
grep -r "app.get\|app.post" ./src | yar study . -m "Document API" -o api-docs.md

# Analyze dependencies
npm list | yar study . -m "Document dependencies" -o deps.md
```

## Tips & Best Practices

### 1. Be Specific with Messages

```bash
# ❌ Vague
yar study . -m "Look at security" -o guide.md

# ✅ Specific
yar study . -m "Focus on authentication flow, authorization checks, and how secrets are managed" -o guide.md
```

### 2. Use Piped Input for Context

```bash
# Provide context about what you're looking for
echo "We're migrating from REST to GraphQL" | \
  yar study ./src/api -o migration-guide.md
```

### 3. Update Documentation Regularly

```bash
# Run in CI after every merge
# Or set up a weekly cron job
```

### 4. Combine Study and Timeline

```bash
# Understand both current state and evolution
yar study . -o current.md
yar timeline . -o evolution.md
yar present -o complete.html -f current.md -f evolution.md
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
yar study . -o huge.md  # Might be too broad

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
