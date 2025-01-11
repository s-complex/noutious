import { scan } from '../src/scan'

it('test scan markdown files', async () => {
  expect(await scan('./packages/nuxt/posts'))
    .toStrictEqual(['hello-world.md'])
})
