# Noutious

A file-based content manage system, driven by Node.js. This project was inspired by [Hexo](https://github.com/hexojs/hexo) and [Nuxt Content](https://github.com/nuxt/content).

> [!IMPORTANT]
>
> This project may involve breaking changes, please think **carefully** before using it in production.

## Quick Start

```shell
$ npm install noutious
$ yarn add noutious
$ pnpm add noutious
```

Then create an instance:

```typescript
import { createNoutious } from 'noutious';

const noutious = await createNoutious({
	baseDir: './', // required, where noutious works
	persist: false, // pre-process data at ${baseDir}/data.json and read data from this file
	draft: false, // draft mode
	excerpt: '<!-- more -->', // excerpt mark
	timeZone: 'Asia/Shanghai', // your timezone
});
```

## Usage

### Query all posts

```typescript
const posts = await noutious.queryPosts({
	// options
	sort: { date: -1 }, // sort posts by date, value: 1 | -1
	include: { categories: 'Noutious' }, // filter posts by specific front-matter value
	limit: 5, // limit posts query amount
});
```

Type:

```ts
interface Post {
	title: string;
	date: Date;
	categories?: string | string[];
	tags?: string[];
	frontmatter: Record<string, any>;
	excerpt?: string;
	source: string;
	content: string;
	raw: string;
	surroundings?: { prev?: Surroundings; next?: Surroundings };
}
```

### Query all categories

```typescript
const categories = await noutious.queryCategories();
```

Type: `string | string[]`

### Query all tags

```typescript
const tags = await noutious.queryTags();
```

Type: `string | string[]`

### Query specific posts

```typescript
const post = await noutious.queryPost(
	// query by slug
	'hello-world',
	// sort posts by date, for query previous post and next post.
	{ sort: { date: -1 } }
);
```

Type:

```ts
interface Post {
	title: string;
	date: Date;
	categories?: string | string[];
	tags?: string[];
	frontmatter: Record<string, any>;
	excerpt?: string;
	source: string;
	content: string;
	raw: string;
	surroundings?: { prev?: Surroundings; next?: Surroundings };
}
```

## Local Development

> Consider using the latest or previous version of Node.js.

1. Clone this repo;
2. Install Node.js;
3. Install pnpm (as package manager);
4. Install dependencies (by running `pnpm i`).

## License

[MIT](https://github.com/s-complex/noutious/blob/main/LICENSE)
