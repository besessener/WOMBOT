import { fileURLToPath } from "node:url";
import { checkRepository } from "../check.ts";
import { type Io, processIo } from "./io.ts";

/** `npm run validate`: checks the app package against the schemas and the policy. Returns the exit code. */
export function validate(root: string, io: Io): 0 | 1 {
  const problems = checkRepository(root);
  if (problems.length === 0) {
    io.out("appPackage: valid and within policy");
    return 0;
  }
  for (const problem of problems) io.err(problem);
  io.err(`appPackage: ${problems.length} problem(s)`);
  return 1;
}

if (import.meta.main) {
  process.exitCode = validate(fileURLToPath(new URL("../..", import.meta.url)), processIo);
}
