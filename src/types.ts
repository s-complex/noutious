export interface Post {
	source: string;
	title: string;
	date: Date | string;
	updated: Date | string;
	categories: string;
	tags: string | string[];
	frontmatter: { [key: string]: any };
	excerpt: string;
	content?: string;
	more: string;
}

export interface Result {
	generator: string;
	posts: Record<string, Post>;
	tags: string[];
	categories: string[];
}

export interface Options {
	persist?: boolean;
	draft?: boolean;
	excerptMark?: string;
}

export interface GetPostsOptions {
	date?: -1 | 1;
	include?: Array<Record<string, string>>;
}
