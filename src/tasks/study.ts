import {query} from '@anthropic-ai/claude-agent-sdk'

import {theme} from '../lib/theme/index.js'

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
  const startTime = Date.now()
  
  let messageCount = 0
  let toolUseCount = 0
  let analysisText = ''

  // Build the prompt with optional context
  let prompt = `Study the directory at path: ${directory}

Develop a thorough understanding of this directory and its contents. Explore recursively and look at parent directories if needed for context.

Provide a comprehensive analysis that explains what this codebase is, how it works, and any important insights about its structure, dependencies, architecture, and functionality.`

  if (message) {
    prompt += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PAY ATTENTION TO THIS REQUEST BY USER:

${message}

This is a specific request from the user that should be prioritized in your analysis.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  }

  if (context) {
    prompt += `

ADDITIONAL CONTEXT:
The user has provided the following context from an external program (piped input):

\`\`\`
${context}
\`\`\`

Please consider this context in your analysis. This might be git diffs, command output, notes, or any other relevant information that should inform your understanding.`
  }

  const result = await query({
    options: {
      allowedTools: ['Read', 'Grep', 'Glob', 'ListDir'],
      systemPrompt: `You are a code analysis assistant. Your goal is to develop a deep, comprehensive understanding of codebases.

You can ONLY use read and search operations. If you need to perform any other action (like writing files, executing commands, etc.), you MUST ask the user for permission.

Deliver clear, insightful analysis that reveals how the codebase works, what it does, and how its components fit together.`,
    },
    prompt,
  })

  for await (const message of result) {
    if (message.type === 'assistant') {
      messageCount++
      const {content} = message.message
      const stopReason = message.message.stop_reason
      
      handleAssistantMessage(content, showUI, block => {
        if (block.type === 'text' && block.text && block.text.trim()) {
          analysisText += block.text + '\n'
        } else if (block.type === 'tool_use') {
          toolUseCount++
        }
      })

      // Show thinking indicator if continuing
      if (stopReason === 'tool_use' && showUI) {
        theme().thinking()
      }
    } else if (message.type === 'result') {
      // Result message contains final summary info
      // We can show stats about the operation if needed
    }
  }

  const duration = Number.parseFloat(((Date.now() - startTime) / 1000).toFixed(2))

  return {
    analysis: analysisText.trim(),
    duration,
    messageCount,
    toolUseCount,
  }
}

/**
 * Handle assistant message content
 */
function handleAssistantMessage(
  content: Array<{input?: unknown; name?: string; text?: string; type: string}>,
  showUI: boolean,
  onBlock: (block: {input?: unknown; name?: string; text?: string; type: string}) => void,
): void {
  for (const block of content) {
    onBlock(block)

    if (block.type === 'text' && block.text && block.text.trim() && showUI) {
      theme().section('Analysis')
      theme().assistantMessage(block.text)
    } else if (block.type === 'tool_use' && block.name && showUI) {
      theme().toolUse(block.name, block.input as Record<string, unknown>)
    }
  }
}

