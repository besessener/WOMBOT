# Mitmachen

Danke, dass du hilfst. WOMBOT ist ein deklarativer Agent für Microsoft 365 Copilot; der TypeScript-Code im Repository
prüft nur das App-Paket. Die [Dokumentation](docs/README.md) erklärt, wie es zusammenhängt.

## Einrichten

Node.js 26 oder neuer:

```sh
npm ci
npm run env:init
```

Zum Bereitstellen brauchst du außerdem das Microsoft 365 Agents Toolkit und einen Mandanten mit Copilot-Lizenz, siehe
[Erste Schritte](docs/tutorials/erste-schritte.md).

## Arbeiten

| Aufgabe | Befehl |
| --- | --- |
| App-Paket prüfen | `npm run validate` |
| Alle Tests | `npm test` |
| Eine Testdatei | `node --test test/policy.test.ts` |
| Lint und Typprüfung | `npm run lint` |
| Alle lokalen Qualitätsprüfungen | `npm run check` |
| Formatieren und sichere Korrekturen | `npm run format` |

Was WOMBOT tut, steht in `appPackage/instruction.txt`; wie du das änderst und ausprobierst:
[Anweisungen ändern](docs/how-to/anweisungen-aendern.md).

## Bevor du einen Pull Request öffnest

```sh
npm run format
npm run check          # lint, types, dead code, app package, tests with coverage thresholds
prek run --all-files   # gitleaks, zizmor, file hygiene
```

- Halte Änderungen fokussiert: ein Thema je Pull Request.
- Die Dokumentation wandert mit dem Code. Eine neue Fähigkeit gehört in `ALLOWED_CAPABILITIES`
  (`src/policy/agent-policy.ts`) **und** ins [Agent-Manifest](docs/reference/agent-manifest.md); sonst schlägt
  `test/docs.test.ts` fehl. Eine schreibende Fähigkeit kommt nie dazu ([Grundregeln](docs/explanation/grundregeln.md)).
- Keine Kennungen aus deinem Mandanten in Git: `env/.env.dev` und `env/.env.local` sind ausgeschlossen, und so bleibt
  es.

## Veröffentlichen

1. Setze die Version in `package.json` und `appPackage/manifest.json` gleich (ab 1.0.0; Microsoft lehnt Versionen
   mit führender 0 ab) und aktualisiere den Stand-Hinweis in der
   [README](README.md) und in `site/index.html`. Merge das über einen Pull Request.
2. Tagge den Merge-Commit auf `main` und pushe den Tag: `git tag vX.Y.Z && git push origin vX.Y.Z`.
3. Stell die neue Version bereit, wie unter [Bereitstellen und freigeben](docs/how-to/bereitstellen.md) beschrieben.
