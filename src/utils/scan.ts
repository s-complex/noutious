import { glob } from 'tinyglobby';
import { processConfig } from './config';

export async function scan(): Promise<string[]> {
	const config = processConfig();

	const filesToScan = [`${config.baseDir}/blog/posts`];
	if (config.draft) {
		filesToScan.push(`${config.baseDir}/blog/drafts`);
	}
	return await glob(filesToScan, { absolute: true });
}
