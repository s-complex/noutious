import type { Args, Env, GetPostsOptions, Post, Result } from './types'
import { readFile } from 'node:fs/promises'
import { consola } from 'consola'
import { join, sep } from 'pathe'
import { persistData } from './persistData'
import { processCategoryData, processPostsData, processTagData } from './processData'
import { scan } from './utils'

class Noutious {
  private baseDir: string
  private persistedDataFileDir: string
  private blogSourceDir: string
  private env: Env
  private data: Result | null
  constructor(base_dir: string, args: Args) {
    if (!base_dir) {
      consola.error(new Error('base_dir is required.'))
    }
    this.baseDir = base_dir + sep
    this.persistedDataFileDir = join(base_dir, 'data.json')
    this.blogSourceDir = join(base_dir, 'posts') + sep
    this.env = {
      args,
      persistData: Boolean(args.persistData),
      draft: Boolean(args.draft),
      excerpt: String(args.excerpt) ?? '<!--more-->',
    }
    this.data = null
  }

  async persistData() {
    try {
      await persistData(this.baseDir, this.env.draft, this.env.excerpt)
    } catch (e) {
      consola.error(new Error(`Error when persisting data: ${e}`))
    }
  }

  async getBlogPosts(options: GetPostsOptions = {}): Promise<Record<string, Post> | null> {
    const { date, include } = options
    let posts: Record<string, Post> = {}

    if (this.persistedDataFileDir) {
      const data = JSON.parse(await readFile(this.persistedDataFileDir, 'utf-8'))
      posts = data.posts
    } else {
      const data = {}
      const posts = await scan(`${this.blogSourceDir}/posts`)
      const postsData = await processPostsData(posts, `${this.blogSourceDir}/posts`, this.env.excerpt)
      if (this.env.draft) {
        const drafts = await scan(`${this.blogSourceDir}/drafts`)
        const draftsData = await processPostsData(drafts, `${this.blogSourceDir}/drafts`, this.env.excerpt)
        Object.assign(data, postsData, draftsData);
      } else {
        Object.assign(data, postsData)
      }
    }

    if (include && Array.isArray(include)) {
      posts = Object.fromEntries(
        Object.entries(posts).filter(([_, post]) =>
          include.some(condition =>
            Object.entries(condition).every(([key, value]) =>
              Array.isArray(post[key as keyof Post])
                ? (post[key as keyof Post] as string[]).includes(value)
                : post[key as keyof Post] === value,
            ),
          ),
        ),
      )
    }

    if (date) {
      posts = Object.fromEntries(
        Object.entries(posts).sort(([, postA], [, postB]) => {
          const dateA = new Date(postA.date)
          const dateB = new Date(postB.date)
          return date === -1 ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
        }),
      )
    }

    return posts
  }

  async getBlogTags() {
    const tags = [];

    if (this.persistedDataFileDir) {
      const data = JSON.parse(await readFile(this.persistedDataFileDir, 'utf-8'))
      tags.push(...data.tags)
    } else {
      const posts = await scan(`${this.blogSourceDir}/posts`)
      const postsTags = await processTagData(posts, this.blogSourceDir)
      if (this.env.draft) {
        const drafts = await scan(`${this.blogSourceDir}/drafts`)
        const draftsTags = await processTagData(drafts, this.blogSourceDir)
        tags.push(...postsTags, ...draftsTags)
      } else {
        tags.push(...postsTags)
      }
    }

    return tags
  }

  async getBlogCategories() {
    const categories = [];

    if (this.persistedDataFileDir) {
      const data = JSON.parse(await readFile(this.persistedDataFileDir, 'utf-8'))
      categories.push(...data.categories)
    } else {
      const posts = await scan(`${this.blogSourceDir}/posts`)
      const postsCategories = await processCategoryData(posts, this.blogSourceDir)
      if (this.env.draft) {
        const drafts = await scan(`${this.blogSourceDir}/drafts`)
        const draftsCategories = await processCategoryData(drafts, this.blogSourceDir)
        categories.push(...postsCategories, ...draftsCategories)
      } else {
        categories.push(...postsCategories)
      }
    }

    return categories
  }

  async getBlogPost(key: string) {
    let posts: Record<string, Post> = {}

    if (this.persistedDataFileDir) {
      const data = JSON.parse(await readFile(this.persistedDataFileDir, 'utf-8'))
      posts = data.posts
    } else {
      const data = {}
      const posts = await scan(`${this.blogSourceDir}/posts`)
      const postsData = await processPostsData(posts, `${this.blogSourceDir}/posts`, this.env.excerpt)
      if (this.env.draft) {
        const drafts = await scan(`${this.blogSourceDir}/drafts`)
        const draftsData = await processPostsData(drafts, `${this.blogSourceDir}/drafts`, this.env.excerpt)
        Object.assign(data, postsData, draftsData);
      } else {
        Object.assign(data, postsData)
      }
    }

    if (posts[key]) {
      return posts[key]
    } else {
      return null
    }
  }
}

export default Noutious
