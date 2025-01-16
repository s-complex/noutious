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
