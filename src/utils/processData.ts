import type { Post } from '../types';
import { readFile, stat } from 'node:fs/promises';
import { join, parse } from 'pathe';
import { parseFrontMatter } from './markdown';
import { useStorage } from '../storage';

export async function processBlogPostsData(
    fileList: string[],
    baseDir: string,
    excerptMark: string
): Promise<void> {
    const posts: Record<string, Post> = {}
    for (const file of fileList) {
        const path = join(baseDir, file);
		const content = await readFile(path, 'utf-8');
		const stats = await stat(path);

		const { attributes, excerpt, more } = parseFrontMatter(content, excerptMark);
		const { title, date, categories, tags, ...otherValue } = attributes;

        const post: Post = {
			source: path,
			frontmatter: otherValue,
			date: new Date(date),
			updated: new Date(stats.mtime),
			title,
			excerpt,
			more,
			categories,
			tags,
		};
		const slug = parse(file).name;
		await useStorage(baseDir).setItemRaw(`posts:${slug}`, post)
        posts[slug] = post
    }
    await useStorage(baseDir).setItemRaw('posts:all', posts)
}

// The method of process categories data is same as tags.
// I don't have ideas about merging them into one function.
export async function processBlogCategoriesData(
    fileList: string[],
    baseDir: string,
): Promise<void> {
    const categories: Set<string> = new Set();

	for (const file of fileList) {
		const path = join(baseDir, file);
		const content = await readFile(path, 'utf-8');
		const { attributes } = parseFrontMatter(content);
		if (attributes.categories && Array.isArray(attributes.categories)) {
			attributes.tags.forEach((category: string) => {
				categories.add(category);
			});
		}
	}

    await useStorage(baseDir).setItemRaw('categories', Array.from(categories))
}

export async function processBlogTagsData(
    fileList: string[],
    baseDir: string,
): Promise<void> {
    const tags: Set<string> = new Set();

	for (const file of fileList) {
		const path = join(baseDir, file);
		const content = await readFile(path, 'utf-8');
		const { attributes } = parseFrontMatter(content);
		if (attributes.tags && Array.isArray(attributes.tags)) {
			attributes.tags.forEach((tag: string) => {
				tags.add(tag);
			});
		}
	}

    await useStorage(baseDir).setItemRaw('tags', Array.from(tags))
}