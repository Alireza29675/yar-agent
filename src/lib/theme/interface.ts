import type {Ora} from 'ora'

/**
 * Theme Interface
 * 
 * Defines the contract that all themes must implement.
 * Themes can inherit from each other to extend or override functionality.
 */
export interface Theme {
  /**
   * Display assistant response text with proper formatting
   */
  assistantMessage(text: string): void

  /**
   * Display dim/subtle text
   */
  dim(message: string): void

  /**
   * Display tool usage statistics
   */
  displayToolStats(): void

  /**
   * Display a divider
   */
  divider(): void

  /**
   * Display error message
   */
  error(message: string): void

  /**
   * Stop spinner with failure
   */
  failSpinner(message?: string): void

  /**
   * Get the current spinner instance (if any)
   */
  getSpinner(): null | Ora

  /**
   * Display a header with gradient styling
   */
  header(text: string): void

  /**
   * Display info message
   */
  info(message: string): void

  /**
   * Clear the tool usage count (useful for new operations)
   */
  resetToolStats(): void

  /**
   * Display a section header
   */
  section(text: string): void

  /**
   * Start a spinner
   */
  startSpinner(text: string): void

  /**
   * Stop spinner with success
   */
  stopSpinner(message?: string): void

  /**
   * Display success message
   */
  success(message: string): void

  /**
   * Display a summary box
   */
  summaryBox(title: string, items: Record<string, number | string>): void

  /**
   * Create and display a table
   */
  table(headers: string[], rows: string[][]): void

  /**
   * Display assistant thinking indicator
   */
  thinking(): void

  /**
   * Display tool result summary
   */
  toolResult(toolName: string, success: boolean, summary?: string): void

  /**
   * Display tool usage with icon and colored name
   */
  toolUse(toolName: string, input?: Record<string, unknown>): void

  /**
   * Update spinner text
   */
  updateSpinner(text: string): void

  /**
   * Display warning message
   */
  warning(message: string): void
}

