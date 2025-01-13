import type { Result } from './types'
import { processCategoryData, processPostsData, processTagData, scan } from './utils'

export async function processMarkdown(basePath: string): Promise<Result> {
  const markdownFiles = await scan(basePath)

  const posts = await processPostsData(markdownFiles, basePath)
  const tag = await processTagData(markdownFiles, basePath)
  const category = await processCategoryData(markdownFiles, basePath)

  const result: Result = {
    generator: 'Localify',
    posts,
    tag,
    category,
  }

  return result
}
