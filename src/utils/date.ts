/**
 * Get the current date and time formatted for context
 */
export function getCurrentDateContext(): string {
  const now = new Date()
  const formatted = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
  return `Current date and time: ${formatted}`
}
