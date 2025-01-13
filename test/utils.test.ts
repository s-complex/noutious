import { describe, expect, it } from 'vitest'
import { processPostsData, scan } from '../src/utils'

describe('markdown File Scanning', () => {
  it('should scan markdown files', async () => {
    expect(await scan('./playgrounds/nuxt/posts')).toStrictEqual([
      'hello-world.md',
    ])
  })
})
