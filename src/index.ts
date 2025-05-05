import type { GetPostsOptions, Options, Post } from './types';
import { readFile, stat, unlink } from 'node:fs/promises';
import { consola } from 'consola';
import { useStorage } from './storage';
import { normalize } from 'pathe';
import { glob } from 'tinyglobby'
import { processBlogPostsData, processBlogCategoriesData, processBlogTagsData } from './utils/processData';

export async function createNoutious(baseDir: string, options: Options): Promise<{
	queryBlogPosts: () => Promise<Record<string, Post> | null>;
	queryBlogCategories: () => Promise<string[] | null>;
	queryBlogTags: () => Promise<string[] | null>;
}> {
	const { draft = false, excerptMark = '<!-- more -->' } = options

	try {
		baseDir = normalize(baseDir)
		const filesToScan = [`${baseDir}/blog/posts/**/*.md`]
		if (draft) {
			filesToScan.push(`${baseDir}/blog/drafts/**/*.md`)
		}
		const fileList = await glob(filesToScan, {
			absolute: true,
		})
		await processBlogPostsData(fileList, baseDir, excerptMark)
		await processBlogCategoriesData(fileList, baseDir)
		await processBlogTagsData(fileList, baseDir)
	} catch (e) {
		consola.error(new Error(`Error when processing data: ${e}`))
	}

	async function queryBlogPosts(): Promise<Record<string, Post> | null> {
		const posts = useStorage(baseDir).getItemRaw<Record<string, Post>>('posts')

		return posts
	}

	async function queryBlogCategories() {
		return useStorage(baseDir).getItemRaw<string[]>('categories')
	}

	async function queryBlogTags() {
		return useStorage(baseDir).getItemRaw<string[]>('tags')
	}

	return {
		queryBlogPosts,
		queryBlogCategories,
		queryBlogTags
	}
}