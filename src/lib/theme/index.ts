/**
 * Theme System
 * 
 * Provides a flexible theming system for the CLI.
 * Themes control all visual output including colors, formatting, and layout.
 */

export {DefaultTheme} from './default.js'
export type {Theme} from './interface.js'
export {theme, ThemeManager} from './manager.js'

// Initialize the default theme on import
import {DefaultTheme} from './default.js'
import {ThemeManager} from './manager.js'

ThemeManager.setTheme(new DefaultTheme())

