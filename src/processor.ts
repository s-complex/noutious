import chokidar from 'chokidar';
import { Config } from './types';
import { glob } from 'tinyglobby';
import { transformPosts, transformTaxonomies } from './utils/transform';
import { Data } from './types';
import { state } from '.';
import { consola } from 'consola';

async function processData(config: Config): Promise<void> {
	const filesToScan = [`${config.baseDir}/blog/posts`];
	if (config.draft) {
		filesToScan.push(`${config.baseDir}/blog/drafts`);
	}
	const fileList = await glob(filesToScan, { absolute: true });
	const posts = await transformPosts(config, fileList);
	const { categories, tags } = await transformTaxonomies(fileList);

	const result: Data = { posts, categories, tags };
	state(result);
}

function debounce(fn: () => void, delay: number) {
	let timer: NodeJS.Timeout | null = null;
	return () => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(fn, delay);
	};
}

export async function processor(config: Config): Promise<void> {
	await processData(config);

	if (process.env.NODE_ENV === 'development') {
		const watcher = chokidar.watch('blog', {
			cwd: config.baseDir,
			ignoreInitial: true,
		});


		const recentPaths = new Set<string>();
		const debouncedProcess = debounce(() => {
			consola.info('Detected changes, re-processing data...');
			processData(config).catch((err) =>
				consola.error('Error during re-processing:', err)
			);
		}, 300);

		const handleChange = (path: string) => {
			if (recentPaths.has(path)) return;

			recentPaths.add(path);
			consola.info(`Change detected on ${path}`);
			debouncedProcess();

			setTimeout(() => {
				recentPaths.delete(path);
			}, 500);
		};

		watcher
			.on('add', handleChange)
			.on('change', handleChange)
			.on('unlink', handleChange);

		consola.info('Start watching for changes...');
	}
}
