import type { Result } from './types'
import { writeFile } from 'node:fs/promises';
import pkg from '../package.json'
import { processCategoryData, processPostsData, processTagData } from './processData'
import { scan } from './utils';

export async function persistData(basePath: string, draft: boolean, excerptMark: string) {
  const blogPostFiles = await scan(`${basePath}/blog`)

  const posts = await processPostsData(blogPostFiles, `${basePath}/blog`, excerptMark)
  const tag = await processTagData(blogPostFiles, `${basePath}/blog`)
  const category = await processCategoryData(blogPostFiles, `${basePath}/blog`)

  const result: Result = {
    generator: `${pkg.name} v${pkg.version}`,
    posts,
    tag,
    category,
  }

  await writeFile('data.json', JSON.stringify(result, null, 2))
}
