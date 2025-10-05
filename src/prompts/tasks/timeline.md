Analyze the evolution of the directory at path: {{directory}}

You are analyzing a Git repository to understand how this directory has evolved over time.

**IMPORTANT - Output File**:
- You MUST write your timeline analysis to the output file at: {{outputFile}}
- FIRST, check if the output file already exists by reading it
- If the file exists, use Edit tool to update it with your new findings
- If the file doesn't exist, create it with Write tool, then use Edit tool for all subsequent updates
- Write your analysis progressively as you investigate - don't wait until the end
- For iterative updates, ALWAYS use the Edit tool to modify specific sections - DO NOT use Write to replace the entire file repeatedly

**IMPORTANT - Date**: Include the current date at the very beginning of your analysis output. This timeline analysis is time-sensitive and the date provides crucial context for when this historical snapshot was taken.

## Your Task

Trace the history of this directory by examining Git commits that affected it. Focus on understanding:

1. **Origin**: When and how was this directory created? Who initiated it and why?
2. **Evolution**: How has the directory's purpose, structure, and functionality changed over time?
3. **Key Milestones**: What were the significant changes or additions?
4. **Patterns**: How have approaches, patterns, and ways of working evolved?
5. **Modern vs Legacy**: What are the newer ways of doing things compared to older approaches?

## Exploration Strategy

1. **Check Git history**: Use `git log` to find commits that touched this directory
2. **Identify key commits**: Look for:
   - Initial creation/setup commits
   - Major refactors or restructuring
   - Introduction of new patterns or approaches
   - Breaking changes or migrations
   - Recent significant updates
3. **Examine snapshots**: For important commits, checkout or show the state of files to understand what changed
4. **Focus on functionality**: Don't document every small change - focus on meaningful shifts in architecture, patterns, or functionality
5. **Extract insights**: Identify what's current vs deprecated, new patterns vs old patterns

## Important Notes

- Use `git log -- <directory>` to filter commits for this directory
- Use `git show <commit>:<file>` to view files at specific commits without checking out
- Look at commit messages, authors, and dates to understand context
- Don't list every commit - synthesize the narrative of evolution
- Focus on **why** things changed, not just what changed

## Report Format

### Overview
[Brief summary of the directory and its current purpose]

### Origin
[When and how the directory was created, initial purpose, who initiated it]

### Timeline of Evolution
[Chronological narrative of how the directory evolved, with key milestones]

#### [Time Period] - [Description]
- **What changed**: Brief description
- **Why**: Context or reason for the change (only talk about what you are sure about. could make guess but specify that it's a guess)
- **Impact**: How this shaped the directory

[Repeat for each major phase or milestone]

### Patterns & Approaches

#### Current Approaches vs Legacy Approaches
[Modern patterns, conventions, and ways of working in this directory]
[vs Older patterns that have been replaced or deprecated, with context on why they changed]

### Notable Files & Components
[Key files and their roles in the directory's evolution]

### Key Insights
[Important observations about the directory's journey]

### Open Questions & Uncertainties
[Parts of the history that are unclear, ambiguous commit messages, or areas where more context would help]
