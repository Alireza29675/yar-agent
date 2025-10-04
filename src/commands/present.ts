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
    update: Flags.boolean({
      char: 'u',
      default: false,
      description: 'Update existing presentation with new content',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Present)
    const {file: files, message, output, serve, update} = flags

    // Validate output filename
    if (!output.endsWith('.html')) {
      this.error('Output file must have .html extension')
    }

    // Resolve full path for output
    const fullOutputPath = resolve(output)

    // Check if output file exists
    let existingContent: string | undefined
    try {
      existingContent = await fs.readFile(output, 'utf8')
      // File exists
      if (!update) {
        this.error(
          `Output file already exists: ${output}\nUse --update or -u flag to update the existing presentation with new content.`
        )
      }
    } catch {
      // File doesn't exist, which is fine
      if (update) {
        this.error('Cannot use --update flag: output file does not exist yet.')
      }
    }

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

    // If updating, add existing content at the beginning
    if (existingContent) {
      fileContents.unshift(`# Existing Presentation (you are updating this with new content)\n\n${existingContent}`)
    }

    // Validate that at least one input source is provided (excluding existing content for update)
    if (fileContents.length === 0 || (update && fileContents.length === 1)) {
      this.error('No input provided. Use -f to specify files or pipe content via stdin.')
    }

    // Combine all content
    const content = fileContents.join('\n\n---\n\n')

    // Display info
    console.log()
    theme().info(`${update ? 'Updating' : 'Creating'} presentation: ${fullOutputPath}`)
    if (message) {
      theme().info(`Instructions: ${message}`)
    }
    if (update) {
      theme().info(`Mode: Updating existing presentation`)
    }
    theme().divider()

    // Start spinner
    theme().startSpinner(`${update ? 'Updating' : 'Creating'} slides...`)

    // Run the present task (showUI: false to avoid logging HTML)
    const result = await presentTask({
      content,
      message: message || undefined,
      showUI: false,
    })

    // Stop spinner
    theme().stopSpinner()

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
