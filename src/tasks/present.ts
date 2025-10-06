import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

import {buildPresentConfig, type PresentTaskConfig} from '../config/task-configurations.js'
import type {AvailableTool} from '../config/tools.js'
import {executeAgent} from '../services/agent.js'
import {buildPrompt, loadPromptFromFile} from '../services/prompt-builder.js'
import {getCurrentDateContext} from '../utils/date.js'

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Present Task Options
 */
export interface PresentOptions {
  /** Content to convert to presentation */
  content: string
  /** Important message from user */
  message?: string
  /** Whether to show UI */
  showUI?: boolean
  /** Task configuration options */
  taskConfig?: PresentTaskConfig
}

/**
 * Present Task Result
 */
export interface PresentResult {
  /** Duration in seconds */
  duration: number
  /** Generated HTML content */
  html: string
  /** Number of messages exchanged */
  messageCount: number
  /** Per-tool usage counts */
  toolUseCounts: Record<string, number>
  /** Total number of tools used */
  totalToolUseCount: number
}

/**
 * Build a present-specific prompt
 *
 * @param content - Content to convert
 * @param message - Optional user message
 * @param taskConfig - Optional task configuration options
 * @returns The formatted present prompt
 */
async function buildPresentPrompt(
  content: string,
  message?: string,
  taskConfig?: PresentTaskConfig,
): Promise<string> {
  // Load base prompt from markdown file
  const promptFile = join(__dirname, '..', 'prompts', 'tasks', 'present.md')
  const basePrompt = await loadPromptFromFile(promptFile, {})

  // Add date context
  const dateContext = getCurrentDateContext()
  const fullContext = `${dateContext}\n\n${content}`

  // Build task configuration parameters
  const taskConfiguration = taskConfig ? buildPresentConfig(taskConfig) : undefined

  // Add the content and message
  return buildPrompt({
    basePrompt,
    context: fullContext,
    message,
    taskConfiguration,
  })
}

/**
 * Present Task
 *
 * Converts content to a reveal.js presentation.
 */
export async function presentTask(options: PresentOptions): Promise<PresentResult> {
  const {content, message, showUI = true, taskConfig} = options

  // Build the prompt
  const prompt = await buildPresentPrompt(content, message, taskConfig)

  // Create agent configuration with no tools (just generate HTML)
  const config = {
    allowedTools: [] as AvailableTool[],
  }

  // Execute the agent
  const result = await executeAgent({
    config,
    prompt,
    showUI,
  })

  return {
    duration: result.duration,
    html: result.text,
    messageCount: result.messageCount,
    toolUseCounts: result.toolUseCounts,
    totalToolUseCount: result.totalToolUseCount,
  }
}
