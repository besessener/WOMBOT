/** Microsoft's two app icons, derived from the website's favicon so the motif lives in one file. */
export interface IconVariants {
  /** 192 × 192, motif on a full-bleed square in the accent colour. */
  readonly color: string;
  /** 32 × 32, white motif on transparent; details drawn in the accent colour become holes. */
  readonly outline: string;
}

const FAVICON =
  /^<svg[^>]*viewBox="0 0 32 32"[^>]*>(?:<title>[^<]*<\/title>)?<rect[^>]*fill="(#[0-9a-fA-F]{6})"[^>]*\/>(.*)<\/svg>\s*$/s;

/** Splits `site/favicon.svg` into its background colour and motif and builds both app icons from them. */
export function iconVariants(favicon: string): IconVariants {
  const match = FAVICON.exec(favicon);
  const accent = match?.[1];
  const motif = match?.[2];
  if (accent === undefined || motif === undefined) {
    throw new Error(
      "site/favicon.svg: expected a 32 × 32 viewBox, a background <rect> with a hex fill, then the motif",
    );
  }
  const holes = motif.replaceAll(accent, "#000");
  return {
    color: svg(192, `<rect width="32" height="32" fill="${accent}"/>${scaled(0.72, motif)}`),
    outline: svg(
      32,
      `<mask id="m"><rect width="32" height="32" fill="#000"/>${holes}</mask>${scaled(1.12, '<rect width="32" height="32" fill="#fff" mask="url(#m)"/>')}`,
    ),
  };
}

function scaled(factor: number, content: string): string {
  return `<g transform="translate(16 16) scale(${factor}) translate(-16 -17)">${content}</g>`;
}

function svg(size: number, content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">${content}</svg>`;
}
