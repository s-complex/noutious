# Noutious

A simple file-based content manage system driven by [Node.js](https://nodejs.org), inspired by [Hexo](https://hexo.io) and its core [Warehouse](https://github.com/hexojs/warehouse).

> Note: This project is still under development. **DO NOT USE THIS PROJECT IN PRODUCTION.**

## Quick Start

```
// npm
$ npm install noutious
// yarn
$ yarn add noutious
// pnpm
$ pnpm add noutious
```

Then import it and initialize an instance.

```js
import { createNoutious } from 'noutious';

const noutious = await createNoutious({
	draft: false, // set to `true` to scan draft posts.
	excerptMark: ''
})
```

## API

### `queryBlogPosts()`

```js
// Get all posts data
const posts = await noutious.queryBlogPosts();
```

### `queryBlogCategories()`

```js
// Get all categories
const posts = await noutious.queryBlogCategories();
```

### `queryBlogTags()`

```js
// Get all tags
const posts = await noutious.queryBlogTags();
```

Other APIs are still waiting for development.

## License

[MIT](https://github.com/s-complex/noutious/blob/main/LICENSE)
