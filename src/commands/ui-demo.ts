import {Command} from '@oclif/core'

import {theme} from '../lib/theme/index.js'

/**
 * Demo command to showcase the UI library capabilities
 * Run: yar ui-demo
 */
export default class UiDemo extends Command {
  static description = 'Demonstrate the YAR UI library capabilities'
  static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    // Header
    theme().header('🎨 YAR UI Library Demo')

    // Basic messages
    theme().section('Message Types')
    theme().success('This is a success message')
    theme().error('This is an error message')
    theme().warning('This is a warning message')
    theme().info('This is an info message')
    theme().dim('This is subtle/dim text')

    // Divider
    theme().divider()

    // Tool usage simulation
    theme().section('Tool Usage Display')
    theme().toolUse('Read', {path: 'src/commands/study.ts'})
    theme().toolResult('Read', true, '105 lines read')
    theme().toolUse('Grep', {path: '.', pattern: 'async'})
    theme().toolResult('Grep', true, '15 matches found')
    theme().toolUse('ListDir', {targetDirectory: './src'})
    theme().toolResult('ListDir', true, '3 directories, 5 files')
    theme().toolUse('Read', {path: 'package.json'})
    theme().toolResult('Read', true, '72 lines read')
    theme().toolUse('Glob', {pattern: '**/*.ts'})
    theme().toolResult('Glob', true, '8 files found')

    // Divider
    theme().divider()

    // Thinking indicator
    theme().section('Thinking Indicator')
    theme().thinking()

    // Divider
    theme().divider()

    // Spinner demo
    theme().section('Spinner Demo')
    theme().startSpinner('Processing files...')
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 1500)
    })
    theme().updateSpinner('Analyzing code...')
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 1500)
    })
    theme().stopSpinner('Analysis complete!')

    // Divider
    theme().divider()

    // Table
    theme().section('Table Display')
    theme().table(
      ['File', 'Lines', 'Type'],
      [
        ['index.ts', '2', 'TypeScript'],
        ['study.ts', '105', 'TypeScript'],
        ['ui.ts', '267', 'TypeScript'],
        ['ui-demo.ts', '95', 'TypeScript'],
      ]
    )

    // Divider
    theme().divider()

    // Summary box
    theme().summaryBox('Demo Summary', {
      'Duration': '3.0s',
      'Files Analyzed': 8,
      'Lines of Code': 479,
      'Status': '✓ Success',
    })

    // Tool statistics
    theme().displayToolStats()

    // Final success
    theme().success('UI Demo completed successfully!')

    // Info message
    theme().info('See docs/UI_LIBRARY.md for full documentation')
  }
}

