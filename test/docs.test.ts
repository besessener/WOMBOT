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

describe("documentation", () => {
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
