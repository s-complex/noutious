// config.ts
import { Config } from '../types';

let value: Config | undefined;

const defaultConfig: Config = {
	baseDir: process.cwd(),
	persist: false,
	draft: false,
	excerpt: '<!-- more -->',
};

export function writeConfig(config: Config): void {
	value = config;
}

export function readConfig(): Config {
	return { ...defaultConfig, ...value };
}
