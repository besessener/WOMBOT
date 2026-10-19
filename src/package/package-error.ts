/** The app package cannot be read: a missing or malformed file, a bad reference or placeholder. */
export class PackageError extends Error {
  override readonly name = "PackageError";
}
