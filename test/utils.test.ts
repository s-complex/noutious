import { describe, expect, it } from 'vitest'
import { scan } from '../src/utils'

describe('markdown File Scanning', () => {
  it('should scan markdown files', async () => {
    expect(await scan('./packages/nuxt/posts')).toStrictEqual(['hello-world.md'])
  })
})
