import type { Post } from './types'
import { readFile, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import matter from 'gray-matter'
import { glob } from 'tinyglobby'

export async function scan(path: string) {
  const pattern = ['**/*.md']
  const ignore = ['**/*.d.ts']

  return await glob(pattern, {
    cwd: path,
    ignore,
  })
}

export async function processPostsData(
  markdownFiles: string[],
  basePath: string,
  excerptMark: string,
) {
  const posts: Record<string, Post> = {}
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { data: frontmatterData, content: postContent } = matter(fileContent)

    const { title, date, categories, tags, ...otherValue } = frontmatterData

    let postExcerpt = ''
    const moreIndex = postContent.indexOf(excerptMark)
    if (moreIndex !== -1) {
      postExcerpt = postContent.slice(0, moreIndex).trim()
    }

    const post: Post = {
      source: filePath,
      frontmatter: otherValue,
      date: date || '',
      updated: (await stat(filePath)).mtime.toISOString(),
      title: title || '',
      excerpt: postExcerpt || '',
      categories,
      tags,
    }
    const key = parse(file).name
    posts[key] = post
  }
  return posts
}

export async function processTagData(markdownFiles: string[], basePath: string) {
  const tags: Set<string> = new Set()
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { data: frontmatterData } = matter(fileContent)
    if (frontmatterData.tags && Array.isArray(frontmatterData.tags)) {
      frontmatterData.tags.forEach((tag: string) => {
        tags.add(tag)
      })
    }
  }
  return Array.from(tags)
}

export async function processCategoryData(markdownFiles: string[], basePath: string) {
  const categories: Set<string> = new Set()
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { data: frontmatterData } = matter(fileContent)
    if (frontmatterData.categories) {
      categories.add(frontmatterData.categories)
    }
  }
  return Array.from(categories)
}

export async function processSinglePostData(post: Post) {
  const postFile = await readFile(post.source, 'utf-8')
  const { content: postContent } = matter(postFile)
  return {
    ...post,
    content: postContent,
  }
}
