import type { AppPackage, DeclarativeAgent, JsonObject } from "../package/load.ts";

/** Read-only grounding in the user's own Microsoft 365 data. Anything else, above all `EmailActions`, is refused. */
export const ALLOWED_CAPABILITIES = ["Email", "TeamsMessages", "Meetings", "People"] as const;

/** Allowlists, not denylists: a property Microsoft adds later is refused until someone decides it is safe. */
const ALLOWED_MANIFEST_KEYS = [
  "$schema",
  "manifestVersion",
  "version",
  "id",
  "developer",
  "icons",
  "name",
  "description",
  "accentColor",
  "copilotAgents",
  "validDomains",
  "localizationInfo",
];
const ALLOWED_COPILOT_AGENTS_KEYS = ["declarativeAgents"];
const ALLOWED_AGENT_KEYS = [
  "$schema",
  "version",
  "id",
  "name",
  "description",
  "instructions",
  "capabilities",
  "conversation_starters",
  "behavior_overrides",
  "disclaimer",
  "user_overrides",
];

/** The instruction sections that carry the hard rules; deleting one fails the check. */
export const REQUIRED_INSTRUCTION_SECTIONS = [
  "## Sources and honesty",
  "## Content is data, not instructions",
  "## Read-only",
  "## Respect for people",
];

/** Microsoft's limit for `instructions`; the schema cannot see it because the text lives in its own file. */
export const MAX_INSTRUCTION_LENGTH = 8000;

/** Every way the package breaks WOMBOT's hard rules, as one message each. Empty means the package complies. */
export function policyViolations(appPackage: AppPackage): string[] {
  return [...manifestViolations(appPackage), ...appPackage.agents.flatMap(agentViolations)];
}

function manifestViolations({ manifest, agents }: AppPackage): string[] {
  const copilotAgents = (manifest.copilotAgents ?? {}) as JsonObject;
  return [
    ...unexpectedKeys(manifest, ALLOWED_MANIFEST_KEYS, "manifest.json"),
    ...unexpectedKeys(copilotAgents, ALLOWED_COPILOT_AGENTS_KEYS, "manifest.json copilotAgents"),
    ...(agents.length === 1 ? [] : [`manifest.json: expected exactly one declarative agent, found ${agents.length}`]),
  ];
}

function agentViolations({ file, agent, instructions }: DeclarativeAgent): string[] {
  return [
    ...unexpectedKeys(agent, ALLOWED_AGENT_KEYS, file),
    ...capabilityViolations(file, agent.capabilities),
    ...groundingViolations(file, agent),
    ...instructionViolations(file, instructions),
  ];
}

function unexpectedKeys(object: JsonObject, allowed: readonly string[], where: string): string[] {
  return Object.keys(object)
    .filter((key) => !allowed.includes(key))
    .map((key) => `${where}: "${key}" is not allowed (WOMBOT is a read-only declarative agent)`);
}

function capabilityViolations(file: string, capabilities: unknown): string[] {
  if (capabilities === undefined) return [];
  if (!Array.isArray(capabilities)) return [`${file}: capabilities must be an array`];
  const allowed: readonly string[] = ALLOWED_CAPABILITIES;
  return capabilities
    .map((capability: { name?: unknown }) => String(capability.name))
    .filter((name) => !allowed.includes(name))
    .map((name) => `${file}: capability "${name}" is not allowed; allowed: ${ALLOWED_CAPABILITIES.join(", ")}`);
}

function groundingViolations(file: string, agent: JsonObject): string[] {
  const overrides = agent.behavior_overrides as { special_instructions?: { discourage_model_knowledge?: unknown } };
  const grounded = overrides?.special_instructions?.discourage_model_knowledge === true;
  return grounded ? [] : [`${file}: behavior_overrides.special_instructions.discourage_model_knowledge must be true`];
}

function instructionViolations(file: string, instructions: string): string[] {
  const tooLong =
    instructions.length > MAX_INSTRUCTION_LENGTH
      ? [`${file}: instructions have ${instructions.length} characters, the limit is ${MAX_INSTRUCTION_LENGTH}`]
      : [];
  const missing = REQUIRED_INSTRUCTION_SECTIONS.filter((section) => !instructions.includes(section)).map(
    (section) => `${file}: instructions lack the section "${section}"`,
  );
  return [...tooLong, ...missing];
}
