import type { Post } from "./types";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { glob } from "tinyglobby";

export async function scan(path: string) {
  const pattern = ["**/*.md"];
  const ignore = ["**/*.d.ts"];

  return await glob(pattern, {
    cwd: path,
    ignore,
  });
}

export async function processPostsData(
  markdownFiles: string[],
  basePath: string
) {
  const posts: Post[] = [];
  for (const file of markdownFiles) {
    const filePath = path.join(basePath, file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data: frontmatterData, content } = matter(fileContent);
    const key = `localify:${file}`;
    const post: Post = {
      source: filePath,
      raw: fileContent,
      frontmatter: frontmatterData,
      key,
      content,
      date: frontmatterData.date || new Date().toISOString(),
      updated: (await fs.stat(filePath)).mtime,
      title: frontmatterData.title || "",
      excerpt: frontmatterData.excerpt || "",
    };
    posts.push(post);
  }
  return posts;
}

export async function processTagData(markdownFiles: string[], basePath: string) {
  const tags: Record<string, string[]> = {};
  for (const file of markdownFiles) {
    const filePath = path.join(basePath, file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data: frontmatterData } = matter(fileContent);
    if (frontmatterData.tags && Array.isArray(frontmatterData.tags)) {
      frontmatterData.tags.forEach((tag) => {
        if (tags[tag]) {
          tags[tag].push(filePath);
        } else {
          tags[tag] = [filePath];
        }
      });
    }
  }
  return tags;
}

export async function processCategoryData(markdownFiles: string[], basePath: string) {
  const categories: Record<string, string[]> = {};
  for (const file of markdownFiles) {
    const filePath = path.join(basePath, file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data: frontmatterData } = matter(fileContent);
    if (frontmatterData.category && Array.isArray(frontmatterData.category)) {
      frontmatterData.category.forEach((category) => {
        if (categories[category]) {
          categories[category].push(filePath);
        } else {
          categories[category] = [filePath];
        }
      });
    }
  }
  return categories;
}
