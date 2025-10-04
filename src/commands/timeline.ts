import {Args, Command, Flags} from '@oclif/core'
import * as fs from 'node:fs/promises'
import {resolve} from 'node:path'

import {theme} from '../lib/theme/index.js'
import {timelineTask} from '../tasks/timeline.js'
import {readStdin} from '../utils/stdin.js'

export default class Timeline extends Command {
  static args = {
    directory: Args.string({
      default: '.',
      description: 'Directory to analyze timeline',
      required: false,
    }),
  }
  static description = 'Analyze the evolution of a directory over time using Git history'
  static examples = [
    '<%= config.bin %> <%= command.id %> . -o timeline.md',
    '<%= config.bin %> <%= command.id %> ./src -o timeline.md',
    '<%= config.bin %> <%= command.id %> ./packages/core -o evolution.md',
    '<%= config.bin %> <%= command.id %> . -m "Focus on architecture changes" -o timeline.md',
    'cat notes.txt | <%= config.bin %> <%= command.id %> ./src -o timeline.md',
  ]
  static flags = {
    message: Flags.string({
      char: 'm',
      description: 'Important message for the agent to pay attention to',
      required: false,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output file path to write the timeline to',
      required: true,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Timeline)
    const {directory} = args
    const {message, output} = flags

    // Resolve full path
    const fullPath = resolve(directory)

    // Check for piped input
    const stdinInput = await readStdin()

    // Always show UI
    const showUI = true

    // Display header
    theme().header('YAR Timeline')
    theme().info(`Analyzing: ${fullPath}`)
    if (message) {
      theme().info(`Focus: ${message}`)
    }

    theme().divider()

    // Run the timeline task
    const result = await timelineTask({
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
      'Duration': `${result.duration}s`,
      'Messages': result.messageCount,
      'Output': output,
      'Tools': result.totalToolUseCount,
    })

    theme().displayToolStats(result.toolUseCounts)
  }
}
