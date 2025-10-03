import {Args, Command, Flags} from '@oclif/core'
import * as fs from 'node:fs/promises'

import {theme} from '../lib/theme/index.js'
import {studyTask} from '../tasks/study.js'
import {readStdin} from '../utils/stdin.js'

export default class Study extends Command {
  static args = {
    directory: Args.string({
      description: 'Directory to study recursively',
      required: true,
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
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Study)
    const {directory} = args
    const {message, output} = flags

    // Check for piped input
    const stdinInput = await readStdin()

    // Suppress visual UI if writing to file
    const showUI = !output

    if (showUI) {
      // Display header
      theme().header('🔍 YAR Study Agent')
      theme().info(`Analyzing directory: ${directory}`)

      if (stdinInput) {
        theme().info(`Piped input received: ${stdinInput.length} characters`)
      }

      if (message) {
        theme().warning(`User message: ${message}`)
      }

      theme().divider()
    }

    // Run the study task
    const result = await studyTask({
      context: stdinInput || undefined,
      directory,
      message: message || undefined,
      showUI,
    })

    // Write to file if output flag is provided
    if (output) {
      await fs.writeFile(output, result.analysis, 'utf8')
      theme().success(`Analysis written to: ${output}`)
      theme().info(`Duration: ${result.duration}s | Messages: ${result.messageCount} | Tools Used: ${result.totalToolUseCount}`)
    } else {
      // Display completion summary
      theme().divider()
      
      theme().summaryBox('Study Complete', {
        'Directory': directory,
        'Duration': `${result.duration}s`,
        'Messages': result.messageCount,
        'Tools Used': result.totalToolUseCount,
      })

      theme().displayToolStats(result.toolUseCounts)
      
      theme().success('Study completed successfully!')
    }
  }
}
