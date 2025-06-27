import { glob } from 'tinyglobby';
import { readConfig } from './utils/config';
import { transformPosts, transformTaxonomies } from './utils/transform';
import { PersistData } from './types';
import pkg from '../package.json';
import { readFile, writeFile } from 'fs/promises';
import { consola } from 'consola';

// persist-data.ts
export const persistData = {
	async write(): Promise<void> {
		const config = readConfig();
		const filesToScan = [`${config.baseDir}/blog/posts`];
		if (config.draft) {
			filesToScan.push(`${config.baseDir}/blog/drafts`);
		}
		const fileList = await glob(filesToScan, { absolute: true });
		const posts = await transformPosts(fileList);
		const { categories, tags } = await transformTaxonomies(fileList);

		const result: PersistData = {
			generator: `${pkg.name} v${pkg.version}`,
			posts,
			categories,
			tags,
		};

		await writeFile(
			`${config.baseDir}/data.json`,
			JSON.stringify(result, null, 2)
		);
	},

	async read(): Promise<PersistData | undefined> {
		const config = readConfig();
		const dataFilePath = `${config.baseDir}/data.json`;

		try {
			const raw = await readFile(dataFilePath, 'utf-8');
			return JSON.parse(raw) as PersistData;
		} catch (e) {
			consola.error(new Error(`${e}`));
		}
	},
};
