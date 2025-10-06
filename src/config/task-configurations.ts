/**
 * Task Configuration Definitions
 *
 * Each task can define its own configuration parameters to control agent behavior.
 * This file provides base types and common configurations.
 */

/**
 * A single task configuration parameter
 */
export interface TaskConfigParameter {
  /** Name of the parameter */
  name: string
  /** Current value */
  value: string
  /** Explanation of what this value means */
  meaning: string
}

// ============================================================================
// Common Configurations (can be reused across tasks)
// ============================================================================

/**
 * Effort level configuration - reusable across analysis tasks
 */
export const EFFORT_CONFIGS: Record<'low' | 'mid' | 'high', TaskConfigParameter> = {
  high: {
    name: 'effort',
    value: 'high',
    meaning:
      'You must do extra investigation and grasp every detail. Be thorough, explore deeply, and leave no stone unturned.',
  },
  low: {
    name: 'effort',
    value: 'low',
    meaning:
      'Provide a quick overview focusing on the most important aspects. Keep the analysis concise and high-level.',
  },
  mid: {
    name: 'effort',
    value: 'mid',
    meaning:
      'Provide a balanced analysis with good coverage of important aspects without being exhaustive.',
  },
}

// ============================================================================
// Study Task Configuration
// ============================================================================

export interface StudyTaskConfig {
  effort?: 'low' | 'mid' | 'high'
}

export function buildStudyConfig(options: StudyTaskConfig): TaskConfigParameter[] {
  const config: TaskConfigParameter[] = []

  if (options.effort) {
    config.push(EFFORT_CONFIGS[options.effort])
  }

  return config
}

// ============================================================================
// Timeline Task Configuration
// ============================================================================

export interface TimelineTaskConfig {
  effort?: 'low' | 'mid' | 'high'
}

export function buildTimelineConfig(options: TimelineTaskConfig): TaskConfigParameter[] {
  const config: TaskConfigParameter[] = []

  if (options.effort) {
    config.push(EFFORT_CONFIGS[options.effort])
  }

  return config
}

// ============================================================================
// Present Task Configuration
// ============================================================================

const THEME_CONFIGS: Record<'dark' | 'light', TaskConfigParameter> = {
  dark: {
    name: 'theme',
    value: 'dark',
    meaning: 'Use dark theme with light text on dark backgrounds for the presentation.',
  },
  light: {
    name: 'theme',
    value: 'light',
    meaning: 'Use light theme with dark text on light backgrounds for the presentation.',
  },
}

export interface PresentTaskConfig {
  theme?: 'light' | 'dark'
}

export function buildPresentConfig(options: PresentTaskConfig): TaskConfigParameter[] {
  const config: TaskConfigParameter[] = []

  if (options.theme) {
    config.push(THEME_CONFIGS[options.theme])
  }

  return config
}

