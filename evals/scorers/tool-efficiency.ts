#!/usr/bin/env node

/**
 * Custom scorer to evaluate tool usage efficiency
 * Checks if the agent used tools appropriately and efficiently
 */

interface ScorerInput {
  output: string
  context?: {
    vars?: {
      expectedTools?: string[]
      maxToolCalls?: number
    }
  }
}

interface ScorerOutput {
  pass: boolean
  score: number
  reason: string
}

export default function scoreToolEfficiency(input: ScorerInput): ScorerOutput {
  const { output, context } = input
  const expectedTools = context?.vars?.expectedTools || []
  const maxToolCalls = context?.vars?.maxToolCalls || 20

  // Parse metadata from output (if available)
  let toolUseCount = 0
  const metadataMatch = output.match(/Tool calls: (\d+)/)
  if (metadataMatch) {
    toolUseCount = parseInt(metadataMatch[1], 10)
  }

  // Check if tool usage is within acceptable range
  if (toolUseCount === 0) {
    return {
      pass: false,
      score: 0,
      reason: 'No tools were used - agent may not have accessed codebase',
    }
  }

  if (toolUseCount > maxToolCalls) {
    return {
      pass: false,
      score: 0.3,
      reason: `Too many tool calls (${toolUseCount}), expected max ${maxToolCalls}`,
    }
  }

  // Check if expected tools are mentioned in output
  const missingTools = expectedTools.filter(
    (tool) => !output.toLowerCase().includes(tool.toLowerCase())
  )

  if (missingTools.length > 0) {
    return {
      pass: false,
      score: 0.5,
      reason: `Missing expected tool usage or mentions: ${missingTools.join(', ')}`,
    }
  }

  // Efficient tool usage
  return {
    pass: true,
    score: 1,
    reason: `Efficient tool usage: ${toolUseCount} calls`,
  }
}
