import type { Args, Env, GetPostsOptions, Post, Result } from './types'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { consola } from 'consola'
import { join, sep } from 'pathe'
import { processMarkdown } from './processMarkdown'

class Noutious {
  private baseDir: string
  private sourceDir: string
  private env: Env
  private data: Result | null
  constructor(base_dir: string, args: Args) {
    if (!base_dir) {
      consola.error(new Error('base_dir is required.'))
    }
    this.baseDir = base_dir + sep
    this.sourceDir = join(base_dir, 'posts') + sep
    this.env = {
      args,
      localDb: Boolean(args.localDb),
      draft: Boolean(args.draft),
      excerpt: String(args.excerpt) || '<!--more-->',
    }
    this.data = null
  }

  async init() {
    try {
      if (this.env.localDb) {
        const dbFilePath = join(this.baseDir, 'db.json')
        try {
          try {
            if (existsSync(dbFilePath)) {
              unlinkSync(dbFilePath)
            }
            this.data = await processMarkdown(this.sourceDir, this.env.excerpt)
            writeFileSync(dbFilePath, JSON.stringify(this.data))
          }
          catch (e) {
            consola.error(e)
          }
          const dbData = readFileSync(dbFilePath, 'utf-8')
          this.data = JSON.parse(dbData)
        }
        catch (e) {
          consola.error(e)
        }
      }
      else {
        this.data = await processMarkdown(this.sourceDir, this.env.excerpt)
      }
    }
    catch (e) {
      consola.error('Error initlializing data:', e)
    }
  }

  async getPosts(options: GetPostsOptions = {}): Promise<Record<string, Post> | null> {
    const { date, include } = options

    if (!this.data) {
      consola.warn('Data not loaded. Call loadData() first.')
      return null
    }

    let posts: Record<string, Post> = this.data.posts

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

  getTags() {
    if (!this.data) {
      consola.warn('Data not loaded. Call loadData() first.')
      return null
    }
    return this.data.tag
  }

  getCategories() {
    if (!this.data) {
      consola.warn('Data not loaded. Call loadData() first.')
      return null
    }
    return this.data.category
  }

  getSinglePost(key: string) {
    if (!this.data) {
      consola.warn('Data not loaded. Call loadData() first.')
      return null
    }
    if (this.data.posts[key]) {
      return this.data.posts[key]
    }
    else {
      return null
    }
  }
}

export default Noutious
