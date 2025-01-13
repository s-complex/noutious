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
) {
  const posts: Record<string, Post> = {};
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { data: frontmatterData, content: postContent } = matter(fileContent)
    let postExcerpt = ""
    const moreIndex = postContent.indexOf("<!--more-->")
    if (moreIndex !== -1) {
      postExcerpt = postContent.slice(0, moreIndex)
    }
    const post: Post = {
      source: filePath,
      frontmatter: frontmatterData,
      date: frontmatterData.date.toISOString(),
      updated: (await stat(filePath)).mtime.toISOString(),
      title: frontmatterData.title || '',
      excerpt: postExcerpt || '',
    }
    const key = parse(file).name;
    posts[key] = post;
  }
  return posts
}

export async function processTagData(markdownFiles: string[], basePath: string) {
  const tags: Record<string, string[]> = {}
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { data: frontmatterData } = matter(fileContent)
    if (frontmatterData.tags && Array.isArray(frontmatterData.tags)) {
      frontmatterData.tags.forEach((tag) => {
        if (tags[tag]) {
          tags[tag].push(filePath)
        }
        else {
          tags[tag] = [filePath]
        }
      })
    }
  }
  return tags
}

export async function processCategoryData(markdownFiles: string[], basePath: string) {
  const categories: Record<string, string[]> = {}
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { data: frontmatterData } = matter(fileContent)
    if (frontmatterData.category && Array.isArray(frontmatterData.category)) {
      frontmatterData.category.forEach((category) => {
        if (categories[category]) {
          categories[category].push(filePath)
        }
        else {
          categories[category] = [filePath]
        }
      })
    }
  }
  return categories
}

export async function processSinglePostData(post: Post, key: string) {
  const postFile = await readFile(post.source, 'utf-8')
  const { content: postContent } = matter(postFile);
  return {
    ...post,
    content: postContent
  }
}
