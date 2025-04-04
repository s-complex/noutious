import yaml from 'yaml'

export function parseFrontMatter(markdown: string, excerptMark?: string) {
  const [preText, frontMatter = '', ...postText] = markdown.split('---')
  const attributes = yaml.parse(frontMatter, { logLevel: 'silent' })

  const body = frontMatter ? postText.join('') : preText

  const [excerpt, more] = excerptMark ? pickExcerpt(body, excerptMark) : []

  return {
    attributes,
    excerpt,
    more,
  }
}

export function pickExcerpt(body: string, excerptMark: string) {
  return body.split(excerptMark, 2).map(str => str.trim())
}
