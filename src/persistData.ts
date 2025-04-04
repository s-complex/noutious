import type { FrontMatter, Post, Result } from './types'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { join, parse } from 'pathe'
import pkg from '../package.json'
import { parseFrontMatter, pickExcerpt, scan } from './utils'

export async function persistData(baseDir: string, draft: boolean, excerptMark: string) {
  const filesToScan = [`${baseDir}/blog/posts`]
  if (draft) {
    filesToScan.push(`${baseDir}/blog/drafts`)
  }
  const data = await scan(filesToScan)
  const posts: Record<string, Post> = {}
  const allTags: Set<string> = new Set()
  const allCategories: Set<string> = new Set()

  for (const file of data) {
    const path = join(baseDir, file)
    const content = await readFile(path, 'utf-8')
    const stats = await stat(path)

    const { attributes, body } = parseFrontMatter(content)
    const { title, date, categories, tags, ...otherValue } = attributes as FrontMatter
    const excerpt = pickExcerpt(body, excerptMark)

    const post: Post = {
      source: path,
      frontmatter: otherValue,
      date: new Date(date),
      updated: new Date(stats.mtime),
      title,
      excerpt,
      more: body.trim(),
      categories,
      tags,
    }
    const key = parse(file).name
    posts[key] = post

    if (tags && Array.isArray(tags)) {
      tags.forEach((tag: string) => {
        allTags.add(tag)
      })
    }

    if (categories) {
      allCategories.add(categories)
    }
  }

  const result: Result = {
    generator: `${pkg.name} v${pkg.version}`,
    posts,
    tags: Array.from(allTags),
    categories: Array.from(allCategories)
  }

  await writeFile(`${baseDir}/data.json`, JSON.stringify(result, null, 2))
}
