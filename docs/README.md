# YAR Documentation

Welcome to the YAR documentation! This directory contains comprehensive guides and references for using and extending YAR.

## 📚 Documentation Index

### Getting Started

- **[../README.md](../README.md)** - Main project README with installation and quick start

### User Guides

- **[STUDY_COMMAND_FEATURES.md](./STUDY_COMMAND_FEATURES.md)** - Complete guide to the study command
  - Piped input support
  - Output file functionality
  - Usage examples and best practices
  - Real-world use cases

### Developer Guides

- **[UI_LIBRARY.md](./UI_LIBRARY.md)** - UI library reference and examples
  - Complete API documentation
  - Color schemes and icons
  - Usage patterns
  - Code examples for creating new commands

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
  - Architecture overview
  - Feature breakdown
  - Code organization
  - Design decisions

### Project Information

- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes
  - New features
  - Bug fixes
  - Breaking changes

## 🎯 Quick Links by Task

### I want to...

**Use YAR:**
- Study a codebase → [STUDY_COMMAND_FEATURES.md](./STUDY_COMMAND_FEATURES.md)
- Understand available features → [../README.md](../README.md)

**Extend YAR:**
- Create a new command → [UI_LIBRARY.md](./UI_LIBRARY.md)
- Understand the codebase → [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

**Contribute:**
- See what's new → [CHANGELOG.md](./CHANGELOG.md)
- Understand the architecture → [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## 📖 Documentation Structure

```
docs/
├── README.md                      # This file
├── CHANGELOG.md                   # Version history
├── STUDY_COMMAND_FEATURES.md      # Study command guide
├── UI_LIBRARY.md                  # UI library reference
└── IMPLEMENTATION_SUMMARY.md      # Technical details
```

## 🚀 Quick Start Examples

### Study a Directory
```bash
yar study .
```

### Study with Context
```bash
git diff | yar study ./src
```

### Save Analysis to File
```bash
yar study . -o analysis.md
```

### See UI Capabilities
```bash
yar ui-demo
```

## 🤝 Contributing

When adding new features or commands:

1. Update relevant documentation in this directory
2. Add examples to the appropriate guide
3. Update CHANGELOG.md with your changes
4. Keep UI_LIBRARY.md in sync with UI changes

## 📝 Documentation Standards

- Use clear, concise language
- Include code examples for all features
- Add real-world use cases
- Keep examples up-to-date
- Use proper markdown formatting

## 💡 Need Help?

- Check the [main README](../README.md) for installation and setup
- See [STUDY_COMMAND_FEATURES.md](./STUDY_COMMAND_FEATURES.md) for command usage
- Review [UI_LIBRARY.md](./UI_LIBRARY.md) for extending YAR
- Look at [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for architecture

---

**Last Updated:** October 2025

