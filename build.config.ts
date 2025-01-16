import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index.ts'],
  outDir: 'dist',
  declaration: true,
  externals: ['tinyglobby', 'fdir', 'picomatch'],
  minify: true
})
