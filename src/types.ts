interface Post {
  source: string
  title: string
  date: Date | string
  updated: Date | string
  categories: string
  tags: string | string[]
  frontmatter: {
    [key: string]: any
  }
  excerpt: string
  content?: string
}

interface Result {
  generator: string
  posts: Record<string, Post>
  tag: string[]
  category: string[]
}

interface Args {
  localDb?: boolean
  draft?: boolean
  excerpt?: string
}

interface Env {
  args: Args
  localDb: boolean
  draft: boolean
  excerpt: string
}

interface GetPostsOptions {
  date?: -1 | 1
  include?: Array<Record<string, string>>
}

export type {
  Args,
  Env,
  GetPostsOptions,
  Post,
  Result,
}
