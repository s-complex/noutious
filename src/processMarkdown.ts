import type { Result } from './types'
import pkg from '../package.json'
import { processCategoryData, processPostsData, processTagData, scan } from './utils'

export async function processMarkdown(basePath: string, excerptMark: string): Promise<Result> {
  const markdownFiles = await scan(basePath)

  const posts = await processPostsData(markdownFiles, basePath, excerptMark)
  const tag = await processTagData(markdownFiles, basePath)
  const category = await processCategoryData(markdownFiles, basePath)

  const result: Result = {
    generator: `${pkg.name} v${pkg.version}`,
    posts,
    tag,
    category,
  }

  return result
}
