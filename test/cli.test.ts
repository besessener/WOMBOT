import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { root } from "./repository.ts";

function run(script: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("command line", () => {
  it("npm run validate checks this repository and exits 0", () => {
    assert.deepEqual(run("src/cli/validate.ts"), {
      status: 0,
      stdout: "appPackage: valid and within policy\n",
      stderr: "",
    });
  });

  it("npm run env:init reports each env file and exits 0", () => {
    const { status, stdout, stderr } = run("src/cli/env-init.ts");
    assert.equal(status, 0);
    assert.equal(stderr, "");
    assert.match(stdout, /^env\/\.env\.dev: (exists, left as is|created from env\/\.env\.dev\.example)$/m);
    assert.match(stdout, /^env\/\.env\.local: (exists, left as is|created from env\/\.env\.local\.example)$/m);
  });
});
