import type { Post } from './types'
import { readFile, stat } from 'node:fs/promises'
import { join, parse } from 'pathe'
import { glob } from 'tinyglobby'
import { parseFrontMatter } from './utils'

export async function processBlogPostsData(baseDir: string, draft: boolean, excerptMark: string) {
  const filesToScan = [`${baseDir}/blog/posts`]
  if (draft) {
    filesToScan.push(`${baseDir}/blog/drafts`)
  }
  const fileList = await glob(filesToScan, {
    absolute: true,
  })

  const posts: Record<string, Post> = {}
  for (const file of fileList) {
    const path = join(baseDir, file)
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
    }
    const key = parse(file).name
    posts[key] = post
  }

  return posts
}

export async function processBlogCategoriesData(baseDir: string, draft: boolean) {
  const filesToScan = [`${baseDir}/blog/posts`]
  if (draft) {
    filesToScan.push(`${baseDir}/blog/drafts`)
  }
  const fileList = await glob(filesToScan, {
    absolute: true,
  })

  const categories: Set<string> = new Set()
  for (const file of fileList) {
    const path = join(baseDir, file)
    const content = await readFile(path, 'utf-8')
    const { attributes } = parseFrontMatter(content)
    if (attributes.categories) {
      categories.add(attributes.categories)
    }
  }

  return Array.from(categories)
}

export async function processBlogTagsData(baseDir: string, draft: boolean) {
  const filesToScan = [`${baseDir}/blog/posts`]
  if (draft) {
    filesToScan.push(`${baseDir}/blog/drafts`)
  }
  const fileList = await glob(filesToScan, {
    absolute: true,
  })

  const tags: Set<string> = new Set()
  for (const file of fileList) {
    const path = join(baseDir, file)
    const content = await readFile(path, 'utf-8')
    const { attributes } = parseFrontMatter(content)
    if (attributes.tags && Array.isArray(attributes.tags)) {
      attributes.tags.forEach((tag: string) => {
        tags.add(tag)
      })
    }
  }
  return Array.from(tags)
}
