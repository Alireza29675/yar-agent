/**
 * Example usage of the Theme system
 * This file demonstrates how to use the rich UI components in your commands
 */

import {theme} from './theme/index.js'

export function exampleUsage() {
  // Display a header with gradient
  theme().header('Welcome to YAR')

  // Section headers
  theme().section('Getting Started')

  // Different message types
  theme().success('Operation completed successfully')
  theme().error('Something went wrong')
  theme().warning('This is a warning message')
  theme().info('Here is some information')
  theme().dim('This is subtle text')

  // Tool usage display
  theme().toolUse('Read', {path: '/path/to/file.ts'})
  theme().toolUse('Grep', {path: '.', pattern: 'console.log'})
  theme().toolUse('ListDir', {targetDirectory: './src'})

  // Tool results
  theme().toolResult('Read', true, '150 lines read')
  theme().toolResult('Write', false, 'Permission denied')

  // Spinners (for async operations)
  theme().startSpinner('Processing...')
  setTimeout(() => {
    theme().updateSpinner('Still processing...')
  }, 1000)
  setTimeout(() => {
    theme().stopSpinner('Done!')
  }, 2000)

  // Tables
  theme().table(
    ['File', 'Lines', 'Type'],
    [
      ['index.ts', '42', 'TypeScript'],
      ['app.tsx', '156', 'React'],
      ['styles.css', '89', 'CSS'],
    ]
  )

  // Summary box
  theme().summaryBox('Operation Summary', {
    'Duration': '5.2s',
    'Files Processed': 42,
    'Status': 'Success',
  })

  // Display tool statistics (pass tool counts from agent execution)
  const mockToolCounts = {
    Read: 3,
    Grep: 1,
    ListDir: 1,
  }
  theme().displayToolStats(mockToolCounts)

  // Divider
  theme().divider()
}

/**
 * Example: Using the UI in an async command
 */
export async function exampleAsyncCommand() {
  theme().header('Async Command Example')
  
  theme().startSpinner('Loading data...')
  
  try {
    // Simulate async work
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 2000)
    })
    
    theme().stopSpinner('Data loaded successfully')
    theme().success('Command completed')
  } catch (error) {
    theme().failSpinner('Failed to load data')
    theme().error(String(error))
  }
}

/**
 * Example: Displaying tool usage in real-time
 */
export function exampleToolTracking() {
  theme().header('Tool Usage Tracking')
  
  // Simulate multiple tool uses
  theme().toolUse('Read', {path: 'file1.ts'})
  theme().toolResult('Read', true, '50 lines')
  
  theme().toolUse('Read', {path: 'file2.ts'})
  theme().toolResult('Read', true, '100 lines')
  
  theme().toolUse('Grep', {path: '.', pattern: 'TODO'})
  theme().toolResult('Grep', true, '5 matches found')
  
  theme().toolUse('Read', {path: 'file3.ts'})
  theme().toolResult('Read', true, '75 lines')

  // Display statistics (pass tool counts from agent execution)
  const mockToolCounts = {
    Read: 3,
    Grep: 1,
  }
  theme().displayToolStats(mockToolCounts)
}

