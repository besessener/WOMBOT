import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type AppPackage, type JsonObject, loadAppPackage } from "./package/load.ts";
import { PackageError } from "./package/package-error.ts";
import { VALIDATION_VALUES } from "./package/placeholders.ts";
import { policyViolations } from "./policy/agent-policy.ts";
import { schemaErrors } from "./schema/validate.ts";

/** Everything wrong with the app package under `root`: unreadable files, schema errors and policy violations. */
export function checkRepository(root: string): string[] {
  let appPackage: AppPackage;
  try {
    appPackage = loadAppPackage(join(root, "appPackage"), VALIDATION_VALUES);
  } catch (error) {
    if (error instanceof PackageError) return [error.message];
    throw error;
  }
  return [...schemaProblems(root, appPackage), ...evaluationProblems(root), ...policyViolations(appPackage)];
}

/** `evals/prompts.json` follows the evaluation schema its `schemaVersion` names, if the file exists. */
function evaluationProblems(root: string): string[] {
  const path = join(root, "evals/prompts.json");
  if (!existsSync(path)) return [];
  let dataset: JsonObject;
  try {
    dataset = JSON.parse(readFileSync(path, "utf8")) as JsonObject;
  } catch (error) {
    return [`evals/prompts.json: not valid JSON (${(error as Error).message})`];
  }
  const schema = vendoredSchema(root, `eval-prompts-v${String(dataset.schemaVersion)}.json`);
  return check(schema, dataset, "evals/prompts.json");
}

function schemaProblems(root: string, { manifest, agents, languages }: AppPackage): string[] {
  const version = String(manifest.manifestVersion);
  const results = [check(vendoredSchema(root, `teams-v${version}.json`), manifest, "manifest.json")];
  for (const { file, agent } of agents) {
    results.push(check(vendoredSchema(root, `declarative-agent-${String(agent.version)}.json`), agent, file));
  }
  if (languages.length > 0) {
    const languageSchema = vendoredSchema(root, `teams-localization-v${version}.json`);
    for (const { file, strings } of languages) results.push(check(languageSchema, strings, file));
  }
  return results.flat();
}

type Schema = { readonly schema: JsonObject } | { readonly missing: string };

function vendoredSchema(root: string, name: string): Schema {
  const path = join(root, "schemas", name);
  if (!existsSync(path)) return { missing: `schemas/${name}` };
  return { schema: JSON.parse(readFileSync(path, "utf8")) as JsonObject };
}

function check(schema: Schema, document: JsonObject, label: string): string[] {
  if ("missing" in schema)
    return [`${label}: no vendored schema ${schema.missing}; see docs/how-to/schema-aktualisieren.md`];
  return schemaErrors(schema.schema, document, label);
}
