import { stat } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import Noutious from '../src/index'

const noutious = new Noutious('./test', {})
await noutious.init()

describe('main', () => {
  describe('getPosts', () => {
    describe('without options', () => {
      it('should return all posts', async () => {
        expect(await noutious.getPosts()).toStrictEqual({
          'getting-started': {
            categories: 'guide',
            date: new Date('2025-01-10T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            more: 'Some ways to use Noutious.\n\n<!--more-->\n\n## Initialize an instance',
            source: 'test/posts/getting-started.md',
            tags: ['noutious', 'guide'],
            title: 'Getting started',
            updated: (
              await stat('./test/posts/getting-started.md')
            ).mtime.toISOString(),
          },
          'hello-world': {
            categories: 'default',
            date: new Date('2025-01-09T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/hello-world.md',
            tags: 'noutious',
            title: 'Hello World',
            updated: (
              await stat('./test/posts/hello-world.md')
            ).mtime.toISOString(),
          },
        })
      })
    })
    describe('with include categories option', () => {
      it('should return filtered posts', async () => {
        expect(
          await noutious.getPosts({ include: [{ categories: 'guide' }] }),
        ).toStrictEqual({
          'getting-started': {
            categories: 'guide',
            date: new Date('2025-01-10T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/getting-started.md',
            tags: ['noutious', 'guide'],
            title: 'Getting started',
            updated: (
              await stat('./test/posts/getting-started.md')
            ).mtime.toISOString(),
          },
        })
      })
    })
    describe('with include tags option', () => {
      it('should return filtered posts', async () => {
        expect(
          await noutious.getPosts({ include: [{ tags: 'noutious' }] }),
        ).toStrictEqual({
          'getting-started': {
            categories: 'guide',
            date: new Date('2025-01-10T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/getting-started.md',
            tags: ['noutious', 'guide'],
            title: 'Getting started',
            updated: (
              await stat('./test/posts/getting-started.md')
            ).mtime.toISOString(),
          },
          'hello-world': {
            categories: 'default',
            date: new Date('2025-01-09T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/hello-world.md',
            tags: 'noutious',
            title: 'Hello World',
            updated: (
              await stat('./test/posts/hello-world.md')
            ).mtime.toISOString(),
          },
        })
      })
    })
    describe('with include categories and tags option', () => {
      it('should return filtered posts', async () => {
        expect(
          await noutious.getPosts({
            include: [{ categories: 'guide' }, { tags: 'noutious' }],
          }),
        ).toStrictEqual({
          'getting-started': {
            categories: 'guide',
            date: new Date('2025-01-10T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/getting-started.md',
            tags: ['noutious', 'guide'],
            title: 'Getting started',
            updated: (
              await stat('./test/posts/getting-started.md')
            ).mtime.toISOString(),
          },
          'hello-world': {
            categories: 'default',
            date: new Date('2025-01-09T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/hello-world.md',
            tags: 'noutious',
            title: 'Hello World',
            updated: (
              await stat('./test/posts/hello-world.md')
            ).mtime.toISOString(),
          },
        })
      })
    })
    describe('with date option', () => {
      it('should return filtered posts', async () => {
        expect(await noutious.getPosts({ date: -1 })).toStrictEqual({
          'getting-started': {
            categories: 'guide',
            date: new Date('2025-01-10T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/getting-started.md',
            tags: ['noutious', 'guide'],
            title: 'Getting started',
            updated: (
              await stat('./test/posts/getting-started.md')
            ).mtime.toISOString(),
          },
          'hello-world': {
            categories: 'default',
            date: new Date('2025-01-09T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/hello-world.md',
            tags: 'noutious',
            title: 'Hello World',
            updated: (
              await stat('./test/posts/hello-world.md')
            ).mtime.toISOString(),
          },
        })
      })
    })
    describe('with date reverse option', () => {
      it('should return filtered posts', async () => {
        expect(await noutious.getPosts({ date: 1 })).toStrictEqual({
          'hello-world': {
            categories: 'default',
            date: new Date('2025-01-09T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/hello-world.md',
            tags: 'noutious',
            title: 'Hello World',
            updated: (
              await stat('./test/posts/hello-world.md')
            ).mtime.toISOString(),
          },
          'getting-started': {
            categories: 'guide',
            date: new Date('2025-01-10T00:00:00.000Z'),
            excerpt: '',
            frontmatter: {},
            source: 'test/posts/getting-started.md',
            tags: ['noutious', 'guide'],
            title: 'Getting started',
            updated: (
              await stat('./test/posts/getting-started.md')
            ).mtime.toISOString(),
          },
        })
      })
    })
  })
  describe('getSinglePost', () => {
    it('should return single post data', async () => {
      expect(await noutious.getSinglePost('getting-started')).toEqual({
        categories: 'guide',
        content: 'Some ways to use Noutious.\n\n<!--more-->\n\n## Initialize an instance',
        date: new Date('2025-01-10T00:00:00.000Z'),
        excerpt: '',
        frontmatter: {},
        source: 'test/posts/getting-started.md',
        tags: ['noutious', 'guide'],
        title: 'Getting started',
        updated: (
          await stat('./test/posts/getting-started.md')
        ).mtime.toISOString(),
      })
    })
  })
})
