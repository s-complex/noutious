import type { FrontMatter } from '../types'
import { consola } from 'consola'
import yaml from 'yaml'

function parseFrontMatter(markdown: string) {
    const frontMatterStart = markdown.indexOf('---');
    const frontMatterEnd = markdown.indexOf('---', frontMatterStart + 3);

    let attributes = {} as FrontMatter;
    let body = markdown;

    if (frontMatterStart !== -1 && frontMatterEnd !== -1 && frontMatterEnd > frontMatterStart) {
        const frontMatterContent = markdown.slice(frontMatterStart + 3, frontMatterEnd).trim();
        try {
            attributes = yaml.parse(frontMatterContent);
            body = markdown.slice(frontMatterEnd + 3).trim();
        } catch (e) {
            consola.error(new Error(`Error parsing yaml: ${e}`));
        }
    }

    return {
        attributes,
        body,
    };
}

function pickExcerpt(content: string, excerptMark: string) {
    let excerpt = ''
    const moreIndex = content.indexOf(excerptMark)
    if (moreIndex !== -1) {
        excerpt = content.slice(0, moreIndex).trim()
    }
    return excerpt
}

export { parseFrontMatter, pickExcerpt }