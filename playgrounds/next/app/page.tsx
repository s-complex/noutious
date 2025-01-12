// eslint-disable-next-line antfu/no-import-dist
import Localify from "../../../dist/index"

async function initLocalify() {
  // eslint-disable-next-line node/prefer-global/process
  const localify = new Localify(process.cwd(), {
    localDb: true,
    draft: true,
    excerpt: ''
  })
  await localify.init();
  return localify
}

export default async function Home() {
  const localify = await initLocalify();
  const posts = localify.getPosts();
  return posts
}