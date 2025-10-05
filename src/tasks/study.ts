import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

import {createFileAccessValidator} from '../config/tool-validators.js'
import {READ_ONLY_TOOLS} from '../config/tools.js'
import {executeAgent} from '../services/agent.js'
import {buildPrompt, loadPromptFromFile} from '../services/prompt-builder.js'
import {getCurrentDateContext, getOutputContext} from '../utils/date.js'

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Study Task Options
 */
export interface StudyOptions {
  /** Additional context from piped input */
  context?: string
  /** Directory to study */
  directory: string
  /** Important message from user */
  message?: string
  /** Output file path where the agent should write the analysis */
  outputFile: string
  /** Whether to show UI (false when outputting to file) */
  showUI?: boolean
}

/**
 * Study Task Result
 */
export interface StudyResult {
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
 * Build a study-specific prompt for code analysis
 *
 * @param directory - Directory to analyze
 * @param outputFile - Output file where analysis should be written
 * @param message - Optional user message
 * @param context - Optional additional context
 * @returns The formatted study prompt
 */
async function buildStudyPrompt(
  directory: string,
  outputFile: string,
  message?: string,
  context?: string,
): Promise<string> {
  // Load base prompt from markdown file with variable substitution
  const promptFile = join(__dirname, '..', 'prompts', 'tasks', 'study.md')
  const basePrompt = await loadPromptFromFile(promptFile, {directory, outputFile})

  // Add date context and output file info
  const dateContext = getCurrentDateContext()
  const outputFileContext = getOutputContext(outputFile)
  const fullContext = context
    ? `${dateContext}\n${outputFileContext}\n\n${context}`
    : `${dateContext}\n${outputFileContext}`

  // Add message and context using the prompt builder
  return buildPrompt({
    basePrompt,
    context: fullContext,
    message,
  })
}

/**
 * Study Task
 *
 * Analyzes a directory using AI to understand its structure,
 * dependencies, and functionality. The agent will write the analysis
 * directly to the output file.
 */
export async function studyTask(options: StudyOptions): Promise<StudyResult> {
  const {context, directory, message, outputFile, showUI = true} = options

  // Build the prompt using the task-specific prompt builder
  const prompt = await buildStudyPrompt(directory, outputFile, message, context)

  // Create file access validator to restrict editing to only the output file
  const fileValidator = createFileAccessValidator(outputFile)

  // Create agent configuration with Read tools + Edit/Write restricted to output file
  const config = {
    allowedTools: [...READ_ONLY_TOOLS, 'Edit' as const, 'Write' as const],
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

