export interface NoutiousConfig {
	baseDir: string;
	persist?: boolean;
	draft?: boolean;
	excerpt?: string;
}

export interface Post {
	title: string;
	date: Date;
	categories?: string | string[];
	tags?: string[];
	frontmatter: Record<string, any>;
	excerpt?: string;
	source: string;
	content: string;
	raw: string;
	surroundings?: { prev?: Surroundings; next?: Surroundings };
}

export interface Surroundings {
	slug: string;
	title: string;
}

export interface Data {
	generator: string;
	posts: Record<string, Post>;
	categories: string[];
	tags: string[];
}

export interface PostsFilterOptions {
	sort?: { date?: 1 | -1 };
	includes?: Record<string, any>;
	limit?: number;
}
