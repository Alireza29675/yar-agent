# Getting Started with YAR Evaluations

## What Are Evals?

Evaluations (evals) are automated tests that measure how well YAR's AI agent performs its tasks. Instead of testing code logic (like unit tests), evals test the quality of AI outputs.

## Quick Start

### 1. Run Your First Eval

```bash
# Quick test (runs in ~30 seconds)
pnpm run build
npx promptfoo eval -c evals/configs/quick-test.yaml

# Full evaluation suite (takes longer)
pnpm run eval
```

### 2. View Results

```bash
# Open web dashboard
pnpm run eval:view
```

This opens an interactive UI showing:
- ✅ Pass/fail status for each test
- 📊 Scores (0-1 scale)
- 📝 Detailed outputs
- ⚡ Performance metrics (tool usage, duration)

## What Gets Tested?

### Current Test Cases

1. **File Discovery**: Can YAR list files in a codebase?
2. **Security Analysis**: Does it find missing password validation?
3. **Bug Detection**: Can it spot division-by-zero errors?
4. **Code Overview**: Does it provide useful project summaries?

### How It Works

**Test Fixture**: `evals/fixtures/sample-project/`
- Simple TypeScript project with intentional bugs
- 3 files: calculator.ts, auth.ts, utils.ts

**Evaluation Criteria**:
- **Keywords**: Must mention relevant terms (e.g., "password", "security")
- **Length**: Output should be substantial (>100 chars)
- **LLM Judge**: Claude grades output quality (1-5 scale)

## Understanding Results

### Example Output

```
✅ Should identify security issues in auth module
   Score: 0.85
   - Contains "password validation": ✅
   - LLM rubric: 4/5 - "Correctly identified missing validation"
   - Tools used: 8 (efficient)
```

### What Good Looks Like

- **Pass rate**: >80% of tests passing
- **Scores**: Average >0.7
- **Tool efficiency**: <20 tool calls per task
- **Quality**: LLM judge scores >3/5

## Development Workflow

### When Adding Features

1. **Before**: Run evals to establish baseline
   ```bash
   pnpm run eval
   ```

2. **Make changes**: Implement your feature

3. **After**: Run evals again
   ```bash
   pnpm run eval
   ```

4. **Compare**: Check for regressions

### Adding New Tests

**Step 1**: Add prompt to `evals/datasets/study-prompts.yaml`

```yaml
- "Your new test prompt here"
```

**Step 2**: Add test case to `evals/configs/study-command.yaml`

```yaml
- description: Should do something specific
  vars:
    message: Analyze X for Y
  assert:
    - type: contains
      value: expected-keyword
```

**Step 3**: Run and verify

```bash
pnpm run eval
```

## Common Scenarios

### Testing a Specific Feature

Create a focused config file:

```yaml
# evals/configs/my-feature.yaml
description: Test my new feature
providers:
  - file://./evals/providers/yar-provider.ts

prompts:
  - "Test my specific feature"

tests:
  - assert:
      - type: contains
        value: expected-output
```

Run it:
```bash
npx promptfoo eval -c evals/configs/my-feature.yaml
```

### Debugging Failed Tests

1. **Check the output**: What did YAR actually return?
   ```bash
   cat evals/results/study-command-results.json | jq
   ```

2. **Run manually**: Try the command yourself
   ```bash
   ./bin/dev.js study evals/fixtures/sample-project -m "Find bugs"
   ```

3. **Compare**: Manual output vs eval output

4. **Adjust test or fix code**: Depending on what's wrong

### Continuous Testing (Watch Mode)

```bash
pnpm run eval:watch
```

This re-runs evals whenever files change - useful during development.

## Best Practices

### ✅ Do

- Run evals before committing major changes
- Add eval tests for new features
- Use specific, focused test cases
- Document why tests exist

### ❌ Don't

- Commit failing evals (unless intentionally testing new features)
- Make tests too broad ("analyze everything")
- Skip evals to save time (they catch regressions!)
- Hardcode API keys in eval files

## Troubleshooting

### "Error: ANTHROPIC_API_KEY not set"

```bash
export ANTHROPIC_API_KEY=your-key-here
pnpm run eval
```

### "Provider not found"

Make sure you built first:
```bash
pnpm run build
```

### "All tests failing"

Check that YAR works manually:
```bash
./bin/dev.js study . -m "What files exist?"
```

If manual works but evals fail, check provider file.

## Next Steps

- Read [evals/README.md](./README.md) for comprehensive docs
- Explore [promptfoo documentation](https://www.promptfoo.dev/docs/intro/)
- Add tests for your use cases
- Set up CI/CD integration

## Example: Adding a Security Test

Let's add a test for SQL injection detection:

**1. Create fixture** (`evals/fixtures/sample-project/src/db.ts`):
```typescript
export function getUser(id: string) {
  // SQL injection vulnerability
  return db.query(`SELECT * FROM users WHERE id = ${id}`)
}
```

**2. Add test case** (in `evals/configs/study-command.yaml`):
```yaml
- description: Should identify SQL injection vulnerability
  vars:
    message: Find security issues in db.ts
  assert:
    - type: contains-any
      value:
        - SQL injection
        - parameterized query
        - prepared statement
    - type: llm-rubric
      value: |
        Score 5 if identifies SQL injection vulnerability
        Score 3 if mentions database security but not specific issue
        Score 1 otherwise
```

**3. Run eval**:
```bash
pnpm run eval
```

**4. Verify**: Check that YAR correctly identifies the vulnerability

That's it! You've added a new security test to your eval suite.
