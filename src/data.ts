import { transformPosts, transformTaxonomies } from './utils/transform';
import type { Post } from './types';
import { scan } from './utils/scan';
import { persistData } from './persist';

export async function queryData(
	queryType: 'posts' | 'categories' | 'tags'
): Promise<Record<string, Post> | string[]> {
	const persist = await persistData.read()
	const fileList = scan();

	const taxonomies = transformTaxonomies(await fileList);

	switch (queryType) {
		case 'posts': {
			if (persist && persist.posts && Object.keys(persist.posts).length > 0) {
				return persist.posts;
			}

			return await transformPosts(await fileList);
		}

		case 'categories': {
			if (
				persist &&
				Array.isArray(persist.categories) &&
				persist.categories.length > 0
			) {
				return persist.categories;
			}

			return (await taxonomies).categories;
		}

		case 'tags': {
			if (persist && Array.isArray(persist.tags) && persist.tags.length > 0) {
				return persist.tags;
			}

			return (await taxonomies).tags;
		}
	}
}
