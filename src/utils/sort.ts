import type { Post } from '../types';

export function getNestedValue(obj: any, path: string): any {
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
		filtered.sort(([, a], [, b]) =>
			sort.date === 1
				? a.date.getTime() - b.date.getTime()
				: b.date.getTime() - a.date.getTime()
		);
	}

	return filtered;
}