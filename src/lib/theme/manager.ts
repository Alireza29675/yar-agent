import type {Theme} from './interface.js'

/**
 * Theme Manager
 * 
 * Manages the global theme state and provides access to the current theme.
 * Allows themes to be changed at runtime.
 */
export class ThemeManager {
  private static currentTheme: null | Theme = null

  /**
   * Get the current active theme
   * Throws an error if no theme is set (should never happen in practice)
   */
  static getTheme(): Theme {
    if (!this.currentTheme) {
      throw new Error('No theme set. Please initialize a theme first.')
    }

    return this.currentTheme
  }

  /**
   * Check if a theme is currently set
   */
  static hasTheme(): boolean {
    return this.currentTheme !== null
  }

  /**
   * Set the active theme
   */
  static setTheme(theme: Theme): void {
    this.currentTheme = theme
  }
}

/**
 * Convenience function to get the current theme
 * This is the primary way commands should access the theme
 */
export function theme(): Theme {
  return ThemeManager.getTheme()
}

