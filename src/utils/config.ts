import type { NoutiousConfig } from '../types';

let defaultConfig: NoutiousConfig = {
	baseDir: './',
	persist: false,
	draft: false,
	excerpt: '<!-- more -->',
	timeZone: 'Asia/Shanghai',
};

let userConfig: Partial<NoutiousConfig> = {};

export function processConfig(_config?: Partial<NoutiousConfig>): NoutiousConfig {
	if (_config) {
		userConfig = _config;
	}
	return { ...defaultConfig, ...userConfig };
}
