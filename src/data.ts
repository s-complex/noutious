import { readFile } from 'node:fs/promises';
import { readConfig } from './utils/config';
import { transformPosts, transformTaxonomies } from './utils/transform';
import { existsSync } from 'node:fs';
import type { Data, Post } from './types';

const DATA_PATH = `${readConfig().baseDir}/data.json`;

export async function queryData(
	queryType: 'posts' | 'categories' | 'tags',
	fileList: string[]
): Promise<Record<string, Post> | string[]> {
	const isPersistDataExists = existsSync(DATA_PATH);
	let persistData: Data | null = null;

	if (isPersistDataExists) {
		try {
			const persistDataRaw = await readFile(DATA_PATH, 'utf-8');
			persistData = JSON.parse(persistDataRaw);
		} catch {
			persistData = null;
		}
	}

	const taxonomies = transformTaxonomies(fileList);

	switch (queryType) {
		case 'posts': {
			if (persistData && persistData.posts && Object.keys(persistData.posts).length > 0) {
				return persistData.posts;
			}

			return await transformPosts(fileList);
		}

		case 'categories': {
			if (
				persistData &&
				Array.isArray(persistData.categories) &&
				persistData.categories.length > 0
			) {
				return persistData.categories;
			}

			return (await taxonomies).categories;
		}

		case 'tags': {
			if (persistData && Array.isArray(persistData.tags) && persistData.tags.length > 0) {
				return persistData.tags;
			}

			return (await taxonomies).tags;
		}
	}
}
