import {createReadOnlyAgentConfig, executeAgent} from '../services/agent.js'
import {buildStudyPrompt} from '../services/prompt-builder.js'

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
  /** Whether to show UI (false when outputting to file) */
  showUI?: boolean
}

/**
 * Study Task Result
 */
export interface StudyResult {
  /** The full analysis text */
  analysis: string
  /** Duration in seconds */
  duration: number
  /** Number of messages exchanged */
  messageCount: number
  /** Number of tools used */
  toolUseCount: number
}

/**
 * Study Task
 *
 * Analyzes a directory using AI to understand its structure,
 * dependencies, and functionality.
 */
export async function studyTask(options: StudyOptions): Promise<StudyResult> {
  const {context, directory, message, showUI = true} = options

  // Build the prompt using the prompt builder service
  const prompt = buildStudyPrompt(directory, message, context)

  // Create agent configuration
  const config = createReadOnlyAgentConfig()

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
    toolUseCount: result.toolUseCount,
  }
}

