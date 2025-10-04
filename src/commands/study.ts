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
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Study)
    const {directory} = args
    const {message, output} = flags

    // Resolve full path
    const fullPath = resolve(directory)

    // Check for piped input
    const stdinInput = await readStdin()

    // Always show UI
    const showUI = true

    // Display header
    theme().header('YAR Study')
    theme().info(`Analyzing: ${fullPath}`)
    if (message) {
      theme().info(`Focus: ${message}`)
    }
    theme().divider()

    // Run the study task
    const result = await studyTask({
      context: stdinInput || undefined,
      directory,
      message: message || undefined,
      showUI,
    })

    // Write to file
    await fs.writeFile(output, result.analysis, 'utf8')

    // Display completion summary
    theme().divider()

    theme().summaryBox('Complete', {
      'Output': output,
      'Duration': `${result.duration}s`,
      'Messages': result.messageCount,
      'Tools': result.totalToolUseCount,
    })

    theme().displayToolStats(result.toolUseCounts)
  }
}
