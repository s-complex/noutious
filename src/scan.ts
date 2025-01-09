import { globSync } from "tinyglobby";

export function scanMarkdownSync(directory: string): string[] {
    const pattern = ['**/*.md'];
    const ignore = ['**/*.d.ts'];

    return globSync(pattern, { cwd: directory, ignore })
}