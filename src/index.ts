import type { Env, Result } from "./types";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, sep } from "node:path";
import { consola } from "consola";
import { processMarkdown } from "./processMarkdown";

class Localify {
  private baseDir: string;
  private sourceDir: string;
  private env: Env;
  private data: Result | null;
  constructor(base_dir: string, env: Env) {
    if (!base_dir) {
      consola.error(new Error("base_dir is required."));
    }
    this.baseDir = base_dir + sep;
    this.sourceDir = join(base_dir, "posts") + sep;
    this.env = {
      localDb: env.localDb || false,
      draft: env.localDb || false,
      excerpt: env.localDb || false,
    };
    this.data = null;
  }

  async init() {
    try {
      if (this.env.localDb) {
        const dbFilePath = join(this.baseDir, "db.json");
        consola.log(dbFilePath)
        try {
          if (!existsSync(dbFilePath)) {
            this.data = await processMarkdown(this.sourceDir);
            writeFileSync(dbFilePath, JSON.stringify(this.data));
          }
          const dbData = readFileSync(dbFilePath, "utf-8");
          this.data = JSON.parse(dbData);
        } catch (e) {
          consola.error(e);
        }
      } else {
        this.data = await processMarkdown(this.sourceDir);
      }
    } catch (e) {
      consola.error("Error initlializing data:", e);
    }
  }

  getPosts() {
    if (!this.data) {
      consola.warn("Data not loaded. Call loadData() first.");
      return null;
    }
    return this.data.posts;
  }

  getTags() {
    if (!this.data) {
      consola.warn("Data not loaded. Call loadData() first.");
      return null;
    }
    return this.data.tag;
  }

  getCategories() {
    if (!this.data) {
      consola.warn("Data not loaded. Call loadData() first.");
      return null;
    }
    return this.data.category;
  }
}

export default Localify;
