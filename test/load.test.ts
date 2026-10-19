import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadAppPackage } from "../src/package/load.ts";
import { PackageError } from "../src/package/package-error.ts";
import { fillPlaceholders, VALIDATION_VALUES } from "../src/package/placeholders.ts";

function packageDirectory(files: Record<string, string>): string {
  const directory = mkdtempSync(join(tmpdir(), "wombot-load-"));
  for (const [name, content] of Object.entries(files)) writeFileSync(join(directory, name), content);
  return directory;
}

const manifest = JSON.stringify({
  id: "${{TEAMS_APP_ID}}",
  copilotAgents: { declarativeAgents: [{ id: "declarativeAgent", file: "agent.json" }] },
});

describe("fillPlaceholders", () => {
  it("replaces every known placeholder", () => {
    assert.equal(fillPlaceholders("${{A}}-${{B}}-${{A}}", { A: "1", B: "2" }, "x.json"), "1-2-1");
  });

  it("refuses an unknown placeholder and names the file", () => {
    assert.throws(
      () => fillPlaceholders("WOMBOT${{APP_NAME_SUFIX}}", VALIDATION_VALUES, "manifest.json"),
      new PackageError("manifest.json: unknown placeholder ${{APP_NAME_SUFIX}}"),
    );
  });
});

describe("loadAppPackage", () => {
  it("fills placeholders and resolves the instructions file", () => {
    const directory = packageDirectory({
      "manifest.json": manifest,
      "agent.json": JSON.stringify({ name: "W${{APP_NAME_SUFFIX}}", instructions: "$[file('rules.txt')]" }),
      "rules.txt": "Be brief.",
    });
    const loaded = loadAppPackage(directory, VALIDATION_VALUES);
    assert.equal(loaded.manifest.id, VALIDATION_VALUES.TEAMS_APP_ID);
    assert.deepEqual(loaded.agents, [
      { file: "agent.json", agent: { name: "Wlocal", instructions: "Be brief." }, instructions: "Be brief." },
    ]);
  });

  it("keeps inline instructions", () => {
    const directory = packageDirectory({
      "manifest.json": manifest,
      "agent.json": JSON.stringify({ instructions: "Inline." }),
    });
    assert.equal(loadAppPackage(directory, VALIDATION_VALUES).agents[0]?.instructions, "Inline.");
  });

  it("returns no agents and no languages when the manifest declares none", () => {
    const directory = packageDirectory({ "manifest.json": "{}" });
    assert.deepEqual(loadAppPackage(directory, VALIDATION_VALUES), { manifest: {}, agents: [], languages: [] });
  });

  it("loads the default language file first, then the additional ones, with placeholders filled", () => {
    const localizationInfo = {
      defaultLanguageTag: "en",
      defaultLanguageFile: "en.json",
      additionalLanguages: [{ languageTag: "de", file: "de.json" }],
    };
    const directory = packageDirectory({
      "manifest.json": JSON.stringify({ localizationInfo }),
      "en.json": JSON.stringify({ "name.short": "W${{APP_NAME_SUFFIX}}" }),
      "de.json": JSON.stringify({ "name.short": "W" }),
    });
    assert.deepEqual(loadAppPackage(directory, VALIDATION_VALUES).languages, [
      { file: "en.json", strings: { "name.short": "Wlocal" } },
      { file: "de.json", strings: { "name.short": "W" } },
    ]);
  });

  it("loads only the default language file without additional languages", () => {
    const directory = packageDirectory({
      "manifest.json": JSON.stringify({ localizationInfo: { defaultLanguageFile: "en.json" } }),
      "en.json": "{}",
    });
    assert.deepEqual(loadAppPackage(directory, VALIDATION_VALUES).languages, [{ file: "en.json", strings: {} }]);
  });

  const broken: [string, Record<string, string>, string][] = [
    ["a missing manifest", {}, "manifest.json: not found"],
    ["invalid JSON", { "manifest.json": "{" }, "manifest.json: not valid JSON"],
    ["a JSON array", { "manifest.json": "[]" }, "manifest.json: must contain a JSON object"],
    ["JSON null", { "manifest.json": "null" }, "manifest.json: must contain a JSON object"],
    [
      "an agent entry without a file",
      { "manifest.json": JSON.stringify({ copilotAgents: { declarativeAgents: [{ id: "a" }] } }) },
      "manifest.json: a declarative agent has no file",
    ],
    [
      "a language without a file",
      { "manifest.json": JSON.stringify({ localizationInfo: { additionalLanguages: [{ languageTag: "de" }] } }) },
      "manifest.json: a language in localizationInfo has no file",
    ],
    [
      "an agent file outside the package",
      { "manifest.json": manifest.replace("agent.json", "../agent.json") },
      "../agent.json: points outside the app package",
    ],
    [
      "instructions that are not a string",
      { "manifest.json": manifest, "agent.json": JSON.stringify({ instructions: 1 }) },
      "agent.json: instructions must be a string",
    ],
    [
      "a missing instructions file",
      { "manifest.json": manifest, "agent.json": JSON.stringify({ instructions: "$[file('gone.txt')]" }) },
      "gone.txt: not found",
    ],
  ];
  for (const [what, files, message] of broken) {
    it(`reports ${what}`, () => {
      const directory = packageDirectory(files);
      assert.throws(
        () => loadAppPackage(directory, VALIDATION_VALUES),
        (error: unknown) => error instanceof PackageError && error.message.startsWith(message),
      );
    });
  }
});
