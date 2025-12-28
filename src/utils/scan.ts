import { glob } from 'tinyglobby';
import { readConfig } from './config';

export async function scan(): Promise<string[]> {
	const config = readConfig();

	const filesToScan = [`${config.baseDir}/blog/posts`];
	if (config.draft) {
		filesToScan.push(`${config.baseDir}/blog/drafts`);
	}
	return await glob(filesToScan, { absolute: true });
}
