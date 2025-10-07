# YAR Agent - Timeline Analysis

**Analysis Date:** October 7, 2025

## Overview

YAR (یار - meaning "companion" in Farsi) is an agentic CLI tool for analyzing and understanding codebases through AI-powered exploration. Built on top of Anthropic's Claude Agent SDK, it provides commands to study codebases, trace their evolution through Git history, and create presentations from documentation.

**Current Purpose:** A CLI tool that helps developers quickly onboard to complex codebases by providing intelligent analysis, historical context, and presentation capabilities.

## Origin

**Created:** October 3, 2025, 19:36 GMT+2
**Author:** Alireza Sheikholmolouki
**Initial Commit:** `e05274d` - "yar: init"

The project started as a fully-formed CLI tool with three core commands already implemented:
- `study` - Analyze directory structure and patterns
- `timeline` - Trace Git history evolution
- `present` - Convert documentation to presentations

The initial release (v0.1.0) came with comprehensive documentation, GitHub workflows, theming system, and a complete UI library. This suggests it was either migrated from another project or carefully planned before the initial commit.

**Initial Package Name:** `yar-cli`

## Timeline of Evolution

### Phase 1: Foundation (October 3-4, 2025)

#### October 3, 2025 - Initial Release
- **What changed**: Complete CLI tool scaffolding with three core commands (`study`, `timeline`, `present`)
- **Why**: The project started as a fully-formed tool, suggesting pre-planning or migration from another codebase. Included comprehensive documentation, GitHub workflows, theming system, and UI library from day one.
- **Impact**: Established the foundation for an agentic CLI tool that leverages Claude Agent SDK for codebase analysis
- **Key Components**:
  - Commands: `study`, `timeline`, `present`, and `ui-demo`
  - Agent service with Claude SDK integration
  - Theme system with customizable presentation styles
  - Prompt builder for task generation
  - GitHub workflows for testing, releases, and publishing

#### October 4-5, 2025 - Publishing & Infrastructure
- **What changed**: Fixed GitHub releases workflow and enabled proper version bumping
- **Why**: Initial CI/CD setup needed refinement to properly publish to npm
- **Impact**: Established automated release pipeline with changesets

### Phase 2: Rebranding & Identity (October 5, 2025)

#### Package Rename: yar-cli → yar-agent
- **What changed**: Renamed package from `yar-cli` to `yar-agent`
- **Why**: Better reflects the tool's nature as an agentic tool built on Claude Agent SDK rather than just a CLI utility
- **Impact**: Aligned branding with the underlying technology (agent-based approach)
- **Commits**: `3d049e4`, `8cf8dba`

#### Branding Cleanup
- **What changed**: Removed "Your AI Research Assistant" tagline expansion
- **Why**: Simplified branding - YAR now just means "companion" (یار in Farsi) without forced acronym
- **Impact**: More authentic, less gimmicky branding that honors the Persian origin
- **Commit**: `3988372`

### Phase 3: Enhanced Context & Intelligence (October 5, 2025)

#### Date Context Feature
- **What changed**: Added current date/time context to all task outputs
- **Why**: Time-sensitive analyses need timestamps to indicate when the snapshot was taken
- **Impact**: Better context for generated documentation, especially for timeline analysis
- **Technical Details**:
  - Created `src/utils/date.ts` utility
  - Updated all task prompts (study, timeline, present) to include date instructions
  - Date context passed to agent during execution
- **Commit**: `8dbc74e`

#### Automatic File Update Detection
- **What changed**: Removed `-u/--update` flag; tool now automatically detects existing output files
- **Why**: Simplify UX - no need to remember special flags for updating vs creating
- **Impact**: More intuitive workflow - agents automatically read existing files and update them
- **Technical Details**:
  - Created `getOutputContext` utility with restriction notices
  - Modified agent service to handle automatic file detection
  - Updated prompts with instructions for Edit vs Write tool usage
- **Commit**: `3f00656`, `4648fbc`

### Phase 4: Focus & Refinement (October 5, 2025)

