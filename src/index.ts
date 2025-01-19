import type { Args, Env, Result } from './types'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join, sep } from 'node:path'
import { consola } from 'consola'
import { processMarkdown } from './processMarkdown'
import { processSinglePostData } from './utils'

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

  getPosts() {
    if (!this.data) {
      consola.warn('Data not loaded. Call loadData() first.')
      return null
    }
    return this.data.posts
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
      return processSinglePostData(this.data.posts[key])
    }
    else {
      return null
    }
  }
}

export default Noutious
