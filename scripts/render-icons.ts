import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { iconVariants } from "../src/icons/variants.ts";

// `npm run icons`: renders appPackage/color.png, appPackage/outline.png and site/img/wombot-192.png from
// site/favicon.svg with an installed Chromium browser (Edge or Chrome), so the repository needs no Playwright.

const root = fileURLToPath(new URL("..", import.meta.url));

const BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/microsoft-edge",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

function browser(): string {
  const found = BROWSERS.find((path) => path !== undefined && path !== "" && existsSync(path));
  if (found === undefined) throw new Error("No Edge or Chrome found; set CHROME_PATH to a Chromium-based browser.");
  return found;
}

function render(executable: string, svg: string, size: number, target: string): void {
  const work = mkdtempSync(join(tmpdir(), "wombot-icon-"));
  const page = join(work, "icon.html");
  writeFileSync(page, `<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  rmSync(target, { force: true });
  const result = spawnSync(
    executable,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--default-background-color=00000000",
      `--user-data-dir=${join(work, "profile")}`,
      `--window-size=${size},${size}`,
      `--screenshot=${target}`,
      pathToFileURL(page).href,
    ],
    { encoding: "utf8", timeout: 60_000 },
  );
  // Edge exits non-zero over harmless internal log lines even when the screenshot is fine; the file decides.
  if (!existsSync(target)) {
    throw new Error(`Rendering ${target} failed: ${result.stderr || result.error?.message || "no output"}`);
  }
}

const variants = iconVariants(readFileSync(join(root, "site/favicon.svg"), "utf8"));
const installedBrowser = browser();
render(installedBrowser, variants.color, 192, join(root, "appPackage/color.png"));
render(installedBrowser, variants.outline, 32, join(root, "appPackage/outline.png"));
copyFileSync(join(root, "appPackage/color.png"), join(root, "site/img/wombot-192.png"));
process.stdout.write("Rendered appPackage/color.png, appPackage/outline.png and site/img/wombot-192.png\n");
