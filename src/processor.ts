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

function debounceFn<T extends (...args: any[]) => void>(fn: T, delay = 300) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

export async function processor(config: Config): Promise<void> {
    await processData(config);

    if (process.env.NODE_ENV === 'development') {
        const watcher = chokidar.watch('blog', {
            cwd: config.baseDir,
            ignoreInitial: true,
        });

        const debouncedProcess = debounceFn(() => {
            consola.info('Detected changes, re-processing data...');
            processData(config).catch((err) =>
                consola.error('Error during re-processing:', err)
            );
        }, 500);

        watcher
            .on('add', () => {
                debouncedProcess();
            })
            .on('change', () => {
                debouncedProcess();
            })
            .on('unlink', () => {
                debouncedProcess();
            });

        consola.info('Start watching for changes...');
    }
}