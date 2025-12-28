import { persistData } from './persist';
import type { NoutiousConfig, Post, PostsFilterOptions, Surroundings } from './types';
import { writeConfig } from './utils/config';
import { filterAndSortEntries } from './utils/sort';
import { queryData } from './data';
import { consola } from 'consola';

export async function createNoutious(
	config: NoutiousConfig
): Promise<{
	queryPosts: (options?: PostsFilterOptions) => Promise<{ [k: string]: Post }>;
	queryCategories: () => Promise<string[]>;
	queryTags: () => Promise<string[]>;
	queryPost: (slug: string, options?: PostsFilterOptions) => Promise<Post>;
}> {
	writeConfig(config);

	if (config.persist) {
		await persistData.write();
	}

	async function queryPosts(options: PostsFilterOptions = {}) {
		const posts = (await queryData('posts')) as Record<string, Post>;
		const { sort, includes = {} } = options;

		for (const post of Object.values(posts)) {
			post.date = post.date instanceof Date ? post.date : new Date(post.date);
		}

		let entries = Object.entries(posts);
		entries = filterAndSortEntries(entries, includes, sort);

		if (options.limit && options.limit > 0) {
			entries = entries.slice(0, options.limit);
		}

		return Object.fromEntries(entries);
	}

	async function queryCategories(): Promise<string[]> {
		return (await queryData('categories')) as string[];
	}

	async function queryTags(): Promise<string[]> {
		return (await queryData('tags')) as string[];
	}

	async function queryPost(slug: string, options: PostsFilterOptions = {}): Promise<Post> {
		const posts = (await queryData('posts')) as Record<string, Post>;
		const { sort } = options;

		let entries = Object.entries(posts);
		entries = filterAndSortEntries(entries, {}, sort);

		const idx = entries.findIndex(([key]) => key === slug);

		if (idx === -1) {
			consola.error(new Error(`Post with slug "${slug}" not found`));
		}

		const post = entries[idx][1];

		const toSurround = (entry?: [string, Post]): Surroundings | undefined =>
			entry ? { slug: entry[0], title: entry[1].title } : undefined;

		post.surroundings = {
			prev: toSurround(entries[idx - 1]),
			next: toSurround(entries[idx + 1]),
		};

		return post;
	}

	return { queryPosts, queryCategories, queryTags, queryPost };
}
