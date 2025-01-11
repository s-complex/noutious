import { join, sep } from 'node:path'
import { consola } from 'consola'

interface Env {
  localDb: boolean
  silent: boolean
  draft: boolean
  excerpt: boolean | string

}

class Localify {
  private baseDir: string
  private sourceDir: string
  private env: Env
  constructor(base_dir: string) {
    if (!base_dir) {
      consola.error(new Error('base_dir is required.'))
    }
    this.baseDir = base_dir + sep
    this.sourceDir = join(base_dir, 'sources') + sep
    this.env = {
      localDb: false,
      silent: false,
      draft: false,
      excerpt: false,
    }
  }

  returnMessage() {
    return '1'
  }
}

export default Localify
