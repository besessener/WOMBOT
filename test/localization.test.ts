import assert from "node:assert/strict";
import { join } from "node:path";
import { describe, it } from "node:test";
import { checkRepository } from "../src/check.ts";
import type { AppPackage, JsonObject } from "../src/package/load.ts";
import { localizationViolations } from "../src/policy/localization.ts";
import { copyRepository, editJson } from "./repository.ts";

function appPackage(agent: JsonObject, languages: Record<string, JsonObject>): AppPackage {
  return {
    manifest: {},
    agents: [{ file: "declarativeAgent.json", agent, instructions: "" }],
    languages: Object.entries(languages).map(([file, localizationKeys]) => ({ file, strings: { localizationKeys } })),
  };
}

const localizedAgent = {
  name: "WOMBOT",
  description: "[[agent_description]]",
  conversation_starters: [{ title: "[[starter_title]]", text: "[[starter_text]]" }],
  instructions: "[[not_a_key_here]]",
};
const complete = { agent_description: "d", starter_title: "t", starter_text: "x" };

describe("localizationViolations", () => {
  it("accepts language files that cover exactly the keys the agent uses", () => {
    assert.deepEqual(
      localizationViolations(appPackage(localizedAgent, { "en.json": complete, "de.json": complete })),
      [],
    );
  });

  it("accepts an agent without keys and without language files", () => {
    assert.deepEqual(localizationViolations(appPackage({ name: "WOMBOT", description: "plain" }, {})), []);
  });

  it("names every key a language file lacks or leaves empty", () => {
    const de = { agent_description: "  ", starter_title: "t" };
    assert.deepEqual(localizationViolations(appPackage(localizedAgent, { "en.json": complete, "de.json": de })), [
      'de.json: no text for "agent_description", which declarativeAgent.json uses',
      'de.json: no text for "starter_text", which declarativeAgent.json uses',
    ]);
  });

  it("names keys no agent uses", () => {
    const en = { ...complete, leftover: "old" };
    assert.deepEqual(localizationViolations(appPackage(localizedAgent, { "en.json": en })), [
      'en.json: "leftover" is not used by any agent',
    ]);
  });

  it("refuses keys that break Microsoft's key pattern", () => {
    const broken = { ...localizedAgent, description: "[[1 bad key]]" };
    const { agent_description: _unused, ...rest } = complete;
    assert.deepEqual(localizationViolations(appPackage(broken, { "en.json": rest })), [
      'declarativeAgent.json: "[[1 bad key]]" is not a valid localization key',
    ]);
  });

  it("requires language files when the agent uses keys", () => {
    assert.deepEqual(localizationViolations(appPackage(localizedAgent, {})), [
      "manifest.json: the agent uses localization keys but localizationInfo lists no language files",
    ]);
  });

  it("treats a language file without localizationKeys as missing every key", () => {
    const pkg: AppPackage = { ...appPackage(localizedAgent, {}), languages: [{ file: "en.json", strings: {} }] };
    assert.equal(localizationViolations(pkg).length, 3);
  });
});

describe("language files in this repository", () => {
  it("are validated against Microsoft's localization schema", () => {
    const copy = copyRepository();
    editJson(join(copy, "appPackage/de.json"), (strings) => {
      strings["description.short"] = "x".repeat(81);
    });
    const problems = checkRepository(copy);
    assert.ok(
      problems.some((problem) => problem.startsWith("de.json/description.short")),
      problems.join("\n"),
    );
  });

  it("must all carry the same keys", () => {
    const copy = copyRepository();
    editJson(join(copy, "appPackage/de.json"), (strings) => {
      const { starter_own_text: _removed, ...keys } = strings.localizationKeys as JsonObject;
      strings.localizationKeys = keys;
    });
    assert.deepEqual(checkRepository(copy), [
      'de.json: no text for "starter_own_text", which declarativeAgent.json uses',
    ]);
  });
});