#### Study Prompt Refactor
- **What changed**: Shifted study command focus from exhaustive documentation to effective onboarding
- **Why**: More useful to generate actionable onboarding guides rather than encyclopedic documentation
- **Impact**: Better quality output focused on what developers need to be productive quickly
- **Key Changes**:
  - **Old approach**: Comprehensive coverage of all areas (repo boot, architecture, data model, CI/CD, security, etc.)
  - **New approach**: Focus on getting developers productive - entry points, conventions, gotchas, unwritten rules
  - Emphasizes information that's hard to discover from code alone
  - Avoids repeating what's already in README or obvious from code
- **Commits**: `aa411cd`, `6e649c3`

#### Presentation Display Fix
- **What changed**: Added maxScale to reveal.js config
- **Why**: Prevent content overflow in presentations
- **Impact**: Better presentation rendering across different screen sizes
- **Commit**: `658c2b4`

### Phase 5: Documentation Overhaul (October 5, 2025)

#### README Rewrite & Usage Guide
- **What changed**:
  - Rewrote README with more engaging narrative
  - Created separate USAGE.md for comprehensive documentation
  - Removed GUIDE.md (replaced by CONTRIBUTOR_ONBOARDING.md)
- **Why**: Separate concerns - README for quick start, USAGE.md for detailed reference
- **Impact**: Better developer experience with clear, well-organized documentation
- **Commit**: `cb94edf`

#### Contributor Onboarding
- **What changed**: Added CONTRIBUTOR_ONBOARDING.md and `pnpm onboarding:update` script
- **Why**: Dogfooding - use YAR to maintain its own onboarding documentation
- **Impact**: Living example of YAR's capabilities and self-maintaining docs
- **Commit**: `55b30e0`

### Phase 6: Configuration System (October 7, 2025)

#### CLI Simplification & Task-Specific Configurations
- **What changed**:
  - Simplified CLI flags with better defaults
  - Added task-specific configuration system
  - Introduced "effort" levels (low/mid/high) for analysis tasks
  - Added theme configuration for presentations
- **Why**: Give users more control over agent behavior without overwhelming CLI complexity
- **Impact**: More flexible and powerful while remaining user-friendly
- **Technical Details**:
  - Created `src/config/task-configurations.ts`
  - Effort configs: control analysis depth (high = thorough, mid = balanced, low = quick overview)
  - Theme configs: dark/light presentation themes
  - Configurations passed to agent with explanations of what each value means
  - Updated CLAUDE.md with extensive configuration documentation
- **Commit**: `3576384`

## Patterns & Approaches

### Current Approaches

**Agentic Architecture**
- Built on Claude Agent SDK for autonomous code exploration
- Agents use tools (Read, Grep, Glob, etc.) like a developer would
- Progressive output writing - agents write incrementally using Write/Edit tools
- Tool validators control file access (agents restricted to output file path only)

**File Update Intelligence**
- **Current**: Automatic detection - no flags needed
- Agents automatically detect existing output files and update them
- Uses Edit tool for modifications, Write tool only for initial creation
- Restriction notices inform agents which files they can modify

**Task Configuration System** (Latest: Oct 7, 2025)
- Task-specific configurations for fine-grained control
- Effort levels (low/mid/high) control analysis depth
- Configurations include explanations of what each value means
- Passed as structured parameters to agents via prompts

**Prompt Engineering**
- Templated prompts in `src/prompts/tasks/` directory
- System prompt in `src/prompts/system/app_introduction.md`
- Context injection via `ContextItem` interface
- Date/time context automatically included for time-sensitive tasks

**CLI Architecture**
- Built on OCLIF framework
- Command pattern: each task has dedicated command class
- Task execution layer separate from command layer
- Prompt building service assembles final prompts from templates + context

### Legacy Approaches

**Manual Update Flag** (Removed Oct 5, 2025)
- **Old**: Required `-u/--update` flag to update existing files
- **Why changed**: Unnecessary complexity - agents can detect files themselves
- **Migration**: Automatic file detection in agent service

**Exhaustive Study Focus** (Changed Oct 5, 2025)
- **Old**: Comprehensive coverage of all areas (CI/CD, security, data model, etc.)
- **New**: Focus on effective onboarding and getting developers productive
- **Why changed**: More useful to highlight what's hard to discover from code alone

**"AI Research Assistant" Branding** (Removed Oct 5, 2025)
- **Old**: "Your AI Research Assistant" - YAR as acronym
- **New**: YAR simply means "companion" in Farsi
- **Why changed**: More authentic, less forced acronym

