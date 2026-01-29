import { readFile } from 'node:fs/promises';
import type { Post } from '../types';
import { fmParser } from './fmParser';
import { parse } from 'pathe';
import { formatInTimeZone } from 'date-fns-tz';

export async function transformPosts(
	fileList: string[],
	timeZone: string
): Promise<Record<string, Post>> {
	const posts: Record<string, Post> = {};

	const results = await Promise.all(
		fileList.map(async (path) => {
			const raw = await readFile(path, 'utf-8');
			const { attributes, excerpt, body } = fmParser(raw);
			const { title, date, categories, tags, description, ...frontmatter } = attributes;

			return {
				key: parse(path).name,
				post: {
					title,
					date: formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
					categories,
					tags,
					excerpt: description || excerpt,
					frontmatter,
					content: body,
					raw,
				} as Post,
			};
		})
	);

	for (const { key, post } of results) {
		posts[key] = post;
	}

	return posts;
}

export async function transformTaxonomies(
	fileList: string[]
): Promise<{ categories: string[]; tags: string[] }> {
	const categories = new Set<string>();
	const tags = new Set<string>();
	const datas = await Promise.all(
		fileList.map(async (path) => {
			const raw = await readFile(path, 'utf-8');
			const { attributes } = fmParser(raw);
			return attributes as any;
		})
	);

	for (const data of datas) {
		const catList = [].concat(data.categories || []);
		const tagList = [].concat(data.tags || []);

		catList.forEach((c: string) => categories.add(c));
		tagList.forEach((t: string) => tags.add(t));
	}

	return { categories: Array.from(categories), tags: Array.from(tags) };
}
