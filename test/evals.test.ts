import assert from "node:assert/strict";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { checkRepository } from "../src/check.ts";
import { copyRepository, editJson } from "./repository.ts";

describe("evals/prompts.json", () => {
  it("is optional", () => {
    const copy = copyRepository();
    rmSync(join(copy, "evals/prompts.json"));
    assert.deepEqual(checkRepository(copy), []);
  });

  it("is validated against the evaluation schema it names", () => {
    const copy = copyRepository();
    editJson(join(copy, "evals/prompts.json"), (dataset) => {
      dataset.items = [{ expected_response: "no prompt" }];
    });
    const problems = checkRepository(copy);
    assert.ok(problems.length > 0);
    assert.ok(
      problems.every((problem) => problem.startsWith("evals/prompts.json")),
      problems.join("\n"),
    );
  });

  it("refuses evaluator names the schema does not know", () => {
    const copy = copyRepository();
    editJson(join(copy, "evals/prompts.json"), (dataset) => {
      dataset.default_evaluators = { Vibes: {} };
    });
    assert.ok(checkRepository(copy).some((problem) => problem.startsWith("evals/prompts.json/default_evaluators")));
  });

  it("reports a schema version without a vendored schema", () => {
    const copy = copyRepository();
    editJson(join(copy, "evals/prompts.json"), (dataset) => {
      dataset.schemaVersion = "9.9.9";
    });
    assert.deepEqual(checkRepository(copy), [
      "evals/prompts.json: no vendored schema schemas/eval-prompts-v9.9.9.json; see docs/how-to/schema-aktualisieren.md",
    ]);
  });

  it("reports invalid JSON", () => {
    const copy = copyRepository();
    writeFileSync(join(copy, "evals/prompts.json"), "{");
    const problems = checkRepository(copy);
    assert.equal(problems.length, 1);
    assert.match(problems[0] ?? "", /^evals\/prompts\.json: not valid JSON/);
  });
});
