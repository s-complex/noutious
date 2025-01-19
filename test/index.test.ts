import { stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import Noutious from "../src/index";

const noutious = new Noutious("./test", {});
await noutious.init();

describe("main", () => {
  describe("getSinglePost", () => {
    it("should return single post data", async () => {
      expect(await noutious.getSinglePost("getting-started")).toEqual({
        categories: "guide",
        content:
          "Some ways to use Noutious.\n\n<!--more-->\n\n## Initialize an instance",
        date: new Date("2025-01-10T00:00:00.000Z"),
        excerpt: "",
        frontmatter: {},
        source: "test\\posts\\getting-started.md",
        tags: ["noutious", "guide"],
        title: "Getting started",
        updated: (
          await stat("./test/posts/getting-started.md")
        ).mtime.toISOString(),
      });
    });
  });
});
