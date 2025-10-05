/**
 * Tool Validators
 *
 * Utility functions for creating canUseTool validators that restrict tool usage.
 */

import type {CanUseTool} from '@anthropic-ai/claude-agent-sdk'

import {lstatSync} from 'node:fs'
import {resolve} from 'node:path'

/**
 * Create a canUseTool validator that restricts Edit and Write tools based on a pattern
 *
 * This validator allows the agent to use Edit and Write tools ONLY on files matching the pattern.
 * Any attempts to access other files will be denied.
 *
 * @param pattern - Either a string (exact file/directory path) or a RegExp pattern
 *   - String: ONLY allows that exact file or files within that directory
 *   - RegExp: Allows files matching the regex pattern
 * @returns A canUseTool validator function
 *
 * @example
 * ```typescript
 * // Single file only
 * const validator = createFileAccessValidator('/path/to/config.json')
 *
 * // Directory (allows all files in directory)
 * const validator = createFileAccessValidator('/path/to/src')
 *
 * // Pattern matching (all .md files)
 * const validator = createFileAccessValidator(/\.md$/)
 *
 * // Pattern matching (files in docs folder)
 * const validator = createFileAccessValidator(/\/docs\/.*\.md$/)
 *
 * const result = await executeAgent({
 *   prompt: 'Update the files',
 *   config: {
 *     allowedTools: ['Edit', 'Write', 'Read'],
 *     canUseTool: validator
 *   }
 * })
 * ```
 */
export function createFileAccessValidator(pattern: RegExp | string): CanUseTool {
  // If pattern is a string, resolve it and determine if it's a file or directory
  let matcher: (path: string) => boolean
  let errorMessage: string

  if (typeof pattern === 'string') {
    const absolutePath = resolve(pattern)

    // Check if it's a directory or file
    let isDirectory = false
    try {
      const stat = lstatSync(absolutePath)
      isDirectory = stat.isDirectory()
    } catch {
      // If path doesn't exist yet, assume it's a file
      isDirectory = false
    }

    if (isDirectory) {
      // Directory: allow all files within it
      matcher = (path: string) => path.startsWith(absolutePath + '/') || path === absolutePath
      errorMessage = `Access denied: You can only edit files in ${absolutePath}`
    } else {
      // File: allow only this exact file
      matcher = (path: string) => path === absolutePath
      errorMessage = `Access denied: You can only edit the file at ${absolutePath}`
    }
  } else {
    // RegExp: match against the pattern
    matcher = (path: string) => pattern.test(path)
    errorMessage = `Access denied: File path does not match allowed pattern ${pattern}`
  }

  return async (toolName, input) => {
    // Allow all tools except Edit and Write
    if (toolName !== 'Edit' && toolName !== 'Write') {
      return {behavior: 'allow', updatedInput: input}
    }

    // For Edit and Write, check if the file path matches
    const inputFilePath = (input as {file_path?: string}).file_path

    if (!inputFilePath) {
      return {
        behavior: 'deny',
        message: `Error: ${toolName} tool requires a file_path parameter`,
      }
    }

    const requestedPath = resolve(inputFilePath)

    if (!matcher(requestedPath)) {
      return {
        behavior: 'deny',
        message: `${errorMessage}. Attempted to access: ${requestedPath}`,
      }
    }

    return {behavior: 'allow', updatedInput: input}
  }
}
