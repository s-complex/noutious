import type { Result } from './types';
import { processCategoryData, processPostsData, processTagData, scan } from './utils';

export async function processMarkdown(basePath: string): Promise<Result> {
  const markdownFiles = await scan(basePath);

  const posts = await processPostsData(markdownFiles, basePath);
  const tags = await processTagData(markdownFiles, basePath);
  const categories = await processCategoryData(markdownFiles, basePath);

  const result: Result = {
    generator: "Localify",
    posts: {},
    tag: tags,
    category: categories,
  };

  // 生成 posts 对象
  for (const post of posts) {
    const key = post.key; // 使用之前生成的 key
    result.posts[key] = post;
  }

  return result;
}