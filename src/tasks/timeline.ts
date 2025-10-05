import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

import {READ_ONLY_TOOLS} from '../config/tools.js'
import {executeAgent} from '../services/agent.js'
import {buildPrompt, loadPromptFromFile} from '../services/prompt-builder.js'
import {getCurrentDateContext} from '../utils/date.js'

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Timeline Task Options
 */
export interface TimelineOptions {
  /** Additional context from piped input */
  context?: string
  /** Directory to analyze */
  directory: string
  /** Important message from user */
  message?: string
  /** Whether to show UI (false when outputting to file) */
  showUI?: boolean
}

/**
 * Timeline Task Result
 */
export interface TimelineResult {
  /** The full timeline analysis text */
  analysis: string
  /** Duration in seconds */
  duration: number
  /** Number of messages exchanged */
  messageCount: number
  /** Per-tool usage counts */
  toolUseCounts: Record<string, number>
  /** Total number of tools used */
  totalToolUseCount: number
}

/**
 * Build a timeline-specific prompt
 *
 * @param directory - Directory to analyze
 * @param message - Optional user message
 * @param context - Optional additional context
 * @returns The formatted timeline prompt
 */
async function buildTimelinePrompt(
  directory: string,
  message?: string,
  context?: string,
): Promise<string> {
  // Load base prompt from markdown file with variable substitution
  const promptFile = join(__dirname, '..', 'prompts', 'tasks', 'timeline.md')
  const basePrompt = await loadPromptFromFile(promptFile, {directory})

  // Add date context
  const dateContext = getCurrentDateContext()
  const fullContext = context ? `${dateContext}\n\n${context}` : dateContext

  // Add message and context using the prompt builder
  return buildPrompt({
    basePrompt,
    context: fullContext,
    message,
  })
}

/**
 * Timeline Task
 *
 * Analyzes the evolution of a directory over time using Git history.
 */
export async function timelineTask(options: TimelineOptions): Promise<TimelineResult> {
  const {context, directory, message, showUI = true} = options

  // Build the prompt using the task-specific prompt builder
  const prompt = await buildTimelinePrompt(directory, message, context)

  // Create agent configuration with read-only tools + Bash for git commands
  const config = {
    allowedTools: [...READ_ONLY_TOOLS, 'Bash' as const],
  }

  // Execute the agent
  const result = await executeAgent({
    config,
    prompt,
    showUI,
  })

  return {
    analysis: result.text,
    duration: result.duration,
    messageCount: result.messageCount,
    toolUseCounts: result.toolUseCounts,
    totalToolUseCount: result.totalToolUseCount,
  }
}
