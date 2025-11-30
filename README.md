# Noutious

A file-based content manage system, driven by Node.js. This project was inspired by [Hexo](https://github.com/hexojs/hexo) and [Nuxt Content](https://github.com/nuxt/content).

> [!IMPORTANT]
>
> This project is still in development, bugs and mistakes are everywhere. **DO NOT USE IT IN PRODUCTION.**

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

### Query all categories

```typescript
const categories = await noutious.queryCategories();
```

### Query all tags

```typescript
const tags = await noutious.queryTags();
```

### Query specific posts

```typescript
const { post, prev, next } = await noutious.queryPost(
	// query by slug
	'hello-world',
	// sort posts by date, for query previous post and next post.
	{ sort: { date: -1 } }
);
```

## License

[MIT](https://github.com/s-complex/noutious/blob/main/LICENSE)
