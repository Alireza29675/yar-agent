#!/usr/bin/env node
import { studyTask } from '../../dist/tasks/study.js'

interface ProviderInput {
  prompt: string
  vars?: {
    directory?: string
    context?: string
  }
}

interface ProviderOutput {
  output: string
  metadata: {
    messageCount: number
    toolUseCount: number
    duration: number
  }
}

/**
 * Custom promptfoo provider for YAR study command
 * This allows promptfoo to test YAR's analysis capabilities
 */
async function callYarStudy(input: ProviderInput): Promise<ProviderOutput> {
  const directory = input.vars?.directory || process.cwd()
  const context = input.vars?.context
  const message = input.prompt

  try {
    const result = await studyTask({
      directory,
      message,
      context,
      showUI: false, // Silent mode for evals
    })

    return {
      output: result.text,
      metadata: {
        messageCount: result.messageCount,
        toolUseCount: result.toolUseCount,
        duration: result.duration,
      },
    }
  } catch (error) {
    return {
      output: `Error: ${error instanceof Error ? error.message : String(error)}`,
      metadata: {
        messageCount: 0,
        toolUseCount: 0,
        duration: 0,
      },
    }
  }
}

// Export for promptfoo to use
export default callYarStudy
