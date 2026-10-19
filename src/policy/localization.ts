import type { AppPackage, JsonObject } from "../package/load.ts";

const KEY = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const TOKEN = /^\[\[(.*)\]\]$/;

/**
 * Every `[[key]]` the agent uses has a non-empty value in every language file, and no language file carries keys
 * nobody uses. Copilot would otherwise show the raw token, or a language would silently fall behind.
 */
export function localizationViolations({ agents, languages }: AppPackage): string[] {
  const used = new Map<string, string>();
  const problems: string[] = [];
  for (const { file, agent } of agents) {
    const { instructions: _text, ...localizable } = agent;
    for (const token of tokens(localizable)) {
      if (KEY.test(token)) used.set(token, file);
      else problems.push(`${file}: "[[${token}]]" is not a valid localization key`);
    }
  }
  if (used.size > 0 && languages.length === 0) {
    problems.push("manifest.json: the agent uses localization keys but localizationInfo lists no language files");
  }
  for (const { file, strings } of languages) problems.push(...languageViolations(file, strings, used));
  return problems;
}

function languageViolations(file: string, strings: JsonObject, used: ReadonlyMap<string, string>): string[] {
  const values = (strings.localizationKeys ?? {}) as JsonObject;
  const missing = [...used].filter(([key]) => typeof values[key] !== "string" || (values[key] as string).trim() === "");
  const unused = Object.keys(values).filter((key) => !used.has(key));
  return [
    ...missing.map(([key, agentFile]) => `${file}: no text for "${key}", which ${agentFile} uses`),
    ...unused.map((key) => `${file}: "${key}" is not used by any agent`),
  ];
}

function tokens(value: unknown): string[] {
  if (typeof value === "string") {
    const token = TOKEN.exec(value)?.[1];
    return token === undefined ? [] : [token];
  }
  if (Array.isArray(value)) return value.flatMap(tokens);
  if (typeof value === "object" && value !== null) return Object.values(value).flatMap(tokens);
  return [];
}
