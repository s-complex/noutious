import type { GetPostsOptions, Options, Post } from './types'
import { readFile, stat, unlink } from 'node:fs/promises'
import { consola } from 'consola'
import { persistData } from './persistData'
import { processBlogCategoriesData, processBlogPostsData, processBlogTagsData } from './processData'

export async function createNoutious(baseDir: string, options: Options) {
  const { persist = false, draft = false, excerptMark = '<!-- more -->' } = options

  const persistDataFileDir = `${baseDir}/data.json`
  if (persist) {
    try {
      await persistData(baseDir, draft, excerptMark)
    }
    catch (e) {
      consola.error(new Error(e as string))
    }
  }
  else {
    try {
      if (await stat(persistDataFileDir)) {
        await unlink(persistDataFileDir)
      }
    }
    catch (e) {
      consola.error(new Error(`Error when deleting persist data file: ${e}`))
    }
  }

  async function fetchBlogPosts(options: GetPostsOptions = {}): Promise<Record<string, Post> | null> {
    const { include, date } = options
    let posts: Record<string, Post> = {}

    try {
      const data: { posts: Record<string, Post> } = JSON.parse(await readFile(persistDataFileDir, 'utf-8'))
      posts = data.posts
    }
    catch {
      try {
        const data = await processBlogPostsData(baseDir, draft, excerptMark)
        posts = data
      }
      catch (e) {
        consola.error(new Error(`Error when fetching raw blog posts data: ${e}`))
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

  async function fetchBlogCategories() {
    return await processBlogCategoriesData(baseDir, draft)
  }

  async function fetchBlogTags() {
    return await processBlogTagsData(baseDir, draft)
  }

  return {
    fetchBlogPosts,
    fetchBlogCategories,
    fetchBlogTags,
  }
}
