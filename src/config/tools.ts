/**
 * Tool Configuration
 *
 * Manages available tools for AI agents and provides common tool sets.
 */

/**
 * All available tools in the Claude Agent SDK
 */
export const AVAILABLE_TOOLS = [
  'Read',
  'Write',
  'Grep',
  'Glob',
  'ListDir',
  'Bash',
  'Edit',
] as const

/**
 * Union type of all available tools
 */
export type AvailableTool = (typeof AVAILABLE_TOOLS)[number]

/**
 * Read-only tools (safe for analysis without modifying anything)
 */
export const READ_ONLY_TOOLS: AvailableTool[] = ['Read', 'Grep', 'Glob', 'ListDir']

/**
 * File modification tools (use with caution)
 */
export const FILE_MODIFICATION_TOOLS: AvailableTool[] = ['Write', 'Edit']

/**
 * Command execution tools (use with extreme caution)
 */
export const EXECUTION_TOOLS: AvailableTool[] = ['Bash']

/**
 * All tools (use only when necessary)
 */
export const ALL_TOOLS: AvailableTool[] = [...AVAILABLE_TOOLS]
