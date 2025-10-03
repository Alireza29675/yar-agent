import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

import {CODE_ANALYSIS_SYSTEM_PROMPT} from '../config/system-prompts.js'
import {READ_ONLY_TOOLS} from '../config/tools.js'
import {executeAgent} from '../services/agent.js'
import {buildPrompt, loadPromptFromFile} from '../services/prompt-builder.js'

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
 * Build a study-specific prompt for code analysis
 *
 * @param directory - Directory to analyze
 * @param message - Optional user message
 * @param context - Optional additional context
 * @returns The formatted study prompt
 */
async function buildStudyPrompt(
  directory: string,
  message?: string,
  context?: string,
): Promise<string> {
  // Load base prompt from markdown file with variable substitution
  const promptFile = join(__dirname, '..', 'prompts', 'tasks', 'study.md')
  const basePrompt = await loadPromptFromFile(promptFile, {directory})

  // Add message and context using the prompt builder
  return buildPrompt({
    basePrompt,
    context,
    message,
  })
}

/**
 * Study Task
 *
 * Analyzes a directory using AI to understand its structure,
 * dependencies, and functionality.
 */
export async function studyTask(options: StudyOptions): Promise<StudyResult> {
  const {context, directory, message, showUI = true} = options

  // Build the prompt using the task-specific prompt builder
  const prompt = await buildStudyPrompt(directory, message, context)

  // Create agent configuration
  const config = {
    allowedTools: READ_ONLY_TOOLS,
    systemPrompt: CODE_ANALYSIS_SYSTEM_PROMPT,
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
    toolUseCount: result.toolUseCount,
  }
}

