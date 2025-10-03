/**
 * Prompt Builder Service
 *
 * Builds structured prompts for AI agents with support for context,
 * messages, and formatting.
 */

/**
 * Options for building prompts
 */
export interface PromptBuilderOptions {
  /** Base prompt text */
  basePrompt: string
  /** Optional important message from user to highlight */
  message?: string
  /** Optional additional context (e.g., piped input) */
  context?: string
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
 * Build a study-specific prompt for code analysis
 *
 * @param directory - Directory to analyze
 * @param message - Optional user message
 * @param context - Optional additional context
 * @returns The formatted study prompt
 */
export function buildStudyPrompt(
  directory: string,
  message?: string,
  context?: string,
): string {
  return buildPrompt({
    basePrompt: `Study the directory at path: ${directory}

Develop a thorough understanding of this directory and its contents. Explore recursively and look at parent directories if needed for context.

Provide a comprehensive analysis that explains what this codebase is, how it works, and any important insights about its structure, dependencies, architecture, and functionality.`,
    context,
    message,
  })
}
