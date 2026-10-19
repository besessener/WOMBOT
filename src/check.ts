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
  return [...schemaProblems(root, appPackage), ...policyViolations(appPackage)];
}

function schemaProblems(root: string, { manifest, agents }: AppPackage): string[] {
  const manifestSchema = vendoredSchema(root, `teams-v${String(manifest.manifestVersion)}.json`);
  const results = [check(manifestSchema, manifest, "manifest.json")];
  for (const { file, agent } of agents) {
    results.push(check(vendoredSchema(root, `declarative-agent-${String(agent.version)}.json`), agent, file));
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
