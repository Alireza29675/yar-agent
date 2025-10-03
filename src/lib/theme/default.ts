import boxen from 'boxen'
import chalk from 'chalk'
import Table from 'cli-table3'
import figures from 'figures'
import gradient from 'gradient-string'
import ora, {Ora} from 'ora'

import type {Theme} from './interface.js'

/**
 * Default Theme
 * 
 * Modern CLI theme with colors, spinners, tables, boxes, and structured logging.
 * This is the default theme that provides rich terminal output.
 */
export class DefaultTheme implements Theme {
  // Color schemes
  private colors = {
    bold: chalk.bold,
    dim: chalk.dim,
    error: chalk.red,
    highlight: chalk.magenta,
    info: chalk.cyan,
    success: chalk.green,
    tool: chalk.blue,
    warning: chalk.yellow,
  }
  private spinner: null | Ora = null

  /**
   * Display assistant response text with proper formatting
   */
  assistantMessage(text: string): void {
    // Add subtle indent and formatting
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.trim().startsWith('#')) {
        // Headers
        console.log('\n' + this.colors.bold(line))
      } else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        // List items
        console.log(this.colors.dim('  ') + line)
      } else if (line.trim()) {
        console.log(line)
      } else {
        console.log()
      }
    }
  }

  /**
   * Display dim/subtle text
   */
  dim(message: string): void {
    console.log(this.colors.dim(message))
  }

  /**
   * Display tool usage statistics
   */
  displayToolStats(toolUseCounts: Record<string, number>): void {
    if (Object.keys(toolUseCounts).length === 0) return

    const rows = Object.entries(toolUseCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tool, count]) => [
        this.colors.tool(tool),
        this.colors.highlight(count.toString()),
      ])

    console.log('\n' + this.colors.bold.cyan('Tool Usage Statistics:'))
    this.table(['Tool', 'Count'], rows)
  }

  /**
   * Display a divider
   */
  divider(): void {
    console.log(this.colors.dim('─'.repeat(process.stdout.columns || 80)))
  }

  /**
   * Display error message
   */
  error(message: string): void {
    console.log(this.colors.error(`${figures.cross} ${message}`))
  }

  /**
   * Stop spinner with failure
   */
  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message)
      this.spinner = null
    }
  }

  /**
   * Get the current spinner instance
   */
  getSpinner(): null | Ora {
    return this.spinner
  }

  /**
   * Display a header with gradient styling
   */
  header(text: string): void {
    const gradientText = gradient(['#00f5ff', '#00a1ff'])(text)
    console.log('\n' + boxen(gradientText, {
      borderColor: 'cyan',
      borderStyle: 'round',
      margin: 1,
      padding: 1,
    }))
  }

  /**
   * Display info message
   */
  info(message: string): void {
    console.log(this.colors.info(`${figures.info} ${message}`))
  }


  /**
   * Display a section header
   */
  section(text: string): void {
    console.log('\n' + this.colors.bold.cyan(`${figures.arrowRight} ${text}`))
  }

  /**
   * Start a spinner
   */
  startSpinner(text: string): void {
    this.spinner = ora({
      color: 'cyan',
      spinner: 'dots',
      text,
    }).start()
  }

  /**
   * Stop spinner with success
   */
  stopSpinner(message?: string): void {
    if (this.spinner) {
      if (message) {
        this.spinner.succeed(message)
      } else {
        this.spinner.stop()
      }

      this.spinner = null
    }
  }

  /**
   * Success message
   */
  success(message: string): void {
    console.log(this.colors.success(`${figures.tick} ${message}`))
  }

  /**
   * Display a summary box
   */
  summaryBox(title: string, items: Record<string, number | string>): void {
    let content = this.colors.bold(title) + '\n\n'
    for (const [key, value] of Object.entries(items)) {
      content += `${this.colors.dim(key + ':')} ${this.colors.highlight(String(value))}\n`
    }

    console.log('\n' + boxen(content.trim(), {
      borderColor: 'yellow',
      borderStyle: 'round',
      margin: {bottom: 1, left: 2, right: 2, top: 1},
      padding: 1,
    }))
  }

  /**
   * Create and display a table
   */
  table(headers: string[], rows: string[][]): void {
    const table = new Table({
      head: headers.map(h => this.colors.bold.cyan(h)),
      style: {
        border: ['dim'],
        head: [],
      },
    })

    for (const row of rows) {
      table.push(row)
    }

    console.log(table.toString())
  }

  /**
   * Display assistant thinking indicator
   */
  thinking(): void {
    console.log(this.colors.dim(`${figures.ellipsis} Thinking...`))
  }

  /**
   * Display tool result summary
   */
  toolResult(toolName: string, success: boolean, summary?: string): void {
    const status = success ? this.colors.success('✓') : this.colors.error('✗')
    console.log(`  ${status} ${this.colors.dim(summary || 'Complete')}`)
  }

  /**
   * Display tool usage with icon and colored name
   */
  toolUse(toolName: string, input?: Record<string, unknown>): void {
    const toolIcons: Record<string, string> = {
      Bash: '💻',
      Glob: '📁',
      Grep: '🔍',
      ListDir: '📂',
      Read: '📖',
      Write: '✍️',
    }

    const icon = toolIcons[toolName] || '🔧'
    console.log(
      this.colors.tool(`${icon} ${toolName}`) +
      (input ? this.colors.dim(` ${this.formatToolInput(toolName, input)}`) : '')
    )
  }

  /**
   * Update spinner text
   */
  updateSpinner(text: string): void {
    if (this.spinner) {
      this.spinner.text = text
    }
  }

  /**
   * Display warning message
   */
  warning(message: string): void {
    console.log(this.colors.warning(`${figures.warning} ${message}`))
  }

  /**
   * Format tool input for display
   */
  private formatToolInput(toolName: string, input: Record<string, unknown>): string {
    if (!input) return ''
    
    switch (toolName) {
      case 'Glob': {
        const {glob_pattern: globPattern1, globPattern: globPattern2, pattern} = input
        const resolvedPattern = pattern || globPattern1 || globPattern2
        return `→ ${resolvedPattern as string || ''}`
      }

      case 'Grep': {
        const {path, pattern} = input
        return `→ "${pattern as string || ''}"${path ? ` in ${path as string}` : ''}`
      }

      case 'ListDir': {
        const {path, target_directory: targetDir1, targetDirectory: targetDir2} = input
        const dir = path || targetDir1 || targetDir2
        return `→ ${dir as string || ''}`
      }

      case 'Read': {
        const {file_path: filePath1, filePath: filePath2, path} = input
        const resolvedPath = path || filePath1 || filePath2
        return `→ ${resolvedPath as string || ''}`
      }

      default: {
        return ''
      }
    }
  }
}

