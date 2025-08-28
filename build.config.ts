import { defineBuildConfig } from 'obuild/config';

export default defineBuildConfig({
	entries: [
		{
			type: 'bundle',
			input: ['./src/index.ts', './src/processor.ts'],
			minify: true,
			rolldown: {
				external: [
					'chokidar',
					'consola',
					'gray-matter',
					'pathe',
					'tinyglobby',
				],
			},
		},
		{ type: 'bundle', input: './src/types.ts', dts: { emitDtsOnly: true } },
	],
});
