# Noutious

A simple file-based content manage system driven by [Node.js](https://nodejs.org).

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

> Note: Custom excerpt mark is still in development.

## License

[MIT](https://github.com/s-complex/noutious/blob/main/LICENSE)
