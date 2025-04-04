# Noutious

A simple file-based content manage system driven by [Node.js](https://nodejs.org), inspired by [Hexo](https://hexo.io) and its core [Warehouse](https://github.com/hexojs/warehouse).

> Note: This project is still under development.

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
import Noutious from 'noutious'

function initNoutious() {
  const noutious = new Noutious({
    localDb: process.env.NODE_ENV === 'production',
    draft: false,
    excerpt: ''
  })
  return noutious
}
```

## API

### `getBlogPosts()`

```js
// Get all posts data or specific posts data
const posts = await noutious.getPosts({
  date: -1, // Sort result by date
  include: [{ tags: 'Noutious' }] // Filter result by specific value
})
```

### `getBlogCategories()`

```js
// Get all categories
const categories = await noutious.getCategories()
```

### `getBlogTags()`

```js
// Get all tags
const tags = await noutious.getTags()
```

### `getBlogPost()`

```js
// Find post by its slug
const post = await noutious.getPost('hello-world')
```

### `persistData()`

```js
// Pre-generate all data and write into local file.
await noutious.persistData()
```

## License

[MIT](https://github.com/s-complex/noutious/blob/main/LICENSE)
