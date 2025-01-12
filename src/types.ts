export interface Post {
  source: string;
  raw: string;
  frontmatter: Record<string, any>;
  key: string;
  content: string;
  date: Date | string;
  updated: Date | string;
  title: string;
  excerpt: string;
}

export interface Result {
  generator: string;
  posts: Record<string, Post>;
  tag: Record<string, string[]>;
  category: Record<string, string[]>;
}

export interface Env {
  localDb: boolean;
  draft: boolean;
  excerpt: boolean | string;
}
