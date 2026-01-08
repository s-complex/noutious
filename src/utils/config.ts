import type { NoutiousConfig } from '../types';

let config: NoutiousConfig | undefined;

const defaultConfig: NoutiousConfig = {
	baseDir: './',
	persist: false,
	draft: false,
	excerpt: '<!-- more -->',
	timeZone: 'Asia/Shanghai',
};

export function processConfig(_config?: NoutiousConfig): NoutiousConfig {
	if (_config) config = _config;
	return { ...defaultConfig, ...config };
}
