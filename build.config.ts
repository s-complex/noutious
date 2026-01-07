import { defineBuildConfig } from 'obuild/config';

export default defineBuildConfig({
	entries: [
		{
			type: 'bundle',
			input: ['./src/index.ts'],
			minify: true,
			rolldown: { external: ['consola', 'date-fns-tz', 'js-yaml', 'pathe', 'tinyglobby'] },
		},
		{ type: 'bundle', input: './src/types.ts', dts: { emitDtsOnly: true } },
	],
});
