/**
 * Agent Service
 *
 * Core service for orchestrating AI agents, handling messages,
 * and tracking execution statistics.
 */

import {query} from '@anthropic-ai/claude-agent-sdk'

import type {AvailableTool} from '../config/tools.js'

import {theme} from '../lib/theme/index.js'

/**
 * Agent configuration options
 */
export interface AgentConfig {
  /** Allowed tools for the agent to use */
  allowedTools: AvailableTool[]
  /** System prompt for the agent */
  systemPrompt: string
}

/**
 * Agent execution options
 */
export interface AgentExecutionOptions {
  /** Agent configuration */
  config: AgentConfig
  /** Optional callback for processing text blocks */
  onText?: (text: string) => void
  /** Optional callback for processing tool uses */
  onToolUse?: (toolName: string, input: unknown) => void
  /** The prompt to send to the agent */
  prompt: string
  /** Whether to show UI feedback */
  showUI?: boolean
}

/**
 * Agent execution result
 */
export interface AgentExecutionResult {
  /** Duration in seconds */
  duration: number
  /** Number of messages exchanged */
  messageCount: number
  /** Accumulated text output from the agent */
  text: string
  /** Per-tool usage counts */
  toolUseCounts: Record<string, number>
  /** Total number of tools used */
  totalToolUseCount: number
}

/**
 * Execute an agent and handle its messages
 *
 * @param options - Agent execution options
 * @returns Execution result with statistics
 *
 * @example
 * ```typescript
 * const result = await executeAgent({
 *   prompt: 'Analyze this file',
 *   config: {
 *     systemPrompt: 'You are a code analyzer',
 *     allowedTools: ['Read', 'Grep']
 *   },
 *   showUI: true,
 *   onText: (text) => console.log('Got text:', text)
 * })
 * ```
 */
export async function executeAgent(
  options: AgentExecutionOptions,
): Promise<AgentExecutionResult> {
  const {config, onText, onToolUse, prompt, showUI = true} = options
  const startTime = Date.now()

  let messageCount = 0
  const toolUseCounts: Record<string, number> = {}
  let textOutput = ''

  const result = await query({
    options: {
      allowedTools: config.allowedTools,
      systemPrompt: config.systemPrompt,
    },
    prompt,
  })

  for await (const message of result) {
    if (message.type === 'assistant') {
      messageCount++
      const {content, stop_reason: stopReason} = message.message

      processAssistantMessage(content, {
        onBlock(block) {
          if (block.type === 'text' && block.text && block.text.trim()) {
            textOutput += block.text + '\n'
            if (onText) {
              onText(block.text)
            }
          } else if (block.type === 'tool_use') {
            if (block.name) {
              toolUseCounts[block.name] = (toolUseCounts[block.name] || 0) + 1
            }

            if (onToolUse && block.name) {
              onToolUse(block.name, block.input)
            }
          }
        },
        showUI,
      })

      // Show thinking indicator if continuing
      if (stopReason === 'tool_use' && showUI) {
        theme().thinking()
      }
    } else if (message.type === 'result') {
      // Result message contains final summary info
      // We can process it if needed in the future
    }
  }

  const duration = Number.parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
  const totalToolUseCount = Object.values(toolUseCounts).reduce((sum, count) => sum + count, 0)

  return {
    duration,
    messageCount,
    text: textOutput.trim(),
    toolUseCounts,
    totalToolUseCount,
  }
}

/**
 * Message content block type
 */
interface ContentBlock {
  input?: unknown
  name?: string
  text?: string
  type: string
}

/**
 * Options for processing assistant messages
 */
interface ProcessMessageOptions {
  /** Callback for each content block */
  onBlock: (block: ContentBlock) => void
  /** Whether to show UI feedback */
  showUI: boolean
}

/**
 * Process assistant message content blocks
 *
 * @param content - Array of content blocks from the assistant
 * @param options - Processing options
 */
function processAssistantMessage(
  content: ContentBlock[],
  options: ProcessMessageOptions,
): void {
  const {onBlock, showUI} = options

  for (const block of content) {
    // Always call the block callback
    onBlock(block)

    // Show UI feedback if enabled
    if (showUI) {
      if (block.type === 'text' && block.text && block.text.trim()) {
        theme().section('Analysis')
        theme().assistantMessage(block.text)
      } else if (block.type === 'tool_use' && block.name) {
        theme().toolUse(block.name, block.input as Record<string, unknown>)
      }
    }
  }
}

