/**
 * UI Library (Legacy Export)
 * 
 * @deprecated Use the theme system instead: import { theme } from './theme/index.js'
 * This file is kept for backward compatibility but will be removed in a future version.
 * 
 * Migrating:
 * - Old: import { ui } from './ui.js'
 * - New: import { theme } from './theme/index.js'
 * - Usage: theme().header(...) instead of ui.header(...)
 */

import {theme} from './theme/index.js'

/**
 * @deprecated Use theme() function from './theme/index.js' instead
 */
export const ui = theme()
