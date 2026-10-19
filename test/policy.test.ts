import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AppPackage, JsonObject } from "../src/package/load.ts";
import {
  ALLOWED_CAPABILITIES,
  MAX_INSTRUCTION_LENGTH,
  policyViolations,
  REQUIRED_INSTRUCTION_SECTIONS,
} from "../src/policy/agent-policy.ts";

const instructions = REQUIRED_INSTRUCTION_SECTIONS.join("\n\n");

function compliantAgent(): JsonObject {
  return {
    version: "v1.8",
    name: "WOMBOT",
    description: "test",
    instructions,
    capabilities: ALLOWED_CAPABILITIES.map((name) => ({ name })),
    behavior_overrides: { special_instructions: { discourage_model_knowledge: true } },
  };
}

function appPackage(overrides: { manifest?: JsonObject; agent?: JsonObject; instructions?: string } = {}): AppPackage {
  const agent = overrides.agent ?? compliantAgent();
  return {
    manifest: overrides.manifest ?? {
      manifestVersion: "1.30",
      copilotAgents: { declarativeAgents: [{ id: "declarativeAgent", file: "declarativeAgent.json" }] },
    },
    agents: [{ file: "declarativeAgent.json", agent, instructions: overrides.instructions ?? instructions }],
  };
}

describe("policyViolations", () => {
  it("accepts a read-only agent with the required instruction sections", () => {
    assert.deepEqual(policyViolations(appPackage()), []);
  });

  for (const capability of [
    "EmailActions",
    "MeetingActions",
    "WebSearch",
    "OneDriveAndSharePoint",
    "CodeInterpreter",
  ]) {
    it(`refuses the capability ${capability}`, () => {
      const agent = compliantAgent();
      agent.capabilities = [{ name: "Email" }, { name: capability }];
      const violations = policyViolations(appPackage({ agent }));
      assert.equal(violations.length, 1);
      assert.match(violations[0] ?? "", new RegExp(`capability "${capability}" is not allowed`));
    });
  }

  it("refuses capabilities that are not an array", () => {
    const agent = { ...compliantAgent(), capabilities: { name: "Email" } };
    assert.deepEqual(policyViolations(appPackage({ agent })), ["declarativeAgent.json: capabilities must be an array"]);
  });

  it("accepts an agent without capabilities", () => {
    const { capabilities: _none, ...agent } = compliantAgent();
    assert.deepEqual(policyViolations(appPackage({ agent })), []);
  });

  for (const key of ["actions", "worker_agents", "editorial_answers", "sensitivity_label"]) {
    it(`refuses the agent property ${key}`, () => {
      const agent = { ...compliantAgent(), [key]: [] };
      assert.deepEqual(policyViolations(appPackage({ agent })), [
        `declarativeAgent.json: "${key}" is not allowed (WOMBOT is a read-only declarative agent)`,
      ]);
    });
  }

  for (const key of ["bots", "composeExtensions", "agentConnectors", "webApplicationInfo"]) {
    it(`refuses the manifest property ${key}`, () => {
      const base = appPackage().manifest;
      const violations = policyViolations(appPackage({ manifest: { ...base, [key]: [] } }));
      assert.deepEqual(violations, [
        `manifest.json: "${key}" is not allowed (WOMBOT is a read-only declarative agent)`,
      ]);
    });
  }

  it("refuses API plugins and custom engine agents next to the declarative agent", () => {
    const manifest = {
      copilotAgents: { declarativeAgents: [], plugins: [], customEngineAgents: [] },
    };
    const violations = policyViolations(appPackage({ manifest }));
    assert.ok(violations.some((violation) => violation.includes('"plugins" is not allowed')));
    assert.ok(violations.some((violation) => violation.includes('"customEngineAgents" is not allowed')));
  });

  it("refuses a package without exactly one declarative agent", () => {
    const empty: AppPackage = { manifest: { copilotAgents: { declarativeAgents: [] } }, agents: [] };
    assert.deepEqual(policyViolations(empty), ["manifest.json: expected exactly one declarative agent, found 0"]);
    const missing: AppPackage = { manifest: {}, agents: [] };
    assert.deepEqual(policyViolations(missing), ["manifest.json: expected exactly one declarative agent, found 0"]);
  });

  it("requires grounding in the configured sources only", () => {
    for (const behavior_overrides of [undefined, {}, { special_instructions: { discourage_model_knowledge: false } }]) {
      const agent = { ...compliantAgent(), behavior_overrides };
      assert.deepEqual(policyViolations(appPackage({ agent })), [
        "declarativeAgent.json: behavior_overrides.special_instructions.discourage_model_knowledge must be true",
      ]);
    }
  });

  it("refuses instructions over Microsoft's limit", () => {
    const long = instructions + "x".repeat(MAX_INSTRUCTION_LENGTH);
    const violations = policyViolations(appPackage({ instructions: long }));
    assert.deepEqual(violations, [
      `declarativeAgent.json: instructions have ${long.length} characters, the limit is ${MAX_INSTRUCTION_LENGTH}`,
    ]);
  });

  it("accepts instructions of exactly the limit", () => {
    const exact = instructions.padEnd(MAX_INSTRUCTION_LENGTH, "x");
    assert.deepEqual(policyViolations(appPackage({ instructions: exact })), []);
  });

  it("names every hard-rule section missing from the instructions", () => {
    const violations = policyViolations(appPackage({ instructions: "## Read-only" }));
    assert.deepEqual(
      violations,
      REQUIRED_INSTRUCTION_SECTIONS.filter((section) => section !== "## Read-only").map(
        (section) => `declarativeAgent.json: instructions lack the section "${section}"`,
      ),
    );
  });
});
