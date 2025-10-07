/**
 * Formatting utilities
 */

/**
 * Get a human-readable date and time string
 *
 * @returns Formatted date and time (e.g., "Tuesday, January 7, 2025 at 2:30 PM")
 */
export function getFormattedDateTime(): string {
  const now = new Date()
  return now.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}
