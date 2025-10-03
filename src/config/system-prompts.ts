/**
 * System Prompts Configuration
 *
 * Loads reusable system prompts from Markdown files in src/prompts/system/
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Load a system prompt from a Markdown file
 */
function loadSystemPrompt(filename: string): string {
  const promptPath = path.join(__dirname, '..', 'prompts', 'system', filename)
  return fs.readFileSync(promptPath, 'utf8').trim()
}

/**
 * General code analysis system prompt
 *
 * Use this for tasks that need to analyze, understand, or review code
 * without making modifications.
 *
 * Loaded from: src/prompts/system/code-analysis.md
 */
export const CODE_ANALYSIS_SYSTEM_PROMPT = loadSystemPrompt('code-analysis.md')

/**
 * Code generation system prompt
 *
 * Use this for tasks that need to generate or modify code.
 *
 * Loaded from: src/prompts/system/code-generation.md
 */
export const CODE_GENERATION_SYSTEM_PROMPT = loadSystemPrompt('code-generation.md')

/**
 * General assistant system prompt
 *
 * Use this for tasks that don't fit into specific categories.
 *
 * Loaded from: src/prompts/system/general-assistant.md
 */
export const GENERAL_ASSISTANT_SYSTEM_PROMPT = loadSystemPrompt('general-assistant.md')
