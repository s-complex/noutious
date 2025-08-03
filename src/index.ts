import { Data, Post, PostsFilterOptions, PostSlim } from './types';
import { filterAndSortEntries } from './utils/sort';

const data: Data = { posts: {}, categories: [], tags: [] };

export function state(_data: Data): void {
	Object.assign(data, _data);
}

export function queryPosts(
	options: PostsFilterOptions = {}
): Record<string, PostSlim> {
	let posts = data.posts;

	const { sort, includes = {} } = options;

	for (const post of Object.values(posts)) {
		post.date = post.date instanceof Date ? post.date : new Date(post.date);
	}

	let entries = Object.entries(posts);

	entries = filterAndSortEntries(entries, includes, sort);

	const slimEntries = entries.map(([slug, post]) => [
		slug,
		{
			title: post.title,
			date: post.date,
			categories: post.categories,
			tags: post.tags,
			frontmatter: post.frontmatter,
			excerpt: post.excerpt,
		} as PostSlim,
	]);

	return Object.fromEntries(slimEntries);
}

export function queryCategories(): string[] {
	return data.categories;
}

export function queryTags(): string[] {
	return data.tags;
}

export function queryPost(
	slug: string,
	options: { sort?: { date?: 1 | -1 } } = {}
): { post?: Post; prev?: Post; next?: Post } {
	let posts = data.posts;
	const { sort = { date: -1 } } = options;

	for (const post of Object.values(posts)) {
		post.date = post.date instanceof Date ? post.date : new Date(post.date);
		post.updated =
			post.updated instanceof Date
				? post.updated
				: new Date(post.updated);
	}

	let entries = Object.entries(posts);
	entries = filterAndSortEntries(entries, {}, sort);

	const idx = entries.findIndex(([key]) => key === slug);

	if (idx === -1) {
		return { post: undefined, prev: undefined, next: undefined };
	}

	const post = entries[idx][1];
	const prev = idx > 0 ? entries[idx - 1][1] : undefined;
	const next = idx < entries.length - 1 ? entries[idx + 1][1] : undefined;

	return { post, prev, next };
}
