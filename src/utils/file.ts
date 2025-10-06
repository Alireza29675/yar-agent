import * as fs from 'node:fs/promises'
import {dirname, resolve} from 'node:path'

/**
 * Ensures the directory for an output file exists
 *
 * @param outputPath - The output file path
 */
export async function ensureOutputDirectory(outputPath: string): Promise<void> {
  const outputDir = dirname(resolve(outputPath))
  await fs.mkdir(outputDir, {recursive: true})
}
