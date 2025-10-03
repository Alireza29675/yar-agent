import {query} from '@anthropic-ai/claude-agent-sdk'
import {Args, Command} from '@oclif/core'

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
  ]

  public async run(): Promise<void> {
    const {args} = await this.parse(Study)
    const {directory} = args

    this.log(`Starting to study directory: ${directory}\n`)

    const result = await query({
      options: {
        allowedTools: ['Read', 'Grep', 'Glob', 'ListDir'],
        systemPrompt: `You are a code analysis assistant. Your goal is to develop a deep, comprehensive understanding of codebases.

You can ONLY use read and search operations. If you need to perform any other action (like writing files, executing commands, etc.), you MUST ask the user for permission.

Deliver clear, insightful analysis that reveals how the codebase works, what it does, and how its components fit together.`,
      },
      prompt: `Study the directory at path: ${directory}

Develop a thorough understanding of this directory and its contents. Explore recursively and look at parent directories if needed for context.

Provide a comprehensive analysis that explains what this codebase is, how it works, and any important insights about its structure, dependencies, architecture, and functionality.`,
    })

    for await (const message of result) {
      if (message.type === 'assistant') {
        const {content} = message.message
        for (const block of content) {
          if (block.type === 'text') {
            this.log(block.text)
          }
        }
      }
    }

    this.log('\n✅ Study complete!')
  }
}

