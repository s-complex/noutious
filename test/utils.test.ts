import { stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { processPostsData, processTagData, scan } from "../src/utils";

describe("utils", () => {
  describe("scan markdown files", () => {
    it("should scan markdown files", async () => {
      expect(await scan("./test/posts")).toStrictEqual([
        "getting-started.md",
        "hello-world.md",
      ]);
    });
  });

  describe("posts data processing", () => {
    it("should process markdown files", async () => {
      expect(
        await processPostsData(
          ["getting-started.md", "hello-world.md"],
          "./test/posts",
          "<!--more-->"
        )
      ).toStrictEqual({
        "getting-started": {
          title: "Getting started",
          date: new Date("2025-01-10T00:00:00.000Z"),
          source: "test\\posts\\getting-started.md",
          frontmatter: {},
          updated: (
            await stat("./test/posts/getting-started.md")
          ).mtime.toISOString(),
          excerpt: "Some ways to use Noutious.",
          tags: ["noutious", "guide"],
          categories: "guide",
        },
        "hello-world": {
          title: "Hello World",
          date: new Date("2025-01-09T00:00:00.000Z"),
          source: "test\\posts\\hello-world.md",
          frontmatter: {},
          updated: (
            await stat("./test/posts/hello-world.md")
          ).mtime.toISOString(),
          excerpt: "Welcome to use Noutious!",
          tags: "noutious",
          categories: "default",
        },
      });
    });
  });

  describe("processTagData", () => {
    it("should collect and process tag data", async () => {
      expect(await processTagData(["getting-started.md", "hello-world.md"], "./test/posts")).toStrictEqual(["noutious", "guide"]);
    })
  })
});
