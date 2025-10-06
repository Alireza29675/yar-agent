import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

import {buildTimelineConfig, type TimelineTaskConfig} from '../config/task-configurations.js'
import {READ_ONLY_TOOLS} from '../config/tools.js'
import {createFileAccessValidator} from '../config/tool-validators.js'
import {executeAgent} from '../services/agent.js'
import {buildPrompt, loadPromptFromFile} from '../services/prompt-builder.js'
import {getCurrentDateContext, getOutputContext} from '../utils/date.js'

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
  /** Output file path where the agent should write the timeline */
  outputFile: string
  /** Whether to show UI (false when outputting to file) */
  showUI?: boolean
  /** Task configuration options */
  taskConfig?: TimelineTaskConfig
}

/**
 * Timeline Task Result
 */
export interface TimelineResult {
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
 * @param outputFile - Output file where timeline should be written
 * @param message - Optional user message
 * @param context - Optional additional context
 * @param taskConfig - Optional task configuration options
 * @returns The formatted timeline prompt
 */
async function buildTimelinePrompt(
  directory: string,
  outputFile: string,
  message?: string,
  context?: string,
  taskConfig?: TimelineTaskConfig,
): Promise<string> {
  // Load base prompt from markdown file with variable substitution
  const promptFile = join(__dirname, '..', 'prompts', 'tasks', 'timeline.md')
  const basePrompt = await loadPromptFromFile(promptFile, {directory, outputFile})

  // Add date context and output file info
  const dateContext = getCurrentDateContext()
  const outputFileContext = getOutputContext(outputFile)
  const fullContext = context
    ? `${dateContext}\n${outputFileContext}\n\n${context}`
    : `${dateContext}\n${outputFileContext}`

  // Build task configuration parameters
  const taskConfiguration = taskConfig ? buildTimelineConfig(taskConfig) : undefined

  // Add message, task config, and context using the prompt builder
  return buildPrompt({
    basePrompt,
    context: fullContext,
    message,
    taskConfiguration,
  })
}

/**
 * Timeline Task
 *
 * Analyzes the evolution of a directory over time using Git history.
 * The agent will write the timeline directly to the output file.
 */
export async function timelineTask(options: TimelineOptions): Promise<TimelineResult> {
  const {context, directory, message, outputFile, showUI = true, taskConfig} = options

  // Build the prompt using the task-specific prompt builder
  const prompt = await buildTimelinePrompt(directory, outputFile, message, context, taskConfig)

  // Create file access validator to restrict editing to only the output file
  const fileValidator = createFileAccessValidator(outputFile)

  // Create agent configuration with read-only tools + Bash for git + Edit/Write restricted to output
  const config = {
    allowedTools: [...READ_ONLY_TOOLS, 'Bash' as const, 'Edit' as const, 'Write' as const],
    canUseTool: fileValidator,
  }

  // Execute the agent
  const result = await executeAgent({
    config,
    prompt,
    showUI,
  })

  return {
    duration: result.duration,
    messageCount: result.messageCount,
    toolUseCounts: result.toolUseCounts,
    totalToolUseCount: result.totalToolUseCount,
  }
}