**Package Name** (Changed Oct 5, 2025)
- **Old**: `yar-cli`
- **New**: `yar-agent`
- **Why changed**: Better reflects the agentic architecture

## Notable Files & Components

### Commands (`src/commands/`)
- `study.ts` - Analyze codebase structure and create onboarding guides
- `timeline.ts` - Trace Git history evolution (this command!)
- `present.ts` - Convert documentation to reveal.js presentations
- `ui-demo.ts` - Demo UI components (development tool)

### Core Services (`src/services/`)
- `agent.ts` - Core agent orchestration, message handling, execution stats
  - Handles AbortController for Ctrl+C interruption (added in latest)
  - Tool usage tracking and statistics
  - Progressive UI feedback
  - CanUseTool validator support (added Oct 7)
- `prompt-builder.ts` - Assembles prompts from templates + context

### Task Executors (`src/tasks/`)
- `study.ts` - Executes study task with agent
- `timeline.ts` - Executes timeline task with agent
- `present.ts` - Executes presentation generation task

### Configuration (`src/config/`)
- `tools.ts` - Available tool definitions for agents
- `tool-validators.ts` - Tool usage validators (file access control)
- `task-configurations.ts` - Task-specific configuration system (NEW: Oct 7)

### Utilities (`src/utils/`)
- `date.ts` - Date/time context generation (added Oct 5)
- `file.ts` - File utilities (added Oct 7)
- `stdin.ts` - Stdin reading for piped input

### Theme System (`src/lib/theme/`)
- `default.ts` - Default theme implementation with boxen, chalk, ora
- `interface.ts` - Theme interface definition
- `manager.ts` - Theme management and switching
- `index.ts` - Theme exports

### Prompts (`src/prompts/`)
- `system/app_introduction.md` - Base system prompt
- `tasks/study.md` - Study task prompt template
- `tasks/timeline.md` - Timeline task prompt template
- `tasks/present.md` - Presentation task prompt template

## Key Insights

### Rapid Evolution
This project went from initial commit to v0.3.1 in just **4 days** (Oct 3-7, 2025), with 31 commits. The pace suggests active development and iteration based on usage feedback.

### Dogfooding
The project uses itself to maintain its own documentation:
- `pnpm onboarding:update` script runs `yar study` on itself
- CONTRIBUTOR_ONBOARDING.md generated by YAR
- Living example of the tool's capabilities

### Focus on UX
Several changes prioritize developer experience:
- Removed manual update flag → automatic detection
- Added effort levels → control without complexity
- Better documentation structure → README + USAGE.md split
- Task configurations with explanations → transparent agent behavior

### Shift from Exhaustive to Actionable
The study prompt refactor reveals a philosophical shift: instead of documenting everything, focus on what helps developers be productive. This aligns with the tool's purpose as an onboarding companion.

### Agent-Centric Design
The architecture treats agents as first-class entities:
- Tool validators control what agents can access
- Progressive output encourages incremental writing
- Context injection provides agents with necessary information
- Configuration explanations help agents understand requirements

### Prompt Engineering as Code
Prompts are version-controlled templates, not hard-coded strings. This makes the agent behavior:
- Reviewable in pull requests
- Evolvable over time (as seen with study prompt refactor)
- Testable and debuggable

## Open Questions & Uncertainties

### Initial Commit Mystery
The first commit included a fully-formed project with:
- Complete documentation
- Working theme system
- GitHub workflows
- Three functional commands

Was this migrated from another project? Developed locally before open-sourcing? The commit message "yar: init" doesn't provide context.

### ui-demo Command
There's a `ui-demo.ts` command for testing UI components. Its evolution isn't clear - was it always there? Is it meant for internal use only? Should it be documented?

### Theme System Usage
The theme system has comprehensive infrastructure (manager, interface, default implementation) but only one theme exists. Were multiple themes planned? Is the presentation theme configuration (dark/light) separate from this?

### Why "Agent SDK" vs "Code CLI"?
The requirements mention Claude Code CLI, but the tool is built on Claude Agent SDK. How do these relate? Is Code CLI a wrapper around the SDK, or are they different products?

### Tool Validators Evolution
`tool-validators.ts` was added in commit `4648fbc` (Oct 5, 2025) as part of the automatic file update detection feature. It implements the file access restriction system that prevents agents from modifying files outside the designated output path.
