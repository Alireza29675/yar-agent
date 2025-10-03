# Study Command Features

The `study` command has been enhanced with powerful new capabilities for accepting input and saving output.

## Features

### 1. ✅ Important User Messages

Use the `--message` or `-m` flag to provide a specific, high-priority request to the agent.

**Examples:**

```bash
# Focus on specific aspects
yar study . -m "Focus on security vulnerabilities"

# Request specific analysis
yar study ./api -m "Explain the authentication flow"

# Combine with output file
yar study . -m "Identify performance bottlenecks" -o analysis.md

# Multiple flags together
yar study ./src -m "Look for code smells and anti-patterns" -o report.md
```

**How it works:**
- The message is prominently highlighted in the prompt with visual separators
- Marked as "⚠️ PAY ATTENTION TO THIS REQUEST BY USER"
- Agent prioritizes this request in its analysis
- Perfect for directing the AI's focus

### 2. ✅ Piped Input Support

The study command can accept piped input from other CLI commands. This allows you to provide additional context to the AI agent.

**Examples:**

```bash
# Pipe git diff to understand recent changes
git diff | yar study ./src

# Pipe notes or context
cat project-notes.txt | yar study .

# Pipe command output
ls -la | yar study ./config

# Pipe multiple sources
git log --oneline -10 | yar study .
```

**How it works:**
- The agent receives the piped input as "ADDITIONAL CONTEXT"
- The AI considers this context when analyzing the directory
- Perfect for providing git diffs, notes, or any relevant information

### 3. ✅ Output File Support

Save the analysis to a file instead of displaying it in the terminal.

**Examples:**

```bash
# Save analysis to a markdown file
yar study . -o analysis.md

# Save with short flag
yar study ./src -o src-analysis.txt

# Combine piped input with file output
git diff | yar study . -o changes-analysis.md
```

**How it works:**
- When using `-o` or `--output`, the rich UI is suppressed
- Analysis is written directly to the specified file
- A success message confirms the file was written
- Summary stats (duration, messages, tools used) are still shown

## Complete Examples

### Example 1: Focused Analysis with User Message

```bash
# Direct the agent to focus on specific concerns
yar study ./src -m "Analyze error handling and edge cases"
```

The agent will:
1. Receive your high-priority message
2. Prioritize this aspect in the analysis
3. Provide insights specifically about error handling
4. Include other findings as well

### Example 2: Study with Git Context

```bash
# Get analysis of recent changes with context
git diff HEAD~5..HEAD | yar study ./src -o recent-changes.md
```

The agent will:
1. Receive the git diff as context
2. Analyze the `./src` directory
3. Consider the diff when providing insights
4. Write the analysis to `recent-changes.md`

### Example 2: Study with Project Notes

```bash
# Provide context from your notes
cat <<EOF | yar study . -o analysis.md
Focus on:
- Authentication flow
- Database schema
- API endpoints
- Security considerations
EOF
```

The agent will:
1. Receive your notes as context
2. Study the directory with your focus areas in mind
3. Write targeted analysis to `analysis.md`

### Example 3: Interactive Study

```bash
# Show analysis in terminal with rich UI
yar study ./src
```

The agent will:
1. Display beautiful colored output
2. Show real-time tool usage (📖 Read, 🔍 Grep, etc.)
3. Provide comprehensive analysis with statistics
4. Display tool usage summary

### Example 4: Piped Input Without File Output

```bash
# Provide context but show results in terminal
echo "This is a microservices project" | yar study ./services
```

The agent will:
1. Receive your context
2. Show rich UI with the analysis
3. Display tool usage and statistics

## UI Behavior

### With Output File (`-o`)
- ❌ No gradient header
- ❌ No colored tool usage
- ❌ No animated spinners  
- ❌ No summary boxes
- ✅ Clean text output to file
- ✅ Success message with file path
- ✅ Brief statistics in terminal

### Without Output File (default)
- ✅ Gradient header
- ✅ Colored, rich UI
- ✅ Real-time tool tracking
- ✅ Summary boxes and tables
- ✅ Tool usage statistics
- ✅ Animated indicators

## Stdin Input Format

The piped input is wrapped in a clear format for the AI:

```
ADDITIONAL CONTEXT:
The user has provided the following context from an external program (piped input):

```
<your piped content>
```

Please consider this context in your analysis. This might be git diffs, 
command output, notes, or any other relevant information that should inform 
your understanding.
```

## Use Cases

### 1. Focused Code Review
```bash
yar study ./src -m "Review code quality and identify technical debt" -o code-review.md
```

### 2. Security Audit
```bash
yar study . -m "Focus on security vulnerabilities, authentication, and authorization" -o security-audit.md
```

### 3. Performance Analysis
```bash
yar study ./api -m "Identify performance bottlenecks and optimization opportunities" -o perf-analysis.md
```

### 4. Documentation Generation
```bash
yar study ./api -m "Generate comprehensive API documentation" -o api-docs.md
```

### 5. Onboarding with Context
```bash
cat onboarding-questions.txt | yar study . \
  -m "Answer these questions for new developers" \
  -o onboarding-guide.md
```

### 6. Refactoring Planning
```bash
git diff | yar study ./legacy-code \
  -m "Suggest refactoring strategies and migration path" \
  -o refactoring-plan.md
```

### 7. Architecture Review
```bash
yar study . -m "Analyze architecture patterns, dependencies, and modularity" -o architecture-review.md
```

### 8. Bug Investigation
```bash
yar study ./components -m "Investigate potential causes of the login bug" -o bug-analysis.md
```

## Technical Details

### Stdin Detection
- Uses `process.stdin.isTTY` to detect piped input
- Reads stdin with UTF-8 encoding
- 100ms timeout for stdin data
- Returns `null` if no input is piped

### Output Handling
- When `-o` is specified, UI is suppressed
- Analysis text is collected during streaming
- Written to file only after completion
- Uses UTF-8 encoding

### Error Handling
- File write errors are handled gracefully
- Invalid paths show clear error messages
- Stdin read errors don't crash the command

## Best Practices

1. **Use file output for long analyses**: Save to markdown for easy reading
2. **Pipe git diffs for context**: Help the AI understand recent changes
3. **Combine with other tools**: Use `tee`, `grep`, `awk`, etc.
4. **Save important analyses**: Keep a history of your codebase insights
5. **Use interactive mode for exploration**: Rich UI is great for quick studies

## Command Flags

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--message` | `-m` | Important message for the agent to pay attention to | No |
| `--output` | `-o` | Output file path | No |

## Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `directory` | Directory to study recursively | Yes |

## Exit Codes

- `0`: Success
- `1`: Error (invalid directory, write failure, etc.)

## Related Commands

- `yar ui-demo`: See all UI capabilities
- `yar --help`: See all available commands

