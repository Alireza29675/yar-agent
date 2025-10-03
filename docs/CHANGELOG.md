# Changelog

## v0.2.0 - Enhanced Study Command

### 🔄 Breaking Changes

- **Removed tests**: Traditional unit tests have been removed in favor of evaluations (evals) to better assess AI agent performance and behavior. Evals will be added in a future release.

### 🚀 New Features

#### Piped Input Support
- **Accept stdin input**: Study command now accepts piped input from other CLI commands
- **Context integration**: Piped content is included as "ADDITIONAL CONTEXT" in the AI prompt
- **Smart detection**: Automatically detects if input is piped using `process.stdin.isTTY`
- **Use cases**: Perfect for piping git diffs, command outputs, notes, or any contextual information

**Examples:**
```bash
git diff | yar study ./src
cat notes.txt | yar study .
echo "Focus on security" | yar study ./api
```

#### Output File Support
- **Save to file**: Use `-o` or `--output` flag to write analysis to a file
- **Clean output**: UI is suppressed when writing to file for clean text output
- **UTF-8 encoding**: Ensures proper character encoding
- **Summary stats**: Brief statistics shown in terminal after writing

**Examples:**
```bash
yar study . -o analysis.md
yar study ./src -o src-analysis.txt
git diff | yar study . -o changes.md
```

### 💅 UI Improvements

- **Conditional UI**: Rich UI only shows in interactive mode (not when outputting to file)
- **Piped input indicator**: Shows character count when input is piped
- **Better feedback**: Clear success messages when writing to file
- **Preserved stats**: Duration, message count, and tool usage still displayed

### 🔧 Technical Improvements

- **Type safety**: Proper TypeScript types for all message handlers
- **Better code organization**: Extracted `handleAssistantMessage` helper method
- **Stdin handling**: Robust stdin reading with timeout
- **Error handling**: Graceful handling of file write errors

### 📚 Documentation

- **STUDY_COMMAND_FEATURES.md**: Comprehensive guide to new features
- **Updated README**: Enhanced with new examples
- **Updated help text**: Shows all available options and examples
- **Use case examples**: Real-world scenarios and best practices

### 🎯 Examples of New Workflows

1. **Code Review with Context**
   ```bash
   git diff main...feature | yar study ./src -o review.md
   ```

2. **Documentation Generation**
   ```bash
   yar study ./api -o api-docs.md
   ```

3. **Security Audit**
   ```bash
   echo "Focus on auth and security" | yar study . -o audit.md
   ```

4. **Interactive Exploration**
   ```bash
   yar study ./src  # Shows rich UI
   ```

### 🐛 Bug Fixes

- Fixed TypeScript strict null checks
- Fixed linting errors for code style
- Properly sorted object type properties

### 📦 Dependencies

No new dependencies added - uses built-in Node.js modules:
- `node:fs/promises` for file writing
- `process.stdin` for piped input

---

## v0.1.0 - Initial Rich UI Release

### Features
- Rich CLI UI library with colors, spinners, tables
- Study command for code analysis
- UI demo command
- Tool usage tracking and statistics
- Modern TypeScript setup with ESM

See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for details.

