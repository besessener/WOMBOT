import { constants, copyFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { type Io, processIo } from "./io.ts";

const EXAMPLE_SUFFIX = ".example";

/** `npm run env:init`: creates each missing `env/.env.<name>` from its example; never overwrites. */
export function initEnv(root: string, io: Io): void {
  const directory = join(root, "env");
  const examples = readdirSync(directory).filter((name) => name.endsWith(EXAMPLE_SUFFIX));
  for (const example of examples) {
    const target = example.slice(0, -EXAMPLE_SUFFIX.length);
    if (existsSync(join(directory, target))) {
      io.out(`env/${target}: exists, left as is`);
      continue;
    }
    copyFileSync(join(directory, example), join(directory, target), constants.COPYFILE_EXCL);
    io.out(`env/${target}: created from env/${example}`);
  }
}

if (import.meta.main) {
  initEnv(fileURLToPath(new URL("../..", import.meta.url)), processIo);
}
