import { defineBuildConfig } from 'obuild/config';

export default defineBuildConfig({
	entries: [
		{
			type: 'bundle',
			input: './src/index.ts',
			minify: true,
			rolldown: {
				external: ['consola', 'gray-matter', 'tinyglobby', 'pathe'],
			},
		},
	],
});
