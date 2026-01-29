import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

export default defineConfig([
	{
		input: 'src/index.ts',
		external: ['consola', 'date-fns-tz', 'js-yaml', 'pathe', 'tinyglobby'],
		plugins: [dts()],
		output: {
			entryFileNames: '[name].mjs',
			chunkFileNames: '[name]-[hash].mjs',
			minify: true,
			cleanDir: true,
		},
		platform: 'node',
	},
	{
		input: 'src/types.ts',
		plugins: [dts({ emitDtsOnly: true })],
		output: { entryFileNames: '[name].mjs' },
	},
]);
