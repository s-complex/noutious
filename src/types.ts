export interface PostSlim {
	title: string;
	date: Date;
	categories?: string | string[];
	tags?: string[];
	frontmatter: Record<string, any>;
	excerpt?: string;
}

export interface PostsFilterOptions {
	sort?: { date?: 1 | -1 };
	includes?: Record<string, any>;
}

export interface Post extends PostSlim {
	source: string;
	updated: Date;
	content: string;
	raw: string;
}

export interface Data {
	posts: Record<string, Post>;
	categories: string[];
	tags: string[];
}

export interface Config {
	baseDir: string;
	persist?: boolean;
	draft?: boolean;
	excerpt?: string;
}
