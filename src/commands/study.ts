import {Args, Command, Flags} from '@oclif/core'
import * as fs from 'node:fs/promises'
import {resolve} from 'node:path'

import {theme} from '../lib/theme/index.js'
import {studyTask} from '../tasks/study.js'
import {ensureOutputDirectory} from '../utils/file.js'
import {getFormattedDateTime} from '../utils/format.js'
import {readStdin} from '../utils/stdin.js'

export default class Study extends Command {
  static args = {
    directory: Args.string({
      default: '.',
      description: 'Directory to study recursively',
      required: false,
    }),
  }
  static description = 'Study a directory and understand how it works recursively'
  static examples = [
    '<%= config.bin %> <%= command.id %> .',
    '<%= config.bin %> <%= command.id %> ./src',
    '<%= config.bin %> <%= command.id %> /path/to/project',
    '<%= config.bin %> <%= command.id %> . -o analysis.md',
    '<%= config.bin %> <%= command.id %> . -m "Focus on security vulnerabilities"',
    'cat notes.txt | <%= config.bin %> <%= command.id %> ./src',
    'git diff | <%= config.bin %> <%= command.id %> .',
    '<%= config.bin %> <%= command.id %> ./api -m "Explain the authentication flow"',
  ]
  static flags = {
    effort: Flags.string({
      default: 'mid',
      description: 'Analysis effort level: low (quick overview), mid (balanced), high (thorough)',
      options: ['low', 'mid', 'high'],
      required: false,
    }),
    message: Flags.string({
      char: 'm',
      description: 'Important message for the agent to pay attention to',
      required: false,
    }),
    output: Flags.string({
      char: 'o',
      default: 'GUIDE.md',
      description: 'Output file path to write the analysis to (default: GUIDE.md)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Study)
    const {directory} = args
    const {effort, message, output} = flags

    // Resolve full path
    const fullPath = resolve(directory)

    // Ensure output directory exists
    await ensureOutputDirectory(output)

    // Check if output file exists and read it
    let existingContent: string | undefined
    try {
      existingContent = await fs.readFile(output, 'utf8')
    } catch {
      // File doesn't exist, which is fine
    }

    // Check for piped input
    const stdinInput = await readStdin()

    // Build context with existing content and stdin
    let contextString: string | undefined
    const contextParts: string[] = []

    if (existingContent) {
      contextParts.push(`EXISTING OUTPUT FILE CONTENT (you are updating this file with new findings):

${existingContent}`)
    }

    if (stdinInput) {
      contextParts.push(`PIPED INPUT:

${stdinInput}`)
    }

    if (contextParts.length > 0) {
      contextString = contextParts.join('\n\n---\n\n')
    }

    // Always show UI
    const showUI = true

    // Display info
    console.log()
    theme().header(`${existingContent ? 'Updating' : 'Studying'}: ${fullPath}`)
    theme().info(getFormattedDateTime())
    if (message) {
      theme().info(`Focus: ${message}`)
    }
    if (existingContent) {
      theme().info(`Mode: Updating existing analysis`)
    }
    theme().divider()

    // Run the study task (agent will write to output file)
    const result = await studyTask({
      context: contextString,
      directory,
      message: message || undefined,
      outputFile: resolve(output),
      showUI,
      taskConfig: {
        effort: effort as 'low' | 'mid' | 'high',
      },
    })

    // Verify output file was created
    try {
      await fs.access(output)
    } catch {
      this.error('Agent failed to create the output file. Please check the logs.')
    }

    // Display completion summary
    theme().divider()

    theme().summaryBox('Complete', {
      'Duration': `${result.duration}s`,
      'Messages': result.messageCount,
      'Output': output,
      'Tools': result.totalToolUseCount,
    })

    theme().displayToolStats(result.toolUseCounts)
  }
}
