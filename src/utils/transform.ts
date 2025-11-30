import { readFile, stat } from 'node:fs/promises';
import type { Post } from '../types';
import matter from 'gray-matter';
import { parse } from 'pathe';
import { readConfig } from './config';

export async function transformPosts(fileList: string[]): Promise<Record<string, Post>> {
	const posts: Record<string, Post> = {};
	const config = readConfig();

	for (const path of fileList) {
		const [raw, stats] = await Promise.all([readFile(path, 'utf-8'), stat(path)]);

		const { content, data } = matter(raw);
		const { title, date, categories, tags, description, updated, ...frontmatter } = data;

		const excerpt = content.includes(config.excerpt!)
			? content.split(config.excerpt!)[0].trim()
			: content.trim();

		posts[parse(path).name] = {
			source: path,
			title,
			date: new Date(date),
			updated: updated || new Date(stats.mtime),
			categories,
			tags,
			excerpt: description || excerpt,
			frontmatter,
			content,
			raw,
		};
	}

	return posts;
}

export async function transformTaxonomies(
	fileList: string[]
): Promise<{ categories: string[]; tags: string[] }> {
	const categories = new Set<string>();
	const tags = new Set<string>();

	for (const path of fileList) {
		const raw = await readFile(path, 'utf-8');
		const { data } = matter(raw);

		const catList = [].concat(data.categories || []);
		const tagList = [].concat(data.tags || []);

		catList.forEach((c: string) => categories.add(c));
		tagList.forEach((t: string) => tags.add(t));
	}
	return { categories: Array.from(categories), tags: Array.from(tags) };
}
