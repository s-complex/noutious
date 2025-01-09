import { consola } from "consola";
import { sep, join } from "path";

interface Env {
    localDb: boolean;
    silent: boolean;
    draft: boolean;
}

class Localify {
    private baseDir: string;
    private sourceDir: string;
    private env: {};
    constructor(base_dir: string) {
        if (!base_dir) {
            consola.error(new Error("base_dir is required."))
        }
        this.baseDir = base_dir + sep;
        this.sourceDir = join(base_dir, "sources") + sep;
        this.env = {
            localDb: false,
            silent: false,
            draft: false
        }
    }
}

declare global {
    const localify: Localify;
}

export default localify;