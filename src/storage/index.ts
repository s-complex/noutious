import { createStorage, Storage, StorageValue } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs';

export function useStorage(baseDir: string): Storage<StorageValue> {
	const storage = createStorage({ driver: fsDriver({ base: `${baseDir}/data` }) });
	return storage;
}
