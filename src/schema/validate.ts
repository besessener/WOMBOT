import { Ajv } from "ajv";
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import type { JsonObject } from "../package/load.ts";

// ajv-formats is CommonJS; under nodenext its default export arrives wrapped.
const addFormats = addFormatsModule as unknown as typeof addFormatsModule.default;

/**
 * Validates `document` against one of the vendored schemas. Microsoft's manifest schemas declare draft-04 but use
 * nothing that differs from draft-07, so Ajv compiles them once the `$schema` marker is dropped; the evaluation
 * schema is draft 2020-12 and gets Ajv's 2020 class.
 */
export function schemaErrors(schema: JsonObject, document: JsonObject, label: string): string[] {
  const { $schema: draft, ...body } = schema;
  // strictTypes only warns about Microsoft's schemas omitting `type` next to type-specific keywords; the
  // localization schema has a pattern with a lone `]` that is only valid without the `u` flag.
  const options = { allErrors: true, strictTypes: false, unicodeRegExp: false } as const;
  const ajv = String(draft).includes("2020-12") ? new Ajv2020(options) : new Ajv(options);
  addFormats(ajv);
  const validate = ajv.compile(body);
  if (validate(document)) return [];
  return (validate.errors ?? []).map((error) => {
    const where = error.instancePath === "" ? "/" : error.instancePath;
    return `${label}${where}: ${error.message ?? "invalid"}`;
  });
}
