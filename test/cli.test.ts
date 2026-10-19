import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { copyRepository, root } from "./repository.ts";

function run(directory: string, script: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [script], { cwd: directory, encoding: "utf8" });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("command line", () => {
  it("npm run validate checks this repository and exits 0", () => {
    assert.deepEqual(run(root, "src/cli/validate.ts"), {
      status: 0,
      stdout: "appPackage: valid and within policy\n",
      stderr: "",
    });
  });

  it("npm run env:init creates the env files of the repository it lives in and exits 0", () => {
    const copy = copyRepository();
    cpSync(join(root, "src"), join(copy, "src"), { recursive: true });
    cpSync(join(root, "package.json"), join(copy, "package.json"));
    assert.deepEqual(run(copy, "src/cli/env-init.ts"), {
      status: 0,
      stdout: "env/.env.dev: created from env/.env.dev.example\nenv/.env.local: created from env/.env.local.example\n",
      stderr: "",
    });
    assert.ok(existsSync(join(copy, "env/.env.dev")));
  });
});
