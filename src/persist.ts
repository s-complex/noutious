import { scan } from './utils/scan';
import { readConfig } from './utils/config';
import { transformPosts, transformTaxonomies } from './utils/transform';
import type { Data } from './types';
import pkg from '../package.json';
import { readFile, writeFile } from 'node:fs/promises';

export const persistData = {
	async write(): Promise<void> {
		const config = readConfig();
		const fileList = await scan();

		const timeZone =
			config.timeZone && config.timeZone.trim() ? config.timeZone : 'Asia/Shanghai';

		const [posts, { categories, tags }] = await Promise.all([
			transformPosts(fileList, timeZone),
			transformTaxonomies(fileList),
		]);
		const result: Data = { generator: `${pkg.name} v${pkg.version}`, posts, categories, tags };

		await writeFile(`${config.baseDir}/data.json`, JSON.stringify(result, null, 2));
	},

	async read(): Promise<Data | undefined> {
		const config = readConfig();
		const dataFilePath = `${config.baseDir}/data.json`;

		if (!config.persist) {
			return undefined;
		}

		try {
			const raw = await readFile(dataFilePath, 'utf-8');
			return JSON.parse(raw) as Data;
		} catch {
			return undefined;
		}
	},
};
