# YAR Evaluations (Evals)

This directory contains the evaluation (evals) system for testing and measuring YAR's performance. We use [promptfoo](https://www.promptfoo.dev/) as our evaluation framework.

## Directory Structure

```
evals/
├── configs/           # Evaluation configurations (YAML)
│   └── study-command.yaml
├── datasets/          # Test prompts and inputs
│   └── study-prompts.yaml
├── providers/         # Custom providers for YAR commands
│   └── yar-provider.ts
├── scorers/           # Custom scoring functions
│   └── tool-efficiency.ts
├── fixtures/          # Sample codebases for testing
│   └── sample-project/
└── results/           # Evaluation results (gitignored)
```

## Quick Start

### Run Evals

```bash
# Run all evaluations (builds first)
pnpm run eval

# View results in web UI
pnpm run eval:view

# Watch mode - re-run on changes
pnpm run eval:watch
```

### View Results

After running evals, results are saved to `evals/results/` and you can:
1. Check the JSON output file
2. Run `pnpm run eval:view` to see interactive web dashboard
3. Review pass/fail status and scores

## What We Test

### Study Command Evals

**File**: `evals/configs/study-command.yaml`

Tests YAR's ability to:
- Analyze codebase structure
- Identify security issues
- Find bugs in code
- Provide helpful overviews
- Use tools efficiently

**Test Cases**:
1. **Codebase Overview**: Can YAR understand project structure?
2. **Security Analysis**: Does it identify auth vulnerabilities?
3. **Bug Detection**: Can it find the division-by-zero bug?
4. **General Analysis**: Does it provide meaningful insights?

## Evaluation Metrics

### 1. Code-Based Assertions
- **contains**: Check if output includes specific keywords
- **contains-all**: All keywords must be present
- **contains-any**: At least one keyword present
- **javascript**: Custom JS validation logic

### 2. LLM-as-Judge
Uses Claude to grade subjective qualities:
- Accuracy of code understanding
- Quality of explanations
- Completeness of analysis

Scores: 1-5 scale

### 3. Custom Scorers
- **tool-efficiency.ts**: Evaluates if tools are used appropriately

## Creating New Evals

### 1. Add Test Prompts

Edit `evals/datasets/study-prompts.yaml`:

```yaml
- "Your new test prompt here"
```

### 2. Add Test Cases

Edit `evals/configs/study-command.yaml`:

```yaml
- description: Should do something specific
  vars:
    directory: ./evals/fixtures/sample-project
    message: Your specific instruction
  assert:
    - type: contains
      value: expected-keyword
    - type: llm-rubric
      value: |
        Evaluation criteria here.
        Score 1-5 based on...
```

### 3. Create Custom Scorers (Optional)

Create `evals/scorers/your-scorer.ts`:

```typescript
export default function yourScorer(input: ScorerInput): ScorerOutput {
  return {
    pass: true,
    score: 1,
    reason: 'Explanation of score',
  }
}
```

Then reference in config:

```yaml
assert:
  - type: javascript
    value: file://./evals/scorers/your-scorer.ts
```

## Test Fixtures

Sample codebases in `evals/fixtures/` are designed with intentional issues:

**sample-project**:
- `calculator.ts`: Has division-by-zero bug
- `auth.ts`: Missing password validation (security issue)
- `utils.ts`: Simple utilities for testing

Add more fixtures by creating directories in `evals/fixtures/`.

## Custom Provider

**File**: `evals/providers/yar-provider.ts`

Wraps YAR's `studyTask()` function so promptfoo can call it:
- Runs in silent mode (`showUI: false`)
- Returns output and metadata (tool counts, duration)
- Handles errors gracefully

## Interpreting Results

### Pass/Fail
- **Pass**: All assertions succeeded
- **Fail**: One or more assertions failed

### Scores
- **1.0**: Perfect - meets all criteria
- **0.5-0.9**: Partial success
- **0-0.4**: Poor performance
- **N/A**: Assertion not applicable

### Metadata
- **messageCount**: Number of agent messages
- **toolUseCount**: Number of tool calls made
- **duration**: Time taken (ms)

## Best Practices

1. **Specific Test Cases**: Each test should validate one specific capability
2. **Golden Answers**: Include expected outputs when possible
3. **Rubrics**: Write clear scoring rubrics for LLM judges
4. **Fixtures**: Keep test codebases small but realistic
5. **Iteration**: Run evals frequently during development
6. **Regression Testing**: Don't remove passing tests

## CI/CD Integration

To run evals in CI:

```yaml
- name: Run evaluations
  run: pnpm run eval
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Results can be compared across commits to catch regressions.

## Troubleshooting

### Evals Not Running
- Ensure `pnpm run build` completes successfully
- Check `ANTHROPIC_API_KEY` is set
- Verify fixture files exist

### All Tests Failing
- Check provider is working: inspect `evals/providers/yar-provider.ts`
- Run YAR manually to ensure basic functionality works
- Review error messages in results JSON

### Inconsistent Scores
- LLM-based scoring can vary - run multiple times
- Consider using `promptfoo eval --repeat 3` for stability
- Use code-based assertions for deterministic checks

## Resources

- [promptfoo Documentation](https://www.promptfoo.dev/docs/intro/)
- [Writing Effective Evals](https://www.promptfoo.dev/docs/guides/evaluate-llm/)
- [Custom Providers](https://www.promptfoo.dev/docs/providers/custom-api/)
- [Assertion Types](https://www.promptfoo.dev/docs/configuration/expected-outputs/)

## Contributing

When adding new YAR features:
1. Add corresponding eval test cases
2. Create fixtures if needed
3. Run evals to ensure no regressions
4. Document new test scenarios in this README
