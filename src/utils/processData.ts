import type { FrontMatter, Post } from '../types'
import { readFile, stat } from 'node:fs/promises'
import { consola } from 'consola'
import { join, parse } from 'pathe'
import yaml from 'yaml'

function parseFrontMatter(markdown: string) {
  const frontMatterStart = markdown.indexOf('---');
  const frontMatterEnd = markdown.indexOf('---', frontMatterStart + 3);

  let attributes = {} as FrontMatter;
  let body = markdown;

  if (frontMatterStart !== -1 && frontMatterEnd !== -1 && frontMatterEnd > frontMatterStart) {
    const frontMatterContent = markdown.slice(frontMatterStart + 3, frontMatterEnd).trim();
    try {
      attributes = yaml.parse(frontMatterContent);
      body = markdown.slice(frontMatterEnd + 3).trim();
    } catch (e) {
      consola.error(new Error(`Error parsing yaml: ${e}`));
    }
  }

  return {
    attributes,
    body,
  };
}

function pickExcerpt(content: string, excerptMark: string) {
  let excerpt = ''
  const moreIndex = content.indexOf(excerptMark)
  if (moreIndex !== -1) {
    excerpt = content.slice(0, moreIndex).trim()
  }
  return excerpt
}

async function processPostsData(
  markdownFiles: string[],
  basePath: string,
  excerptMark: string,
) {
  const posts: Record<string, Post> = {}
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const fileStat = await stat(filePath)

    const { attributes, body } = parseFrontMatter(fileContent)
    const { title, date, categories, tags, ...otherValue } = attributes as FrontMatter

    const postExcerpt = pickExcerpt(body, excerptMark)

    const post: Post = {
      source: filePath,
      frontmatter: otherValue,
      date: new Date(date) || '',
      updated: fileStat.mtime.toISOString(),
      title: title || '',
      excerpt: postExcerpt || '',
      more: body.trim() || '',
      categories,
      tags,

    }
    const key = parse(file).name
    posts[key] = post
  }
  return posts
}

async function processTagData(markdownFiles: string[], basePath: string) {
  const tags: Set<string> = new Set()
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { attributes } = parseFrontMatter(fileContent)
    if (attributes.tags && Array.isArray(attributes.tags)) {
      attributes.tags.forEach((tag: string) => {
        tags.add(tag)
      })
    }
  }
  return Array.from(tags)
}

async function processCategoryData(markdownFiles: string[], basePath: string) {
  const categories: Set<string> = new Set()
  for (const file of markdownFiles) {
    const filePath = join(basePath, file)
    const fileContent = await readFile(filePath, 'utf-8')
    const { attributes } = parseFrontMatter(fileContent)
    if (attributes.categories) {
      categories.add(attributes.categories)
    }
  }
  return Array.from(categories)
}

export {
  processCategoryData,
  processPostsData,
  processTagData,
}
