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
import { createNoutious } from 'noutious'

const noutious = await createNoutious({
    baseDir: process.cwd() // required
    persist: false
    draft: false
    excerpt: '<!-- more -->'
})
```

## Usage

### Query all posts

```typescript
const posts = await noutious.queryPosts({
    // options
    sort: { date: -1 } // sort posts by date, value: 1 | -1
    include: { categories: 'Noutious' } // filter posts by specific front-matter value
})
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
	// sort posts by date, but for query previous post and next post.
	{ sort: { date: -1 } }
);
```

## License
