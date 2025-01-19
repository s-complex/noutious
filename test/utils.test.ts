import { stat } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { processPostsData, scan } from '../src/utils'

describe('markdown File Scanning', () => {
  it('should scan markdown files', async () => {
    expect(await scan('./test/posts')).toStrictEqual([
      'getting-started.md',
      'hello-world.md',
    ])
  })
})

describe('processPostsData', () => {
  it('should process markdown files', async () => {
    expect(
      await processPostsData([
        'getting-started.md',
        'hello-world.md',
      ], './test/posts', '<!--more-->'),
    ).toStrictEqual(
      {
        'getting-started': {
          title: 'Getting started',
          date: new Date('2025-01-10T00:00:00.000Z'),
          source: 'test\\posts\\getting-started.md',
          frontmatter: {},
          updated: (await stat('./test/posts/getting-started.md')).mtime.toISOString(),
          excerpt: 'Some ways to use Noutious.',
          tags: undefined,
          categories: undefined,
        },
        'hello-world': {
          title: 'Hello World',
          date: new Date('2025-01-09T00:00:00.000Z'),
          source: 'test\\posts\\hello-world.md',
          frontmatter: {},
          updated: (await stat('./test/posts/hello-world.md')).mtime.toISOString(),
          excerpt: 'Welcome to use Noutious!',
          tags: undefined,
          categories: undefined,
        },
      },
    )
  })
})
