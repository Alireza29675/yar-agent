import {Command, Flags} from '@oclif/core'
import {exec} from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as http from 'node:http'
import {dirname, resolve} from 'node:path'

import {theme} from '../lib/theme/index.js'
import {presentTask} from '../tasks/present.js'
import {readStdin} from '../utils/stdin.js'

export default class Present extends Command {
  static description = 'Convert content to a reveal.js presentation'
  static examples = [
    '<%= config.bin %> <%= command.id %> -o slides.html -f content.md',
    '<%= config.bin %> <%= command.id %> -o slides.html -f intro.md -f main.md -f conclusion.md',
    'cat notes.md | <%= config.bin %> <%= command.id %> -o slides.html',
    '<%= config.bin %> <%= command.id %> -o slides.html -f content.md -m "Make it technical"',
    '<%= config.bin %> <%= command.id %> -o slides.html -f content.md --serve',
  ]
  static flags = {
    file: Flags.string({
      char: 'f',
      description: 'Input file(s) to convert to presentation',
      multiple: true,
      required: false,
    }),
    message: Flags.string({
      char: 'm',
      description: 'Instructions for the AI',
      required: false,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Output HTML file path',
      required: true,
    }),
    serve: Flags.boolean({
      default: false,
      description: 'Serve presentation after generation',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Present)
    const {file: files, message, output, serve} = flags

    // Validate output filename
    if (!output.endsWith('.html')) {
      this.error('Output file must have .html extension')
    }

    // Resolve full path for output
    const fullOutputPath = resolve(output)

    // Read input from files and/or stdin
    const fileContents: string[] = []
    if (files && files.length > 0) {
      for (const filePath of files) {
        try {
          const content = await fs.readFile(filePath, 'utf8')
          fileContents.push(`# File: ${filePath}\n\n${content}`)
        } catch (error) {
          this.error(`Failed to read file: ${filePath}`)
        }
      }
    }

    const stdinContent = await readStdin()
    if (stdinContent) {
      fileContents.push(`# Piped Input\n\n${stdinContent}`)
    }

    // Validate that at least one input source is provided
    if (fileContents.length === 0) {
      this.error('No input provided. Use -f to specify files or pipe content via stdin.')
    }

    // Combine all content
    const content = fileContents.join('\n\n---\n\n')

    // Always show UI
    const showUI = true

    // Display header
    theme().header('YAR Present')
    theme().info(`Output: ${fullOutputPath}`)
    if (message) {
      theme().info(`Instructions: ${message}`)
    }

    theme().divider()

    // Run the present task
    const result = await presentTask({
      content,
      message: message || undefined,
      showUI,
    })

    // Create output directory if it doesn't exist
    const outputDir = dirname(fullOutputPath)
    await fs.mkdir(outputDir, {recursive: true})

    // Write to file
    await fs.writeFile(fullOutputPath, result.html, 'utf8')

    // Display completion summary
    theme().divider()

    theme().summaryBox('Complete', {
      'Duration': `${result.duration}s`,
      'Messages': result.messageCount,
      'Output': fullOutputPath,
      'Tools': result.totalToolUseCount,
    })

    theme().displayToolStats(result.toolUseCounts)

    // Serve if requested
    if (serve) {
      await this.servePresentation(fullOutputPath)
    }
  }

  private async servePresentation(filePath: string): Promise<void> {
    const port = 3000

    const server = http.createServer(async (req, res) => {
      try {
        const content = await fs.readFile(filePath, 'utf8')
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(content)
      } catch {
        res.writeHead(500)
        res.end('Error reading file')
      }
    })

    server.listen(port, () => {
      const url = `http://localhost:${port}`
      theme().divider()
      theme().success(`Serving presentation at: ${url}`)
      theme().info('Press Ctrl+C to stop the server')

      // Open browser
      const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
      exec(`${command} ${url}`)
    })

    // Keep the process alive
    await new Promise(() => {}) // Never resolves - keeps server running
  }
}
