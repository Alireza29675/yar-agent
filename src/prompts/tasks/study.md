Study the directory at path: {{directory}}

Your goal is to create an **effective onboarding guide** for this codebase. Help developers get productive quickly by providing comprehensive yet distilled information that's hard to discover by just reading the code.

**Focus on:**
- What developers need to know to get started and be productive
- Information that's not obvious from reading code (context, conventions, gotchas)
- Highlights and key insights that accelerate understanding
- Entry points and common workflows
- The "unwritten rules" and implicit knowledge

**Avoid:**
- Exhaustive documentation of every detail
- Information that's easily discoverable in the code itself
- Repeating what's already in README or official docs (reference them instead)
- Over-explaining simple, self-documenting code

**IMPORTANT - Output File**:
- You MUST write your analysis to the output file at: {{outputFile}}
- FIRST, check if the output file already exists by reading it
- If the file exists, use Edit tool to update it with your new findings
- If the file doesn't exist, create it with Write tool, then use Edit tool for all subsequent updates
- Write your analysis progressively as you investigate - don't wait until the end
- For iterative updates, ALWAYS use the Edit tool to modify specific sections - DO NOT use Write to replace the entire file repeatedly

**IMPORTANT - Date**: Include the current date at the very beginning of your analysis output. This analysis is time-sensitive and the date provides crucial context for when this snapshot was taken.

## Key Areas for Onboarding

Investigate these areas based on what's relevant to this codebase. Not all will apply - focus on what matters most for getting developers productive:

**Getting Started (Critical)**
- Entry points: Where does execution begin? Main files, commands, scripts
- Setup: Build/run commands, environment variables, required dependencies
- Quick wins: Simplest way to see something working (golden path)
- Common gotchas: Non-obvious setup issues or environment quirks

**Architecture & Code Organization (High Priority)**
- Directory structure: What goes where and why (especially non-obvious patterns)
- Key abstractions: Core concepts, models, services that everything builds on
- Data flow: How information moves through the system
- Extension points: Where/how to add new features
- Conventions: Naming patterns, file organization, code style

**Development Workflow (Important)**
- Local development: How to iterate quickly (hot reload, watch mode, etc.)
- Testing: How to run tests, write new ones, key testing patterns
- Common tasks: Adding features, fixing bugs, migrations, etc.
- Build/deploy: How changes get from local to production
- Debugging: Tools, techniques, common issues

**Context & History (Valuable)**
- Why things are the way they are (architectural decisions)
- Modern vs legacy patterns (what to emulate, what to avoid)
- Recent changes: What's new or actively evolving
- Known issues: Technical debt, limitations, planned improvements

**Integration Points (If Relevant)**
- Key dependencies: What they do, why they matter, how they're used
- External services: APIs, databases, third-party integrations
- Configuration: How settings work, where they live, how to change them

**Team & Workflow (If Relevant)**
- Contribution process: How to get code reviewed and merged
- Code quality expectations: Linters, formatters, review practices
- Communication: Where to ask questions, who knows what

**Only If Applicable:**
- Security model, authentication, authorization approaches
- Performance characteristics, optimization strategies
- Monitoring, logging, debugging in production
- Database schemas, migrations, data patterns

## Analysis Approach

Explore the codebase to understand what new developers need to know. Focus on:

1. **Start with entry points**: Find where execution begins and trace key flows
2. **Identify core patterns**: Look for repeated architectural patterns and conventions
3. **Understand the "why"**: Don't just document what code does - explain why it's structured this way
4. **Find the implicit knowledge**: Uncover conventions, gotchas, and context that isn't in the code
5. **Prioritize actionable information**: What helps someone make their first contribution?
6. **Be selective**: Include what accelerates understanding, skip what's obvious from code

**Balance depth with clarity**: Comprehensive enough to be useful, distilled enough to be digestible.

## Report Format

Here is a possible format for your analysis. You could adjust it to the task at hand. you could exclude any section and add any section you think is relevant:

### Overview
[High-level summary of what this directory is and does]

### Structure
[Directory organization and key components]

### How to
[Take most common tasks done in this directory and explain how to do them. From setup to contribution and adding certain features. Migrations, creating new features, anything important, etc.]

### Architecture & Patterns
[Design patterns, architectural decisions, conventions]
[Feel free to draw Mermaid diagrams to help explain the architecture. Ensure the diagrams are compatible with the Markdown renderer and you MUST ensure that the diagrams are truthful and accurate.]

### Dependencies & Integrations
[What it depends on and how it connects to other parts. This could include other services, notable dependencies, protocols of communication, tooling, etc.]

### Key Insights
[Important observations, notable implementation details]

### Open Questions & Uncertainties (ALWAYS INCLUDE THIS SECTION!)
[Parts you're uncertain about, ambiguities in the code, areas that need clarification, or aspects where you'd benefit from more context]

The "Open Questions & Uncertainties" section is important - be honest about what you don't fully understand or what seems ambiguous.
