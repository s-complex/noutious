export interface Post {
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

export interface Result {
  generator: string
  posts: Record<string, Post>
  tag: string[]
  category: string[]
}

export interface Args {
  localDb?: boolean
  draft?: boolean
  excerpt?: string
}

export interface Env {
  args: Args
  localDb: boolean
  draft: boolean
  excerpt: string
}

export interface GetPostsOptions {
  date?: -1 | 1;
  include?: Array<Record<string, string>>;
}