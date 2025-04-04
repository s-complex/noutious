import type { Post, Result } from './types'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { normalize, parse } from 'pathe'
import { glob } from 'tinyglobby'
import pkg from '../package.json'
import { parseFrontMatter } from './utils'

export async function persistData(baseDir: string, draft: boolean, excerptMark: string) {
  baseDir = normalize(baseDir)
  const filesToScan = [`${baseDir}/blog/posts/**/*.md`]
  if (draft) {
    filesToScan.push(`${baseDir}/blog/drafts/**/*.md`)
  }
  const fileList = await glob(filesToScan, {
    absolute: true,
  })
  const posts: Record<string, Post> = {}
  const allTags: Set<string> = new Set()
  const allCategories: Set<string> = new Set()

  for (const path of fileList) {
    const content = await readFile(path, 'utf-8')
    const stats = await stat(path)

    const { attributes, excerpt, more } = parseFrontMatter(content, excerptMark)
    const { title, date, categories, tags, ...otherValue } = attributes

    const post: Post = {
      source: path,
      frontmatter: otherValue,
      date: new Date(date),
      updated: new Date(stats.mtime),
      title,
      excerpt,
      more,
      categories,
      tags,
      content,
    }
    const key = parse(path).name
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
    categories: Array.from(allCategories),
  }

  await writeFile(`${baseDir}/data.json`, JSON.stringify(result, null, 2))
}
