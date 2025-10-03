/**
 * Prompt Builder Service
 *
 * Builds structured prompts for AI agents with support for context,
 * messages, and formatting. Includes support for loading prompts from
 * Markdown files with variable substitution.
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'

/**
 * Options for building prompts
 */
export interface PromptBuilderOptions {
  /** Base prompt text */
  basePrompt: string
  /** Optional additional context (e.g., piped input) */
  context?: string
  /** Optional important message from user to highlight */
  message?: string
}

/**
 * Build a structured prompt with optional message and context
 *
 * @param options - Prompt builder options
 * @returns The formatted prompt string
 *
 * @example
 * ```typescript
 * const prompt = buildPrompt({
 *   basePrompt: 'Analyze this codebase',
 *   message: 'Focus on security issues',
 *   context: gitDiff
 * })
 * ```
 */
export function buildPrompt(options: PromptBuilderOptions): string {
  const {basePrompt, context, message} = options
  let prompt = basePrompt

  // Add important user message with visual emphasis
  if (message) {
    prompt += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PAY ATTENTION TO THIS REQUEST BY USER:

${message}

This is a specific request from the user that should be prioritized in your analysis.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  }

  // Add additional context from external sources
  if (context) {
    prompt += `

ADDITIONAL CONTEXT:
The user has provided the following context from an external program (piped input):

\`\`\`
${context}
\`\`\`

Please consider this context in your analysis. This might be git diffs, command output, notes, or any other relevant information that should inform your understanding.`
  }

  return prompt
}

/**
 * Load a prompt from a Markdown file and substitute variables
 *
 * @param filePath - Path to the Markdown file (relative to project root or absolute)
 * @param variables - Object containing variable values for substitution
 * @returns The prompt text with variables substituted
 *
 * @example
 * ```typescript
 * // Given study.md contains: "Analyze {{directory}} for {{type}} issues"
 * const prompt = await loadPromptFromFile('./prompts/study.md', {
 *   directory: '/src',
 *   type: 'security'
 * })
 * // Returns: "Analyze /src for security issues"
 * ```
 */
export async function loadPromptFromFile(
  filePath: string,
  variables: Record<string, string> = {},
): Promise<string> {
  // Read the markdown file
  const content = await fs.readFile(filePath, 'utf8')

  // Replace variables in the format {{variableName}}
  let processed = content
  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    processed = processed.replace(pattern, value)
  }

  return processed.trim()
}

/**
 * Load a prompt from a file relative to a base directory
 *
 * @param baseDir - Base directory (e.g., __dirname)
 * @param fileName - File name relative to base directory
 * @param variables - Variables for substitution
 * @returns The processed prompt
 *
 * @example
 * ```typescript
 * const prompt = await loadPromptFromDir(__dirname, './prompts/study.md', { directory: '/src' })
 * ```
 */
export async function loadPromptFromDir(
  baseDir: string,
  fileName: string,
  variables: Record<string, string> = {},
): Promise<string> {
  const filePath = path.join(baseDir, fileName)
  return loadPromptFromFile(filePath, variables)
}
