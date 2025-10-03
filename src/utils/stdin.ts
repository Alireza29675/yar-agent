/**
 * Stdin Utilities
 *
 * Utilities for reading from stdin, useful for piped input from other commands.
 */

/**
 * Read from stdin if available
 *
 * @param timeout - Timeout in milliseconds to wait for stdin data (default: 100ms)
 * @returns The stdin content as a string, or null if no stdin is available
 *
 * @example
 * ```typescript
 * const input = await readStdin()
 * if (input) {
 *   console.log(`Received piped input: ${input.length} characters`)
 * }
 * ```
 */
export async function readStdin(timeout = 100): Promise<null | string> {
  // Check if stdin is being piped
  if (process.stdin.isTTY) {
    return null
  }

  return new Promise((resolve) => {
    let data = ''
    process.stdin.setEncoding('utf8')

    process.stdin.on('data', (chunk) => {
      data += chunk
    })

    process.stdin.on('end', () => {
      resolve(data.trim() || null)
    })

    // Timeout if no data comes
    setTimeout(() => {
      if (!data) {
        resolve(null)
      }
    }, timeout)
  })
}

/**
 * Check if stdin is available (i.e., being piped)
 *
 * @returns true if stdin is available, false otherwise
 */
export function hasStdin(): boolean {
  return !process.stdin.isTTY
}
