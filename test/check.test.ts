import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { checkRepository } from "../src/check.ts";
import { initEnv } from "../src/cli/env-init.ts";
import { validate } from "../src/cli/validate.ts";
import { captureIo, copyRepository, editJson, root } from "./repository.ts";

describe("checkRepository", () => {
  it("passes for the app package in this repository", () => {
    assert.deepEqual(checkRepository(root), []);
  });

  it("gives the app package the same version as package.json", () => {
    const readVersion = (path: string) =>
      (JSON.parse(readFileSync(join(root, path), "utf8")) as { version: string }).version;
    assert.equal(readVersion("appPackage/manifest.json"), readVersion("package.json"));
  });

  it("reports schema errors with the file and path", () => {
    const copy = copyRepository();
    editJson(join(copy, "appPackage/declarativeAgent.json"), (agent) => {
      agent.conversation_starters = [{ title: "no text" }];
    });
    const problems = checkRepository(copy);
    assert.ok(
      problems.some((problem) => problem.startsWith("declarativeAgent.json/conversation_starters/0")),
      problems.join("\n"),
    );
  });

  it("reports a write capability that the schema accepts but the policy refuses", () => {
    const copy = copyRepository();
    editJson(join(copy, "appPackage/declarativeAgent.json"), (agent) => {
      (agent.capabilities as unknown[]).push({ name: "EmailActions" });
    });
    assert.deepEqual(checkRepository(copy), [
      'declarativeAgent.json: capability "EmailActions" is not allowed; allowed: Email, TeamsMessages, Meetings, People',
    ]);
  });

  it("reports a manifest version without a vendored schema", () => {
    const copy = copyRepository();
    editJson(join(copy, "appPackage/manifest.json"), (manifest) => {
      manifest.manifestVersion = "9.99";
    });
    const problems = checkRepository(copy);
    assert.ok(
      problems.includes(
        "manifest.json: no vendored schema schemas/teams-v9.99.json; see docs/how-to/schema-aktualisieren.md",
      ),
    );
  });

  it("reports an unreadable package instead of throwing", () => {
    const copy = copyRepository();
    rmSync(join(copy, "appPackage/instruction.txt"));
    const problems = checkRepository(copy);
    assert.equal(problems.length, 1);
    assert.match(problems[0] ?? "", /^instruction\.txt: not found/);
  });
});

describe("validate", () => {
  it("returns 0 and says so for a valid package", () => {
    const io = captureIo();
    assert.equal(validate(root, io), 0);
    assert.deepEqual(io.lines, { out: ["appPackage: valid and within policy"], err: [] });
  });

  it("returns 1 and lists every problem", () => {
    const copy = copyRepository();
    editJson(join(copy, "appPackage/declarativeAgent.json"), (agent) => {
      agent.actions = [{ id: "plugin", file: "plugin.json" }];
    });
    const io = captureIo();
    assert.equal(validate(copy, io), 1);
    assert.deepEqual(io.lines.out, []);
    assert.equal(io.lines.err.at(-1), `appPackage: ${io.lines.err.length - 1} problem(s)`);
    assert.ok(io.lines.err.some((line) => line.includes('"actions" is not allowed')));
  });
});

describe("initEnv", () => {
  it("creates missing env files from their examples and never overwrites", () => {
    const copy = copyRepository();
    const dev = join(copy, "env/.env.dev");
    const local = join(copy, "env/.env.local");
    assert.equal(existsSync(dev), false);
    writeFileSync(local, "TEAMS_APP_ID=kept\n");

    const io = captureIo();
    initEnv(copy, io);

    assert.equal(readFileSync(dev, "utf8"), readFileSync(join(copy, "env/.env.dev.example"), "utf8"));
    assert.equal(readFileSync(local, "utf8"), "TEAMS_APP_ID=kept\n");
    assert.deepEqual(io.lines.out, [
      "env/.env.dev: created from env/.env.dev.example",
      "env/.env.local: exists, left as is",
    ]);
  });
});
