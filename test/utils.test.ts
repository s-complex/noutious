import { scan } from '../src/utils'

it('test scan markdown files', async () => {
  expect(await scan('./packages/nuxt/posts'))
    .toStrictEqual(['hello-world.md'])
})
