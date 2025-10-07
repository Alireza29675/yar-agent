# yar-agent

## 0.4.2

### Patch Changes

- a9c0abb: Add demo GIFs to README showing CLI-to-presentation workflow

## 0.4.1

### Patch Changes

- 7122e28: feat: improve UI with agent callouts, human-readable timestamps, and unified date formatting

## 0.4.0

### Minor Changes

- 3576384: Add task-specific configuration system with --effort and --theme flags. Each task now has its own configuration interface: study/timeline support --effort (low/mid/high), present supports --theme (light/dark). Configurations are type-safe and extensible.

### Patch Changes

- 3576384: Simplify CLI flags with sensible defaults. `study` and `timeline` now default to GUIDE.md and TIMELINE.md respectively. `present` defaults to GUIDE.slides.html and serves by default.

## 0.3.1

### Patch Changes

- cb94edf: Improve documentation narrative

## 0.3.0

### Minor Changes

- 27710c6: Automatic file update detection and improved study command

  - **Breaking**: Removed `-u`/`--update` flag - now automatically detects and updates existing output files
  - **Enhancement**: Write and Edit tools now display file paths in terminal output
  - **Enhancement**: Prompts now prefer Edit tool over Write for iterative updates
  - **Improvement**: Study command now focuses on effective onboarding rather than exhaustive documentation

### Patch Changes

- f1db03f: Clean up branding and documentation

  - Remove "Your AI Research Assistant" expansion from all documentation
  - Consistently use motto "Understand Complex Codebases Fast" across package.json, CLAUDE.md, and system prompts

## 0.2.0

### Minor Changes

- da01c6d: Add current date context to all task outputs for time-sensitive analysis
- 8cf8dba: Rename package from yar-cli to yar-agent

## 0.1.2

### Patch Changes

- 5786a7b: typo fix in readme

## 0.1.1

### Patch Changes

- e05274d: Improve README with quick start guide and better examples

  - Add quick start section showing complete workflow
  - Improve command examples and descriptions
  - Add detailed CI/CD integration guide with automatic file update detection
  - Better explain the purpose of each command

## 0.1.0

### Minor Changes

- Initial release of YAR

  - 🔍 **Study command**: Analyze directory structure, architecture, and patterns
  - ⏳ **Timeline command**: Trace Git history to understand codebase evolution
  - 🎨 **Present command**: Convert content to reveal.js presentations
  - 🔄 **Automatic updates**: Detects and updates existing files automatically
  - 📊 **Clean UI**: Real-time progress feedback with colors and emojis
  - Built with Claude Agent SDK
