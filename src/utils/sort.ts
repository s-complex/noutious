import type { Post } from '../types';

function getNestedValue(obj: any, path: string): any {
	return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function filterAndSortEntries(
	entries: [string, Post][],
	includes: Record<string, any> = {},
	sort?: { date?: 1 | -1 }
): [string, Post][] {
	let filtered = entries.filter(([_, post]) => {
		for (const [key, expected] of Object.entries(includes)) {
			const value = getNestedValue(post, key);
			if (Array.isArray(value)) {
				if (!value.includes(expected)) return false;
			} else {
				if (value !== expected) return false;
			}
		}
		return true;
	});

	if (sort?.date) {
		const timeOf = (p: Post) => new Date(p.date as string).getTime();

		filtered.sort(([, a], [, b]) =>
			sort.date === 1 ? timeOf(a) - timeOf(b) : timeOf(b) - timeOf(a)
		);
	}

	return filtered;
}
