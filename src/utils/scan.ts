import { glob } from 'tinyglobby'

export async function scan(path: string) {
  const pattern = ['**/*.md']
  const ignore = ['**/*.d.ts']

  return await glob(pattern, {
    cwd: path,
    ignore,
  })
}
