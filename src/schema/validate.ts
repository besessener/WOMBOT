import { Ajv } from "ajv";
import addFormatsModule from "ajv-formats";
import type { JsonObject } from "../package/load.ts";

// ajv-formats is CommonJS; under nodenext its default export arrives wrapped.
const addFormats = addFormatsModule as unknown as typeof addFormatsModule.default;

/**
 * Validates `document` against one of Microsoft's vendored schemas. They declare draft-04 but use nothing that
 * differs from draft-07, so Ajv compiles them once the `$schema` marker is dropped.
 */
export function schemaErrors(schema: JsonObject, document: JsonObject, label: string): string[] {
  const { $schema: _draft, ...body } = schema;
  // strictTypes only warns about Microsoft's schemas omitting `type` next to type-specific keywords.
  const ajv = new Ajv({ allErrors: true, strictTypes: false });
  addFormats(ajv);
  const validate = ajv.compile(body);
  if (validate(document)) return [];
  return (validate.errors ?? []).map((error) => {
    const where = error.instancePath === "" ? "/" : error.instancePath;
    return `${label}${where}: ${error.message ?? "invalid"}`;
  });
}
