import type { NoutiousConfig } from '../types';

let config: NoutiousConfig | undefined;

const defaultConfig: NoutiousConfig = {
	baseDir: './',
	persist: false,
	draft: false,
	excerpt: '<!-- more -->',
	timeZone: 'Asia/Shanghai',
};

export function writeConfig(_config: NoutiousConfig): void {
	config = _config;
}

export function readConfig(): NoutiousConfig {
	return { ...defaultConfig, ...config };
}
