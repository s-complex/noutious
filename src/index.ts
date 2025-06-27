import { glob } from 'tinyglobby';
import { persistData } from './persist';
import { Config, Post, PostsFilterOptions, PostSlim } from './types';
import { writeConfig } from './utils/config';
import { transformPosts, transformTaxonomies } from './utils/transform';
import { filterAndSortEntries } from './utils/sort';

export async function createNoutious(
	config: Config
): Promise<{
	queryPosts: (
		options?: PostsFilterOptions
	) => Promise<{ posts: Record<string, PostSlim> }>;
	queryCategories: () => Promise<string[]>;
	queryTags: () => Promise<string[]>;
	queryPost: (
		slug: string,
		options?: { sort?: { date?: 1 | -1 } }
	) => Promise<{ post?: Post; prev?: Post; next?: Post }>;
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

	async function queryPosts(
		options: PostsFilterOptions = {}
	): Promise<{ posts: Record<string, PostSlim> }> {
		const data = await persistData.read();
		let posts = data?.posts ?? (await transformPosts(fileList));
		const { sort, includes = {} } = options;

		for (const post of Object.values(posts)) {
			post.date =
				post.date instanceof Date ? post.date : new Date(post.date);
		}

		let entries = Object.entries(posts);

		entries = filterAndSortEntries(entries, includes, sort);

		const slimEntries = entries.map(([slug, post]) => [
			slug,
			{
				slug,
				title: post.title,
				date: post.date,
				categories: post.categories,
				tags: post.tags,
				frontmatter: post.frontmatter,
				excerpt: post.excerpt,
			} as PostSlim,
		]);

		return { posts: Object.fromEntries(slimEntries) };
	}

	async function queryCategories(): Promise<string[]> {
		const data = await persistData.read();
		let categories =
			data?.categories ??
			(await transformTaxonomies(fileList)).categories;
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
	): Promise<{ post?: Post; prev?: Post; next?: Post }> {
		const data = await persistData.read();
		let posts = data?.posts ?? (await transformPosts(fileList));
		const { sort = { date: -1 } } = options;

		for (const post of Object.values(posts)) {
			post.date =
				post.date instanceof Date ? post.date : new Date(post.date);
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

	return { queryPosts, queryCategories, queryTags, queryPost };
}
