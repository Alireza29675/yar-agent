/**
 * Get the current date and time formatted for context
 */
export function getCurrentDateContext(): string {
  const now = new Date()
  const formatted = now.toLocaleString('en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    timeZoneName: 'short',
    year: 'numeric',
  })
  return `Current date and time: ${formatted}`
}

/**
 * Get output file context with restriction notice
 *
 * @param outputFile - Path to the output file where the agent should write
 * @returns Formatted context string with file path and restriction notice
 */
export function getOutputContext(outputFile: string): string {
  return `Output file path: ${outputFile}

**RESTRICTION**: You are ONLY ALLOWED to write to this file (${outputFile}). Any attempts to edit or write other files will be blocked.`
}
