export interface Config {
	baseDir: string;
	persist?: boolean;
	draft?: boolean;
	excerpt?: string;
}

export interface PostSlim {
	title: string;
	date: Date;
	categories?: string | string[]; // 注意这里是数组类型，跟 Post 中保持一致更好
	tags?: string[];
	frontmatter: Record<string, any>;
	excerpt?: string;
}

export interface Post extends PostSlim {
	source: string;
	updated: Date;
	content: string;
	raw: string;
}

export interface PersistData {
	generator: string;
	posts: Record<string, Post>;
	categories: string[];
	tags: string[];
}

export interface PostsFilterOptions {
	sort?: { date?: 1 | -1 };
	includes?: Record<string, any>;
}
