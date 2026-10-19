import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { PackageError } from "./package-error.ts";
import { fillPlaceholders } from "./placeholders.ts";

export type JsonObject = Record<string, unknown>;

export interface DeclarativeAgent {
  /** Path of the agent manifest relative to the app package directory. */
  readonly file: string;
  /** The agent manifest with placeholders filled and `instructions` resolved to the file's text. */
  readonly agent: JsonObject;
  readonly instructions: string;
}

export interface AppPackage {
  readonly manifest: JsonObject;
  readonly agents: readonly DeclarativeAgent[];
}

const FILE_REFERENCE = /^\$\[file\('([^']+)'\)\]$/;

/** Reads `appPackage/` the way the Agents Toolkit builds it: placeholders filled, `$[file('…')]` resolved. */
export function loadAppPackage(directory: string, values: Readonly<Record<string, string>>): AppPackage {
  const manifest = readJson(directory, "manifest.json", values);
  const agents = agentEntries(manifest).map((file) => loadAgent(directory, file, values));
  return { manifest, agents };
}

function agentEntries(manifest: JsonObject): string[] {
  const copilotAgents = manifest.copilotAgents as { declarativeAgents?: unknown } | undefined;
  const entries = copilotAgents?.declarativeAgents;
  if (!Array.isArray(entries)) return [];
  return entries.map((entry: { file?: unknown }) => {
    if (typeof entry.file !== "string") throw new PackageError("manifest.json: a declarative agent has no file");
    return entry.file;
  });
}

function loadAgent(directory: string, file: string, values: Readonly<Record<string, string>>): DeclarativeAgent {
  const agent = readJson(directory, file, values);
  const instructions = resolveInstructions(directory, file, agent.instructions);
  return { file, agent: { ...agent, instructions }, instructions };
}

function resolveInstructions(directory: string, file: string, instructions: unknown): string {
  if (typeof instructions !== "string") throw new PackageError(`${file}: instructions must be a string`);
  const reference = FILE_REFERENCE.exec(instructions)?.[1];
  return reference === undefined ? instructions : readText(directory, reference);
}

function readJson(directory: string, file: string, values: Readonly<Record<string, string>>): JsonObject {
  const text = fillPlaceholders(readText(directory, file), values, file);
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new PackageError(`${file}: not valid JSON (${(error as Error).message})`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new PackageError(`${file}: must contain a JSON object`);
  }
  return parsed as JsonObject;
}

function readText(directory: string, file: string): string {
  const path = resolve(directory, file);
  const inside = relative(resolve(directory), path);
  if (inside.startsWith("..") || isAbsolute(inside)) {
    throw new PackageError(`${file}: points outside the app package`);
  }
  if (!existsSync(path)) throw new PackageError(`${file}: not found in ${join(directory)}`);
  return readFileSync(path, "utf8");
}
