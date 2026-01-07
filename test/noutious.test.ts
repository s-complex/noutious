import { describe, test, expect } from 'vitest';

import { readFile } from 'node:fs/promises';
import { createNoutious } from '../src/index';
import type { NoutiousConfig } from '../src/types';
import pkg from '../package.json';

const fixtureDir = './test/fixture';
const noutiousConfig: NoutiousConfig = { baseDir: fixtureDir, timeZone: 'Asia/Shanghai' };

describe('noutious', () => {
	test('query posts', async () => {
		const noutious = await createNoutious({ ...noutiousConfig });
		const posts = await noutious.queryPosts();
		expect(posts).toEqual({
			'hello-world': {
				source: 'D:/Projects/app/noutious/test/fixture/blog/posts/hello-world.md',
				title: 'Hello World',
				date: '2025-12-25T15:27:36+08:00',
				categories: 'Default',
				tags: 'Hello',
				excerpt: 'This is post excerpt.',
				frontmatter: {},
				content: '\nThis is post excerpt.\n\n\n\n...and the next is post content.\n',
				raw:
					'---\n' +
					'title: Hello World\n' +
					'date: 2025-12-25 15:27:36\n' +
					'categories: Default\n' +
					'tags: Hello\n' +
					'---\n' +
					'\n' +
					'This is post excerpt.\n' +
					'\n' +
					'<!-- more -->\n' +
					'\n' +
					'...and the next is post content.\n',
			},
		});
	});

	test('query categories', async () => {
		const noutious = await createNoutious({ ...noutiousConfig });
		const categories = await noutious.queryCategories();
		expect(categories).toEqual(['Default']);
	});

	test('query tags', async () => {
		const noutious = await createNoutious({ ...noutiousConfig });
		const tags = await noutious.queryTags();
		expect(tags).toEqual(['Hello']);
	});

	test('show drafts', async () => {
		const noutious = await createNoutious({ ...noutiousConfig, draft: true });
		const post = await noutious.queryPost('test');
		expect(post).toEqual({
			source: 'D:/Projects/app/noutious/test/fixture/blog/drafts/test.md',
			title: 'Test Post',
			date: '2025-12-25T15:31:17+08:00',
			categories: undefined,
			tags: undefined,
			excerpt: 'You can only see this post when draft mode is on.',
			frontmatter: {},
			content: '\n' + 'You can only see this post when draft mode is on.\n',
			raw:
				'---\n' +
				'title: Test Post\n' +
				'date: 2025-12-25 15:31:17\n' +
				'---\n' +
				'\n' +
				'You can only see this post when draft mode is on.\n',
			surroundings: { prev: undefined, next: { slug: 'hello-world', title: 'Hello World' } },
		});
	});

	test('generate persist data', async () => {
		await createNoutious({ ...noutiousConfig, persist: true });
		const persistData = await readFile(`${fixtureDir}/data.json`, 'utf-8');
		expect(JSON.parse(persistData)).toEqual({
			generator: `${pkg.name} v${pkg.version}`,
			posts: {
				'hello-world': {
					source: 'D:/Projects/app/noutious/test/fixture/blog/posts/hello-world.md',
					title: 'Hello World',
					date: '2025-12-25T15:27:36+08:00',
					categories: 'Default',
					tags: 'Hello',
					excerpt: 'This is post excerpt.',
					frontmatter: {},
					content: '\nThis is post excerpt.\n\n\n\n...and the next is post content.\n',
					raw:
						'---\n' +
						'title: Hello World\n' +
						'date: 2025-12-25 15:27:36\n' +
						'categories: Default\n' +
						'tags: Hello\n' +
						'---\n' +
						'\n' +
						'This is post excerpt.\n' +
						'\n' +
						'<!-- more -->\n' +
						'\n' +
						'...and the next is post content.\n',
				},
			},
			categories: ['Default'],
			tags: ['Hello'],
		});
	});
});
