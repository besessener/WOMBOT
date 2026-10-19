import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { iconVariants } from "../src/icons/variants.ts";
import { root } from "./repository.ts";

const favicon = readFileSync(join(root, "site/favicon.svg"), "utf8");

describe("iconVariants", () => {
  it("builds the colour icon at 192 px on the favicon's accent colour", () => {
    const { color } = iconVariants(favicon);
    assert.match(color, /width="192" height="192"/);
    assert.match(color, /<rect width="32" height="32" fill="#be185d"\/>/);
  });

  it("builds the outline icon at 32 px from white only, with accent details turned into mask holes", () => {
    const { outline } = iconVariants(favicon);
    assert.match(outline, /width="32" height="32"/);
    assert.doesNotMatch(outline, /#be185d/i);
    assert.match(outline, /<mask id="m">/);
    assert.match(outline, /fill="#fff" mask="url\(#m\)"/);
  });

  it("uses the same accent colour as the app manifest", () => {
    const manifest = JSON.parse(readFileSync(join(root, "appPackage/manifest.json"), "utf8")) as {
      accentColor: string;
    };
    assert.match(iconVariants(favicon).color, new RegExp(`fill="${manifest.accentColor}"`, "i"));
  });

  it("refuses a favicon without a background rectangle", () => {
    assert.throws(
      () => iconVariants('<svg viewBox="0 0 32 32"><circle r="4"/></svg>'),
      /expected a 32 × 32 viewBox, a background <rect>/,
    );
  });
});
