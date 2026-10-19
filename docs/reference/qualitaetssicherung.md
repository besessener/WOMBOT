# Qualitätsprüfungen

Jede Prüfung unten läuft in CI bei jedem Pull Request und jedem Push auf `main`. `npm run check` führt die lokalen in
einem Rutsch aus.

| Prüfung | Befehl | Prüft | Workflow |
| --- | --- | --- | --- |
| Formatierung und Lint | `npm run lint` (`biome ci .`) | Formatierung von TypeScript, JSON, HTML und CSS; Biomes empfohlene Regeln plus die strengeren aus [`biome.json`](../../biome.json) | `ci.yml` |
| Typen | `npm run typecheck` (Teil von `lint`) | `tsc` strict über `src` und `test` | `ci.yml` |
| Toter Code | `npm run knip` | Unbenutzte Dateien, Exporte und Abhängigkeiten ([`knip.json`](../../knip.json)) | `ci.yml` |
| App-Paket | `npm run validate` | Manifest und Agent gegen Microsofts Schemas, dazu die [Grundregeln](../explanation/grundregeln.md) | `ci.yml` |
| Tests und Abdeckung | `npm run test:coverage` | Alle Tests, dazu Zeilen-, Zweig- und Funktionsabdeckung von `src/` über den Schwellen | `ci.yml` |
| Dokumentation | `test/docs.test.ts` (Teil der Tests) | Relative Links und Anker; jede erlaubte Fähigkeit ist im [Agent-Manifest](agent-manifest.md) beschrieben | `ci.yml` |
| Secrets | `gitleaks git` | Die ganze Git-Historie ([`.gitleaks.toml`](../../.gitleaks.toml)) | `ci.yml`, Job hygiene |
| Dateihygiene und Workflows | `prek run --all-files` | Merge-Marker, YAML/JSON-Syntax, Dateien über 1 MB, private Schlüssel, Leerzeichen am Zeilenende, abschließender Zeilenumbruch, Zeilenenden; zizmor prüft die Workflows | `ci.yml`, Job hygiene |
| Code-Scanning | CodeQL `security-extended` | JavaScript/TypeScript und die Workflows | `codeql.yml`, auch wöchentlich |
| Abhängigkeitsupdates | Dependabot | npm-Pakete, Actions und Hook-Revisionen, wöchentlich mit 7 Tagen Wartezeit | `dependabot.yml` |

## Was die Prüfungen nicht abdecken

Ob WOMBOT gute Antworten gibt, entscheidet das Modell von Copilot zur Laufzeit; kein Test im Repository kann das
zusichern. Die Prüfungen stellen sicher, dass das Paket gültig ist, dass WOMBOT nur lesen kann und dass die
Abschnitte mit den Grundregeln in den Anweisungen stehen. Wie du Antworten prüfst, steht unter
[Anweisungen ändern](../how-to/anweisungen-aendern.md#im-copilot-ausprobieren).

## Abdeckungsschwellen

`npm run test:coverage` nutzt Nodes eingebaute Abdeckungsmessung und schlägt unter diesen Schwellen fehl:

| Metrik | Schwelle | Gemessen (2026-10) |
| --- | --- | --- |
| Zeilen | 99 % | 100 % |
| Zweige | 95 % | 96,8 % |
| Funktionen | 97 % | 97,2 % |

Die Schwellen liegen knapp unter den gemessenen Werten und werden nur angehoben, nie gesenkt.

## Pinning

Workflow-Actions und Hook-Revisionen sind auf Commit-SHAs festgelegt, mit dem Tag in einem Kommentar; zizmor schlägt
bei einem nicht festgelegten `uses:` fehl. Workflows beginnen mit `permissions: {}` und geben jedem Job nur, was er
braucht. Dependabot aktualisiert die SHAs und Kommentare.
