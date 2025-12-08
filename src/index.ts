import { glob } from 'tinyglobby';
import { persistData } from './persist';
import { NoutiousConfig, Post, PostsFilterOptions, Surroundings } from './types';
import { writeConfig } from './utils/config';
import { transformPosts, transformTaxonomies } from './utils/transform';
import { filterAndSortEntries } from './utils/sort';

export async function createNoutious(
	config: NoutiousConfig
): Promise<{
	queryPosts: (options?: PostsFilterOptions) => Promise<any>;
	queryCategories: () => Promise<string[]>;
	queryTags: () => Promise<string[]>;
	queryPost: (slug: string, options?: { sort?: { date?: 1 | -1 } }) => Promise<Post>;
}> {
	writeConfig(config);
	let fileList: string[];

	if (config.persist) {
		await persistData.write();
	} else {
		const filesToScan = [`${config.baseDir}/blog/posts`];
		if (config.draft) {
			filesToScan.push(`${config.baseDir}/blog/drafts`);
		}
		fileList = await glob(filesToScan, { absolute: true });
	}

	async function queryPosts(options: PostsFilterOptions = {}) {
		const data = await persistData.read();
		let posts = data?.posts ?? (await transformPosts(fileList));
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
		const data = await persistData.read();
		let categories = data?.categories ?? (await transformTaxonomies(fileList)).categories;
		return categories;
	}

	async function queryTags(): Promise<string[]> {
		const data = await persistData.read();
		let tags = data?.tags ?? (await transformTaxonomies(fileList)).tags;
		return tags;
	}

	async function queryPost(
		slug: string,
		options: { sort?: { date?: 1 | -1 } } = {}
	): Promise<Post> {
		const data = await persistData.read();
		let posts = data?.posts ?? (await transformPosts(fileList));
		const { sort = { date: -1 } } = options;

		let entries = Object.entries(posts);
		entries = filterAndSortEntries(entries, {}, sort);

		const idx = entries.findIndex(([key]) => key === slug);

		if (idx === -1) {
			throw new Error(`Post with slug "${slug}" not found`);
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
