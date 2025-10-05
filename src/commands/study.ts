import {Args, Command, Flags} from '@oclif/core'
import * as fs from 'node:fs/promises'
import {resolve} from 'node:path'

import {theme} from '../lib/theme/index.js'
import {studyTask} from '../tasks/study.js'
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
    'git diff | <%= config.bin %> <%= command.id %> . -o analysis.md',
    '<%= config.bin %> <%= command.id %> ./api -m "Explain the authentication flow" -o report.md',
  ]
  static flags = {
    message: Flags.string({
      char: 'm',
      description: 'Important message for the agent to pay attention to',
      required: false,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output file path to write the analysis to',
      required: true,
    }),
    update: Flags.boolean({
      char: 'u',
      default: false,
      description: 'Update existing output file with new findings',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Study)
    const {directory} = args
    const {message, output, update} = flags

    // Resolve full path
    const fullPath = resolve(directory)

    // Check if output file exists
    let existingContent: string | undefined
    try {
      existingContent = await fs.readFile(output, 'utf8')
      // File exists
      if (!update) {
        this.error(
          `Output file already exists: ${output}\nUse --update or -u flag to update the existing file with new findings.`
        )
      }
    } catch {
      // File doesn't exist, which is fine
      if (update) {
        this.error('Cannot use --update flag: output file does not exist yet.')
      }
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
    theme().info(`${update ? 'Updating' : 'Analyzing'}: ${fullPath}`)
    if (message) {
      theme().info(`Focus: ${message}`)
    }
    if (update) {
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
