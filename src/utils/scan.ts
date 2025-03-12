import { glob } from 'tinyglobby'

export async function scan(path: string) {
  const pattern = ['**/*.md']

  return await glob(pattern, {
    cwd: path
  })
}
