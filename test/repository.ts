import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Io } from "../src/cli/io.ts";

export const root = fileURLToPath(new URL("..", import.meta.url));

/** A throwaway copy of the real `appPackage/`, `schemas/`, `env/` and `evals/` to break on purpose. */
export function copyRepository(): string {
  const copy = mkdtempSync(join(tmpdir(), "wombot-"));
  for (const directory of ["appPackage", "schemas", "env", "evals"]) {
    cpSync(join(root, directory), join(copy, directory), {
      recursive: true,
      filter: (source) => !(source.includes("build") || /\.env\.(dev|local)$/.test(source)),
    });
  }
  return copy;
}

/** Rewrites one JSON file of a copied repository. */
export function editJson(path: string, edit: (json: Record<string, unknown>) => void): void {
  const json = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  edit(json);
  writeFileSync(path, JSON.stringify(json, null, 2));
}

export interface CapturedIo extends Io {
  readonly lines: { readonly out: string[]; readonly err: string[] };
}

export function captureIo(): CapturedIo {
  const lines = { out: [] as string[], err: [] as string[] };
  return { lines, out: (line) => lines.out.push(line), err: (line) => lines.err.push(line) };
}
