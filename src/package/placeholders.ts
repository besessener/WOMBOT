import { PackageError } from "./package-error.ts";

const PLACEHOLDER = /\$\{\{([A-Za-z0-9_]+)\}\}/g;

/** Stand-ins for the Agents Toolkit's `${{VAR}}` values, valid against the schemas, used only to validate offline. */
export const VALIDATION_VALUES: Readonly<Record<string, string>> = {
  TEAMS_APP_ID: "00000000-0000-0000-0000-000000000000",
  APP_NAME_SUFFIX: "local",
};

/** Replaces every `${{NAME}}` in `text`; an unknown name is an error, so a typo never reaches a tenant. */
export function fillPlaceholders(text: string, values: Readonly<Record<string, string>>, source: string): string {
  return text.replace(PLACEHOLDER, (_match, name: string) => {
    const value = values[name];
    if (value === undefined) throw new PackageError(`${source}: unknown placeholder \${{${name}}}`);
    return value;
  });
}
