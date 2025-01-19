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

## License

[MIT](https://github.com/s-complex/noutious/blob/main/LICENSE)
