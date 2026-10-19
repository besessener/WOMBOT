import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { describe, it } from "node:test";
import { ALLOWED_CAPABILITIES } from "../src/policy/agent-policy.ts";
import { root } from "./repository.ts";

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

function documentationFiles(): string[] {
  return [join(root, "README.md"), join(root, "CONTRIBUTING.md"), ...markdownFiles(join(root, "docs"))];
}

/** GitHub's heading anchors: lower case, punctuation dropped, spaces to hyphens, duplicates numbered. */
function anchors(markdown: string): Set<string> {
  const seen = new Map<string, number>();
  const result = new Set<string>();
  for (const [, heading] of markdown.replace(/```[\s\S]*?```/g, "").matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const slug = (heading ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .replace(/\s/g, "-");
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    result.add(count === 0 ? slug : `${slug}-${count}`);
  }
  return result;
}

/** Why the link `target` in `file` is broken, or undefined when it resolves. External links are not checked. */
function linkProblem(file: string, target: string): string | undefined {
  if (/^[a-z]+:/i.test(target)) return undefined;
  const [pathPart = "", anchor] = target.split("#");
  const path = pathPart === "" ? file : join(dirname(file), decodeURIComponent(pathPart));
  if (!existsSync(path)) return `${relative(root, file)} -> ${target}`;
  if (anchor !== undefined && path.endsWith(".md") && !anchors(readFileSync(path, "utf8")).has(anchor)) {
    return `${relative(root, file)} -> ${target} (no such heading)`;
  }
  return undefined;
}

function brokenLinks(file: string): string[] {
  const text = readFileSync(file, "utf8")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)].flatMap(([, target]) => {
    const problem = target === undefined ? undefined : linkProblem(file, target);
    return problem === undefined ? [] : [problem];
  });
}

/** UTF-8 read as Windows-1252 and saved again: "ü" becomes "Ã¼", "–" becomes "â€“". */
const DOUBLE_ENCODED =
  /\u00c3[\u0080-\u00bf\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u02c6\u02dc\u2013-\u203a\u20ac\u2122]|\u00e2\u20ac|\u00c2[\u00a0-\u00bf]/;

function textFiles(): string[] {
  return [
    ...documentationFiles(),
    join(root, "CLAUDE.md"),
    join(root, "site/index.html"),
    join(root, "appPackage/manifest.json"),
    join(root, "appPackage/declarativeAgent.json"),
    join(root, "appPackage/instruction.txt"),
  ];
}

describe("documentation", () => {
  it("has no double-encoded UTF-8 in the docs, the website or the app package", () => {
    const broken = textFiles().filter((file) => DOUBLE_ENCODED.test(readFileSync(file, "utf8")));
    assert.deepEqual(
      broken.map((file) => relative(root, file)),
      [],
    );
  });

  it("has no broken relative links or anchors", () => {
    assert.deepEqual(documentationFiles().flatMap(brokenLinks), []);
  });

  it("describes every allowed capability in docs/reference/agent-manifest.md", () => {
    const doc = readFileSync(join(root, "docs/reference/agent-manifest.md"), "utf8");
    assert.deepEqual(
      ALLOWED_CAPABILITIES.filter((capability) => !doc.includes(`| \`${capability}\` |`)),
      [],
    );
  });

  it("documents only capabilities that the app package actually declares", () => {
    const agent = JSON.parse(readFileSync(join(root, "appPackage/declarativeAgent.json"), "utf8")) as {
      capabilities: { name: string }[];
    };
    assert.deepEqual(
      agent.capabilities.map((capability) => capability.name),
      [...ALLOWED_CAPABILITIES],
    );
  });
});
