import { load } from 'js-yaml';
import { readConfig } from './config';

interface FrontMatterResult<T = any> {
	attributes: T;
	excerpt: string;
	body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function fmParser<T = any>(content: string): FrontMatterResult<T> {
	let attributes = {} as T;
	let body = content;

	const config = readConfig();

	const isMatch = content.match(FRONTMATTER_RE);

	if (isMatch) {
		attributes = (load(isMatch[1]) as T) || ({} as T);
		body = content.slice(isMatch[0].length);
	}

	const [excerpt, rest] = body.split(config.excerpt!);

	return { attributes, excerpt: excerpt.trim(), body: rest ? excerpt + rest : body };
}
